/**
 * @type {import("lint-staged").Config}
 */
const config = {
  "*.ts": "eslint --fix",
  "*.js": "eslint --fix",
  "*.md": "bun prettier --write",
  "*.yaml": "yamllint",
  "*.yml": "yamllint",
}

export default config
