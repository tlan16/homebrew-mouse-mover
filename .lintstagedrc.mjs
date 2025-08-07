/**
 * @type {import("lint-staged").Config}
 */
const config = {
  "*.ts": "eslint --fix",
  "*.js": "eslint --fix",
  "*.md": "npx --yes prettier --parser markdown --write",
  "*.sh": "npx --yes shellcheck",
  "*.yaml": "yamllint",
  "*.yml": "yamllint",
  ".husky/pre-commit": "npx --yes shellcheck",
}

export default config
