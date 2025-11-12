'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Palette, Upload } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function AppearancePage() {
  const [primaryColor, setPrimaryColor] = useState('#3F51B5');
  const [backgroundColor, setBackgroundColor] = useState('#F5F5F5');
  const [textColor, setTextColor] = useState('#FFFFFF');

  // A simple function to determine if text should be light or dark
  const getTextColor = (hexcolor: string) => {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 4), 16);
    const b = parseInt(hexcolor.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <>
      <PageHeader
        title="Appearance & Branding"
        description="Customize the look and feel of your chatbot widgets to match your brand."
      />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Color Customization</CardTitle>
            <CardDescription>
              Pick colors that align with your brand identity. The changes will be reflected in the preview.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="relative">
                <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md border appearance-none bg-transparent cursor-pointer"
                />
              </div>
            </div>
             <div className="space-y-2">
              <Label>Background Color</Label>
               <div className="relative">
                <Input value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
                <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md border appearance-none bg-transparent cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chatbot Preview</CardTitle>
             <CardDescription>See your changes in real-time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 flex-col rounded-lg border">
                <div 
                    className="flex items-center justify-between rounded-t-lg p-3"
                    style={{backgroundColor: primaryColor, color: getTextColor(primaryColor)}}
                >
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                        </div>
                        <p className="font-semibold">Support Bot</p>
                    </div>
                </div>
                <div 
                    className="flex-1 p-4 space-y-4"
                    style={{backgroundColor: backgroundColor}}
                >
                    <div className="max-w-[75%] rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
                        Hello! How can I help you today?
                    </div>
                     <div className="flex justify-end">
                        <div 
                            className="max-w-[75%] rounded-lg p-3 text-sm"
                            style={{backgroundColor: primaryColor, color: getTextColor(primaryColor)}}
                        >
                            I have a question about pricing.
                        </div>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

         <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
            <CardDescription>
              Upload your company logo to be displayed in the chatbot header.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
             <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg bg-secondary">
                <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 5MB.</p>
            </div>
          </CardContent>
        </Card>
      </div>
       <div className="mt-8 flex justify-end">
        <Button size="lg">Save Changes</Button>
      </div>
    </>
  );
}
