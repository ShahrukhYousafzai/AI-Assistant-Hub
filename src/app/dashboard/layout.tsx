import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <DashboardSidebar />
        <SidebarInset>
          <div className="min-h-screen">
            <div className="px-4 lg:px-8">{children}</div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
