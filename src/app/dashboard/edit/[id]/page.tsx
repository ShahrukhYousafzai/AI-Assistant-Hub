'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockChatbots, mockDataSources } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Bot, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TestChatbotDialog } from '@/components/test-chatbot-dialog';
import type { Chatbot } from '@/lib/types';

const editChatbotFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Chatbot name must be at least 3 characters.',
  }),
  persona: z.string().min(10, {
    message: 'Persona description must be at least 10 characters.',
  }),
  knowledgeSourceIds: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one knowledge source.',
    }),
  primaryColor: z.string(),
  backgroundColor: z.string(),
  botMessageColor: z.string(),
});

// A simple function to determine if text should be light or dark
const getTextColor = (hexcolor: string) => {
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

export default function EditChatbotPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const botId = params.id as string;

  const [isTestDialogOpen, setTestDialogOpen] = useState(false);
  const chatbot = mockChatbots.find((bot) => bot.id === botId);

  const form = useForm<z.infer<typeof editChatbotFormSchema>>({
    resolver: zodResolver(editChatbotFormSchema),
    defaultValues: {
      name: '',
      persona: 'This bot is friendly and helpful.', // Default persona
      knowledgeSourceIds: [],
      primaryColor: '#6366F1',
      backgroundColor: '#111827',
      botMessageColor: '#1F2937',
    },
  });

  const watchPrimaryColor = form.watch('primaryColor', '#6366F1');
  const watchBackgroundColor = form.watch('backgroundColor', '#111827');
  const watchBotMessageColor = form.watch('botMessageColor', '#1F2937');
  
  useEffect(() => {
    if (chatbot) {
      form.reset({
        name: chatbot.name,
        // A real implementation would fetch the full persona text
        persona: `This bot is based on ${chatbot.name}.`,
        knowledgeSourceIds: chatbot.knowledgeSources,
        primaryColor: '#6366F1',
        backgroundColor: '#111827',
        botMessageColor: '#1F2937',
      });
    }
  }, [chatbot, form]);

  function onSubmit(values: z.infer<typeof editChatbotFormSchema>) {
    console.log(values);
    toast({
      title: 'Chatbot Updated!',
      description: `The chatbot "${values.name}" has been successfully updated.`,
    });
    router.push('/dashboard');
  }

  const handleTestClick = () => {
    setTestDialogOpen(true);
  };

  if (!chatbot) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
          <p className="mb-4">Chatbot not found.</p>
          <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
          </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Edit "${chatbot.name}"`}
        description="Modify your AI assistant's configuration and appearance."
        action={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                    <CardTitle>1. Name & Persona</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chatbot Name</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Q1 2024 Product Bot" {...field} />
                            </FormControl>
                            <FormDescription>Give your new bot a unique name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="persona"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Persona & Rules</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="e.g., Be enthusiastic, helpful, and always try to guide users towards our pricing page."
                                className="min-h-[120px]"
                                {...field}
                            />
                            </FormControl>
                            <FormDescription>
                            Set the unique personality and the core rules for this bot instance.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                    <CardTitle>2. Attach Knowledge</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <FormField
                        control={form.control}
                        name="knowledgeSourceIds"
                        render={() => (
                        <FormItem>
                            <div className="mb-4">
                            <FormLabel className="text-base">Data Sources</FormLabel>
                            <FormDescription>
                                Select which documents or data sources from your library this specific bot should learn from.
                            </FormDescription>
                            </div>
                            <div className="space-y-3">
                            {mockDataSources.map((source) => (
                                <FormField
                                key={source.id}
                                control={form.control}
                                name="knowledgeSourceIds"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={source.id}
                                        className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(source.id)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...field.value, source.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                    (value) => value !== source.id
                                                    )
                                                );
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal w-full cursor-pointer">
                                        {source.name}
                                        </FormLabel>
                                    </FormItem>
                                    );
                                }}
                                />
                            ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>3. Appearance</CardTitle>
                        <CardDescription>Customize this bot's colors and preview it.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="primaryColor"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Primary Color</FormLabel>
                                <FormControl>
                                     <div className="relative">
                                        <Input {...field} />
                                        <input
                                            type="color"
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md border appearance-none bg-transparent cursor-pointer"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="backgroundColor"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Color</FormLabel>
                                <FormControl>
                                     <div className="relative">
                                        <Input {...field} />
                                        <input
                                            type="color"
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md border appearance-none bg-transparent cursor-pointer"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="botMessageColor"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bot Message Color</FormLabel>
                                <FormControl>
                                     <div className="relative">
                                        <Input {...field} />
                                        <input
                                            type="color"
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md border appearance-none bg-transparent cursor-pointer"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel>Preview</FormLabel>
                            <div className="mt-2 flex h-64 flex-col rounded-lg border">
                                <div 
                                    className="flex items-center justify-between rounded-t-lg p-3"
                                    style={{backgroundColor: watchPrimaryColor, color: getTextColor(watchPrimaryColor)}}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center">
                                            <Bot className="h-5 w-5" />
                                        </div>
                                        <p className="font-semibold">{form.getValues('name') || 'Support Bot'}</p>
                                    </div>
                                </div>
                                <div 
                                    className="flex-1 p-4 space-y-4"
                                    style={{backgroundColor: watchBackgroundColor}}
                                >
                                    <div 
                                    className="max-w-[75%] rounded-lg p-3 text-sm"
                                    style={{backgroundColor: watchBotMessageColor, color: getTextColor(watchBotMessageColor)}}
                                    >
                                        Hello! How can I help you today?
                                    </div>
                                    <div className="flex justify-end">
                                        <div 
                                            className="max-w-[75%] rounded-lg p-3 text-sm"
                                            style={{backgroundColor: watchPrimaryColor, color: getTextColor(watchPrimaryColor)}}
                                        >
                                            I have a question about pricing.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" size="lg" type="button" onClick={handleTestClick}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Test Chatbot
            </Button>
            <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
          </div>
        </form>
      </Form>
      <TestChatbotDialog
        chatbot={chatbot}
        isOpen={isTestDialogOpen}
        onOpenChange={setTestDialogOpen}
      />
    </>
  );
}
