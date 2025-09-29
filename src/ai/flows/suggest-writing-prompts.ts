'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest writing prompts based on a photo and location data.
 *
 * - suggestWritingPrompts - A function that suggests writing prompts for a walking diary entry.
 * - SuggestWritingPromptsInput - The input type for the suggestWritingPrompts function.
 * - SuggestWritingPromptsOutput - The return type for the suggestWritingPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWritingPromptsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo taken during the walk, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  locationDescription: z.string().describe('A description of the location where the photo was taken.'),
});

export type SuggestWritingPromptsInput = z.infer<typeof SuggestWritingPromptsInputSchema>;

const SuggestWritingPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('An array of suggested writing prompts.'),
});

export type SuggestWritingPromptsOutput = z.infer<typeof SuggestWritingPromptsOutputSchema>;

export async function suggestWritingPrompts(input: SuggestWritingPromptsInput): Promise<SuggestWritingPromptsOutput> {
  return suggestWritingPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWritingPromptsPrompt',
  input: {schema: SuggestWritingPromptsInputSchema},
  output: {schema: SuggestWritingPromptsOutputSchema},
  prompt: `You are a creative writing assistant for a walking diary app. Given a photo and location description, suggest three writing prompts to inspire the user to write a detailed and creative diary entry.

Location: {{{locationDescription}}}
Photo: {{media url=photoDataUri}}

Respond with only three writing prompts.`,
});

const suggestWritingPromptsFlow = ai.defineFlow(
  {
    name: 'suggestWritingPromptsFlow',
    inputSchema: SuggestWritingPromptsInputSchema,
    outputSchema: SuggestWritingPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
