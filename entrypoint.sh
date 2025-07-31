#!/bin/bash

set -e

echo "🔧 Building ..."
npm run build

echo "📜 Running test..."
npm run test:e2e


echo "📜 Running migrations..."
npm run typeorm-notifyly:run-migrations

echo "📜 Starting application (Dev mode)..."
npm run start:dev