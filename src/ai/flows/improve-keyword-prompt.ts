// 'use server'
'use server';

/**
 * @fileOverview A long-tail keyword suggestion refinement AI agent.
 *
 * - improveKeywordPrompt - A function that handles the keyword refinement process.
 * - ImproveKeywordPromptInput - The input type for the improveKeywordPrompt function.
 * - ImproveKeywordPromptOutput - The return type for the improveKeywordPrompt function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ImproveKeywordPromptInputSchema = z.object({
  baseKeyword: z.string().describe('The original base keyword.'),
  feedback: z.string().describe('User feedback on the previous keyword suggestions.'),
  previousSuggestions: z.array(z.string()).describe('The previous keyword suggestions.'),
});
export type ImproveKeywordPromptInput = z.infer<typeof ImproveKeywordPromptInputSchema>;

const ImproveKeywordPromptOutputSchema = z.object({
  refinedKeywords: z.array(z.string()).describe('Refined long-tail keyword suggestions.'),
});
export type ImproveKeywordPromptOutput = z.infer<typeof ImproveKeywordPromptOutputSchema>;

export async function improveKeywordPrompt(input: ImproveKeywordPromptInput): Promise<ImproveKeywordPromptOutput> {
  return improveKeywordPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveKeywordPromptPrompt',
  input: {
    schema: z.object({
      baseKeyword: z.string().describe('The original base keyword.'),
      feedback: z.string().describe('User feedback on the previous keyword suggestions.'),
      previousSuggestions: z.array(z.string()).describe('The previous keyword suggestions.'),
    }),
  },
  output: {
    schema: z.object({
      refinedKeywords: z.array(z.string()).describe('Refined long-tail keyword suggestions.'),
    }),
  },
  prompt: `You are an expert SEO specialist. A user has provided the base keyword "{{baseKeyword}}" and the following long-tail keyword suggestions: {{previousSuggestions}}. The user has given the following feedback: "{{feedback}}". Based on this feedback, refine the long-tail keyword suggestions to be more relevant and accurate. Return only an array of keywords.
`,
});

const improveKeywordPromptFlow = ai.defineFlow<
  typeof ImproveKeywordPromptInputSchema,
  typeof ImproveKeywordPromptOutputSchema
>(
  {
    name: 'improveKeywordPromptFlow',
    inputSchema: ImproveKeywordPromptInputSchema,
    outputSchema: ImproveKeywordPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
