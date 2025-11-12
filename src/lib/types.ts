export type Chatbot = {
  id: string;
  name: string;
  status: 'Live' | 'Draft';
  lastUpdatedAt: string;
  monthlyConversations: number;
  knowledgeSources: string[]; // Array of DataSource IDs
  multilingual: boolean;
  suggestionBubbles: boolean;
};

export type DataSource = {
  id: string;
  name: string;
  type: 'document' | 'website' | 'text';
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
