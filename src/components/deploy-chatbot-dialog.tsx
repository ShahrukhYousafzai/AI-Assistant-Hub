'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Code, Frame, Globe } from 'lucide-react';
import type { Chatbot } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

type DeployChatbotDialogProps = {
  chatbot: Chatbot | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeployChatbotDialog({ chatbot, isOpen, onOpenChange }: DeployChatbotDialogProps) {
  const { toast } = useToast();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!chatbot) return null;

  const directLink = `${origin}/c/${chatbot.id}`;
  const embedCode = `<script src="${origin}/widget.js" data-bot-id="${chatbot.id}" async defer></script>`;
  const iframeCode = `<iframe src="${directLink}" width="100%" height="500" frameborder="0"></iframe>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: 'You can now paste the code.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Deploy "{chatbot.name}"</DialogTitle>
          <DialogDescription>
            Choose a deployment method to make your chatbot available to users.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="link" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">
                <Globe className="mr-2 h-4 w-4"/>
                Direct Link
            </TabsTrigger>
            <TabsTrigger value="embed">
                <Code className="mr-2 h-4 w-4"/>
                Embed
            </TabsTrigger>
            <TabsTrigger value="iframe">
                <Frame className="mr-2 h-4 w-4"/>
                Iframe
            </TabsTrigger>
          </TabsList>
           <TabsContent value="link" className="mt-4">
             <div className="space-y-4">
               <p className="text-sm text-muted-foreground">
                Share this direct link with your users via email, social media, or other channels.
              </p>
              <div className="relative">
                <Input value={directLink} readOnly className="pr-12 h-10 font-mono text-sm bg-secondary" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
                  onClick={() => handleCopy(directLink)}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="embed" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Copy and paste this snippet into the HTML of your website where you want the chat widget to appear.
              </p>
              <div className="relative">
                <Textarea value={embedCode} readOnly className="pr-12 h-32 font-mono text-xs bg-secondary" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => handleCopy(embedCode)}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
           <TabsContent value="iframe" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use this iframe code to embed the chatbot within a specific part of your website layout.
              </p>
              <div className="relative">
                <Textarea value={iframeCode} readOnly className="pr-12 h-32 font-mono text-xs bg-secondary" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => handleCopy(iframeCode)}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
