/**
 * @type {import("lint-staged").Config}
 */
const config = {
  "*.ts": "eslint --fix",
  "*.js": "eslint --fix",
  "*.md": "bun prettier --write",
  "*.sh": "bun shellcheck",
  "*.yaml": "yamllint",
  "*.yml": "yamllint",
  ".husky/pre-commit": "bun shellcheck",
}

export default config
