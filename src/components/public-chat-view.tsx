'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Chatbot } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { generateChatResponse } from '@/ai/flows/chat-response';
import { mockDataSources } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Avatar } from './ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

type PublicChatViewProps = {
  chatbot: Chatbot;
};

type Message = {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    feedback?: 'good' | 'bad' | null;
}

// A simple function to determine if text should be light or dark
const getTextColor = (hexcolor: string) => {
    if (!hexcolor) return '#000000';
    hexcolor = hexcolor.replace('#', '');
    if (hexcolor.length === 3) {
        hexcolor = hexcolor.split('').map(char => char + char).join('');
    }
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 4), 16);
    const b = parseInt(hexcolor.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
};

export function PublicChatView({ chatbot }: PublicChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
        { id: 'initial', sender: 'bot', text: `Hello! I'm ${chatbot.name}. Ask me anything!` }
    ]);
    setInputValue('');
  }, [chatbot]);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // In a real app, these colors would be part of the chatbot object.
  const primaryColor = '#3F51B5';
  const backgroundColor = '#F5F5F5';
  const botMessageColor = '#FFFFFF';

  const handleFeedback = (messageId: string, feedback: 'good' | 'bad') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, feedback: msg.feedback === feedback ? null : feedback };
      }
      return msg;
    }));
    console.log(`Feedback for message ${messageId}: ${feedback}`);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isResponding) return;

    const userMessage: Message = { id: crypto.randomUUID(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsResponding(true);

    try {
      const persona = `This bot is based on ${chatbot.name}.`;
      const attachedSources = mockDataSources
        .filter(ds => chatbot.knowledgeSources.includes(ds.id))
        .map(ds => ds.name);

      const response = await generateChatResponse({
        message: inputValue,
        persona: persona,
        knowledgeSourceNames: attachedSources,
      });

      const botResponse: Message = { id: crypto.randomUUID(), sender: 'bot', text: response.response, feedback: null };
      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error("Failed to get chat response:", error);
      const errorResponse: Message = { id: crypto.randomUUID(), sender: 'bot', text: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
        setIsResponding(false);
    }
  }

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor }}>
        <header 
            className="flex items-center justify-between p-4 flex-shrink-0 shadow-md"
            style={{backgroundColor: primaryColor, color: getTextColor(primaryColor)}}
        >
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage />
                    <AvatarFallback style={{backgroundColor: 'rgba(255,255,255,0.3)', color: getTextColor(primaryColor)}}>
                        <Bot />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h1 className="font-semibold text-lg">{chatbot.name}</h1>
                    <p className="text-xs opacity-80">Powered by AI</p>
                </div>
            </div>
        </header>
        <main ref={chatContainerRef} className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
            {messages.map((message) => (
                <div key={message.id} className={cn('flex items-end gap-3', message.sender === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                    {message.sender === 'bot' && (
                         <Avatar className="h-8 w-8">
                            <AvatarImage />
                            <AvatarFallback className="bg-muted text-muted-foreground">
                                <Bot className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                    )}
                     {message.sender === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage />
                            <AvatarFallback style={{ backgroundColor: primaryColor, color: getTextColor(primaryColor)}}>
                                <User className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn('flex flex-col gap-1 w-full', message.sender === 'user' ? 'items-end' : 'items-start')}>
                        <div
                            className={cn('rounded-lg px-4 py-2 text-sm max-w-[80%]', message.sender === 'user' ? 'rounded-br-none' : 'rounded-bl-none')}
                            style={{
                                backgroundColor: message.sender === 'bot' ? botMessageColor : primaryColor,
                                color: getTextColor(message.sender === 'bot' ? botMessageColor : primaryColor),
                            }}
                        >
                            {message.text}
                        </div>
                        {message.sender === 'bot' && message.id !== 'initial' && (
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleFeedback(message.id, 'good')}>
                                    <ThumbsUp className={cn("h-4 w-4", message.feedback === 'good' ? 'text-primary' : 'text-muted-foreground')} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleFeedback(message.id, 'bad')}>
                                    <ThumbsDown className={cn("h-4 w-4", message.feedback === 'bad' ? 'text-destructive' : 'text-muted-foreground')} />
                                </Button>
                            </div>
                        )}
                     </div>
                </div>
            ))}
             {isResponding && (
                <div className="flex items-end gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                            <Bot className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 text-sm rounded-bl-none flex items-center bg-white">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
                    </div>
                </div>
            )}
        </main>
        <footer className="p-4 border-t bg-background">
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isResponding}
                    className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isResponding || !inputValue.trim()} style={{backgroundColor: primaryColor, color: getTextColor(primaryColor)}}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </footer>
    </div>
  );
}
