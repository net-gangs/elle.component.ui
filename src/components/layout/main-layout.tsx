import { Outlet, useRouterState } from "@tanstack/react-router";
import { AppSidebar } from "./sidebar/app-sidebar";
import { LessonSidebar } from "./sidebar/lesson-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

interface MainLayoutProps {
  showRightPanel?: boolean;
  rightPanelProps?: any;
}

export function MainLayout({}: MainLayoutProps) {
  return (
    <SidebarProvider>
      <MainLayoutContent />
    </SidebarProvider>
  );
}

function MainLayoutContent() {
  const router = useRouterState();
  const isLessonPlanning = router.location.pathname.startsWith("/lesson-planning");

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <SidebarProvider className="min-h-[calc(100vh-theme(spacing.4))] h-full">
          {isLessonPlanning && <LessonSidebar />}
          <div className="flex flex-1 flex-col">
            {/* Main content */}
            <main className="flex-1 overflow-auto">
              <div className="flex gap-6 h-full">
                <div className="flex-1 min-w-0 h-full">
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </SidebarInset>

      <Toaster />
    </>
  );
}
