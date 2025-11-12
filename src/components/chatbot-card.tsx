import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Chatbot } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { BarChart, Bot, Edit, MessageSquare, Share2 } from 'lucide-react';
import Link from 'next/link';

type ChatbotCardProps = {
  chatbot: Chatbot;
  onDeploy: (chatbot: Chatbot) => void;
  onTest: (chatbot: Chatbot) => void;
};

export function ChatbotCard({ chatbot, onDeploy, onTest }: ChatbotCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="text-muted-foreground" />
            <span>{chatbot.name}</span>
          </CardTitle>
          <Badge variant={chatbot.status === 'Live' ? 'default' : 'secondary'}>
            {chatbot.status}
          </Badge>
        </div>
        <CardDescription>
          Last updated: {format(parseISO(chatbot.lastUpdatedAt), 'MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart className="h-4 w-4" />
          <span>{chatbot.monthlyConversations.toLocaleString()} conversations this month</span>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" onClick={() => onTest(chatbot)}>
            <MessageSquare />
            Test
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/edit/${chatbot.id}`}>
            <Edit />
            Edit
          </Link>
        </Button>
        <Button size="sm" onClick={() => onDeploy(chatbot)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Share2 />
          Deploy
        </Button>
      </CardFooter>
    </Card>
  );
}
