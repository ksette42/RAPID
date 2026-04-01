import path from 'path';

export function detectLanguage(filePath: string, content: string): string {
  const ext = path.extname(filePath).toLowerCase().slice(1);

  const extMap: Record<string, string> = {
    js: 'JavaScript', jsx: 'JavaScript (React)',
    ts: 'TypeScript', tsx: 'TypeScript (React)',
    py: 'Python', java: 'Java',
    cs: 'C#', cpp: 'C++', c: 'C',
    go: 'Go', rs: 'Rust', rb: 'Ruby',
    php: 'PHP', swift: 'Swift', kt: 'Kotlin',
    sql: 'SQL', sh: 'Shell', bash: 'Shell',
    yml: 'YAML', yaml: 'YAML',
    json: 'JSON', xml: 'XML',
    html: 'HTML', css: 'CSS', scss: 'SCSS',
    tf: 'Terraform', hcl: 'HCL',
    dockerfile: 'Dockerfile',
    toml: 'TOML', md: 'Markdown',
  };

  if (ext && extMap[ext]) return extMap[ext];

  // Content-based detection
  if (/def\s+\w+\(|import\s+\w+|print\(/.test(content)) return 'Python';
  if (/func\s+\w+\s*\(|package\s+main/.test(content)) return 'Go';
  if (/fn\s+\w+\s*\(|let\s+mut\s/.test(content)) return 'Rust';
  if (/interface\s+\w+|:\s+string|:\s+number/.test(content)) return 'TypeScript';
  if (/const\s+\w+|let\s+\w+|function\s+\w+|=>/.test(content)) return 'JavaScript';
  if (/SELECT|INSERT|UPDATE|DELETE|CREATE TABLE/i.test(content)) return 'SQL';
  if (/resource\s+"|provider\s+"|terraform\s*{/.test(content)) return 'Terraform';
  if (/apiVersion:|kind:\s+\w+|metadata:/.test(content)) return 'Kubernetes YAML';
  if (/<\?php/.test(content)) return 'PHP';
  if (/public\s+class|private\s+void|@Override/.test(content)) return 'Java';

  return 'Unknown';
}

export function detectAnalysisType(filePath: string, content: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath).toLowerCase();

  if (['.sql'].includes(ext) || /CREATE TABLE|SELECT\s+\*\s+FROM/i.test(content)) return 'DATABASE';
  if (['.tf', '.hcl'].includes(ext) || base.includes('terraform') || base.includes('main.tf')) return 'INFRASTRUCTURE';
  if (base.includes('docker') || ext === '' && /FROM\s+\w+|RUN\s+/.test(content)) return 'INFRASTRUCTURE';
  if (['.yml', '.yaml'].includes(ext) && /apiVersion|kind:\s/.test(content)) return 'INFRASTRUCTURE';
  if (['.json'].includes(ext) && /panels|dashboard|grafana/i.test(content)) return 'DASHBOARD';
  if (['.yaml', '.yml'].includes(ext) && /openapi|swagger|paths:/i.test(content)) return 'API';
  if (['.json'].includes(ext) && /openapi|swagger|paths/i.test(content)) return 'API';

  return 'CODE';
}

export function getFileSummary(files: string[]): string {
  const exts = [...new Set(files.map(f => path.extname(f)).filter(Boolean))];
  return `${files.length} file${files.length !== 1 ? 's' : ''} (${exts.join(', ')})`;
}
