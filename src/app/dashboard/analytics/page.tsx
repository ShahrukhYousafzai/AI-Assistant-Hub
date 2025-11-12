'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { mockChatbots } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const monthlyData = [
  { month: 'Jan', conversations: 4000 },
  { month: 'Feb', conversations: 3000 },
  { month: 'Mar', conversations: 2000 },
  { month: 'Apr', conversations: 2780 },
  { month: 'May', conversations: 1890 },
  { month: 'Jun', conversations: 2390 },
  { month: 'Jul', conversations: 3490 },
];

export default function AnalyticsPage() {
    const [selectedBotId, setSelectedBotId] = useState<string | undefined>('all');

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Gain insights into your chatbots' performance and user engagement."
      />
      <div className="mb-8">
        <Select onValueChange={setSelectedBotId} defaultValue={selectedBotId}>
            <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a chatbot..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Chatbots</SelectItem>
                {mockChatbots.map((bot) => (
                    <SelectItem key={bot.id} value={bot.id}>
                    {bot.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {mockChatbots.reduce((sum, bot) => sum + bot.monthlyConversations, 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Active Chatbot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Customer Support Bot</p>
            <p className="text-xs text-muted-foreground">1,254 conversations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Bots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{mockChatbots.length}</p>
            <p className="text-xs text-muted-foreground">2 bots are live</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle>Conversations Over Time</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthlyData}>
                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Bar dataKey="conversations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
