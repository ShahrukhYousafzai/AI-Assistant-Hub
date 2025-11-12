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
import { Bot, Send, User } from 'lucide-react';
import type { Chatbot } from '@/lib/types';
import { useState } from 'react';

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
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! I'm a preview of your bot. Ask me anything!"}
  ]);
  const [inputValue, setInputValue] = useState('');

  if (!chatbot) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
        const botResponse: Message = { sender: 'bot', text: `This is a simulated response for "${chatbot.name}". You asked: "${inputValue}"` };
        setMessages(prev => [...prev, botResponse]);
    }, 1000);
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
            <div className="flex-1 space-y-4 overflow-y-auto rounded-lg border p-4 bg-secondary">
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
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <Input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                />
                <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
