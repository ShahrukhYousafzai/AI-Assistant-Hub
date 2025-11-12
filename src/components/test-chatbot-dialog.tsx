'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import type { Chatbot } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { generateChatResponse } from '@/ai/flows/chat-response';
import { mockDataSources } from '@/lib/mock-data';

type TestChatbotDialogProps = {
  chatbot: Chatbot | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

type Message = {
    sender: 'user' | 'bot';
    text: string;
}

export function TestChatbotDialog({ chatbot, isOpen, onOpenChange }: TestChatbotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        setMessages([
            { sender: 'bot', text: "Hello! I'm a preview of your bot. Ask me anything!"}
        ]);
        setInputValue('');
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to the bottom of the chat on new messages
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!chatbot) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isResponding) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsResponding(true);

    try {
      // Find the full persona text
      const persona = `This bot is based on ${chatbot.name}.`; // This would be fetched in a real app
      
      // Get attached knowledge source names
      const attachedSources = mockDataSources
        .filter(ds => chatbot.knowledgeSources.includes(ds.id))
        .map(ds => ds.name);

      const response = await generateChatResponse({
        message: inputValue,
        persona: persona,
        knowledgeSourceNames: attachedSources,
      });

      const botResponse: Message = { sender: 'bot', text: response.response };
      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error("Failed to get chat response:", error);
      const errorResponse: Message = { sender: 'bot', text: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
        setIsResponding(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Test: "{chatbot.name}"</DialogTitle>
          <DialogDescription>
            Interact with your chatbot below to see how it responds. This is a sandboxed preview.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-[60vh]">
            <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto rounded-lg border p-4 bg-secondary">
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                        {message.sender === 'bot' && (
                            <div className="p-2 rounded-full bg-primary text-primary-foreground">
                                <Bot className="h-5 w-5" />
                            </div>
                        )}
                        <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                            message.sender === 'bot' 
                                ? 'bg-background text-foreground'
                                : 'bg-primary text-primary-foreground'
                        }`}>
                            {message.text}
                        </div>
                         {message.sender === 'user' && (
                            <div className="p-2 rounded-full bg-muted text-muted-foreground border">
                                <User className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                ))}
                 {isResponding && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary text-primary-foreground">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="rounded-lg px-4 py-2 max-w-[80%] text-sm bg-background text-foreground flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin"/>
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <Input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isResponding}
                />
                <Button type="submit" size="icon" disabled={isResponding}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
