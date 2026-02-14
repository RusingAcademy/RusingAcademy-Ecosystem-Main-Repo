import fs from "fs";
import path from "path";

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

async function invokeLLM(messages) {
  const resp = await fetch(`${FORGE_API_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FORGE_API_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });
  if (!resp.ok) throw new Error(`LLM API error ${resp.status}`);
  return resp.json();
}

const AUDIT_PROMPT = `You are a senior software architect. Audit this code for security, performance, quality, and architecture issues. For each finding, state the severity (CRITICAL/HIGH/MEDIUM/LOW), category, and a brief description with the fix. Be concise — max 10 findings. End with a 2-sentence overall assessment.`;

const filesToRetry = [
  { name: "Main Router", path: "server/routers.ts", start: 0, end: 400 },
  { name: "Stripe Webhook", path: "server/stripe/webhook.ts", start: 0, end: 400 },
  { name: "Activities Router", path: "server/routers/activities.ts", start: 0, end: 400 },
  { name: "Admin Control Center", path: "server/routers/adminControlCenter.ts", start: 0, end: 400 },
];

const results = [];

for (const file of filesToRetry) {
  const fullPath = path.join(process.cwd(), file.path);
  if (!fs.existsSync(fullPath)) { console.log(`SKIP: ${file.name}`); continue; }
  const lines = fs.readFileSync(fullPath, "utf-8").split("\n");
  const code = lines.slice(file.start, file.end).join("\n");
  console.log(`\nAUDITING: ${file.name} (lines ${file.start}-${file.end} of ${lines.length})...`);
  try {
    const response = await invokeLLM([
      { role: "system", content: AUDIT_PROMPT },
      { role: "user", content: `File: ${file.name}\n\n${code}` },
    ]);
    const content = response.choices?.[0]?.message?.content;
    if (content) {
      results.push({ file_name: file.name, audit: content });
      console.log(`  ✓ Done (${content.length} chars)`);
    }
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
    results.push({ file_name: file.name, error: err.message });
  }
}

fs.writeFileSync("llm-audit-retry-results.json", JSON.stringify(results, null, 2));
console.log(`\nRetry complete. ${results.length} files processed.`);
