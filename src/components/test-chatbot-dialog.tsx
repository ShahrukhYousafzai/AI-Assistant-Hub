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
  
  // In a real app, these colors would be part of the chatbot object.
  // For now, we'll use some defaults if they're not on the mock object.
  const primaryColor = '#3F51B5';
  const backgroundColor = '#F5F5F5';
  const botMessageColor = '#E0E0E0';


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
      <DialogContent className="sm:max-w-md p-0 flex flex-col h-[60vh]">
        <div 
            className="flex items-center justify-between p-3 flex-shrink-0"
            style={{backgroundColor: primaryColor, color: getTextColor(primaryColor)}}
        >
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                </div>
                <p className="font-semibold">{chatbot.name}</p>
            </div>
        </div>
        <div 
            ref={chatContainerRef} 
            className="flex-1 space-y-4 overflow-y-auto p-4"
            style={{backgroundColor: backgroundColor}}
        >
            {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex'}`}>
                    <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm`}
                        style={{
                            backgroundColor: message.sender === 'bot' ? botMessageColor : primaryColor,
                            color: getTextColor(message.sender === 'bot' ? botMessageColor : primaryColor),
                        }}
                    >
                        {message.text}
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
        <div className="p-4 pt-0 border-t">
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
