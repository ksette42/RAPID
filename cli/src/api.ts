import axios, { AxiosInstance } from 'axios';
import { getApiUrl, getApiKey } from './config.js';

let client: AxiosInstance | null = null;

export function getClient(): AxiosInstance {
  if (!client) {
    client = axios.create({
      baseURL: getApiUrl(),
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'rapid-cli/1.0.0',
      },
    });

    client.interceptors.request.use((cfg) => {
      const key = getApiKey();
      if (key) cfg.headers['Authorization'] = `Bearer ${key}`;
      return cfg;
    });

    client.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          console.error('\n\x1b[31m✖ Authentication failed.\x1b[0m');
          console.error('  Run \x1b[36mrapid login\x1b[0m to re-authenticate.\n');
          process.exit(1);
        }
        if (err.response?.status === 403) {
          console.error('\n\x1b[31m✖ Plan limit reached.\x1b[0m');
          console.error('  Run \x1b[36mrapid upgrade\x1b[0m or visit your dashboard to upgrade.\n');
          process.exit(1);
        }
        return Promise.reject(err);
      }
    );
  }
  return client;
}

export interface AnalysisResult {
  analysis: {
    id: string;
    title: string;
    language: string;
    costSavings: number;
    reliabilityScore: number;
    performanceScore: number;
  };
  suggestions: Array<{
    title: string;
    description: string;
    category: string;
    priority: string;
    estimatedSaving: number;
    estimatedEffort: string;
    codeSnippet?: string;
    improvedCode?: string;
  }>;
}

export async function runAnalysis(params: {
  title: string;
  content: string;
  type: string;
  fileName?: string;
}): Promise<AnalysisResult> {
  const res = await getClient().post('/api/analyze', params);
  return res.data;
}

export async function getAnalyses(): Promise<any[]> {
  const res = await getClient().get('/api/analyze');
  return res.data;
}

export async function approveSuggestion(id: string): Promise<void> {
  await getClient().patch(`/api/suggestions/${id}`, { action: 'approve' });
}

export async function implementSuggestion(id: string): Promise<void> {
  await getClient().patch(`/api/suggestions/${id}`, { action: 'implement' });
}
