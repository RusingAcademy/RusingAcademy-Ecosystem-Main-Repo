import fs from "fs";
import path from "path";

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error("Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY");
  process.exit(1);
}

const AUDIT_PROMPT = `You are a senior software architect performing a professional code audit for a large-scale EdTech platform called EcosystemHub (RusingAcademy). The platform is built with React 19 + TypeScript + tRPC + Drizzle ORM + Express + Tailwind CSS 4.

Analyze the code provided and produce a thorough audit covering:
1. Security Issues — XSS risks, injection vulnerabilities, authentication/authorization gaps, data exposure
2. Performance Concerns — N+1 queries, memory leaks, unnecessary re-renders, missing optimizations
3. Code Quality — Readability, maintainability, DRY violations, dead code, error handling
4. Architecture — Separation of concerns, coupling, scalability
5. Specific Bugs or Risks — Concrete bugs, race conditions, edge cases

For each finding provide:
- Severity: CRITICAL / HIGH / MEDIUM / LOW
- Category: Security / Performance / Quality / Architecture / Bug
- Description of the issue
- Location (line or pattern)
- Recommended fix

Be specific and actionable. Focus on concrete issues. Return your response as valid JSON with this structure:
{
  "file_name": "filename",
  "critical_count": 0,
  "high_count": 0,
  "medium_count": 0,
  "low_count": 0,
  "top_finding": "Most important finding summary",
  "findings": [
    {
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "category": "Security|Performance|Quality|Architecture|Bug",
      "description": "...",
      "location": "...",
      "fix": "..."
    }
  ],
  "overall_assessment": "1-3 sentence summary"
}`;

async function invokeLLM(messages) {
  const resp = await fetch(`${FORGE_API_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FORGE_API_KEY}`,
    },
    body: JSON.stringify({
      messages,
      response_format: { type: "json_object" },
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`LLM API error ${resp.status}: ${text}`);
  }
  return resp.json();
}

const filesToAudit = [
  { name: "Main Router (server/routers.ts)", path: "server/routers.ts", maxLines: 600 },
  { name: "Stripe Webhook (server/stripe/webhook.ts)", path: "server/stripe/webhook.ts", maxLines: 800 },
  { name: "Auth Context (server/_core/context.ts)", path: "server/_core/context.ts", maxLines: 200 },
  { name: "App Routes (client/src/App.tsx)", path: "client/src/App.tsx", maxLines: 450 },
  { name: "Index CSS (client/src/index.css)", path: "client/src/index.css", maxLines: 700 },
  { name: "Storage S3 (server/storage.ts)", path: "server/storage.ts", maxLines: 200 },
  { name: "Activities Router (server/routers/activities.ts)", path: "server/routers/activities.ts", maxLines: 600 },
  { name: "SLE Scoring Service (server/services/sleScoringService.ts)", path: "server/services/sleScoringService.ts", maxLines: 600 },
  { name: "Admin Control Center (server/routers/adminControlCenter.ts)", path: "server/routers/adminControlCenter.ts", maxLines: 600 },
  { name: "Webhook Idempotency (server/webhookIdempotency.ts)", path: "server/webhookIdempotency.ts", maxLines: 300 },
];

const results = [];

for (const file of filesToAudit) {
  const fullPath = path.join(process.cwd(), file.path);
  if (!fs.existsSync(fullPath)) {
    console.log(`SKIP: ${file.name} — file not found at ${fullPath}`);
    continue;
  }

  const lines = fs.readFileSync(fullPath, "utf-8").split("\n");
  // Take first maxLines lines to stay within token limits
  const code = lines.slice(0, file.maxLines).join("\n");
  const totalLines = lines.length;

  console.log(`\nAUDITING: ${file.name} (${totalLines} total lines, sending ${Math.min(totalLines, file.maxLines)} lines)...`);

  try {
    const response = await invokeLLM([
      { role: "system", content: AUDIT_PROMPT },
      {
        role: "user",
        content: `Audit this file: ${file.name}\nTotal lines: ${totalLines}\nShowing first ${file.maxLines} lines:\n\n\`\`\`typescript\n${code}\n\`\`\``,
      },
    ]);

    const content = response.choices?.[0]?.message?.content;
    if (content) {
      try {
        const parsed = JSON.parse(content);
        parsed.file_name = file.name;
        results.push(parsed);
        console.log(`  ✓ ${parsed.critical_count || 0} CRITICAL, ${parsed.high_count || 0} HIGH, ${parsed.medium_count || 0} MEDIUM, ${parsed.low_count || 0} LOW`);
        console.log(`  Top: ${parsed.top_finding}`);
      } catch (e) {
        console.log(`  ✗ Failed to parse JSON response`);
        results.push({ file_name: file.name, raw: content, error: "JSON parse failed" });
      }
    }
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
    results.push({ file_name: file.name, error: err.message });
  }
}

// Save results
const outputPath = path.join(process.cwd(), "llm-audit-results.json");
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`\n=== AUDIT COMPLETE ===`);
console.log(`Results saved to ${outputPath}`);
console.log(`Total files audited: ${results.length}`);

// Summary
let totalCritical = 0, totalHigh = 0, totalMedium = 0, totalLow = 0;
for (const r of results) {
  totalCritical += r.critical_count || 0;
  totalHigh += r.high_count || 0;
  totalMedium += r.medium_count || 0;
  totalLow += r.low_count || 0;
}
console.log(`\nSUMMARY: ${totalCritical} CRITICAL, ${totalHigh} HIGH, ${totalMedium} MEDIUM, ${totalLow} LOW`);
