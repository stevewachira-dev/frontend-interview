# Interview MCP - Developer Guidelines

A simple MCP that provides **instructions and best practices** for building the frontend interview project.

## Folder Structure

```
frontend-interview/
  ├── mcp/
  │   ├── guidelines.json    ← Your coding guidelines
  │   ├── server.js          ← MCP server
  │   ├── package.json       ← Dependencies
  │   └── setup.sh           ← This setup script
  ├── src/
  ├── public/
  └── ...
```

## What's Inside

6 guideline documents with **instructions** (not code templates):

- **searchImplementation** - How to implement search with debouncing
- **componentStructure** - How to organize your components
- **styling** - Tailwind CSS styling approach
- **accessibility** - Accessibility requirements
- **stateManagement** - How to handle state
- **typeScript** - TypeScript best practices

## Setup (3 simple steps)

### 1. Navigate to the mcp folder
```bash
cd frontend-interview/mcp
```

### 2. Run setup
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Install the MCP SDK dependency
- Show you the command to add to Claude Code

### 3. Add to Claude Code (copy the command shown)
```bash
claude mcp add interview cmd -- node /full/path/to/frontend-interview/mcp/server.js
```

### 4. Restart Claude Code

Done! ✅

## Usage

Reference guidelines in your prompts:

**Simple:**
```
"Build the search feature following @interview:///searchImplementation"
```

**Comprehensive:**
```
"Build the complete interview project:

Follow these guidelines:
- @interview:///searchImplementation
- @interview:///componentStructure
- @interview:///styling
- @interview:///accessibility
- @interview:///stateManagement
- @interview:///typeScript

Data is in src/data/items.json
Use Next.js and Tailwind
use context7"
```

## Verify It's Working

Type `@` in Claude Code and you should see:
- `@interview:///searchImplementation`
- `@interview:///componentStructure`
- etc.

## Files Explained

- **guidelines.json** - Your instructions (edit this to customize)
- **server.js** - MCP server (don't need to touch this)
- **package.json** - Dependencies list (don't need to touch this)
- **setup.sh** - One-command setup (run once)

## Customizing Guidelines

Edit `guidelines.json` to add or modify instructions:

```json
{
  "myGuideline": {
    "title": "My Custom Guideline",
    "content": [
      "First do this:",
      "- Step 1",
      "- Step 2",
      "",
      "Then do that:",
      "- Another step"
    ]
  }
}
```

After editing, restart Claude Code to reload changes.

## Example Workflow

```bash
# 1. Setup (one time)
cd frontend-interview/mcp
./setup.sh
claude mcp add interview cmd -- node $(pwd)/server.js

# 2. Start coding (from project root)
cd ..
npm install
npm run dev

# 3. Use Claude Code with your guidelines
# Type your prompt with @interview:/// references
```

## Troubleshooting

**MCP not showing up?**
```bash
# Check if it's installed
claude mcp list

# Should show "interview"
```

**Guidelines not loading?**
```bash
# Check file exists
ls frontend-interview/mcp/guidelines.json

# Check JSON is valid
cat frontend-interview/mcp/guidelines.json | jq .
```

**Need to update guidelines?**
1. Edit `guidelines.json`
2. Restart Claude Code
3. Changes are live!
---