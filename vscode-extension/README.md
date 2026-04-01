# RAPID — VS Code Extension

Analyze any file for cost savings and reliability improvements without leaving VS Code.

## Install

Search for **"RAPID"** in the VS Code Extensions marketplace, or:

```bash
code --install-extension rapid-dev.rapid-vscode
```

## Usage

| Action | How |
|--------|-----|
| Analyze current file | `Cmd/Ctrl+Shift+R` |
| Analyze selection | Right-click → "RAPID: Analyze Selected Code" |
| Analyze file from Explorer | Right-click file → "RAPID: Analyze Current File" |
| Scan workspace | Command Palette → "RAPID: Scan Workspace" |
| Open dashboard | Command Palette → "RAPID: Open Dashboard" |

## Setup

1. Install the extension
2. Open Command Palette (`Cmd/Ctrl+Shift+P`)
3. Run `RAPID: Set API Key`
4. Get your API key from [rapid.dev/dashboard/api-keys](https://rapid.dev/dashboard/api-keys)

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `rapid.apiKey` | `""` | Your RAPID API key |
| `rapid.apiUrl` | `"https://app.rapid.dev"` | Server URL (change for self-hosted) |
| `rapid.autoAnalyzeOnSave` | `false` | Auto-analyze on file save |
| `rapid.showInlineHints` | `true` | Show CodeLens hints |
