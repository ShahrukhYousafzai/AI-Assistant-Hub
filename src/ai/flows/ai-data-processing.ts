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
      "The data URI of the document, website content, or raw text to process. Must include a MIME type and use Base64 encoding for documents. Expected format: 'data:<mimetype>;base64,<encoded_data>', a direct URL for websites, or raw text for text sources."
    ),
  dataType: z.enum(['document', 'website', 'text']).describe('The type of data being processed.'),
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
  prompt: `You are an AI data processor that analyzes documents, websites, or raw text and generates tags and summaries.

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
  // A simple Handlebars helper to check for equality.
  // The 'document' type requires the 'media' helper, others do not.
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
