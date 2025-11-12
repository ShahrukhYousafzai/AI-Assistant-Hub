'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { KnowledgeGap, Chatbot } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { BookPlus, Trash2 } from 'lucide-react';

type KnowledgeGapsTableProps = {
  knowledgeGaps: KnowledgeGap[];
  chatbots: Chatbot[];
};

export function KnowledgeGapsTable({ knowledgeGaps, chatbots }: KnowledgeGapsTableProps) {
  const getBotName = (botId: string) => {
    return chatbots.find(bot => bot.id === botId)?.name || 'Unknown Bot';
  };
  
  return (
    <div className="rounded-lg border">
       <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chatbot</TableHead>
            <TableHead>User Question</TableHead>
            <TableHead>Bot Response</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {knowledgeGaps.map((gap) => (
            <TableRow key={gap.id}>
              <TableCell className="font-medium">{getBotName(gap.chatbotId)}</TableCell>
              <TableCell>{gap.question}</TableCell>
              <TableCell className="text-muted-foreground">{gap.response}</TableCell>
              <TableCell>{format(parseISO(gap.timestamp), 'PP')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon">
                                <BookPlus className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add to Knowledge Base</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete Row</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
       </TooltipProvider>
    </div>
  );
}
