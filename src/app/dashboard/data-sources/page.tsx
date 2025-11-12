'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { mockDataSources } from '@/lib/mock-data';
import { DataSourcesTable } from '@/components/data-sources-table';
import { AddDataSourceDialog } from '@/components/add-data-source-dialog';
import { PlusCircle } from 'lucide-react';

export default function DataSourcesPage() {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [dataSources, setDataSources] = useState(mockDataSources);

  const handleDataSourceAdded = () => {
    // In a real app, you would refetch the data.
    // For this mock, we'll just log it.
    console.log('Data source added, refetching list...');
  };

  return (
    <>
      <PageHeader
        title="Data Sources"
        description="This is the single place where all knowledge is uploaded, making it available to any chatbot."
        action={
          <Button onClick={() => setAddDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            <PlusCircle />
            Add Data Source
          </Button>
        }
      />
      <DataSourcesTable dataSources={dataSources} />
      <AddDataSourceDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onDataSourceAdded={handleDataSourceAdded}
      />
    </>
  );
}
