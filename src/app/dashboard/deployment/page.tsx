'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ClipboardCopy, Globe, Code, Frame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockChatbots } from '@/lib/mock-data';
import type { Chatbot } from '@/lib/types';

export default function DeploymentPage() {
  const [selectedBotId, setSelectedBotId] = useState<string | undefined>(mockChatbots[0]?.id);
  const { toast } = useToast();

  const selectedChatbot = mockChatbots.find(bot => bot.id === selectedBotId);

  const embedCode = selectedChatbot ? `<script src="https://example.com/widget.js" data-bot-id="${selectedChatbot.id}" async defer></script>` : '';
  const directLink = selectedChatbot ? `https://chat.example.com/${selectedChatbot.id}` : '';
  const iframeCode = selectedChatbot ? `<iframe src="${directLink}" width="100%" height="500" frameborder="0"></iframe>` : '';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
    });
  };
  
  return (
    <>
      <PageHeader
        title="Deployment"
        description="Get the code or link to deploy your AI assistants to the world."
      />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select a Chatbot</CardTitle>
          <CardDescription>Choose which chatbot you want to deploy.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedBotId} defaultValue={selectedBotId}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Select a chatbot..." />
            </SelectTrigger>
            <SelectContent>
              {mockChatbots.map((bot) => (
                <SelectItem key={bot.id} value={bot.id}>
                  {bot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedChatbot && (
         <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="p-3 rounded-lg bg-secondary">
                        <Code className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                        <CardTitle>Embed on Your Website</CardTitle>
                        <CardDescription>Add a floating chat widget to your site.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-sm text-muted-foreground">
                        Copy and paste this snippet into your website's HTML to add a floating chat bubble.
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
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="p-3 rounded-lg bg-secondary">
                        <Globe className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                        <CardTitle>Share a Direct Link</CardTitle>
                        <CardDescription>A hosted page for your chatbot.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="p-3 rounded-lg bg-secondary">
                        <Frame className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                        <CardTitle>Embed as an Iframe</CardTitle>
                        <CardDescription>Integrate the chat directly into a page section.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
            </Card>
         </div>
      )}
    </>
  );
}
