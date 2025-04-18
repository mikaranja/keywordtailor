'use server';

/**
 * @fileOverview A flow to generate a SEO optimized blog post from a given keyword.
 *
 * - generateBlogPost - A function that handles the blog post generation process.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateBlogPostInputSchema = z.object({
  keyword: z.string().describe('The keyword to generate the blog post for.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  blogPost: z.string().describe('The generated SEO optimized blog post.'),
  progress: z.string().describe('A short, one-sentence summary of what has been generated.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {
    schema: z.object({
      keyword: z.string().describe('The keyword to generate the blog post for.'),
    }),
  },
  output: {
    schema: z.object({
      blogPost: z.string().describe('The generated SEO optimized blog post.'),
    }),
  },
  prompt: `You are an expert SEO content writer.
  Your task is to generate a SEO optimized blog post for the given keyword.
  The blog post should be at least 500 words long and should be engaging and informative.
  The blog post should be well-structured with headings and paragraphs.
  The blog post should be optimized for the given keyword.

  Keyword: {{{keyword}}}

  Blog Post:`,
});

const generateBlogPostFlow = ai.defineFlow<
  typeof GenerateBlogPostInputSchema,
  typeof GenerateBlogPostOutputSchema
>({
  name: 'generateBlogPostFlow',
  inputSchema: GenerateBlogPostInputSchema,
  outputSchema: GenerateBlogPostOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return {
    ...output!,
    progress: 'The blog post has been generated.',
  };
});
