#!/bin/bash

echo "Setting up Youth.Inc sample custom MCP..."

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "📁 Installing in: $SCRIPT_DIR"

# Install dependencies
echo "📦 Installing dependencies..."
cd "$SCRIPT_DIR"
npm install

# Make server executable
chmod +x server.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next step: Add to Claude Code"
echo ""
echo "Run this command:"
echo ""
echo "  claude mcp add interview cmd -- node $SCRIPT_DIR/server.js"
echo ""
echo "Then restart Claude Code and you're ready!"
echo ""
echo "Available guidelines:"
echo "  @interview:///searchImplementation"
echo "  @interview:///componentStructure"
echo "  @interview:///styling"
echo "  @interview:///accessibility"
echo "  @interview:///stateManagement"
echo "  @interview:///typeScript"