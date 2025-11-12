'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { DataSource } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { MoreHorizontal, FileText, Globe, Trash2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

type DataSourcesTableProps = {
  dataSources: DataSource[];
};

const TypeIcon = ({ type }: { type: DataSource['type'] }) => {
  if (type === 'document') {
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
  if (type === 'website') {
    return <Globe className="h-4 w-4 text-muted-foreground" />;
  }
  if (type === 'text') {
    return <Pencil className="h-4 w-4 text-muted-foreground" />;
  }
  return null;
}

export function DataSourcesTable({ dataSources }: DataSourcesTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataSources.map((source) => (
            <TableRow key={source.id}>
              <TableCell className="font-medium">{source.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <TypeIcon type={source.type} />
                  <span className="capitalize">{source.type}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={cn({
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': source.status === 'Ready',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': source.status === 'Processing',
                  })}
                  variant="secondary"
                >
                  {source.status}
                </Badge>
              </TableCell>
              <TableCell>{format(parseISO(source.lastUpdatedAt), 'PPp')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
