export type Chatbot = {
  id: string;
  name: string;
  status: 'Live' | 'Draft';
  lastUpdatedAt: string;
  monthlyConversations: number;
  knowledgeSources: string[]; // Array of DataSource IDs
  multilingual: boolean;
};

export type DataSource = {
  id: string;
  name: string;
  type: 'document' | 'website';
  status: 'Ready' | 'Processing';
  lastUpdatedAt: string;
};

export type KnowledgeGap = {
  id: string;
  chatbotId: string;
  question: string;
  response: string;
  timestamp: string;
};
