import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/request-auth";
import { z } from "zod";

const analyzeSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  type: z.enum(["CODE", "DATABASE", "DASHBOARD", "API", "INFRASTRUCTURE", "GENERAL"]),
  fileName: z.string().optional(),
});

function detectLanguage(content: string, fileName?: string): string {
  if (fileName) {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      js: "JavaScript", jsx: "JavaScript (React)", ts: "TypeScript", tsx: "TypeScript (React)",
      py: "Python", java: "Java", cs: "C#", cpp: "C++", c: "C",
      go: "Go", rs: "Rust", rb: "Ruby", php: "PHP",
      swift: "Swift", kt: "Kotlin", sql: "SQL", sh: "Shell",
      yml: "YAML", yaml: "YAML", json: "JSON", xml: "XML",
      html: "HTML", css: "CSS", scss: "SCSS", tf: "Terraform",
    };
    if (ext && langMap[ext]) return langMap[ext];
  }

  // Pattern-based detection
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

type FindingCategory =
  | "PERFORMANCE"
  | "RELIABILITY"
  | "SECURITY"
  | "MAINTAINABILITY"
  | "SCALABILITY";

interface GeneratedFinding {
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

function buildFallbackFindings(type: string, language: string): GeneratedFinding[] {
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

function generateSuggestions(content: string, language: string, type: string) {
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

  if (/for\s*\([^)]*\)\s*{[^}]*\b(query|fetch|axios|request)\b|while\s*\([^)]*\)\s*{[^}]*\b(query|fetch|axios|request)\b/i.test(content)) {
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

function calculateScores(content: string, suggestions: GeneratedFinding[]) {
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
  if (/for\s*\([^)]*\)\s*{[^}]*\b(query|fetch|axios|request)\b|while\s*\([^)]*\)\s*{[^}]*\b(query|fetch|axios|request)\b/i.test(content)) {
    performanceScore -= 14;
  }

  performanceScore -= Math.min(12, suggestions.filter((s) => s.category === "PERFORMANCE").length * 2);
  reliabilityScore -= Math.min(12, suggestions.filter((s) => s.category === "RELIABILITY" || s.category === "SECURITY").length * 2);

  return {
    reliabilityScore: Math.max(45, Math.min(98, reliabilityScore)),
    performanceScore: Math.max(45, Math.min(98, performanceScore)),
  };
}

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, type, fileName } = analyzeSchema.parse(body);

    const language = detectLanguage(content, fileName);
    const suggestions = generateSuggestions(content, language, type);
    const { reliabilityScore, performanceScore } = calculateScores(content, suggestions);

    // Save to DB
    const analysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        title,
        type: type as any,
        status: "COMPLETED",
        language,
        rawContent: content.substring(0, 10000), // Store first 10k chars
        fileName,
        fileSize: content.length,
        costSavings: null,
        reliabilityScore,
        performanceScore,
        analysisResult: {
          language,
          findingsCount: suggestions.length,
          analyzedAt: new Date().toISOString(),
          authMethod: user.authMethod,
        },
        suggestions: {
          create: suggestions.map((s) => ({
            title: s.title,
            description: s.description,
            category: s.category as any,
            priority: s.priority as any,
            estimatedSaving: null,
            estimatedEffort: s.estimatedEffort,
            codeSnippet: s.codeSnippet,
            improvedCode: s.improvedCode,
            status: "PENDING",
          })),
        },
      },
      include: { suggestions: true },
    });

    // Auto-generate documentation
    await prisma.document.create({
      data: {
        userId: user.id,
        analysisId: analysis.id,
        title: `Analysis Report: ${title}`,
        type: "TECHNICAL",
        content: `# Analysis Report: ${title}

## Overview
- **Language**: ${language}
- **Analysis Type**: ${type}
- **Date**: ${new Date().toLocaleDateString()}
- **Reliability Score**: ${reliabilityScore}/100
- **Performance Score**: ${performanceScore}/100

## Key Findings

### Findings Summary
${suggestions.map((s, i) => `${i + 1}. **${s.title}** (${s.priority} priority) - ${s.category.replace("_", " ")}`).join("\n")}

## Next Steps
Review the findings, capture any code changes you want to make, and update your implementation notes as needed.

---
*Generated by RAPID - Read, Analyze, Patch, Implement & Document*`,
      },
    });

    return NextResponse.json({
      analysis: {
        id: analysis.id,
        title: analysis.title,
        language,
        type,
        reliabilityScore,
        performanceScore,
        findingsCount: suggestions.length,
      },
      suggestions,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = await getRequestUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const analyses = await prisma.analysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      suggestions: { select: { id: true, status: true, category: true, priority: true, estimatedSaving: true } },
    },
  });

  return NextResponse.json(analyses);
}
