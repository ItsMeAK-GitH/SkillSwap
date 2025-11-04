'use server';
/**
 * @fileOverview An AI-powered skill matching flow for connecting users with complementary skills.
 *
 * - skillMatching - A function that orchestrates the skill matching process.
 * - SkillMatchingInput - The input type for the skillMatching function.
 * - SkillMatchingOutput - The return type for the skillMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillMatchingInputSchema = z.object({
  userSkillsToLearn: z
    .array(z.string())
    .describe('List of skills the user wants to learn.'),
  userSkillsToTeach: z
    .array(z.string())
    .describe('List of skills the user can teach.'),
  allUserProfiles: z.array(z.object({
    userId: z.string(),
    skillsToLearn: z.array(z.string()),
    skillsToTeach: z.array(z.string()),
  })).describe('A list of all user profiles with their skills to learn and teach.'),
});
export type SkillMatchingInput = z.infer<typeof SkillMatchingInputSchema>;

const SkillMatchingOutputSchema = z.array(z.object({
  userId: z.string().describe('The user ID of the matched user.'),
  matchedSkillsToLearn: z.array(z.string()).describe('The skills from the input user that the matched user can teach.'),
  matchedSkillsToTeach: z.array(z.string()).describe('The skills from the input user that the matched user can learn.'),
  relevanceScore: z.number().describe('A score indicating the relevance of this match (higher is better).')
})).describe('A list of matched users with their user IDs, the skills they can teach to the user, and the skills they can learn from the user.');
export type SkillMatchingOutput = z.infer<typeof SkillMatchingOutputSchema>;

export async function skillMatching(input: SkillMatchingInput): Promise<SkillMatchingOutput> {
  return skillMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillMatchingPrompt',
  input: {schema: SkillMatchingInputSchema},
  output: {schema: SkillMatchingOutputSchema},
  prompt: `You are an expert skill matching algorithm designed to connect users for skill swaps.

Given a user's profile (skills to learn and skills to teach) and a list of other user profiles, identify potential skill swap partners.

You MUST only use the user profiles provided in the 'allUserProfiles' list. Do not invent or hallucinate any other users.

For each user in 'allUserProfiles', determine which of the input user's 'skills to learn' they can teach, and which of the input user's 'skills to teach' they want to learn.
Also compute a relevance score for each match based on the number of shared skills and the overall complementarity of their skill sets.

User Skills to Learn: {{userSkillsToLearn}}
User Skills to Teach: {{userSkillsToTeach}}

All User Profiles: {{allUserProfiles}}

Return a JSON array of matched users, including their user ID, the skills they can teach the user, the skills they can learn from the user and a relevance score. Sort by relevanceScore in descending order.
If no matches are found, return an empty array.
`,
});

const skillMatchingFlow = ai.defineFlow(
  {
    name: 'skillMatchingFlow',
    inputSchema: SkillMatchingInputSchema,
    outputSchema: SkillMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
