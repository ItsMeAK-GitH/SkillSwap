'use server';
/**
 * @fileOverview An interactive AI flow to verify a user's skill based on a certificate.
 * This flow can ask clarifying questions if it finds discrepancies.
 *
 * - verifySkillInteractive - A function that manages the verification conversation.
 * - VerifySkillInteractiveInput - The input type for the function.
 * - VerifySkillInteractiveOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const VerifySkillInteractiveInputSchema = z.object({
  userName: z.string().describe("The name of the user who uploaded the certificate."),
  skillToVerify: z.string().describe("The skill that needs to be verified."),
  certificateDataUri: z
    .string()
    .describe(
      "A photo of the certificate, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userMessage: z.string().optional().describe("An optional message from the user providing more context or clarification."),
});
export type VerifySkillInteractiveInput = z.infer<typeof VerifySkillInteractiveInputSchema>;

const VerifySkillInteractiveOutputSchema = z.object({
  status: z.enum(['VERIFIED', 'FAILED', 'NEEDS_MORE_INFO']).describe("The current status of the verification."),
  messageToUser: z.string().describe("A message to display to the user explaining the status or asking for more information."),
  reason: z.string().describe("The internal reason for the current status."),
});
export type VerifySkillInteractiveOutput = z.infer<typeof VerifySkillInteractiveOutputSchema>;

export async function verifySkillInteractive(input: VerifySkillInteractiveInput): Promise<VerifySkillInteractiveOutput> {
  return verifySkillInteractiveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifySkillInteractivePrompt',
  input: { schema: VerifySkillInteractiveInputSchema },
  output: { schema: VerifySkillInteractiveOutputSchema },
  prompt: `You are an expert verification agent. Your task is to analyze the provided certificate image and determine if it verifies the user's claimed skill. You must be thorough but can ask the user for clarification if you are unsure.

  **User Information:**
  - User Name: {{userName}}
  - Skill to Verify: {{skillToVerify}}
  - Certificate Image: {{media url=certificateDataUri}}
  {{#if userMessage}}
  - Additional context from user: "{{userMessage}}"
  {{/if}}

  **Verification Steps:**
  1.  **Examine the image:** Confirm it is a certificate of completion/achievement. If it's not a certificate, status is 'FAILED'.
  2.  **Extract Details:** Extract the person's name, the skill/course name, and the issuing organization.
  3.  **Verify Name:** Compare the extracted name with the user's name ('{{userName}}').
      - If it's an exact match, proceed.
      - If it's a partial match (e.g., "John D." for "John Doe", or initials like "A. Rajesh" for "Akshith Rajesh"), the status is 'NEEDS_MORE_INFO'. Ask the user to confirm if the name on the certificate is them.
      - If it's a clear mismatch, the status is 'FAILED'.
  4.  **Verify Skill:** Compare the extracted skill/course with the skill to be verified ('{{skillToVerify}}'). They must be highly relevant. If not, the status is 'FAILED'.
  5.  **Consider User Context:** If the user has provided a message ({{userMessage}}), use it to resolve uncertainties from step 3. For example, if they confirm a partial name is them, you can change the status to 'VERIFIED'.
  6.  **Final Decision:**
      - If all checks pass, the status is 'VERIFIED'. The message to the user should be congratulatory.
      - If any check definitively fails, the status is 'FAILED'. The message should clearly state why.
      - If you have a reasonable doubt (like a partial name match) and have NOT received user context, the status is 'NEEDS_MORE_INFO'. Your message to the user must be a clear question asking for clarification.

  **Your Response:**
  Return a single JSON object with the 'status', a user-friendly 'messageToUser', and a brief internal 'reason'.
  `,
});

const verifySkillInteractiveFlow = ai.defineFlow(
  {
    name: 'verifySkillInteractiveFlow',
    inputSchema: VerifySkillInteractiveInputSchema,
    outputSchema: VerifySkillInteractiveOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
