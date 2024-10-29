/* eslint-disable no-undef */
import JsConfuser from "js-confuser";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";

const sourceCodePath = join(
  import.meta.dirname,
  '..',
  process.argv[2],
);
const resultFilePath = join(
  import.meta.dirname,
  '..',
  process.argv[3],
);
const sourceCode = await readFile(sourceCodePath, 'utf-8');

console.log(`[js-confuser] Obfuscating file: ${sourceCodePath}...`);
const obsfucated = await JsConfuser.obfuscate(sourceCode, {
  target: "node",
  preset: "high",
  globalConcealing: false,
});
await writeFile(resultFilePath, obsfucated);
