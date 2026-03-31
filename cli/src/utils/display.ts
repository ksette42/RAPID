import Table from 'cli-table3';
import chalk from 'chalk';

export function printBanner() {
  const banner = `
  ██████╗  █████╗ ██████╗ ██╗██████╗ 
  ██╔══██╗██╔══██╗██╔══██╗██║██╔══██╗
  ██████╔╝███████║██████╔╝██║██║  ██║
  ██╔══██╗██╔══██║██╔═══╝ ██║██║  ██║
  ██║  ██║██║  ██║██║     ██║██████╔╝
  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ `;

  console.log(chalk.bold.hex('#6172f4')(banner));
  console.log(chalk.gray('  Read · Analyze · Patch · Implement · Document\n'));
}

export function printScores(analysis: {
  costSavings: number;
  reliabilityScore: number;
  performanceScore: number;
  language?: string;
}) {
  const savingsColor = analysis.costSavings > 500 ? chalk.green : chalk.yellow;
  const reliabilityColor = analysis.reliabilityScore >= 80 ? chalk.green : analysis.reliabilityScore >= 60 ? chalk.yellow : chalk.red;
  const performanceColor = analysis.performanceScore >= 80 ? chalk.green : analysis.performanceScore >= 60 ? chalk.yellow : chalk.red;

  console.log('\n' + chalk.bold('  Analysis Scores'));
  console.log('  ' + chalk.gray('─'.repeat(42)));
  console.log(`  ${chalk.cyan('Language')}          ${chalk.white(analysis.language || 'Unknown')}`);
  console.log(`  ${chalk.cyan('Cost Savings')}      ${savingsColor('$' + analysis.costSavings + '/month potential')}`);
  console.log(`  ${chalk.cyan('Reliability')}       ${reliabilityColor(analysis.reliabilityScore + '/100')}`);
  console.log(`  ${chalk.cyan('Performance')}       ${performanceColor(analysis.performanceScore + '/100')}`);
  console.log('  ' + chalk.gray('─'.repeat(42)));
}

export function printSuggestionsTable(suggestions: any[]) {
  if (suggestions.length === 0) {
    console.log(chalk.gray('\n  No suggestions found.\n'));
    return;
  }

  const table = new Table({
    head: [
      chalk.bold.white('#'),
      chalk.bold.white('Title'),
      chalk.bold.white('Priority'),
      chalk.bold.white('Category'),
      chalk.bold.white('Savings/mo'),
      chalk.bold.white('Effort'),
    ],
    colWidths: [4, 40, 12, 18, 14, 14],
    style: { border: ['gray'], head: [] },
    wordWrap: true,
  });

  const priorityColor: Record<string, chalk.Chalk> = {
    CRITICAL: chalk.red,
    HIGH: chalk.yellow,
    MEDIUM: chalk.cyan,
    LOW: chalk.gray,
  };

  suggestions.forEach((s, i) => {
    const pc = priorityColor[s.priority] || chalk.white;
    table.push([
      chalk.gray(String(i + 1)),
      chalk.white(s.title),
      pc(s.priority),
      chalk.gray(s.category.replace('_', ' ')),
      s.estimatedSaving > 0 ? chalk.green('$' + s.estimatedSaving) : chalk.gray('—'),
      chalk.gray(s.estimatedEffort || '—'),
    ]);
  });

  console.log('\n' + chalk.bold('  Suggestions'));
  console.log(table.toString());
}

export function printSuggestionDetail(s: any, index: number) {
  console.log('\n' + chalk.bold.hex('#6172f4')(`  Suggestion #${index + 1}: ${s.title}`));
  console.log('  ' + chalk.gray('─'.repeat(50)));

  const priorityColor: Record<string, chalk.Chalk> = {
    CRITICAL: chalk.red,
    HIGH: chalk.yellow,
    MEDIUM: chalk.cyan,
    LOW: chalk.gray,
  };
  const pc = priorityColor[s.priority] || chalk.white;

  console.log(`  ${chalk.cyan('Priority')}   ${pc(s.priority)}`);
  console.log(`  ${chalk.cyan('Category')}   ${chalk.white(s.category.replace('_', ' '))}`);
  if (s.estimatedSaving > 0) {
    console.log(`  ${chalk.cyan('Savings')}    ${chalk.green('$' + s.estimatedSaving + '/month')}`);
  }
  if (s.estimatedEffort) {
    console.log(`  ${chalk.cyan('Effort')}     ${chalk.gray(s.estimatedEffort)}`);
  }
  console.log(`\n  ${chalk.white(s.description)}`);

  if (s.codeSnippet) {
    console.log('\n  ' + chalk.red.bold('Before:'));
    s.codeSnippet.split('\n').forEach((line: string) => {
      console.log('  ' + chalk.red('- ') + chalk.gray(line));
    });
  }

  if (s.improvedCode) {
    console.log('\n  ' + chalk.green.bold('After:'));
    s.improvedCode.split('\n').forEach((line: string) => {
      console.log('  ' + chalk.green('+ ') + chalk.white(line));
    });
  }
}

export function printSuccess(msg: string) {
  console.log('\n  ' + chalk.green('✔ ') + chalk.white(msg));
}

export function printError(msg: string) {
  console.log('\n  ' + chalk.red('✖ ') + chalk.white(msg));
}

export function printInfo(msg: string) {
  console.log('  ' + chalk.cyan('ℹ ') + chalk.gray(msg));
}

export function printWarning(msg: string) {
  console.log('  ' + chalk.yellow('⚠ ') + chalk.white(msg));
}
