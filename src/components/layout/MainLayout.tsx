import { Sidebar } from './Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AccessibilityToggle } from '@/components/AccessibilityToggle';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen relative">
        {/* Theme Toggle & Accessibility - Top Right Corner */}
        <div className="fixed top-4 right-6 z-40 flex items-center gap-2">
          <AccessibilityToggle />
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
