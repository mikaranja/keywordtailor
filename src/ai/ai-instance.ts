// import { genkit } from 'genkit';
// import { googleAI } from '@genkit-ai/googleai';

// export const ai = genkit({
//   promptDir: './prompts',
//   plugins: [
//     googleAI({
//       apiKey: process.env.GOOGLE_GENAI_API_KEY,
//     }),
//   ],
//   model: 'googleai/gemini-2.0-flash',
// });



import { genkit } from 'genkit';
import { openrouter } from '@genkit-ai/openrouter';

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    openrouter({
      apiKey: process.env.OPENROUTER_API_KEY,  // Set your OpenRouter API key in .env
    }),
  ],
  model: 'openrouter/openai/gpt-4.1-mini',  // Specify the model
});
