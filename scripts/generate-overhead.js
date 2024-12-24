/* eslint-disable no-undef */
import { join } from "path";
import { readFile, writeFile } from "fs/promises";

const depFile = join(
  import.meta.dirname,
  '..',
  process.argv[2],
);
const depContentEncoded = (await readFile(depFile)).toString('base64');

let jsCode = ``;
jsCode += `import { rmSync } from 'fs';\n\n`;
jsCode += `const depContentEncoded = "${depContentEncoded}";\n`;
jsCode += `const depContent = Buffer.from(depContentEncoded, 'base64');\n`;
jsCode += `const depFile = (await import('os')).tmpdir() + (await import('crypto')).randomUUID() + ".node";\n`;
jsCode += `await (await import('fs/promises')).writeFile(depFile, depContent);\n`;
// jsCode += `console.log({depFile})\n`;
jsCode += `process.on("beforeExit", () => { rmSync(depFile); });\n`;
jsCode += `process.on("SIGINT", () => { rmSync(depFile); process.exit(); });\n`;
jsCode += `\n\n`;

await writeFile("dist/overhead.js", jsCode);
