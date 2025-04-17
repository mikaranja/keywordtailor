// Use server directive is required for Genkit flows.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating long-tail keyword suggestions based on a base keyword.
 *
 * - generateLongTailKeywords - A function that triggers the long-tail keyword generation flow.
 * - GenerateLongTailKeywordsInput - The input type for the generateLongTailKeywords function.
 * - GenerateLongTailKeywordsOutput - The output type for the generateLongTailKeywords function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateLongTailKeywordsInputSchema = z.object({
  baseKeyword: z.string().describe('The base keyword to generate long-tail keyword suggestions for.'),
});

export type GenerateLongTailKeywordsInput = z.infer<
  typeof GenerateLongTailKeywordsInputSchema
>;

const GenerateLongTailKeywordsOutputSchema = z.object({
  longTailKeywords: z
    .array(z.string())
    .describe('An array of long-tail keyword suggestions.'),
});

export type GenerateLongTailKeywordsOutput = z.infer<
  typeof GenerateLongTailKeywordsOutputSchema
>;

export async function generateLongTailKeywords(
  input: GenerateLongTailKeywordsInput
): Promise<GenerateLongTailKeywordsOutput> {
  return generateLongTailKeywordsFlow(input);
}

const generateLongTailKeywordsPrompt = ai.definePrompt({
  name: 'generateLongTailKeywordsPrompt',
  input: {
    schema: z.object({
      baseKeyword: z.string().describe('The base keyword to generate long-tail keyword suggestions for.'),
    }),
  },
  output: {
    schema: z.object({
      longTailKeywords: z
        .array(z.string())
        .describe('An array of long-tail keyword suggestions.'),
    }),
  },
  prompt: `You are an expert SEO keyword generator.

  Generate a list of long-tail keyword suggestions based on the following base keyword:

  Base Keyword: {{{baseKeyword}}}

  The long-tail keywords should be relevant and specific to the base keyword.
  Provide the long tail keywords in a JSON array.
  Do not include any explanation or intro/outro text, only the JSON array.`,
});

const generateLongTailKeywordsFlow = ai.defineFlow<
  typeof GenerateLongTailKeywordsInputSchema,
  typeof GenerateLongTailKeywordsOutputSchema
>(
  {
    name: 'generateLongTailKeywordsFlow',
    inputSchema: GenerateLongTailKeywordsInputSchema,
    outputSchema: GenerateLongTailKeywordsOutputSchema,
  },
  async input => {
    const {output} = await generateLongTailKeywordsPrompt(input);
    return output!;
  }
);
