'use server';

/**
 * @fileOverview This file defines the AI data processing flow for automatically processing and tagging uploaded documents and indexing website links.
 *
 * - aiDataProcessing - A function that handles the AI data processing.
 * - AIDataProcessingInput - The input type for the aiDataProcessing function.
 * - AIDataProcessingOutput - The return type for the aiDataProcessing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDataProcessingInputSchema = z.object({
  dataUri: z
    .string()
    .describe(
      "The data URI of the document or website content to process. Must include a MIME type and use Base64 encoding for documents. Expected format: 'data:<mimetype>;base64,<encoded_data>' or a direct URL for websites."
    ),
  dataType: z.enum(['document', 'website']).describe('The type of data being processed.'),
});
export type AIDataProcessingInput = z.infer<typeof AIDataProcessingInputSchema>;

const AIDataProcessingOutputSchema = z.object({
  tags: z.array(z.string()).describe('A list of tags generated for the data.'),
  summary: z.string().describe('A summary of the data.'),
});
export type AIDataProcessingOutput = z.infer<typeof AIDataProcessingOutputSchema>;

export async function aiDataProcessing(input: AIDataProcessingInput): Promise<AIDataProcessingOutput> {
  return aiDataProcessingFlow(input);
}

const aiDataProcessingPrompt = ai.definePrompt({
  name: 'aiDataProcessingPrompt',
  input: {schema: AIDataProcessingInputSchema},
  output: {schema: AIDataProcessingOutputSchema},
  prompt: `You are an AI data processor that analyzes documents or websites and generates tags and summaries.

  Analyze the following {{{dataType}}} content and provide a list of relevant tags and a concise summary.

  Content: {{#ifEquals dataType "document"}}{{media url=dataUri}}{{else}}{{{dataUri}}}{{/ifEquals}}

  Ensure the tags accurately reflect the content and the summary provides a clear overview.

  The tags should be suitable for categorizing the content in a knowledge library.

  The summary should be brief but informative.
  `, 
  config: {
    model: 'models/gemini-1.5-pro-latest',
  }
});

ai.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

const aiDataProcessingFlow = ai.defineFlow(
  {
    name: 'aiDataProcessingFlow',
    inputSchema: AIDataProcessingInputSchema,
    outputSchema: AIDataProcessingOutputSchema,
  },
  async input => {
    const {output} = await aiDataProcessingPrompt(input);
    return output!;
  }
);
