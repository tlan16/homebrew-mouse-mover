#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.." || exit 1

if [ -d "/opt/homebrew/opt/gnu-sed/libexec/gnubin" ]; then
  export PATH="/opt/homebrew/opt/gnu-sed/libexec/gnubin:$PATH"
fi

function build() {
  [ -d dist ] && rm -rf dist
  echo "[INFO] Building initial stage with bun ... "
  pnpm bun build \
    --outdir dist \
    --target node \
    --no-clear-screen \
    src/main.ts \
    ;
  mv dist/main.js dist/amm.js
  rm -f bun.lockb
  echo "[INFO] Initial stage built successfully"
}

function embed_dependency() {
  printf "[INFO] Embedding dependency ... "
  local main_file_path="dist/amm.js"
  local overhead_file_path="dist/overhead.js"
  local temp_shebang_file_path
  temp_shebang_file_path="$(mktemp)"
  if [ "$(find dist -name "robotjs-*.node" -type f | wc -l)" -ne 1 ]; then
    echo "[ERROR] Expected to find exactly one robotjs-*.node file in dist/ directory"
    exit 1
  fi
  dependency_file_name="$(
    find dist -name "robotjs-*.node" -type f | head -n 1
  )"
  pnpm tsx scripts/generate-overhead.js "${dependency_file_name}"
  # Remove leading dist/
  dependency_file_name="${dependency_file_name#dist/}"
  sed -i "s/\"\.\/${dependency_file_name}\"/depFile/g" "${main_file_path}"

  cat "${overhead_file_path}" "${main_file_path}" >"${temp_shebang_file_path}"
  mv "${temp_shebang_file_path}" "${main_file_path}"
  rm "${overhead_file_path}" "dist/${dependency_file_name}"
  echo "done"
}

function inflate() {
  local main_file_path="dist/amm.js"
  local stage1_file_path="dist/amm-stage1.js"
  local stage2_file_path="dist/amm-stage2.js"

  pnpm javascript-obfuscator \
    --compact true \
    --self-defending true \
    --dead-code-injection true \
    --options-preset high-obfuscation \
    --target node \
    --rename-globals true \
    --output "${stage1_file_path}" \
    "${main_file_path}"

  pnpm tsx scripts/js-confuser.js \
    "${stage1_file_path}" \
    "${stage2_file_path}"

  mv "${stage2_file_path}" "${main_file_path}"
  rm "${stage1_file_path}"
}

function make_executable() {
  local main_file_path="dist/amm.js"
  local main_file_path_without_extension="dist/amm"
  local temp_shebang_file_path
  local temp_combined_file_path
  temp_shebang_file_path="$(mktemp)"
  temp_combined_file_path="$(mktemp)"

  printf "#!/usr/bin/env node\n\n" >"${temp_shebang_file_path}"
  cat "${temp_shebang_file_path}" "${main_file_path}" >"${temp_combined_file_path}"
  mv "${temp_combined_file_path}" "${main_file_path}"
  chmod +x "${main_file_path}"
  rm "${temp_shebang_file_path}"

  mv "${main_file_path}" "${main_file_path_without_extension}"
}

function assert() {
  local dist_file="dist/amm"
  printf "[INFO] Checking %s ... " ${dist_file}
  if [ "$(strings ${dist_file} | grep -c robot)" -gt 0 ]; then
    echo "[ERROR] Expected NOT to find string 'robot' in dist/amm"
    exit 1
  fi
  echo "done"
}

function main() {
  build
  embed_dependency
  inflate
  make_executable
  assert
  echo "[INFO] Build completed successfully"
}

main
