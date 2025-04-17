// This file implements the Genkit flow for summarizing generated keywords into main themes or categories.
'use server';
/**
 * @fileOverview A flow to summarize keywords into main themes or categories.
 *
 * - summarizeKeywords - A function that handles the keyword summarization process.
 * - SummarizeKeywordsInput - The input type for the summarizeKeywords function.
 * - SummarizeKeywordsOutput - The return type for the summarizeKeywords function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeKeywordsInputSchema = z.object({
  keywords: z.array(z.string()).describe('The list of keywords to summarize.'),
});
export type SummarizeKeywordsInput = z.infer<typeof SummarizeKeywordsInputSchema>;

const SummarizeKeywordsOutputSchema = z.object({
  summary: z.string().describe('A summary of the main themes or categories of the keywords.'),
  progress: z.string().describe('A short, one-sentence summary of what has been generated.'),
});
export type SummarizeKeywordsOutput = z.infer<typeof SummarizeKeywordsOutputSchema>;

export async function summarizeKeywords(input: SummarizeKeywordsInput): Promise<SummarizeKeywordsOutput> {
  return summarizeKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeKeywordsPrompt',
  input: {
    schema: z.object({
      keywords: z.array(z.string()).describe('The list of keywords to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the main themes or categories of the keywords.'),
      progress: z.string().describe('A short, one-sentence summary of what has been generated.'),
    }),
  },
  prompt: `You are an expert in keyword analysis and categorization.

  Your task is to summarize the following list of keywords into a few main themes or categories.
  Provide a concise summary that captures the overall focus of the generated keyword list.

  Keywords:
  {{#each keywords}}{{{this}}}\n{{/each}}

  Summary:`,
});

const summarizeKeywordsFlow = ai.defineFlow<
  typeof SummarizeKeywordsInputSchema,
  typeof SummarizeKeywordsOutputSchema
>({
  name: 'summarizeKeywordsFlow',
  inputSchema: SummarizeKeywordsInputSchema,
  outputSchema: SummarizeKeywordsOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return {
    ...output!,
    progress: 'The keywords have been summarized into main themes or categories.',
  };
});
