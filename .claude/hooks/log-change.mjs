#!/usr/bin/env node
// يسجّل كل ملف يعدّله Claude Code في .claude/CHANGES.md
// يُستدعى تلقائياً عبر hook من نوع PostToolUse (Write|Edit|MultiEdit).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(raw || "{}");
    const file = data?.tool_input?.file_path;
    if (!file) process.exit(0);

    // جذر المشروع محسوب من موقع السكربت نفسه (.claude/hooks/ -> الجذر)
    const here = path.dirname(fileURLToPath(import.meta.url));
    const root = path.resolve(here, "..", "..");
    const logPath = path.join(root, ".claude", "CHANGES.md");

    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    if (!fs.existsSync(logPath)) {
      fs.writeFileSync(
        logPath,
        "# سجل التعديلات\n\nقائمة بالملفات التي عُدِّلت، الأحدث في الأسفل.\n\n"
      );
    }

    let rel = file;
    try {
      rel = path.relative(root, file) || file;
    } catch (_) {}

    const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    fs.appendFileSync(logPath, `- ${stamp} — \`${rel}\`\n`);
  } catch (_) {
    // لا نوقف العمل أبداً بسبب فشل التسجيل
  }
  process.exit(0);
});
