# RAPID CLI

Analyze any file or codebase for cost savings and reliability improvements directly from your terminal.

## Install

```bash
npm install -g @rapid-dev/cli
```

## Quick Start

```bash
# Authenticate
rapid login

# Analyze a single file
rapid analyze src/api.ts

# Analyze and save report
rapid analyze database.sql --save report.md

# Scan an entire project
rapid scan ./src

# Pipe content
cat query.sql | rapid analyze --title "DB review"

# View past analyses
rapid history
```

## Commands

| Command | Description |
|---------|-------------|
| `rapid login` | Authenticate with your account |
| `rapid logout` | Remove saved credentials |
| `rapid status` | Show auth and config status |
| `rapid analyze <file>` | Analyze a single file |
| `rapid scan [directory]` | Scan an entire directory |
| `rapid history` | List recent analyses |
| `rapid open [id]` | Open analysis or dashboard in browser |
| `rapid config --list` | Show configuration |
| `rapid upgrade` | Open billing page |

## Options

### `rapid analyze`
```
-t, --title <title>     Analysis title
--type <type>           CODE | DATABASE | API | INFRASTRUCTURE | DASHBOARD
-o, --output <format>   table | json | markdown
--save <path>           Save report to file
--detail <n>            Show full detail for suggestion #N
```

### `rapid scan`
```
--pattern <glob>        File pattern (default: **/*.{ts,js,py,go,sql,tf})
--ignore <dirs>         Comma-separated dirs to ignore
--max-files <n>         Max files to analyze (default: 20)
```

## Environment Variables

```bash
RAPID_API_KEY=rapid_xxx    # API key (overrides saved config)
RAPID_API_URL=https://...  # Custom server URL
```

## CI/CD Usage

```bash
# In your pipeline
export RAPID_API_KEY=${{ secrets.RAPID_API_KEY }}
rapid scan ./src --output json > rapid-report.json
```
