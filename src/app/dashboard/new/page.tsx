'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
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
import { mockDataSources } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const newChatbotFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Chatbot name must be at least 3 characters.',
  }),
  persona: z.string().min(10, {
    message: 'Persona description must be at least 10 characters.',
  }),
  greetingMessage: z.string().optional(),
  knowledgeSourceIds: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one knowledge source.',
    }),
  multilingual: z.boolean(),
  suggestionBubbles: z.boolean(),
});

export default function NewChatbotPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newChatbotFormSchema>>({
    resolver: zodResolver(newChatbotFormSchema),
    defaultValues: {
      name: '',
      persona: '',
      greetingMessage: '',
      knowledgeSourceIds: [],
      multilingual: false,
      suggestionBubbles: true,
    },
  });

  function onSubmit(values: z.infer<typeof newChatbotFormSchema>) {
    console.log(values);
    toast({
      title: 'Chatbot Created!',
      description: `The chatbot "${values.name}" has been successfully created.`,
    });
    router.push('/dashboard');
  }

  return (
    <>
      <PageHeader
        title="Create New AI Assistant"
        description="Follow the steps to configure and launch your new chatbot."
        action={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        }
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                name="greetingMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Greeting Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Hello! How can I help you today?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The first message the bot sends to a user. Leave blank for default.
                    </FormDescription>
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
           <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className='space-y-1.5'>
                  <CardTitle>3. Advanced</CardTitle>
                  <CardDescription>
                    Advanced settings for your chatbot.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="multilingual"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Multilingual Support
                        </FormLabel>
                        <FormDescription>
                          Automatically detect user language and translate
                          responses.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="suggestionBubbles"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Suggestion Bubbles
                        </FormLabel>
                        <FormDescription>
                          Show AI-generated quick replies after the bot responds.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">Create Chatbot</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
