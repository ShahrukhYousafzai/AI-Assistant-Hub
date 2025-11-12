'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { mockChatbots } from '@/lib/mock-data';
import { ChatbotCard } from '@/components/chatbot-card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DeployChatbotDialog } from '@/components/deploy-chatbot-dialog';
import type { Chatbot } from '@/lib/types';

export default function MyChatbotsPage() {
  const [isDeployDialogOpen, setDeployDialogOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);

  const handleDeployClick = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setDeployDialogOpen(true);
  };

  return (
    <>
      <PageHeader
        title="My Chatbots"
        description="Manage your portfolio of AI assistants."
        action={
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/dashboard/new">
              <PlusCircle />
              Create New AI Assistant
            </Link>
          </Button>
        }
      />
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockChatbots.map((bot) => (
          <ChatbotCard key={bot.id} chatbot={bot} onDeploy={handleDeployClick} />
        ))}
      </div>
      <DeployChatbotDialog
        chatbot={selectedChatbot}
        isOpen={isDeployDialogOpen}
        onOpenChange={setDeployDialogOpen}
      />
    </>
  );
}
