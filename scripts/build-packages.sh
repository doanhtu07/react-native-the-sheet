#!/usr/bin/env bash
set -euo pipefail

echo "Building tier 1: independent packages..."
pnpm --filter @the-sheet/the-sheet --filter @the-sheet/embedded-stack-navigator --filter @the-sheet/universe-portal run prepare

echo "Building tier 2: packages depending on the-sheet..."
pnpm --filter @the-sheet/flash-list --filter @the-sheet/flash-list-v2 run prepare

echo "All packages built successfully."
