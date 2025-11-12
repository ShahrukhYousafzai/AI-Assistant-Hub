export type Chatbot = {
  id: string;
  name: string;
  status: 'Live' | 'Draft';
  lastUpdatedAt: string;
  monthlyConversations: number;
  knowledgeSources: string[]; // Array of DataSource IDs
};

export type DataSource = {
  id: string;
  name: string;
  type: 'document' | 'website';
  status: 'Ready' | 'Processing';
  lastUpdatedAt: string;
};
