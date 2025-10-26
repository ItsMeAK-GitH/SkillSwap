'use server';

/**
 * @fileOverview This file defines a Genkit flow for sharing skill snippets within a chat, providing rich previews of shared content.
 * 
 * - shareSkillSnippet - An async function that takes user input and returns a rich preview for the shared skill snippet.
 * - ShareSkillSnippetInput - The input type for the shareSkillSnippet function.
 * - ShareSkillSnippetOutput - The return type for the shareSkillSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ShareSkillSnippetInputSchema = z.object({
  snippet: z.string().describe('The skill or project link to be shared.'),
  context: z.string().describe('Additional context or message accompanying the snippet.'),
});
export type ShareSkillSnippetInput = z.infer<typeof ShareSkillSnippetInputSchema>;

const ShareSkillSnippetOutputSchema = z.object({
  richPreview: z.string().describe('A rich preview of the shared skill or project link.'),
});
export type ShareSkillSnippetOutput = z.infer<typeof ShareSkillSnippetOutputSchema>;

export async function shareSkillSnippet(input: ShareSkillSnippetInput): Promise<ShareSkillSnippetOutput> {
  return shareSkillSnippetFlow(input);
}

const shareSkillSnippetPrompt = ai.definePrompt({
  name: 'shareSkillSnippetPrompt',
  input: {schema: ShareSkillSnippetInputSchema},
  output: {schema: ShareSkillSnippetOutputSchema},
  prompt: `You are a helpful assistant designed to generate rich previews for shared skill snippets in a chat application.

  Given the following skill snippet and context, create a concise and informative rich preview that summarizes the content and provides a visually appealing representation for the chat.

  Snippet: {{{snippet}}}
  Context: {{{context}}}

  Ensure the rich preview includes relevant information and is formatted for easy readability within a chat interface.
  The rich preview should not be more than 200 words.
  `,
});

const shareSkillSnippetFlow = ai.defineFlow(
  {
    name: 'shareSkillSnippetFlow',
    inputSchema: ShareSkillSnippetInputSchema,
    outputSchema: ShareSkillSnippetOutputSchema,
  },
  async input => {
    const {output} = await shareSkillSnippetPrompt(input);
    return output!;
  }
);
