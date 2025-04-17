import { genkit } from 'genkit';
import { openai } from '@genkit-ai/openai';

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    openai({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseUrl: 'https://openrouter.ai/api/v1',
    }),
  ],
  model: 'google/gemini-2.5-pro-exp-03-25:free',
});
