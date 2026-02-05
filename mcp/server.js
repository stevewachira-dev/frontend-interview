#!/usr/bin/env node

// Hi! This is a basic custom MCP server
// it runs like a background service
// you don't need to interact with it directly
// it's there when Claude Code needs it 
// you can always customize it with Claude to it's needs for the task we're working on (or different servers for different tasks)

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load guidelines
let guidelines = {};

async function loadGuidelines() {
  try {
    const data = await fs.readFile(path.join(__dirname, 'guidelines.json'), 'utf-8');
    guidelines = JSON.parse(data);
  } catch (error) {
    console.error('Error loading guidelines:', error);
  }
}

// Create server
const server = new Server(
  {
    name: 'interview-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
    },
  }
);

// List available guidelines
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const resources = Object.keys(guidelines).map((key) => ({
    uri: `interview:///${key}`,
    mimeType: 'text/plain',
    name: guidelines[key].title,
  }));

  return { resources };
});

// Read a specific guideline
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const key = uri.replace('interview:///', '');

  if (!guidelines[key]) {
    throw new Error(`Guideline not found: ${key}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: 'text/plain',
        text: `# ${guidelines[key].title}\n\n${guidelines[key].content}`,
      },
    ],
  };
});

// Start server
async function main() {
  await loadGuidelines();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});