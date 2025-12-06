import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { AlertCard } from '@/components/alerts/AlertCard';
import { SearchInput } from '@/components/common/SearchInput';
import { supplierService, Alert } from '@/services/api';

const Alerts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Fetch alerts from API
  const { data: alerts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => supplierService.getAlerts(),
    staleTime: 2 * 60 * 1000, // 2 minutes for alerts
  });

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [alerts, searchQuery, severityFilter]);

  const alertCounts = useMemo(() => ({
    total: alerts.length,
    new: alerts.filter(a => a.status === 'New').length,
    reviewed: alerts.filter(a => a.status === 'Reviewed').length,
    resolved: alerts.filter(a => a.status === 'Resolved').length,
    critical: alerts.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length,
  }), [alerts]);

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold text-foreground mb-4">Failed to Load Alerts</h1>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Unable to fetch alerts data.'}
          </p>
          <button onClick={() => refetch()} className="btn-primary">
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-foreground mb-2">Alerts & Notifications</h1>
          <p className="text-muted-foreground">
            Monitor and respond to supplier performance alerts.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card-base p-4">
            <p className="text-2xl font-bold text-foreground">{alertCounts.total}</p>
            <p className="text-sm text-muted-foreground">Total Alerts</p>
          </div>
          <div className="card-base p-4 border-l-4 border-l-primary">
            <p className="text-2xl font-bold text-primary">{alertCounts.new}</p>
            <p className="text-sm text-muted-foreground">New</p>
          </div>
          <div className="card-base p-4 border-l-4 border-l-warning">
            <p className="text-2xl font-bold text-warning">{alertCounts.reviewed}</p>
            <p className="text-sm text-muted-foreground">Under Review</p>
          </div>
          <div className="card-base p-4 border-l-4 border-l-success">
            <p className="text-2xl font-bold text-success">{alertCounts.resolved}</p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </div>
          <div className="card-base p-4 border-l-4 border-l-destructive">
            <p className="text-2xl font-bold text-destructive">{alertCounts.critical}</p>
            <p className="text-sm text-muted-foreground">Critical Active</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card-base p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search alerts..."
              />
            </div>
            
            <div className="w-40">
              <label htmlFor="severity-filter" className="sr-only">Filter by Severity</label>
              <select
                id="severity-filter"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="input-base"
              >
                <option value="all">All Severity</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="card-base p-12 text-center">
              <svg className="w-12 h-12 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-foreground mb-1">No alerts found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            filteredAlerts.map((alert, index) => (
              <div key={alert.alert_id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                <AlertCard alert={alert} />
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Alerts;
