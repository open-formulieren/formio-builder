#!/bin/bash
#
# Usage, from the root of the repository:
#
#   ./bin/makemessages.sh
#

SUPPORTED_LOCALES=(
  en
  nl
)

FIXED_ARGS=(
  'src/**/*.ts*'
  --ignore='**/*.d.ts'
  --ignore='**/*.stories.*'
  --id-interpolation-pattern '[sha512:contenthash:base64:6]'
  --format bin/i18n-formatter.js
)

for locale in "${SUPPORTED_LOCALES[@]}"; do
  echo "Extracting messages for locale '$locale'"
  npm run makemessages -- \
    "${FIXED_ARGS[@]}" \
    --out-file "i18n/messages/$locale.json"
done
