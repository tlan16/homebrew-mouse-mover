import typescript from "@rollup/plugin-typescript";
import {obfuscator} from "rollup-obfuscator";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/main.ts',
  plugins: [
    typescript(),
    obfuscator({
      optionsPreset: 'high-obfuscation',
    }),
  ],
  output: {
    file: 'dist/main.js',
    format: 'esm',
  },
};

export default config;
