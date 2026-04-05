import test from "node:test";
import assert from "node:assert/strict";
import { calculateScores, detectLanguage, generateFindings } from "../src/lib/analysis";
import { formatSuggestionCategory } from "../src/lib/utils";

test("detectLanguage uses filename and content heuristics", () => {
  assert.equal(detectLanguage("const total: number = 1;", "metrics.ts"), "TypeScript");
  assert.equal(detectLanguage("SELECT * FROM users WHERE id = 1;"), "SQL");
});

test("generateFindings returns security and performance findings without cost-saving category", () => {
  const content = `
    async function getUser(userId) {
      return db.query('SELECT * FROM users WHERE id = ' + userId);
    }
  `;

  const findings = generateFindings(content, "JavaScript", "CODE");

  assert.ok(findings.some((finding) => finding.category === "SECURITY"));
  assert.ok(findings.some((finding) => finding.category === "PERFORMANCE"));
  assert.ok(findings.every((finding) => finding.category !== ("COST_SAVING" as never)));
});

test("generateFindings falls back to general review guidance for unremarkable content", () => {
  const findings = generateFindings("name,age\nAda,37\nGrace,45\nLinus,55", "Unknown", "GENERAL");

  assert.ok(findings.length >= 3);
  assert.ok(findings.length <= 6);
  assert.ok(findings.some((finding) => finding.title.includes("Clarify")));
});

test("calculateScores lowers risky inputs but keeps values bounded", () => {
  const content = `
    setInterval(() => {
      return readFileSync("/tmp/file.txt");
    }, 1000);
    // TODO: remove later
  `;
  const findings = generateFindings(content, "JavaScript", "CODE");
  const scores = calculateScores(content, findings);

  assert.ok(scores.reliabilityScore < 88);
  assert.ok(scores.performanceScore < 86);
  assert.ok(scores.reliabilityScore >= 45);
  assert.ok(scores.performanceScore >= 45);
});

test("formatSuggestionCategory keeps legacy cost-saving records user-friendly", () => {
  assert.equal(formatSuggestionCategory("COST_SAVING"), "EFFICIENCY");
  assert.equal(formatSuggestionCategory("MAINTAINABILITY"), "MAINTAINABILITY");
});
