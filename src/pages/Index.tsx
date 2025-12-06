import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { TopRiskSuppliers } from '@/components/dashboard/TopRiskSuppliers';
import { RecentAlerts } from '@/components/dashboard/RecentAlerts';
import { ChatBot } from '@/components/chat/ChatBot';
import { supplierService } from '@/services/api';


const Index = () => {
  // Fetch dashboard data from API
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: supplierService.getDashboardSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes for dashboard (more frequent updates)
  });

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <MainLayout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold text-foreground mb-4">Failed to Load Dashboard</h1>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Unable to fetch dashboard data.'}
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <header className="animate-fade-in">
          <p className="text-muted-foreground">
            Monitor supplier performance, identify risks, and make data-driven decisions.
          </p>
        </header>

        {/* Summary Cards */}
        <section 
          aria-labelledby="summary-heading"
          className="animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <h2 id="summary-heading" className="sr-only">Performance Summary</h2>
          <SummaryCards summary={dashboardData.summary} />
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <TopRiskSuppliers suppliers={dashboardData.topRiskSuppliers} />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <RecentAlerts alerts={dashboardData.recentAlerts} />
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <ChatBot />
    </MainLayout>
  );
};

export default Index;
