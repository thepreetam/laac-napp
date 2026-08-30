#!/bin/sh
set -e

echo "[LAAC Pipeline] Starting application..."

# Install dependencies
if [ -f "pnpm-lock.yaml" ]; then
  pnpm install --frozen-lockfile --prod=false 2>/dev/null || pnpm install --prod=false
fi

# Build the Next.js app
echo "[LAAC Pipeline] Building..."
pnpm run build

# Start the Next.js server
echo "[LAAC Pipeline] Starting on port ${PORT:-3000}..."
pnpm start
