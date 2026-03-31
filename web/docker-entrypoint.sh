#!/bin/sh
set -e

echo "⚡ Starting RAPID..."

# Run database migrations
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Running database migrations..."
  npx prisma db push --skip-generate || echo "⚠ Migration warning (continuing)"
  echo "✔ Database ready"
fi

# Start the app
echo "🚀 Starting server on port ${PORT:-3000}"
exec node server.js
