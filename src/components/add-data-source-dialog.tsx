'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp, Globe, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AddDataSourceDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDataSourceAdded: () => void;
};

export function AddDataSourceDialog({
  isOpen,
  onOpenChange,
  onDataSourceAdded,
}: AddDataSourceDialogProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onDataSourceAdded();
    onOpenChange(false);
    toast({
      title: 'Data source added!',
      description: 'The new data is now being processed.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Data Source</DialogTitle>
          <DialogDescription>
            Add a new document or website to your knowledge library.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="upload" className="mt-4" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">
                <FileUp className="mr-2 h-4 w-4" /> File Upload
              </TabsTrigger>
              <TabsTrigger value="website">
                <Globe className="mr-2 h-4 w-4" /> Website Link
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, TXT, etc.</p>
                  </div>
                  <Input id="dropzone-file" type="file" className="hidden" />
                </label>
              </div>
            </TabsContent>
            <TabsContent value="website" className="mt-4">
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  Website URL
                </label>
                <Input id="url" placeholder="https://example.com/pricing" />
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                'Add Source'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
