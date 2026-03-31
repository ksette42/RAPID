import Conf from 'conf';

export interface RapidConfig {
  apiUrl: string;
  apiKey: string;
  defaultOutput: 'table' | 'json' | 'markdown';
  autoImplement: boolean;
  lastLogin: string;
}

export const config = new Conf<RapidConfig>({
  projectName: 'rapid-cli',
  defaults: {
    apiUrl: 'https://app.rapid.dev',
    apiKey: '',
    defaultOutput: 'table',
    autoImplement: false,
    lastLogin: '',
  },
});

export function getApiUrl(): string {
  return process.env.RAPID_API_URL || config.get('apiUrl');
}

export function getApiKey(): string {
  return process.env.RAPID_API_KEY || config.get('apiKey');
}

export function requireAuth(): string {
  const key = getApiKey();
  if (!key) {
    console.error('\n\x1b[31m✖ Not authenticated.\x1b[0m');
    console.error('  Run \x1b[36mrapid login\x1b[0m or set RAPID_API_KEY environment variable.\n');
    process.exit(1);
  }
  return key;
}
