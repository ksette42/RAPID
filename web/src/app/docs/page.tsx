"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Code2, FileText, GitMerge, Zap, Key, CreditCard,
  User, BarChart3, BookOpen, ChevronRight, Copy, CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Language = "curl" | "python" | "javascript" | "java" | "csharp";

interface CodeSample {
  curl: string;
  python: string;
  javascript: string;
  java: string;
  csharp: string;
}

interface Endpoint {
  id: string;
  method: "POST" | "GET" | "PATCH" | "DELETE";
  path: string;
  title: string;
  description: string;
  auth: boolean;
  requestBody?: Record<string, { type: string; required: boolean; description: string }>;
  responses: Record<string, string>;
  samples: CodeSample;
}

interface Section {
  id: string;
  title: string;
  icon: any;
  color: string;
  bg: string;
  description: string;
  endpoints: Endpoint[];
}

// ─── Code Samples Data ────────────────────────────────────────────────────────
const BASE = "https://app.rapid.dev";

const sections: Section[] = [
  // ── Authentication ─────────────────────────────────────────────────────────
  {
    id: "auth",
    title: "Authentication",
    icon: Key,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    description: "Register, sign in, and manage API keys to authenticate requests.",
    endpoints: [
      {
        id: "register",
        method: "POST",
        path: "/api/auth/register",
        title: "Register a new account",
        description: "Create a new user account with email and password. Returns the new user ID. A FREE subscription is automatically created.",
        auth: false,
        requestBody: {
          name: { type: "string", required: true, description: "Display name" },
          email: { type: "string", required: true, description: "Email address" },
          password: { type: "string", required: true, description: "Min 8 characters" },
        },
        responses: {
          "201": "Account created — returns { message, userId }",
          "400": "Validation error or email already in use",
        },
        samples: {
          curl: `curl -X POST ${BASE}/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@company.com",
    "password": "securepass123"
  }'`,
          python: `import requests

response = requests.post(
    "${BASE}/api/auth/register",
    json={
        "name": "Jane Doe",
        "email": "jane@company.com",
        "password": "securepass123"
    }
)
print(response.json())`,
          javascript: `const response = await fetch("${BASE}/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Jane Doe",
    email: "jane@company.com",
    password: "securepass123",
  }),
});
const data = await response.json();
console.log(data);`,
          java: `import java.net.http.*;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();
String body = """
    {"name":"Jane Doe","email":"jane@company.com","password":"securepass123"}
    """;
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${BASE}/api/auth/register"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();
HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
          csharp: `using System.Net.Http;
using System.Text;
using System.Text.Json;

var client = new HttpClient();
var payload = new {
    name = "Jane Doe",
    email = "jane@company.com",
    password = "securepass123"
};
var content = new StringContent(
    JsonSerializer.Serialize(payload),
    Encoding.UTF8, "application/json");
var response = await client.PostAsync(
    "${BASE}/api/auth/register", content);
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
        },
      },
      {
        id: "create-api-key",
        method: "POST",
        path: "/api/api-keys",
        title: "Create an API key",
        description: "Generate a new API key for programmatic access. The key is returned once and never shown again. Include it as a Bearer token in the Authorization header on all subsequent requests.",
        auth: true,
        requestBody: {
          name: { type: "string", required: true, description: "Friendly name for the key" },
        },
        responses: {
          "201": "Returns the full API key — save it immediately",
          "400": "Max 10 keys per account",
          "401": "Not authenticated",
        },
        samples: {
          curl: `curl -X POST ${BASE}/api/api-keys \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \\
  -d '{"name": "production-server"}'`,
          python: `import requests

response = requests.post(
    "${BASE}/api/api-keys",
    headers={"Authorization": "Bearer YOUR_SESSION_TOKEN"},
    json={"name": "production-server"}
)
api_key = response.json()["key"]
print(f"Save this key: {api_key}")`,
          javascript: `const response = await fetch("${BASE}/api/api-keys", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_SESSION_TOKEN",
  },
  body: JSON.stringify({ name: "production-server" }),
});
const { key } = await response.json();
console.log("Save this key:", key);`,
          java: `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${BASE}/api/api-keys"))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer YOUR_SESSION_TOKEN")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\"name\":\"production-server\"}"))
    .build();
HttpResponse<String> resp =
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(resp.body());`,
          csharp: `client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", "YOUR_SESSION_TOKEN");
var content = new StringContent(
    "{\"name\":\"production-server\"}",
    Encoding.UTF8, "application/json");
var response = await client.PostAsync("${BASE}/api/api-keys", content);
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
        },
      },
    ],
  },

  // ── Analyze ────────────────────────────────────────────────────────────────
  {
    id: "analyze",
    title: "Analyze",
    icon: Code2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    description: "Submit code, SQL, infrastructure configs, or any text-based data for AI analysis. Returns reliability and performance scores plus actionable suggestions.",
    endpoints: [
      {
        id: "run-analysis",
        method: "POST",
        path: "/api/analyze",
        title: "Run an analysis",
        description: "Analyzes any code or data for cost savings, reliability risks, and performance issues. Supports 50+ languages including JavaScript, Python, Go, SQL, Terraform, YAML, and more. Also accepts dashboard exports and API specs.",
        auth: true,
        requestBody: {
          title: { type: "string", required: true, description: "Name for this analysis" },
          content: { type: "string", required: true, description: "The code or data to analyze (max 50KB)" },
          type: { type: "enum", required: true, description: "CODE | DATABASE | API | INFRASTRUCTURE | DASHBOARD | GENERAL" },
          fileName: { type: "string", required: false, description: "Original filename (helps language detection)" },
        },
        responses: {
          "200": "Returns analysis scores + array of suggestions",
          "400": "Missing required fields",
          "401": "Invalid or missing API key",
          "403": "Free plan limit reached (5/month)",
        },
        samples: {
          curl: `curl -X POST ${BASE}/api/analyze \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer rapid_YOUR_API_KEY" \\
  -d '{
    "title": "payment-service review",
    "type": "CODE",
    "fileName": "payment.ts",
    "content": "async function getUser(id) {\\n  return db.query(\\\"SELECT * FROM users WHERE id = \\\" + id);\\n}"
  }'`,
          python: `import requests

RAPID_API_KEY = "rapid_YOUR_API_KEY"

with open("payment.py", "r") as f:
    code = f.read()

response = requests.post(
    "${BASE}/api/analyze",
    headers={"Authorization": f"Bearer {RAPID_API_KEY}"},
    json={
        "title": "payment-service review",
        "type": "CODE",
        "fileName": "payment.py",
        "content": code,
    }
)

result = response.json()
print(f"Reliability: {result['analysis']['reliabilityScore']}/100")
print(f"Savings: \${result['analysis']['costSavings']}/month")
for s in result["suggestions"]:
    print(f"  [{s['priority']}] {s['title']}")`,
          javascript: `const fs = require("fs");

const code = fs.readFileSync("./payment.js", "utf8");

const response = await fetch("${BASE}/api/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer rapid_YOUR_API_KEY",
  },
  body: JSON.stringify({
    title: "payment-service review",
    type: "CODE",
    fileName: "payment.js",
    content: code,
  }),
});

const { analysis, suggestions } = await response.json();
console.log(\`Reliability: \${analysis.reliabilityScore}/100\`);
console.log(\`Potential savings: $\${analysis.costSavings}/month\`);
suggestions.forEach(s =>
  console.log(\`  [\${s.priority}] \${s.title}\`)
);`,
          java: `import java.nio.file.*;

String code = Files.readString(Path.of("Payment.java"));
String escaped = code.replace("\\", "\\\\").replace("\"", "\\\"")
                     .replace("\\n", "\\\\n");
String body = String.format(
    "{\"title\":\"payment-service\",\"type\":\"CODE\"," +
    "\"fileName\":\"Payment.java\",\"content\":\"%s\"}", escaped);

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${BASE}/api/analyze"))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer rapid_YOUR_API_KEY")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();
HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
          csharp: `using System.IO;

string code = await File.ReadAllTextAsync("Payment.cs");
var payload = new {
    title = "payment-service",
    type = "CODE",
    fileName = "Payment.cs",
    content = code
};
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", "rapid_YOUR_API_KEY");
var json = JsonSerializer.Serialize(payload);
var content = new StringContent(json, Encoding.UTF8, "application/json");
var response = await client.PostAsync("${BASE}/api/analyze", content);
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);`,
        },
      },
      {
        id: "list-analyses",
        method: "GET",
        path: "/api/analyze",
        title: "List all analyses",
        description: "Returns all analyses for the authenticated user, ordered by most recent. Each record includes scores, language, and a summary of suggestions.",
        auth: true,
        responses: {
          "200": "Array of analysis objects",
          "401": "Unauthorized",
        },
        samples: {
          curl: `curl ${BASE}/api/analyze \\
  -H "Authorization: Bearer rapid_YOUR_API_KEY"`,
          python: `import requests

response = requests.get(
    "${BASE}/api/analyze",
    headers={"Authorization": "Bearer rapid_YOUR_API_KEY"}
)
for analysis in response.json():
    print(f"{analysis['title']} — {analysis['status']}")`,
          javascript: `const response = await fetch("${BASE}/api/analyze", {
  headers: { "Authorization": "Bearer rapid_YOUR_API_KEY" },
});
const analyses = await response.json();
analyses.forEach(a =>
  console.log(\`\${a.title} — \${a.status}\`)
);`,
          java: `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${BASE}/api/analyze"))
    .header("Authorization", "Bearer rapid_YOUR_API_KEY")
    .GET()
    .build();
HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
          csharp: `client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", "rapid_YOUR_API_KEY");
var response = await client.GetAsync("${BASE}/api/analyze");
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
        },
      },
    ],
  },

  // ── Suggestions ────────────────────────────────────────────────────────────
  {
    id: "suggestions",
    title: "Suggestions",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    description: "Review, approve, or dismiss AI-generated improvement suggestions. Approved suggestions are queued for implementation.",
    endpoints: [
      {
        id: "update-suggestion",
        method: "PATCH",
        path: "/api/suggestions/:id",
        title: "Approve, dismiss, or implement a suggestion",
        description: "Updates the status of a suggestion. Approving queues it for implementation. Implementing records it as applied and creates an implementation record. Dismissing archives it.",
        auth: true,
        requestBody: {
          action: { type: "enum", required: true, description: "approve | dismiss | implement | reject" },
        },
        responses: {
          "200": "Updated suggestion object",
          "404": "Suggestion not found or not owned by user",
          "401": "Unauthorized",
        },
        samples: {
          curl: `# Approve a suggestion
curl -X PATCH ${BASE}/api/suggestions/SUGGESTION_ID \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer rapid_YOUR_API_KEY" \\
  -d '{"action": "approve"}'

# Dismiss a suggestion
curl -X PATCH ${BASE}/api/suggestions/SUGGESTION_ID \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer rapid_YOUR_API_KEY" \\
  -d '{"action": "dismiss"}'`,
          python: `import requests

def update_suggestion(suggestion_id: str, action: str):
    """action: approve | dismiss | implement | reject"""
    response = requests.patch(
        f"${BASE}/api/suggestions/{suggestion_id}",
        headers={"Authorization": "Bearer rapid_YOUR_API_KEY"},
        json={"action": action}
    )
    return response.json()

# Approve
result = update_suggestion("SUGGESTION_ID", "approve")
print(result["status"])  # APPROVED`,
          javascript: `async function updateSuggestion(id, action) {
  // action: "approve" | "dismiss" | "implement" | "reject"
  const response = await fetch(\`${BASE}/api/suggestions/\${id}\`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer rapid_YOUR_API_KEY",
    },
    body: JSON.stringify({ action }),
  });
  return response.json();
}

// Approve a suggestion
const result = await updateSuggestion("SUGGESTION_ID", "approve");
console.log(result.status); // "APPROVED"`,
          java: `String suggestionId = "SUGGESTION_ID";
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${BASE}/api/suggestions/" + suggestionId))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer rapid_YOUR_API_KEY")
    .method("PATCH", HttpRequest.BodyPublishers.ofString(
        "{\"action\":\"approve\"}"))
    .build();
HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
          csharp: `var request = new HttpRequestMessage(
    HttpMethod.Patch,
    $"${BASE}/api/suggestions/SUGGESTION_ID");
request.Headers.Authorization =
    new AuthenticationHeaderValue("Bearer", "rapid_YOUR_API_KEY");
request.Content = new StringContent(
    "{\"action\":\"approve\"}", Encoding.UTF8, "application/json");
var response = await client.SendAsync(request);
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
        },
      },
    ],
  },

  // ── Implementation ─────────────────────────────────────────────────────────
  {
    id: "implementation",
    title: "Implementation",
    icon: GitMerge,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    description: "Apply or roll back approved changes. Every action is permission-gated — nothing is applied without explicit approval.",
    endpoints: [
      {
        id: "apply-rollback",
        method: "POST",
        path: "/api/implement/:id",
        title: "Apply or roll back an implementation",
        description: "Applies an approved implementation or rolls back a completed one. Rollback reverts the suggestion status back to PENDING so it can be reconsidered.",
        auth: true,
        requestBody: {
          action: { type: "enum", required: true, description: "approve | apply | rollback" },
        },
        responses: {
          "200": "Updated implementation object",
          "404": "Implementation not found",
          "401": "Unauthorized",
        },
        samples: {
          curl: `# Apply an approved implementation
curl -X POST ${BASE}/api/implement/IMPL_ID \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer rapid_YOUR_API_KEY" \\
  -d '{"action": "apply"}'

# Roll back a completed implementation
curl -X POST ${BASE}/api/implement/IMPL_ID \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer rapid_YOUR_API_KEY" \\
  -d '{"action": "rollback"}'`,
          python: `import requests

RAPID_API_KEY = "rapid_YOUR_API_KEY"

def apply_implementation(impl_id: str):
    return requests.post(
        f"${BASE}/api/implement/{impl_id}",
        headers={"Authorization": f"Bearer {RAPID_API_KEY}"},
        json={"action": "apply"}
    ).json()

def rollback_implementation(impl_id: str):
    return requests.post(
        f"${BASE}/api/implement/{impl_id}",
        headers={"Authorization": f"Bearer {RAPID_API_KEY}"},
        json={"action": "rollback"}
    ).json()`,
          javascript: `async function manageImplementation(id, action) {
  // action: "approve" | "apply" | "rollback"
  const response = await fetch(\`${BASE}/api/implement/\${id}\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer rapid_YOUR_API_KEY",
    },
    body: JSON.stringify({ action }),
  });
  return response.json();
}

await manageImplementation("IMPL_ID", "apply");
await manageImplementation("IMPL_ID", "rollback");`,
          java: `String implId = "IMPL_ID";
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${BASE}/api/implement/" + implId))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer rapid_YOUR_API_KEY")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\"action\":\"apply\"}"))
    .build();
HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
          csharp: `var content = new StringContent(
    "{\"action\":\"apply\"}", Encoding.UTF8, "application/json");
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", "rapid_YOUR_API_KEY");
var response = await client.PostAsync(
    "${BASE}/api/implement/IMPL_ID", content);
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
        },
      },
    ],
  },

  // ── Documents ──────────────────────────────────────────────────────────────
  {
    id: "documents",
    title: "Documents",
    icon: FileText,
    color: "text-green-400",
    bg: "bg-green-500/10",
    description: "Access auto-generated technical documentation. Docs are created automatically when an analysis runs.",
    endpoints: [
      {
        id: "list-documents",
        method: "GET",
        path: "/api/documents",
        title: "List documents",
        description: "Returns all auto-generated documentation for the authenticated user. Documents are created automatically when analyses complete.",
        auth: true,
        responses: {
          "200": "Array of document objects with title, type, content",
          "401": "Unauthorized",
        },
        samples: {
          curl: `curl ${BASE}/api/documents \\
  -H "Authorization: Bearer rapid_YOUR_API_KEY"`,
          python: `import requests

response = requests.get(
    "${BASE}/api/documents",
    headers={"Authorization": "Bearer rapid_YOUR_API_KEY"}
)
for doc in response.json():
    print(f"[{doc['type']}] {doc['title']}")`,
          javascript: `const response = await fetch("${BASE}/api/documents", {
  headers: { "Authorization": "Bearer rapid_YOUR_API_KEY" },
});
const docs = await response.json();
docs.forEach(d => console.log(\`[\${d.type}] \${d.title}\`));`,
          java: `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${BASE}/api/documents"))
    .header("Authorization", "Bearer rapid_YOUR_API_KEY")
    .GET()
    .build();
HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
          csharp: `client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", "rapid_YOUR_API_KEY");
var response = await client.GetAsync("${BASE}/api/documents");
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
        },
      },
    ],
  },

  // ── User Profile ───────────────────────────────────────────────────────────
  {
    id: "users",
    title: "User & Profile",
    icon: User,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    description: "Manage your user profile and account settings.",
    endpoints: [
      {
        id: "update-profile",
        method: "PATCH",
        path: "/api/users/profile",
        title: "Update profile",
        description: "Update the authenticated user's display name.",
        auth: true,
        requestBody: {
          name: { type: "string", required: true, description: "New display name" },
        },
        responses: {
          "200": "Updated user object",
          "401": "Unauthorized",
        },
        samples: {
          curl: `curl -X PATCH ${BASE}/api/users/profile \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer rapid_YOUR_API_KEY" \\
  -d '{"name": "Jane Smith"}'`,
          python: `import requests

response = requests.patch(
    "${BASE}/api/users/profile",
    headers={"Authorization": "Bearer rapid_YOUR_API_KEY"},
    json={"name": "Jane Smith"}
)
print(response.json())`,
          javascript: `const response = await fetch("${BASE}/api/users/profile", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer rapid_YOUR_API_KEY",
  },
  body: JSON.stringify({ name: "Jane Smith" }),
});
console.log(await response.json());`,
          java: `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${BASE}/api/users/profile"))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer rapid_YOUR_API_KEY")
    .method("PATCH", HttpRequest.BodyPublishers.ofString(
        "{\"name\":\"Jane Smith\"}"))
    .build();
client.send(request, HttpResponse.BodyHandlers.ofString());`,
          csharp: `var request = new HttpRequestMessage(
    HttpMethod.Patch, "${BASE}/api/users/profile");
request.Headers.Authorization =
    new AuthenticationHeaderValue("Bearer", "rapid_YOUR_API_KEY");
request.Content = new StringContent(
    "{\"name\":\"Jane Smith\"}", Encoding.UTF8, "application/json");
await client.SendAsync(request);`,
        },
      },
    ],
  },

  // ── Stripe / Billing ───────────────────────────────────────────────────────
  {
    id: "billing",
    title: "Billing",
    icon: CreditCard,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    description: "Create Stripe checkout sessions and open the billing portal to manage subscriptions.",
    endpoints: [
      {
        id: "create-checkout",
        method: "POST",
        path: "/api/stripe/checkout",
        title: "Create a checkout session",
        description: "Creates a Stripe Checkout session for the given price ID. Returns a URL to redirect the user to. On success, Stripe redirects back to /dashboard/billing?success=true.",
        auth: true,
        requestBody: {
          priceId: { type: "string", required: true, description: "Stripe Price ID (e.g. price_xxx)" },
          planId: { type: "string", required: true, description: "STARTER | PRO | ENTERPRISE" },
        },
        responses: {
          "200": "Returns { url } — redirect the user to this Stripe URL",
          "400": "Missing price ID",
          "401": "Unauthorized",
        },
        samples: {
          curl: `curl -X POST ${BASE}/api/stripe/checkout \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer rapid_YOUR_API_KEY" \\
  -d '{
    "priceId": "price_YOUR_STRIPE_PRICE_ID",
    "planId": "PRO"
  }'`,
          python: `import requests
import webbrowser

response = requests.post(
    "${BASE}/api/stripe/checkout",
    headers={"Authorization": "Bearer rapid_YOUR_API_KEY"},
    json={
        "priceId": "price_YOUR_STRIPE_PRICE_ID",
        "planId": "PRO"
    }
)
checkout_url = response.json()["url"]
webbrowser.open(checkout_url)`,
          javascript: `const response = await fetch("${BASE}/api/stripe/checkout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer rapid_YOUR_API_KEY",
  },
  body: JSON.stringify({
    priceId: "price_YOUR_STRIPE_PRICE_ID",
    planId: "PRO",
  }),
});
const { url } = await response.json();
window.location.href = url; // redirect to Stripe`,
          java: `String body = "{\"priceId\":\"price_ID\",\"planId\":\"PRO\"}";
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${BASE}/api/stripe/checkout"))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer rapid_YOUR_API_KEY")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();
HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());
// Parse JSON and open the "url" field in a browser
System.out.println(response.body());`,
          csharp: `var payload = new { priceId = "price_ID", planId = "PRO" };
var content = new StringContent(
    JsonSerializer.Serialize(payload),
    Encoding.UTF8, "application/json");
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", "rapid_YOUR_API_KEY");
var response = await client.PostAsync(
    "${BASE}/api/stripe/checkout", content);
var result = JsonSerializer.Deserialize<Dictionary<string,string>>(
    await response.Content.ReadAsStringAsync());
// Open result["url"] in browser
Process.Start(new ProcessStartInfo(result["url"]) { UseShellExecute = true });`,
        },
      },
      {
        id: "billing-portal",
        method: "POST",
        path: "/api/stripe/portal",
        title: "Open billing portal",
        description: "Creates a Stripe Billing Portal session. Returns a URL that lets the user manage their subscription, update payment methods, or cancel.",
        auth: true,
        responses: {
          "200": "Returns { url } — redirect user to Stripe portal",
          "400": "No Stripe customer found",
          "401": "Unauthorized",
        },
        samples: {
          curl: `curl -X POST ${BASE}/api/stripe/portal \\
  -H "Authorization: Bearer rapid_YOUR_API_KEY"`,
          python: `import requests, webbrowser

response = requests.post(
    "${BASE}/api/stripe/portal",
    headers={"Authorization": "Bearer rapid_YOUR_API_KEY"}
)
webbrowser.open(response.json()["url"])`,
          javascript: `const response = await fetch("${BASE}/api/stripe/portal", {
  method: "POST",
  headers: { "Authorization": "Bearer rapid_YOUR_API_KEY" },
});
const { url } = await response.json();
window.location.href = url;`,
          java: `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${BASE}/api/stripe/portal"))
    .header("Authorization", "Bearer rapid_YOUR_API_KEY")
    .POST(HttpRequest.BodyPublishers.noBody())
    .build();
HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
          csharp: `client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", "rapid_YOUR_API_KEY");
var response = await client.PostAsync(
    "${BASE}/api/stripe/portal",
    new StringContent(""));
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
        },
      },
    ],
  },
];

// ─── Language config ──────────────────────────────────────────────────────────
const LANGUAGES: { id: Language; label: string; color: string }[] = [
  { id: "curl",       label: "cURL",       color: "text-orange-400" },
  { id: "python",     label: "Python",     color: "text-blue-400"   },
  { id: "javascript", label: "JavaScript", color: "text-yellow-400" },
  { id: "java",       label: "Java",       color: "text-red-400"    },
  { id: "csharp",     label: "C#",         color: "text-purple-400" },
];

const METHOD_COLORS: Record<string, string> = {
  GET:    "bg-green-500/20 text-green-400 border-green-500/30",
  POST:   "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PATCH:  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
};

// ─── Code block with copy ─────────────────────────────────────────────────────
function CodeBlock({ code, language }: { code: string; language: Language }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl bg-[#0d0d1a] border border-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-white/[0.02]">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied
            ? <><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Copied!</span></>
            : <><Copy className="w-3.5 h-3.5" />Copy</>
          }
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-[#e2e8f0] font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Endpoint card ────────────────────────────────────────────────────────────
function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [lang, setLang] = useState<Language>("curl");
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border/50 bg-card/40 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 hover:bg-accent/30 transition-colors text-left"
      >
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${METHOD_COLORS[endpoint.method]}`}>
          {endpoint.method}
        </span>
        <code className="text-sm font-mono text-foreground/80 flex-1">{endpoint.path}</code>
        {endpoint.auth && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Key className="w-3 h-3" /> Auth required
          </span>
        )}
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-border/50 p-5 space-y-5">
          {/* Description */}
          <div>
            <h4 className="font-semibold text-base mb-1">{endpoint.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{endpoint.description}</p>
          </div>

          {/* Request body */}
          {endpoint.requestBody && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Request Body</p>
              <div className="rounded-lg border border-border/50 divide-y divide-border/50 overflow-hidden">
                {Object.entries(endpoint.requestBody).map(([field, meta]) => (
                  <div key={field} className="flex items-start gap-3 p-3 text-sm bg-muted/20">
                    <code className="text-rapid-400 font-mono text-xs w-24 flex-shrink-0 mt-0.5">{field}</code>
                    <span className="text-muted-foreground text-xs w-16 flex-shrink-0 mt-0.5">{meta.type}</span>
                    <span className={`text-xs w-16 flex-shrink-0 mt-0.5 ${meta.required ? "text-orange-400" : "text-muted-foreground"}`}>
                      {meta.required ? "required" : "optional"}
                    </span>
                    <span className="text-xs text-muted-foreground">{meta.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responses */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Responses</p>
            <div className="space-y-1.5">
              {Object.entries(endpoint.responses).map(([code, desc]) => (
                <div key={code} className="flex items-center gap-3 text-sm">
                  <span className={`font-mono text-xs font-bold w-10 ${code.startsWith("2") ? "text-green-400" : code.startsWith("4") ? "text-red-400" : "text-yellow-400"}`}>
                    {code}
                  </span>
                  <span className="text-muted-foreground text-xs">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Language tabs */}
          <div>
            <div className="flex items-center gap-1 mb-3 flex-wrap">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    lang === l.id
                      ? "bg-rapid-500/20 text-rapid-400 border border-rapid-500/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <CodeBlock code={endpoint.samples[lang]} language={lang} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("auth");

  const current = sections.find(s => s.id === activeSection)!;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 flex">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border/50 bg-card/30 backdrop-blur-sm overflow-y-auto z-40">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-rapid-400" />
              <h2 className="font-bold text-sm">API Reference</h2>
            </div>
            <p className="text-xs text-muted-foreground">Base URL: <code className="text-rapid-400">app.rapid.dev</code></p>
          </div>
          <Separator />
          <nav className="p-3 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                  activeSection === s.id
                    ? "bg-rapid-500/20 text-rapid-400 border border-rapid-500/30"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <s.icon className={`w-4 h-4 flex-shrink-0 ${activeSection === s.id ? "text-rapid-400" : s.color}`} />
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)]">
          <div className="max-w-4xl mx-auto px-6 py-10">

            {/* Page header */}
            <div className="mb-8">
              <Badge variant="info" className="mb-4">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                API Documentation
              </Badge>
              <h1 className="text-4xl font-bold mb-3">
                RAPID API Reference
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Programmatic access to every RAPID feature. Authenticate with an API key and integrate analysis,
                suggestions, and documentation into any application or CI/CD pipeline.
              </p>
            </div>

            {/* Auth banner */}
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 mb-8 flex items-start gap-3">
              <Key className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-400 mb-1">Authentication</p>
                <p className="text-xs text-muted-foreground">
                  All endpoints (except <code className="text-foreground">/api/auth/register</code>) require a Bearer token in the <code className="text-foreground">Authorization</code> header.
                  Generate your API key at <code className="text-foreground">/dashboard/api-keys</code>.
                </p>
                <code className="mt-2 block text-xs bg-muted/50 rounded px-3 py-1.5 text-foreground font-mono">
                  Authorization: Bearer rapid_YOUR_API_KEY
                </code>
              </div>
            </div>

            {/* Mobile section picker */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeSection === s.id
                      ? "bg-rapid-500/20 text-rapid-400 border-rapid-500/30"
                      : "text-muted-foreground border-border/50 hover:border-border"
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5" />
                  {s.title}
                </button>
              ))}
            </div>

            {/* Section */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl ${current.bg} flex items-center justify-center`}>
                  <current.icon className={`w-5 h-5 ${current.color}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{current.title}</h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{current.description}</p>

              <div className="space-y-4">
                {current.endpoints.map((ep) => (
                  <EndpointCard key={ep.id} endpoint={ep} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="lg:ml-64">
        <Footer />
      </div>
    </div>
  );
}
