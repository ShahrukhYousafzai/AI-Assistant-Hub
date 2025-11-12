'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Chatbot } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { generateChatResponse } from '@/ai/flows/chat-response';
import { mockDataSources } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type TestChatbotDialogProps = {
  chatbot: Chatbot | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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


export function TestChatbotDialog({ chatbot, isOpen, onOpenChange }: TestChatbotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        setMessages([
            { id: 'initial', sender: 'bot', text: "Hello! I'm a preview of your bot. Ask me anything!"}
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
  
  // In a real app, these colors would be part of the chatbot object.
  const primaryColor = '#6366F1';
  const backgroundColor = '#111827';
  const botMessageColor = '#1F2937';

  const handleFeedback = (messageId: string, feedback: 'good' | 'bad') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        // If the same feedback is clicked again, reset it. Otherwise, set the new feedback.
        return { ...msg, feedback: msg.feedback === feedback ? null : feedback };
      }
      return msg;
    }));
    // Here you would typically send this feedback to a logging service or database.
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 flex flex-col h-[70vh] max-h-[600px]">
        <div 
            className="flex items-center justify-between p-4 flex-shrink-0"
            style={{backgroundColor: primaryColor, color: getTextColor(primaryColor)}}
        >
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                </div>
                <p className="font-semibold text-lg">{chatbot.name}</p>
            </div>
        </div>
        <div 
            ref={chatContainerRef} 
            className="flex-1 space-y-6 overflow-y-auto p-4"
            style={{backgroundColor: backgroundColor}}
        >
            {messages.map((message) => (
                <div key={message.id} className={cn('flex items-end gap-3', message.sender === 'user' ? 'flex-row-reverse' : 'flex-row')}>
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
                            <div className="flex items-center self-start">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleFeedback(message.id, 'good')}>
                                    <ThumbsUp className={cn("h-4 w-4", message.feedback === 'good' ? 'text-indigo-400' : 'text-gray-400')} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleFeedback(message.id, 'bad')}>
                                    <ThumbsDown className={cn("h-4 w-4", message.feedback === 'bad' ? 'text-red-400' : 'text-gray-400')} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
             {isResponding && (
                <div className="flex items-start gap-3">
                    <div className="rounded-lg px-4 py-2 max-w-[80%] text-sm flex items-center" style={{backgroundColor: botMessageColor, color: getTextColor(botMessageColor)}}>
                        <Loader2 className="h-5 w-5 animate-spin"/>
                    </div>
                </div>
            )}
        </div>
        <div className="p-4 border-t" style={{backgroundColor: backgroundColor, borderColor: botMessageColor}}>
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isResponding}
                    className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <Button type="submit" size="icon" disabled={isResponding || !inputValue.trim()} style={{backgroundColor: primaryColor, color: getTextColor(primaryColor)}}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
