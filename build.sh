#!/bin/bash
set -euo pipefail

echo "Build step PWD: $PWD"
echo "Files in PWD:"
ls -al

echo "Running main build logic..."
echo "--- Cloning external spec repository ---"
rm -rf tmp-spec-repo
git clone --depth 1 https://github.com/agentcommunity/agent-interface-discovery tmp-spec-repo

echo "--- Moving spec docs into place ---"
rm -rf docs/aid
mv tmp-spec-repo/packages/docs docs/aid

echo "--- Building MkDocs site ---"
python3 -m mkdocs build

echo "--- Staging canonical JSON Schema ---"
# mkdir -p site/schema/v1
# cp tmp-spec-repo/packages/aid-schema/aid.schema.json site/schema/v1/aid.schema.json

echo "--- Build complete ---" 