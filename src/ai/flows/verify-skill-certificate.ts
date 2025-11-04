'use server';
/**
 * @fileOverview An AI flow to verify a user's skill based on an uploaded certificate.
 *
 * - verifySkillCertificate - A function that analyzes a certificate image.
 * - VerifySkillCertificateInput - The input type for the function.
 * - VerifySkillCertificateOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerifySkillCertificateInputSchema = z.object({
  userName: z.string().describe("The name of the user who uploaded the certificate."),
  skillToVerify: z.string().describe("The skill that needs to be verified."),
  certificateDataUri: z
    .string()
    .describe(
      "A photo of the certificate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifySkillCertificateInput = z.infer<typeof VerifySkillCertificateInputSchema>;

const VerifySkillCertificateOutputSchema = z.object({
  verified: z.boolean().describe("Whether the certificate is verified or not."),
  reason: z.string().describe("The reason why the certificate was or was not verified."),
});
export type VerifySkillCertificateOutput = z.infer<typeof VerifySkillCertificateOutputSchema>;


export async function verifySkillCertificate(input: VerifySkillCertificateInput): Promise<VerifySkillCertificateOutput> {
  return verifySkillCertificateFlow(input);
}


const prompt = ai.definePrompt({
  name: 'verifySkillCertificatePrompt',
  input: { schema: VerifySkillCertificateInputSchema },
  output: { schema: VerifySkillCertificateOutputSchema },
  prompt: `You are an expert verification agent. Your task is to analyze the provided certificate image and determine if it verifies the user's claimed skill.

  Follow these steps carefully:
  1.  Examine the image to confirm it is a certificate of completion or achievement.
  2.  Extract the name of the person, the name of the skill or course, and the issuing organization from the certificate.
  3.  Compare the extracted person's name with the provided user's name: '{{userName}}'. They should match closely.
  4.  Compare the extracted skill/course name with the skill to be verified: '{{skillToVerify}}'. They should be highly relevant.
  5.  Based on your analysis, decide if the skill is verified.

  Return a JSON object with 'verified' set to true if the certificate is legitimate and matches the user's name and skill. Otherwise, set 'verified' to false. Provide a brief 'reason' for your decision.

  User Name: {{userName}}
  Skill to Verify: {{skillToVerify}}
  Certificate Image: {{media url=certificateDataUri}}
  `,
});

const verifySkillCertificateFlow = ai.defineFlow(
  {
    name: 'verifySkillCertificateFlow',
    inputSchema: VerifySkillCertificateInputSchema,
    outputSchema: VerifySkillCertificateOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
