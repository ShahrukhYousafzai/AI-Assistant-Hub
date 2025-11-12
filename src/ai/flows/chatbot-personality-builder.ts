'use server';

/**
 * @fileOverview Defines a Genkit flow for building chatbot personalities.
 *
 * - buildChatbotPersonality - A function that generates a chatbot personality based on user input.
 * - ChatbotPersonalityInput - The input type for the buildChatbotPersonality function.
 * - ChatbotPersonalityOutput - The return type for the buildChatbotPersonality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotPersonalityInputSchema = z.object({
  name: z.string().describe('The name of the chatbot.'),
  purpose: z.string().describe('The intended purpose or goal of the chatbot.'),
  persona: z.string().describe('A description of the desired personality for the chatbot (e.g., "friendly," "professional," "enthusiastic").'),
  rules: z.string().describe('A list of core rules or guidelines the chatbot should follow.'),
});
export type ChatbotPersonalityInput = z.infer<typeof ChatbotPersonalityInputSchema>;

const ChatbotPersonalityOutputSchema = z.object({
  personalityDescription: z.string().describe('A detailed description of the chatbot personality, incorporating the provided persona and rules.'),
});
export type ChatbotPersonalityOutput = z.infer<typeof ChatbotPersonalityOutputSchema>;

export async function buildChatbotPersonality(input: ChatbotPersonalityInput): Promise<ChatbotPersonalityOutput> {
  return chatbotPersonalityBuilderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPersonalityBuilderPrompt',
  input: {schema: ChatbotPersonalityInputSchema},
  output: {schema: ChatbotPersonalityOutputSchema},
  prompt: `You are an AI expert in defining chatbot personalities.

  Based on the following information, create a detailed description of the chatbot's personality.

  Chatbot Name: {{{name}}}
  Purpose: {{{purpose}}}
  Persona: {{{persona}}}
  Rules: {{{rules}}}

  Personality Description:`,
});

const chatbotPersonalityBuilderFlow = ai.defineFlow(
  {
    name: 'chatbotPersonalityBuilderFlow',
    inputSchema: ChatbotPersonalityInputSchema,
    outputSchema: ChatbotPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
