import * as vscode from 'vscode';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getConfig() {
  const cfg = vscode.workspace.getConfiguration('rapid');
  return {
    apiKey: cfg.get<string>('apiKey') || '',
    apiUrl: cfg.get<string>('apiUrl') || 'https://app.rapid.dev',
    autoAnalyze: cfg.get<boolean>('autoAnalyzeOnSave') || false,
    showHints: cfg.get<boolean>('showInlineHints') || true,
  };
}

function detectLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase().slice(1);
  const map: Record<string, string> = {
    ts: 'TypeScript', tsx: 'TypeScript (React)', js: 'JavaScript', jsx: 'JavaScript (React)',
    py: 'Python', go: 'Go', rs: 'Rust', java: 'Java', cs: 'C#',
    rb: 'Ruby', php: 'PHP', sql: 'SQL', tf: 'Terraform',
    yml: 'YAML', yaml: 'YAML', json: 'JSON', sh: 'Shell',
  };
  return map[ext] || 'Unknown';
}

function detectType(filePath: string, content: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.sql') return 'DATABASE';
  if (['.tf', '.hcl'].includes(ext)) return 'INFRASTRUCTURE';
  if (['.yml', '.yaml'].includes(ext) && /apiVersion:|kind:/.test(content)) return 'INFRASTRUCTURE';
  if (ext === '.json' && /openapi|swagger/.test(content.toLowerCase())) return 'API';
  return 'CODE';
}

// ─── Analysis Panel (Webview) ─────────────────────────────────────────────────
function getWebviewContent(result: any, title: string): string {
  const totalSavings = result.suggestions?.reduce((a: number, s: any) => a + (s.estimatedSaving || 0), 0) || 0;
  const suggestions = result.suggestions || [];

  const suggestionsHtml = suggestions.map((s: any, i: number) => {
    const priorityColors: Record<string, string> = {
      CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#22c55e',
    };
    const pc = priorityColors[s.priority] || '#6b7280';
    return `
      <div class="suggestion">
        <div class="suggestion-header">
          <span class="badge" style="background:${pc}22;color:${pc};border:1px solid ${pc}44">${s.priority}</span>
          <span class="badge secondary">${(s.category || '').replace('_', ' ')}</span>
          ${s.estimatedSaving > 0 ? `<span class="savings">+$${s.estimatedSaving}/mo</span>` : ''}
        </div>
        <div class="suggestion-title">${s.title}</div>
        <div class="suggestion-desc">${s.description}</div>
        ${s.codeSnippet ? `<pre class="code before">${escHtml(s.codeSnippet)}</pre>` : ''}
        ${s.improvedCode ? `<div class="after-label">After:</div><pre class="code after">${escHtml(s.improvedCode)}</pre>` : ''}
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: var(--vscode-font-family); background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); padding: 16px; margin: 0; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .subtitle { color: var(--vscode-descriptionForeground); font-size: 13px; margin-bottom: 20px; }
    .scores { display: flex; gap: 12px; margin-bottom: 24px; }
    .score-card { flex: 1; padding: 14px; border-radius: 8px; text-align: center; }
    .score-card .value { font-size: 22px; font-weight: 700; margin: 4px 0; }
    .score-card .label { font-size: 11px; opacity: 0.7; }
    .savings-card { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); }
    .reliability-card { background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.3); }
    .performance-card { background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.3); }
    .suggestions-header { font-size: 15px; font-weight: 600; margin-bottom: 12px; }
    .suggestion { background: var(--vscode-sideBar-background); border: 1px solid var(--vscode-panel-border); border-radius: 8px; padding: 14px; margin-bottom: 10px; }
    .suggestion-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
    .badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 5px; }
    .badge.secondary { background: rgba(107,114,128,0.2); color: #9ca3af; }
    .savings { margin-left: auto; color: #22c55e; font-size: 13px; font-weight: 600; }
    .suggestion-title { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
    .suggestion-desc { font-size: 13px; opacity: 0.75; line-height: 1.5; margin-bottom: 8px; }
    .code { font-family: var(--vscode-editor-font-family, monospace); font-size: 12px; padding: 10px; border-radius: 6px; overflow-x: auto; margin: 6px 0; white-space: pre-wrap; word-break: break-all; }
    .before { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
    .after { background: rgba(34,197,94,0.05); border: 1px solid rgba(34,197,94,0.2); color: #86efac; }
    .after-label { font-size: 11px; color: #22c55e; margin-top: 4px; }
    .total { margin-top: 8px; padding: 12px 16px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 8px; color: #22c55e; font-weight: 600; }
  </style>
</head>
<body>
  <h1>⚡ ${escHtml(title)}</h1>
  <div class="subtitle">RAPID Analysis — ${new Date().toLocaleDateString()}</div>

  <div class="scores">
    <div class="score-card savings-card">
      <div class="label">Cost Savings</div>
      <div class="value" style="color:#22c55e">$${totalSavings}<span style="font-size:14px">/mo</span></div>
    </div>
    <div class="score-card reliability-card">
      <div class="label">Reliability</div>
      <div class="value" style="color:#60a5fa">${result.analysis?.reliabilityScore || 0}<span style="font-size:14px">/100</span></div>
    </div>
    <div class="score-card performance-card">
      <div class="label">Performance</div>
      <div class="value" style="color:#a78bfa">${result.analysis?.performanceScore || 0}<span style="font-size:14px">/100</span></div>
    </div>
  </div>

  <div class="suggestions-header">${suggestions.length} Suggestions</div>
  ${suggestionsHtml}

  ${totalSavings > 0 ? `<div class="total">💰 Total potential savings: $${totalSavings}/month</div>` : ''}
</body>
</html>`;
}

function escHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Core analyze function ────────────────────────────────────────────────────
async function analyzeContent(content: string, title: string, filePath: string, context: vscode.ExtensionContext) {
  const { apiKey, apiUrl } = getConfig();

  if (!apiKey) {
    const action = await vscode.window.showErrorMessage(
      'RAPID: No API key configured.',
      'Set API Key', 'Get API Key'
    );
    if (action === 'Set API Key') vscode.commands.executeCommand('rapid.setApiKey');
    if (action === 'Get API Key') vscode.env.openExternal(vscode.Uri.parse(`${apiUrl}/dashboard/api-keys`));
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `RAPID: Analyzing ${title}...`,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 20 });

      try {
        const analysisType = detectType(filePath, content);
        const response = await axios.post(
          `${apiUrl}/api/analyze`,
          { title, content, type: analysisType, fileName: path.basename(filePath) },
          { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, timeout: 60000 }
        );

        progress.report({ increment: 80 });
        const result = response.data;

        // Show webview panel
        const panel = vscode.window.createWebviewPanel(
          'rapidAnalysis',
          `RAPID: ${title}`,
          vscode.ViewColumn.Beside,
          { enableScripts: true, retainContextWhenHidden: true }
        );
        panel.webview.html = getWebviewContent(result, title);

        const totalSavings = result.suggestions?.reduce((a: number, s: any) => a + (s.estimatedSaving || 0), 0) || 0;
        const msg = `✔ Analysis complete — ${result.suggestions?.length || 0} suggestions found` +
          (totalSavings > 0 ? `, $${totalSavings}/month potential savings` : '');

        const action = await vscode.window.showInformationMessage(msg, 'Open Dashboard');
        if (action === 'Open Dashboard') {
          vscode.env.openExternal(vscode.Uri.parse(`${apiUrl}/dashboard/analyze/${result.analysis?.id}`));
        }
      } catch (err: any) {
        const msg = err.response?.data?.error || err.message || 'Analysis failed';
        vscode.window.showErrorMessage(`RAPID: ${msg}`);
      }
    }
  );
}

// ─── Activate ─────────────────────────────────────────────────────────────────
export function activate(context: vscode.ExtensionContext) {
  console.log('RAPID extension activated');

  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.text = '$(zap) RAPID';
  statusBar.tooltip = 'Click to analyze current file with RAPID';
  statusBar.command = 'rapid.analyzeFile';
  statusBar.show();
  context.subscriptions.push(statusBar);

  // ── Analyze current file ──────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('rapid.analyzeFile', async (uri?: vscode.Uri) => {
      const fileUri = uri || vscode.window.activeTextEditor?.document.uri;
      if (!fileUri) {
        vscode.window.showWarningMessage('RAPID: No file open to analyze.');
        return;
      }
      const doc = await vscode.workspace.openTextDocument(fileUri);
      const content = doc.getText();
      const title = path.basename(fileUri.fsPath);
      await analyzeContent(content, title, fileUri.fsPath, context);
    })
  );

  // ── Analyze selection ────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('rapid.analyzeSelection', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.selection.isEmpty) {
        vscode.window.showWarningMessage('RAPID: Please select some code first.');
        return;
      }
      const content = editor.document.getText(editor.selection);
      const title = `Selection from ${path.basename(editor.document.uri.fsPath)}`;
      await analyzeContent(content, title, editor.document.uri.fsPath, context);
    })
  );

  // ── Scan workspace ────────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('rapid.analyzeWorkspace', async () => {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders) {
        vscode.window.showWarningMessage('RAPID: No workspace folder open.');
        return;
      }

      const files = await vscode.workspace.findFiles(
        '**/*.{ts,tsx,js,jsx,py,go,rs,java,sql,tf}',
        '**/node_modules/**',
        20
      );

      if (files.length === 0) {
        vscode.window.showInformationMessage('RAPID: No code files found in workspace.');
        return;
      }

      const choice = await vscode.window.showQuickPick(
        files.map(f => ({ label: vscode.workspace.asRelativePath(f), uri: f })),
        { canPickMany: true, placeHolder: `Select files to analyze (${files.length} found)` }
      );

      if (!choice || choice.length === 0) return;

      for (const item of choice) {
        const doc = await vscode.workspace.openTextDocument(item.uri);
        await analyzeContent(doc.getText(), path.basename(item.uri.fsPath), item.uri.fsPath, context);
      }
    })
  );

  // ── Set API Key ────────────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('rapid.setApiKey', async () => {
      const key = await vscode.window.showInputBox({
        prompt: 'Enter your RAPID API key',
        placeHolder: 'rapid_xxxxxxxxxxxx',
        password: true,
        validateInput: (v) => v.length > 0 ? null : 'API key cannot be empty',
      });
      if (key) {
        await vscode.workspace.getConfiguration('rapid').update('apiKey', key, true);
        vscode.window.showInformationMessage('RAPID: API key saved. You are now authenticated!');
      }
    })
  );

  // ── Open Dashboard ─────────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('rapid.openDashboard', () => {
      const { apiUrl } = getConfig();
      vscode.env.openExternal(vscode.Uri.parse(`${apiUrl}/dashboard`));
    })
  );

  // ── View Suggestions ───────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('rapid.viewSuggestions', () => {
      const { apiUrl } = getConfig();
      vscode.env.openExternal(vscode.Uri.parse(`${apiUrl}/dashboard/suggestions`));
    })
  );

  // ── Auto analyze on save ───────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(async (doc) => {
      const { autoAnalyze } = getConfig();
      if (!autoAnalyze) return;
      const supportedExts = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.sql'];
      if (!supportedExts.includes(path.extname(doc.uri.fsPath))) return;
      await analyzeContent(doc.getText(), path.basename(doc.uri.fsPath), doc.uri.fsPath, context);
    })
  );
}

export function deactivate() {}
