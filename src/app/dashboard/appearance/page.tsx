'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette, Upload } from 'lucide-react';
import { SketchPicker } from 'react-color';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function AppearancePage() {
  const [primaryColor, setPrimaryColor] = useState('#6A3EFE');
  const [backgroundColor, setBackgroundColor] = useState('#121829');

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
                <Input value={primaryColor} readOnly />
                 <div
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md border"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
            </div>
             <div className="space-y-2">
              <Label>Background Color</Label>
               <div className="relative">
                <Input value={backgroundColor} readOnly />
                 <div
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md border"
                  style={{ backgroundColor: backgroundColor }}
                />
              </div>
            </div>
             <div className="space-y-2 sm:col-span-2">
                <Label>Or pick your own...</Label>
                <div className="p-4 rounded-lg bg-secondary">
                    {/* In a real scenario, a color picker component would be used here. */}
                    <p className="text-sm text-muted-foreground">A color picker would allow for full customization.</p>
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
                    className="flex items-center justify-between rounded-t-lg p-3 text-white"
                    style={{backgroundColor: primaryColor}}
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
                    <div className="max-w-[75%] rounded-lg bg-secondary p-3 text-sm">
                        Hello! How can I help you today?
                    </div>
                     <div className="flex justify-end">
                        <div 
                            className="max-w-[75%] rounded-lg p-3 text-sm text-white"
                            style={{backgroundColor: primaryColor}}
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
        <Button size="lg" className="bg-primary hover:bg-primary/90">Save Changes</Button>
      </div>
    </>
  );
}
