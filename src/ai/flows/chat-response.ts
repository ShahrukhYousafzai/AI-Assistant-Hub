'use server';

/**
 * @fileOverview Defines a Genkit flow for generating chatbot responses.
 *
 * - generateChatResponse - A function that generates a response based on the user's message, chatbot persona, and knowledge sources.
 * - ChatResponseInput - The input type for the generateChatResponse function.
 * - ChatResponseOutput - The return type for the generateChatResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatResponseInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
  persona: z.string().describe('The personality and rules for the chatbot.'),
  knowledgeSourceNames: z.array(z.string()).describe('The names of the knowledge sources the chatbot can access.'),
  enableTranslation: z.boolean().optional().describe('Whether to enable auto-translation of the response.'),
});
export type ChatResponseInput = z.infer<typeof ChatResponseInputSchema>;

const ChatResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the user.'),
});
export type ChatResponseOutput = z.infer<typeof ChatResponseOutputSchema>;

export async function generateChatResponse(input: ChatResponseInput): Promise<ChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatResponsePrompt',
  input: { schema: ChatResponseInputSchema },
  output: { schema: ChatResponseOutputSchema },
  prompt: `You are an AI assistant. Your personality and rules are defined below.

  **Persona & Rules**
  {{{persona}}}

  You have access to the following knowledge sources. You should ONLY use information from these sources to answer questions. If the answer is not in the sources, say you don't know.
  {{#each knowledgeSourceNames}}
  - {{{this}}}
  {{/each}}

  {{#if enableTranslation}}
  **Language Translation**
  - Detect the language of the user's message.
  - Your final response MUST be in the same language as the user's message.
  - You must still use the English-based knowledge sources provided. Translate the information accurately to the user's language.
  {{/if}}

  **User's Message**
  {{{message}}}

  Based on the persona, rules, and available knowledge, provide a helpful response to the user's message.
  `,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: ChatResponseInputSchema,
    outputSchema: ChatResponseOutputSchema,
  },
  async input => {
    // In a real application, you would use the knowledgeSourceNames to perform
    // a RAG (Retrieval-Augmented Generation) lookup in a vector database.
    // For this example, we are just passing the names to the prompt.
    const { output } = await prompt(input);
    return output!;
  }
);
