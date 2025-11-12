'use client';

import { useParams } from 'next/navigation';
import { mockChatbots } from '@/lib/mock-data';
import { PublicChatView } from '@/components/public-chat-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PublicChatPage() {
  const params = useParams();
  const botId = params.id as string;
  const chatbot = mockChatbots.find((bot) => bot.id === botId);

  if (!chatbot) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
        <h1 className="text-2xl font-bold mb-4">Chatbot Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The chatbot you're looking for doesn't exist or may have been moved.
        </p>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return <PublicChatView chatbot={chatbot} />;
}
