import { Link } from 'react-router-dom';
import { Alert } from '@/data/mockData';
import { AlertCard } from '@/components/alerts/AlertCard';

interface RecentAlertsProps {
  alerts: Alert[];
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  const recentAlerts = alerts
    .filter(a => a.status !== 'Resolved')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  return (
    <div className="card-base p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
        <Link to="/alerts" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {recentAlerts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No active alerts</p>
        ) : (
          recentAlerts.map((alert) => (
            <AlertCard key={alert.alert_id} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
}
