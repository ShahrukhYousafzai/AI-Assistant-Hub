'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bot, Database, LogOut, Settings, Sun, Moon, LifeBuoy, Palette, Share2, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
           <div className="bg-primary p-2 rounded-lg">
             <Bot className="text-primary-foreground" />
            </div>
          <h2 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            AI Assistant Hub
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard'}
              tooltip="My Chatbots"
            >
              <Link href="/dashboard">
                <Bot />
                <span>My Chatbots</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/data-sources'}
              tooltip="Data Sources"
            >
              <Link href="/dashboard/data-sources">
                <Database />
                <span>Data Sources</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/appearance'}
              tooltip="Appearance & Branding"
            >
              <Link href="/dashboard/appearance">
                <Palette />
                <span>Appearance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/deployment'}
              tooltip="Deployment"
            >
              <Link href="/dashboard/deployment">
                <Share2 />
                <span>Deployment</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/analytics'}
              tooltip="Analytics"
            >
              <Link href="/dashboard/analytics">
                <BarChart2 />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <div className="flex items-center justify-between p-2 group-data-[collapsible=icon]:justify-center">
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar?.imageUrl} alt="User avatar" data-ai-hint={userAvatar?.imageHint} />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">User</span>
                    <span className="text-xs text-muted-foreground">user@example.com</span>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:hidden">
                <LogOut />
            </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
