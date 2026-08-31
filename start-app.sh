#!/bin/sh
set -e

echo "[LAAC Pipeline] Starting application..."

# Install dependencies (npm is pre-installed and cached by the platform)
echo "[LAAC Pipeline] Installing dependencies..."
npm install --legacy-peer-deps

# Build the Next.js app
echo "[LAAC Pipeline] Building..."
npm run build

# Start the Next.js server in background
echo "[LAAC Pipeline] Starting on port ${PORT:-3000}..."
npm start -- -p ${PORT:-3000} &
APP_PID=$!

# Wait for server to be ready, then seed demo data
echo "[LAAC Pipeline] Waiting for server to be ready..."
for i in $(seq 1 60); do
  if node -e "fetch('http://localhost:${PORT:-3000}/api/health').then(r=>{if(r.ok)process.exit(0);else process.exit(1)}).catch(()=>process.exit(1))" 2>/dev/null; then
    echo "[LAAC Pipeline] Server ready. Seeding demo data..."
    node -e "fetch('http://localhost:${PORT:-3000}/api/seed',{method:'POST'}).then(r=>r.json()).then(d=>console.log(JSON.stringify(d,null,2))).catch(e=>console.error('[Seed Error]',e.message))" || true
    echo "[LAAC Pipeline] Seed complete."
    break
  fi
  sleep 2
done

# Keep the server running in foreground
wait $APP_PID
