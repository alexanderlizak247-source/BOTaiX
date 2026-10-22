#!/bin/sh
command -v node >/dev/null || { echo "Node.js 18+ is required: https://nodejs.org"; exit 1; }
echo "Open http://localhost:3000"
exec node "$(dirname "$0")/src/server.js"
