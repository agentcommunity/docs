#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Cloning external spec repository ---"
# Clean up old clones and fetch the latest spec repo
rm -rf tmp-spec-repo
git clone --depth 1 https://github.com/agentcommunity/AgentInterfaceDiscovery tmp-spec-repo

echo "--- Moving spec docs into place ---"
# Clean up the old spec files to prevent nesting on rebuild
rm -rf docs/aid
# Move the markdown files into the docs directory for MkDocs to find
mv tmp-spec-repo/docs/aid docs/aid

echo "--- Building MkDocs site ---"
# Build the main HTML documentation
python3 -m mkdocs build

echo "--- Staging canonical JSON Schema ---"
# Create the schema directory in the final output and copy the file
mkdir -p site/schema/v1
cp tmp-spec-repo/packages/aid-schema/aid.schema.json site/schema/v1/aid.schema.json

echo "--- Build complete ---" 