#!/bin/sh
set -e

echo "[LAAC Pipeline] Starting application..."

# Install pnpm if not available
if ! command -v pnpm > /dev/null 2>&1; then
  echo "[LAAC Pipeline] Installing pnpm..."
  npm install -g pnpm
fi

# Install dependencies
if [ -f "pnpm-lock.yaml" ]; then
  pnpm install --frozen-lockfile --prod=false --no-strict-peer-deps 2>/dev/null || pnpm install --prod=false --no-strict-peer-deps
fi

# Build the Next.js app
echo "[LAAC Pipeline] Building..."
pnpm run build

# Start the Next.js server in background
echo "[LAAC Pipeline] Starting on port ${PORT:-3000}..."
pnpm start &
APP_PID=$!

# Wait for server to be ready, then seed demo data
echo "[LAAC Pipeline] Waiting for server to be ready..."
for i in $(seq 1 30); do
  if curl -sf "http://localhost:${PORT:-3000}/api/health" > /dev/null 2>&1; then
    echo "[LAAC Pipeline] Server ready. Seeding demo data..."
    curl -sf "http://localhost:${PORT:-3000}/api/seed" -X POST || true
    echo "[LAAC Pipeline] Seed complete."
    break
  fi
  sleep 1
done

# Keep the server running in foreground
wait $APP_PID
