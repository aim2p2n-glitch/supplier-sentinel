import { Sidebar } from './Sidebar';
import { useTranslation } from 'react-i18next';

// Dummy user for demonstration
const user = { name: 'John Doe' };

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { i18n, t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
