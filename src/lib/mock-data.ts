import { Chatbot, DataSource, KnowledgeGap } from './types';

export const mockDataSources: DataSource[] = [
  {
    id: 'ds_1',
    name: 'Product-Roadmap.pdf',
    type: 'document',
    status: 'Ready',
    lastUpdatedAt: '2024-07-20T10:00:00Z',
  },
  {
    id: 'ds_2',
    name: 'Pricing Page',
    type: 'website',
    status: 'Ready',
    lastUpdatedAt: '2024-07-19T14:30:00Z',
  },
  {
    id: 'ds_3',
    name: 'Employee-Handbook-v2.docx',
    type: 'document',
    status: 'Ready',
    lastUpdatedAt: '2024-07-18T09:00:00Z',
  },
  {
    id: 'ds_4',
    name: 'API-Documentation.pdf',
    type: 'document',
    status: 'Processing',
    lastUpdatedAt: '2024-07-21T11:00:00Z',
  },
  {
    id: 'ds_5',
    name: 'Blog Home',
    type: 'website',
    status: 'Ready',
    lastUpdatedAt: '2024-07-15T18:00:00Z',
  },
  {
    id: 'ds_6',
    name: 'Refund Policy',
    type: 'text',
    status: 'Ready',
    lastUpdatedAt: '2024-07-22T10:00:00Z'
  }
];

export const mockChatbots: Chatbot[] = [
  {
    id: 'bot_1',
    name: 'Customer Support Bot',
    status: 'Live',
    lastUpdatedAt: '2024-07-20T11:30:00Z',
    monthlyConversations: 1254,
    knowledgeSources: ['ds_2', 'ds_5'],
    multilingual: true,
    suggestionBubbles: true,
  },
  {
    id: 'bot_2',
    name: 'Employee Handbook Bot',
    status: 'Live',
    lastUpdatedAt: '2024-07-18T10:00:00Z',
    monthlyConversations: 321,
    knowledgeSources: ['ds_3'],
    multilingual: false,
    suggestionBubbles: false,
  },
  {
    id: 'bot_3',
    name: 'E-commerce FAQ Bot',
    status: 'Draft',
    lastUpdatedAt: '2024-07-19T16:45:00Z',
    monthlyConversations: 0,
    knowledgeSources: ['ds_1', 'ds_2', 'ds_6'],
    multilingual: false,
    suggestionBubbles: true,
  },
  {
    id: 'bot_4',
    name: 'Developer API Helper',
    status: 'Live',
    lastUpdatedAt: '2024-07-21T12:00:00Z',
    monthlyConversations: 890,
    knowledgeSources: ['ds_4'],
    multilingual: true,
    suggestionBubbles: false,
  },
];

export const mockKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'kg_1',
    chatbotId: 'bot_1',
    question: 'Do you offer a discount for non-profits?',
    response: "I'm sorry, I cannot find information about discounts in the provided knowledge sources.",
    timestamp: '2024-07-22T14:30:00Z',
  },
  {
    id: 'kg_2',
    chatbotId: 'bot_4',
    question: 'What are the rate limits for the v2 API?',
    response: 'I do not have information on API rate limits.',
    timestamp: '2024-07-21T18:15:00Z',
  },
  {
    id: 'kg_3',
    chatbotId: 'bot_1',
    question: 'How do I cancel my subscription?',
    response: 'To manage your account, log in to the customer portal.',
    timestamp: '2024-07-20T10:05:00Z',
  },
];
