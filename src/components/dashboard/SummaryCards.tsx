import { MetricCard } from '@/components/common/MetricCard';
import { useTranslation } from 'react-i18next';

interface SummaryCardsProps {
  summary: {
    total_suppliers: number;
    average_score: number;
    at_risk_suppliers: number;
    active_alerts: number;
    critical_alerts: number;
  };
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label={t('total_suppliers')}
        value={summary.total_suppliers}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
      />
      
      <MetricCard
        label={t('average_score')}
        value={Math.round(summary.average_score)}
        trend={{ direction: 'up', value: t('trend_avg_score', { value: '+3.2%' }) }}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
      
      <MetricCard
        label={t('at_risk_suppliers')}
        value={summary.at_risk_suppliers}
        trend={{ direction: summary.at_risk_suppliers > 2 ? 'up' : 'down', value: summary.at_risk_suppliers > 2 ? t('needs_attention') : t('under_control') }}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      />
      
      <MetricCard
        label={t('active_alerts')}
        value={`${summary.active_alerts}${summary.critical_alerts > 0 ? ` (${summary.critical_alerts} ${t('critical')})` : ''}`}
        trend={{ direction: summary.critical_alerts > 0 ? 'up' : 'neutral', value: summary.critical_alerts > 0 ? t('immediate_action_needed') : t('all_under_review') }}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        }
      />
    </div>
  );
}
