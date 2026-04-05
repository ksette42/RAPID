import { Command } from 'commander';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, basename } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import open from 'open';
import { config, requireAuth } from './config.js';
import { runAnalysis, getAnalyses, approveSuggestion } from './api.js';
import { detectLanguage, detectAnalysisType } from './utils/detect.js';
import {
  printBanner,
  printScores,
  printSuggestionsTable,
  printSuggestionDetail,
  printSuccess,
  printError,
  printInfo,
  printWarning,
} from './utils/display.js';

const program = new Command();

// ─── Package version ────────────────────────────────────────────────────────
const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url || `file://${__dirname}/../package.json`), 'utf-8')
);

program
  .name('rapid')
  .description('RAPID — Read, Analyze, Patch, Implement & Document\nAI-powered code analysis for cost savings and reliability')
  .version(pkg.version, '-v, --version')
  .addHelpText('beforeAll', () => {
    printBanner();
    return '';
  });

// ─── LOGIN ───────────────────────────────────────────────────────────────────
program
  .command('login')
  .description('Authenticate with your RAPID account')
  .option('--key <apiKey>', 'Use an API key directly')
  .option('--url <url>', 'Custom RAPID server URL')
  .action(async (opts) => {
    printBanner();

    if (opts.url) {
      config.set('apiUrl', opts.url);
      printInfo(`API URL set to: ${opts.url}`);
    }

    if (opts.key) {
      config.set('apiKey', opts.key);
      printSuccess('API key saved. You are now authenticated.');
      return;
    }

    console.log(chalk.bold('\n  Authenticate with RAPID\n'));

    const { method } = await inquirer.prompt([
      {
        type: 'list',
        name: 'method',
        message: 'How would you like to authenticate?',
        choices: [
          { name: '🌐  Open browser (recommended)', value: 'browser' },
          { name: '🔑  Enter API key manually', value: 'key' },
        ],
      },
    ]);

    if (method === 'browser') {
      const apiUrl = config.get('apiUrl');
      printInfo('Opening your browser to generate an API key...');
      await open(`${apiUrl}/dashboard/api-keys`);
      console.log('');

      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Paste the API key from your browser:',
          mask: '*',
        },
      ]);
      config.set('apiKey', apiKey);
    } else {
      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your API key (from dashboard/api-keys):',
          mask: '*',
        },
      ]);
      config.set('apiKey', apiKey);
    }

    printSuccess('Authenticated successfully!');
    printInfo(`API URL: ${config.get('apiUrl')}`);
  });

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
program
  .command('logout')
  .description('Remove saved credentials')
  .action(() => {
    config.set('apiKey', '');
    printSuccess('Logged out. Run rapid login to re-authenticate.');
  });

// ─── CONFIG ──────────────────────────────────────────────────────────────────
program
  .command('config')
  .description('View or update CLI configuration')
  .option('--set <key=value>', 'Set a config value')
  .option('--get <key>', 'Get a config value')
  .option('--list', 'List all config values')
  .action((opts) => {
    if (opts.list) {
      console.log('\n  ' + chalk.bold('RAPID CLI Configuration\n'));
      console.log(`  ${chalk.cyan('apiUrl')}         ${chalk.white(config.get('apiUrl'))}`);
      console.log(`  ${chalk.cyan('defaultOutput')}  ${chalk.white(config.get('defaultOutput'))}`);
      console.log(`  ${chalk.cyan('apiKey')}         ${config.get('apiKey') ? chalk.green('[set]') : chalk.red('[not set]')}`);
      console.log(`  ${chalk.cyan('autoImplement')} ${chalk.white(String(config.get('autoImplement')))}\n`);
      return;
    }
    if (opts.get) {
      console.log(config.get(opts.get as any));
      return;
    }
    if (opts.set) {
      const [key, value] = opts.set.split('=');
      config.set(key as any, value);
      printSuccess(`Config updated: ${key} = ${value}`);
    }
  });

// ─── ANALYZE ─────────────────────────────────────────────────────────────────
program
  .command('analyze [file]')
  .alias('a')
  .description('Analyze a file or piped code for improvements')
  .option('-t, --title <title>', 'Analysis title')
  .option('--type <type>', 'Analysis type (CODE, DATABASE, API, INFRASTRUCTURE, DASHBOARD, GENERAL)')
  .option('-o, --output <format>', 'Output format: table, json, markdown', 'table')
  .option('--save <path>', 'Save report to file')
  .option('--no-suggestions', 'Show scores only, skip suggestion listing')
  .option('--detail <n>', 'Show full detail for suggestion number N')
  .action(async (file, opts) => {
    requireAuth();

    let content = '';
    let filePath = '';

    if (file) {
      filePath = resolve(file);
      if (!existsSync(filePath)) {
        printError(`File not found: ${filePath}`);
        process.exit(1);
      }
      content = readFileSync(filePath, 'utf-8');
      printInfo(`Reading: ${file}`);
    } else if (!process.stdin.isTTY) {
      // Accept piped input: cat file.py | rapid analyze
      content = readFileSync('/dev/stdin', 'utf-8');
      filePath = 'stdin';
      printInfo('Reading from stdin...');
    } else {
      printError('Please provide a file path or pipe content to analyze.');
      printInfo('Examples:');
      printInfo('  rapid analyze src/api.ts');
      printInfo('  cat query.sql | rapid analyze --title "DB review"');
      process.exit(1);
    }

    const title = opts.title || basename(filePath);
    const language = detectLanguage(filePath, content);
    const analysisType = opts.type || detectAnalysisType(filePath, content);

    printInfo(`Language: ${language} | Type: ${analysisType}`);

    const spinner = ora({
      text: chalk.gray('Analyzing...'),
      spinner: 'dots',
      color: 'magentaBright',
    }).start();

    try {
      const result = await runAnalysis({
        title,
        content,
        type: analysisType,
        fileName: basename(filePath),
      });

      spinner.succeed(chalk.green('Analysis complete!'));

      if (opts.output === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else if (opts.output === 'markdown') {
        const md = generateMarkdownReport(result, title);
        console.log(md);
        if (opts.save) {
          writeFileSync(opts.save, md, 'utf-8');
          printSuccess(`Report saved to ${opts.save}`);
        }
      } else {
        printScores(result.analysis);

        if (opts.suggestions !== false) {
          if (opts.detail) {
            const idx = parseInt(opts.detail, 10) - 1;
            const suggestion = result.suggestions[idx];
            if (!suggestion) {
              printError(`No suggestion #${opts.detail} found.`);
            } else {
              printSuggestionDetail(suggestion, idx);
            }
          } else {
            printSuggestionsTable(result.suggestions);
          }
        }

        const totalSavings = result.suggestions.reduce((a: number, s: any) => a + (s.estimatedSaving || 0), 0);
        if (totalSavings > 0) {
          console.log(
            '\n  ' + chalk.bold('Total potential savings: ') + chalk.green.bold(`$${totalSavings}/month`)
          );
        }

        console.log(
          '\n  ' + chalk.gray('Run ') +
          chalk.cyan(`rapid open ${result.analysis.id}`) +
          chalk.gray(' to review and approve suggestions in your browser.\n')
        );

        if (opts.save) {
          const md = generateMarkdownReport(result, title);
          writeFileSync(opts.save, md, 'utf-8');
          printSuccess(`Report saved to ${opts.save}`);
        }
      }
    } catch (err: any) {
      spinner.fail(chalk.red('Analysis failed'));
      printError(err.response?.data?.error || err.message);
      process.exit(1);
    }
  });

// ─── SCAN (analyze entire directory) ─────────────────────────────────────────
program
  .command('scan [directory]')
  .alias('s')
  .description('Scan an entire directory and analyze all code files')
  .option('--pattern <glob>', 'File pattern to match', '**/*.{ts,js,py,go,sql,tf,yaml,yml}')
  .option('--ignore <dirs>', 'Comma-separated directories to ignore', 'node_modules,dist,build,.git')
  .option('-o, --output <format>', 'Output format: table, json', 'table')
  .option('--max-files <n>', 'Maximum files to analyze', '20')
  .action(async (directory, opts) => {
    requireAuth();

    const { glob } = await import('glob');
    const dir = directory ? resolve(directory) : process.cwd();
    const ignoreDirs = opts.ignore.split(',').map((d: string) => `**/${d}/**`);

    printInfo(`Scanning: ${dir}`);

    const files = await glob(opts.pattern, {
      cwd: dir,
      ignore: ignoreDirs,
      absolute: true,
    });

    if (files.length === 0) {
      printWarning('No matching files found.');
      return;
    }

    const maxFiles = parseInt(opts.maxFiles, 10);
    const filesToAnalyze = files.slice(0, maxFiles);

    if (files.length > maxFiles) {
      printWarning(`Found ${files.length} files, analyzing first ${maxFiles}. Use --max-files to increase.`);
    } else {
      printInfo(`Found ${files.length} files to analyze.`);
    }

    console.log('');

    let totalSavings = 0;
    const results: any[] = [];

    for (const filePath of filesToAnalyze) {
      const spinner = ora({
        text: chalk.gray(`Analyzing ${basename(filePath)}...`),
        spinner: 'dots',
      }).start();

      try {
        const content = readFileSync(filePath, 'utf-8');
        const result = await runAnalysis({
          title: basename(filePath),
          content,
          type: detectAnalysisType(filePath, content),
          fileName: basename(filePath),
        });

        const savings = result.suggestions.reduce((a: number, s: any) => a + (s.estimatedSaving || 0), 0);
        totalSavings += savings;
        results.push({ file: basename(filePath), ...result.analysis, totalSuggestions: result.suggestions.length, savings });

        spinner.succeed(
          chalk.white(basename(filePath).padEnd(30)) +
          chalk.green(`$${savings}/mo`.padStart(12)) +
          chalk.cyan(`  ${result.suggestions.length} suggestions`)
        );
      } catch {
        spinner.fail(chalk.red(`Failed: ${basename(filePath)}`));
      }
    }

    console.log('\n  ' + chalk.gray('─'.repeat(55)));
    console.log(
      '  ' + chalk.bold('Total across ') + chalk.white(filesToAnalyze.length + ' files:') +
      '  ' + chalk.green.bold(`$${totalSavings}/month potential savings`)
    );
    console.log('  ' + chalk.gray('─'.repeat(55)) + '\n');
  });

// ─── HISTORY ─────────────────────────────────────────────────────────────────
program
  .command('history')
  .alias('ls')
  .description('List your recent analyses')
  .option('-n, --limit <n>', 'Number of analyses to show', '10')
  .action(async (opts) => {
    requireAuth();

    const spinner = ora({ text: chalk.gray('Fetching analyses...'), spinner: 'dots' }).start();

    try {
      const analyses = await getAnalyses();
      spinner.stop();

      if (analyses.length === 0) {
        printInfo('No analyses found. Run rapid analyze <file> to get started.');
        return;
      }

      const Table = (await import('cli-table3')).default;
      const table = new Table({
        head: [
          chalk.bold.white('Title'),
          chalk.bold.white('Language'),
          chalk.bold.white('Savings/mo'),
          chalk.bold.white('Reliability'),
          chalk.bold.white('Suggestions'),
          chalk.bold.white('Date'),
        ],
        colWidths: [30, 16, 14, 14, 14, 14],
        style: { border: ['gray'], head: [] },
      });

      analyses.slice(0, parseInt(opts.limit, 10)).forEach((a: any) => {
        table.push([
          chalk.white(a.title?.substring(0, 28) || '—'),
          chalk.gray(a.language || a.type || '—'),
          a.costSavings > 0 ? chalk.green('$' + a.costSavings) : chalk.gray('—'),
          a.reliabilityScore ? chalk.cyan(a.reliabilityScore + '/100') : chalk.gray('—'),
          chalk.gray(String(a.suggestions?.length || 0)),
          chalk.gray(new Date(a.createdAt).toLocaleDateString()),
        ]);
      });

      console.log('\n' + chalk.bold('  Recent Analyses'));
      console.log(table.toString());
    } catch (err: any) {
      spinner.fail('Failed to fetch analyses');
      printError(err.message);
    }
  });

// ─── OPEN ─────────────────────────────────────────────────────────────────────
program
  .command('open [analysisId]')
  .description('Open an analysis or your dashboard in the browser')
  .action(async (analysisId) => {
    const apiUrl = config.get('apiUrl');
    const url = analysisId
      ? `${apiUrl}/dashboard/analyze/${analysisId}`
      : `${apiUrl}/dashboard`;
    printInfo(`Opening: ${url}`);
    await open(url);
  });

// ─── UPGRADE ─────────────────────────────────────────────────────────────────
program
  .command('upgrade')
  .description('Open the billing page to upgrade your plan')
  .action(async () => {
    const apiUrl = config.get('apiUrl');
    printInfo(`Opening billing page...`);
    await open(`${apiUrl}/dashboard/billing`);
  });

// ─── STATUS ──────────────────────────────────────────────────────────────────
program
  .command('status')
  .description('Show current authentication and config status')
  .action(() => {
    printBanner();
    const apiKey = config.get('apiKey');
    const apiUrl = config.get('apiUrl');
    console.log(chalk.bold('  Status\n'));
    console.log(`  ${chalk.cyan('Server')}    ${chalk.white(apiUrl)}`);
    console.log(`  ${chalk.cyan('Auth')}      ${apiKey ? chalk.green('✔ Authenticated') : chalk.red('✖ Not authenticated')}`);
    console.log(`  ${chalk.cyan('Output')}    ${chalk.white(config.get('defaultOutput'))}`);
    if (!apiKey) {
      console.log('\n  ' + chalk.yellow('Run ') + chalk.cyan('rapid login') + chalk.yellow(' to authenticate.\n'));
    } else {
      console.log('\n  ' + chalk.gray('Run ') + chalk.cyan('rapid analyze <file>') + chalk.gray(' to start.\n'));
    }
  });

// ─── Main parse ──────────────────────────────────────────────────────────────
program.parse(process.argv);

if (process.argv.length < 3) {
  printBanner();
  program.outputHelp();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateMarkdownReport(result: any, title: string): string {
  const date = new Date().toLocaleDateString();
  const suggestions = result.suggestions || [];
  const totalSavings = suggestions.reduce((a: number, s: any) => a + (s.estimatedSaving || 0), 0);

  const lines = [
    `# RAPID Analysis Report: ${title}`,
    `_Generated on ${date} by RAPID CLI_`,
    '',
    '## Scores',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Language | ${result.analysis.language || 'Unknown'} |`,
    `| Reliability | ${result.analysis.reliabilityScore}/100 |`,
    `| Performance | ${result.analysis.performanceScore}/100 |`,
    `| Potential Savings | $${totalSavings}/month |`,
    '',
    `## Suggestions (${suggestions.length})`,
    '',
  ];

  suggestions.forEach((s: any, i: number) => {
    lines.push(`### ${i + 1}. ${s.title}`);
    lines.push(`- **Priority**: ${s.priority}`);
    lines.push(`- **Category**: ${s.category.replace('_', ' ')}`);
    if (s.estimatedSaving > 0) lines.push(`- **Savings**: $${s.estimatedSaving}/month`);
    if (s.estimatedEffort) lines.push(`- **Effort**: ${s.estimatedEffort}`);
    lines.push('');
    lines.push(s.description);
    if (s.codeSnippet) {
      lines.push('');
      lines.push('**Before:**');
      lines.push('```');
      lines.push(s.codeSnippet);
      lines.push('```');
    }
    if (s.improvedCode) {
      lines.push('');
      lines.push('**After:**');
      lines.push('```');
      lines.push(s.improvedCode);
      lines.push('```');
    }
    lines.push('');
  });

  lines.push('---');
  lines.push('_Report generated by [RAPID CLI](https://rapid.dev)_');

  return lines.join('\n');
}
