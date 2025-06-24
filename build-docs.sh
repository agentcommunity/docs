#!/bin/bash
set -e

# Build the main site
echo "Building main documentation..."
mkdocs build

# Create a directory for the gh-pages content
mkdir -p gh-pages-dir

# Clone the gh-pages branch into the directory
git clone --branch gh-pages https://github.com/agentcommunity/docs.git gh-pages-dir

# The 'mike' command deploys the versioned docs into an 'aid' subfolder on gh-pages.
# We need to copy this 'aid' folder into our main 'site' directory.
echo "Copying versioned AID docs..."
if [ -d "gh-pages-dir/aid" ]; then
    cp -r gh-pages-dir/aid site/
else
    echo "Warning: 'aid' directory not found in gh-pages branch."
fi

echo "Build complete. The 'site' directory is ready for deployment." 