export type AnalyzeInputType =
  | "CODE"
  | "DATABASE"
  | "DASHBOARD"
  | "API"
  | "INFRASTRUCTURE"
  | "GENERAL";

export type FindingCategory =
  | "PERFORMANCE"
  | "RELIABILITY"
  | "SECURITY"
  | "MAINTAINABILITY"
  | "SCALABILITY";

export interface GeneratedFinding {
  title: string;
  description: string;
  category: FindingCategory;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  estimatedEffort: string;
  codeSnippet?: string;
  improvedCode?: string;
}

function pushFinding(findings: GeneratedFinding[], finding: GeneratedFinding) {
  if (!findings.some((item) => item.title === finding.title)) {
    findings.push(finding);
  }
}

function buildFallbackFindings(
  type: AnalyzeInputType,
  language: string
): GeneratedFinding[] {
  return [
    {
      title: `Clarify ${language !== "Unknown" ? language : type.toLowerCase()} assumptions`,
      description:
        "Document expected inputs, outputs, and edge cases so future reviews can reason about the data quickly.",
      category: "MAINTAINABILITY",
      priority: "LOW",
      estimatedEffort: "30-60 minutes",
    },
    {
      title: "Add stronger validation around incoming data",
      description:
        "Validate required fields, shapes, and boundary conditions before processing to reduce avoidable failures.",
      category: "RELIABILITY",
      priority: "MEDIUM",
      estimatedEffort: "1-2 hours",
    },
    {
      title: "Create a repeatable regression check",
      description:
        "Capture the expected behavior in tests or sample fixtures so future changes can be reviewed with confidence.",
      category: "SCALABILITY",
      priority: "MEDIUM",
      estimatedEffort: "1-3 hours",
    },
  ];
}

export function detectLanguage(content: string, fileName?: string): string {
  if (fileName) {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      js: "JavaScript",
      jsx: "JavaScript (React)",
      ts: "TypeScript",
      tsx: "TypeScript (React)",
      py: "Python",
      java: "Java",
      cs: "C#",
      cpp: "C++",
      c: "C",
      go: "Go",
      rs: "Rust",
      rb: "Ruby",
      php: "PHP",
      swift: "Swift",
      kt: "Kotlin",
      sql: "SQL",
      sh: "Shell",
      yml: "YAML",
      yaml: "YAML",
      json: "JSON",
      xml: "XML",
      html: "HTML",
      css: "CSS",
      scss: "SCSS",
      tf: "Terraform",
    };
    if (ext && langMap[ext]) return langMap[ext];
  }

  if (/def\s+\w+|import\s+\w+|print\(|\.py/.test(content)) return "Python";
  if (/function\s+\w+|const\s+\w+|let\s+\w+|=>/.test(content)) return "JavaScript";
  if (/interface\s+\w+|type\s+\w+\s*=|:\s*string|:\s*number/.test(content)) return "TypeScript";
  if (/SELECT|INSERT|UPDATE|DELETE|CREATE TABLE/i.test(content)) return "SQL";
  if (/resource\s+"|provider\s+"|terraform/.test(content)) return "Terraform";
  if (/apiVersion:|kind:|metadata:/.test(content)) return "Kubernetes YAML";
  if (/<\?php/.test(content)) return "PHP";
  if (/package\s+main|func\s+\w+/.test(content)) return "Go";
  if (/fn\s+\w+|let\s+mut|println!/.test(content)) return "Rust";
  if (/public\s+class|private\s+void|@Override/.test(content)) return "Java";
  if (/\{"|\":|^\s*\[/m.test(content)) return "JSON";
  return "Unknown";
}

export function generateFindings(
  content: string,
  language: string,
  type: AnalyzeInputType
): GeneratedFinding[] {
  const findings: GeneratedFinding[] = [];

  if (/SELECT \*\s+FROM/i.test(content)) {
    pushFinding(findings, {
      title: "Select only required fields",
      description:
        "Replace broad SELECT * queries with explicit columns to make the dataset easier to review and reduce unnecessary processing.",
      category: "PERFORMANCE",
      priority: "HIGH",
      estimatedEffort: "15-30 minutes",
    });
  }

  if (
    /query\([^)]*['"`][^'"`]*(SELECT|INSERT|UPDATE|DELETE)[^'"`]*['"`]\s*\+\s*\w+/i.test(content) ||
    /(SELECT|INSERT|UPDATE|DELETE)[^;\n]*\+\s*\w+/i.test(content)
  ) {
    pushFinding(findings, {
      title: "Parameterize dynamic queries",
      description:
        "Avoid concatenating user-controlled values into queries. Use placeholders or query parameters so the analysis is safer and easier to maintain.",
      category: "SECURITY",
      priority: "CRITICAL",
      estimatedEffort: "30-90 minutes",
      codeSnippet: "db.query('SELECT * FROM users WHERE id = ' + userId)",
      improvedCode: "db.query('SELECT id, email FROM users WHERE id = ?', [userId])",
    });
  }

  if (
    /for\s*\([^)]*\)\s*{[^}]*\b(query|fetch|axios|request)\b|while\s*\([^)]*\)\s*{[^}]*\b(query|fetch|axios|request)\b/i.test(
      content
    )
  ) {
    pushFinding(findings, {
      title: "Batch repeated external calls",
      description:
        "Repeated queries or network calls inside loops can slow processing dramatically. Batch related work or fetch data once when possible.",
      category: "SCALABILITY",
      priority: "HIGH",
      estimatedEffort: "2-4 hours",
    });
  }

  if (/setInterval|setTimeout/.test(content) && !/clearInterval|clearTimeout/.test(content)) {
    pushFinding(findings, {
      title: "Clean up long-running timers",
      description:
        "Timers should be cleared when the owning process, request, or component is no longer active to avoid stale work and unstable behavior.",
      category: "RELIABILITY",
      priority: "MEDIUM",
      estimatedEffort: "30-60 minutes",
    });
  }

  if (/readFileSync|writeFileSync|existsSync/.test(content)) {
    pushFinding(findings, {
      title: "Prefer non-blocking file operations",
      description:
        "Synchronous file APIs can block processing and make larger analyses feel sluggish. Use async file access where possible.",
      category: "PERFORMANCE",
      priority: "MEDIUM",
      estimatedEffort: "30-90 minutes",
    });
  }

  if (/\.filter\([^)]*\)\.map\(|\.map\([^)]*\)\.filter\(/.test(content)) {
    pushFinding(findings, {
      title: "Consolidate repeated array transforms",
      description:
        "Chaining multiple passes over the same data is often harder to read and more expensive to process than a single well-named transformation.",
      category: "MAINTAINABILITY",
      priority: "LOW",
      estimatedEffort: "15-45 minutes",
    });
  }

  if (/TODO|FIXME|XXX/.test(content)) {
    pushFinding(findings, {
      title: "Resolve unresolved implementation markers",
      description:
        "Outstanding TODO or FIXME markers usually indicate hidden assumptions that should be completed or documented before this area grows further.",
      category: "MAINTAINABILITY",
      priority: "MEDIUM",
      estimatedEffort: "30-120 minutes",
    });
  }

  if (type === "API" || /openapi:|swagger:|paths:/i.test(content)) {
    pushFinding(findings, {
      title: "Document failure responses and examples",
      description:
        "Include representative error payloads and edge-case examples so API consumers can understand how the data behaves in real usage.",
      category: "MAINTAINABILITY",
      priority: "MEDIUM",
      estimatedEffort: "1-2 hours",
    });
  }

  if (type === "DASHBOARD" || /grafana|dataset|chart|metric|panel/i.test(content)) {
    pushFinding(findings, {
      title: "Add explicit thresholds and labels",
      description:
        "Clear labels, units, and threshold definitions make dashboards easier to interpret and reduce the chance of acting on ambiguous signals.",
      category: "RELIABILITY",
      priority: "MEDIUM",
      estimatedEffort: "30-90 minutes",
    });
  }

  if ((type === "GENERAL" || language === "JSON") && /,/.test(content) && content.split("\n").length > 5) {
    pushFinding(findings, {
      title: "Normalize and describe key fields",
      description:
        "Structured data is easier to analyze when field names, units, and optional values are described consistently across records.",
      category: "MAINTAINABILITY",
      priority: "LOW",
      estimatedEffort: "30-60 minutes",
    });
  }

  for (const fallback of buildFallbackFindings(type, language)) {
    if (findings.length >= 6) break;
    pushFinding(findings, fallback);
  }

  return findings.slice(0, 6);
}

export function calculateScores(content: string, findings: GeneratedFinding[]) {
  let reliabilityScore = 88;
  let performanceScore = 86;

  if (/setInterval|setTimeout/.test(content) && !/clearInterval|clearTimeout/.test(content)) {
    reliabilityScore -= 10;
  }
  if (/TODO|FIXME|XXX/.test(content)) {
    reliabilityScore -= 6;
  }
  if (/query\([^)]*['"`][^'"`]*(SELECT|INSERT|UPDATE|DELETE)[^'"`]*['"`]\s*\+\s*\w+/i.test(content)) {
    reliabilityScore -= 18;
  }
  if (/SELECT \*\s+FROM/i.test(content)) {
    performanceScore -= 10;
  }
  if (/readFileSync|writeFileSync|existsSync/.test(content)) {
    performanceScore -= 8;
  }
  if (
    /for\s*\([^)]*\)\s*{[^}]*\b(query|fetch|axios|request)\b|while\s*\([^)]*\)\s*{[^}]*\b(query|fetch|axios|request)\b/i.test(
      content
    )
  ) {
    performanceScore -= 14;
  }

  performanceScore -= Math.min(12, findings.filter((finding) => finding.category === "PERFORMANCE").length * 2);
  reliabilityScore -= Math.min(
    12,
    findings.filter((finding) => finding.category === "RELIABILITY" || finding.category === "SECURITY").length * 2
  );

  return {
    reliabilityScore: Math.max(45, Math.min(98, reliabilityScore)),
    performanceScore: Math.max(45, Math.min(98, performanceScore)),
  };
}
