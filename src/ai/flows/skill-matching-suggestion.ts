'use server';

/**
 * @fileOverview Suggests skills a user might be interested in learning based on their existing skills.
 *
 * - skillMatchingSuggestion - A function that suggests skills to learn.
 * - SkillMatchingSuggestionInput - The input type for skillMatchingSuggestion.
 * - SkillMatchingSuggestionOutput - The output type for skillMatchingSuggestion.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillMatchingSuggestionInputSchema = z.object({
  userSkills: z
    .array(z.string())
    .describe('List of skills the user already possesses.'),
  allSkills: z
    .array(z.string())
    .describe('A comprehensive list of all available skills in the system.'),
  numberOfSuggestions: z.number().default(5).describe('The number of skill suggestions to return.'),
});
export type SkillMatchingSuggestionInput = z.infer<typeof SkillMatchingSuggestionInputSchema>;

const SkillMatchingSuggestionOutputSchema = z.array(z.string()).describe('A list of suggested skills the user might be interested in learning.');
export type SkillMatchingSuggestionOutput = z.infer<typeof SkillMatchingSuggestionOutputSchema>;

export async function skillMatchingSuggestion(input: SkillMatchingSuggestionInput): Promise<SkillMatchingSuggestionOutput> {
  return skillMatchingSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillMatchingSuggestionPrompt',
  input: {schema: SkillMatchingSuggestionInputSchema},
  output: {schema: SkillMatchingSuggestionOutputSchema},
  prompt: `You are an AI assistant designed to suggest skills a user might be interested in learning based on the skills they already possess.

  Given the user's existing skills and a comprehensive list of all available skills, identify potential new skills that align with their interests and expertise.

  User's Existing Skills: {{userSkills}}
  All Available Skills: {{allSkills}}

  Suggest {{numberOfSuggestions}} skills that the user might find interesting and beneficial to learn. Return the skills as a JSON array.
  Do not suggest skills the user already has.
  `,
});

const skillMatchingSuggestionFlow = ai.defineFlow(
  {
    name: 'skillMatchingSuggestionFlow',
    inputSchema: SkillMatchingSuggestionInputSchema,
    outputSchema: SkillMatchingSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
