import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle, Clock, TrendingDown, TrendingUp, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { suppliers } from '@/data/mockData';

interface SLAMetric {
  id: string;
  supplierId: string;
  supplierName: string;
  metric: 'delivery_time' | 'response_time' | 'quality_score' | 'uptime';
  current: number;
  threshold: number;
  target: number;
  unit: string;
  status: 'compliant' | 'warning' | 'breached';
  deviationPercent: number;
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
}

const generateSLAMetrics = (): SLAMetric[] => {
  const metrics: SLAMetric[] = [];
  const metricTypes = [
    { type: 'delivery_time' as const, threshold: 48, target: 36, unit: 'hours' },
    { type: 'response_time' as const, threshold: 4, target: 2, unit: 'hours' },
    { type: 'quality_score' as const, threshold: 95, target: 98, unit: '%' },
    { type: 'uptime' as const, threshold: 99, target: 99.9, unit: '%' },
  ];

  suppliers.forEach(supplier => {
    metricTypes.forEach((metricType, idx) => {
      let current: number;
      let status: 'compliant' | 'warning' | 'breached';
      
      // Generate realistic values based on supplier risk level
      if (supplier.risk_level === 'High') {
        current = metricType.threshold + (Math.random() * 20 - 5);
        status = current > metricType.threshold ? 'breached' : 'warning';
      } else if (supplier.risk_level === 'Medium') {
        current = metricType.threshold - (Math.random() * 10);
        status = current > metricType.threshold ? 'breached' : 'warning';
      } else {
        current = metricType.target - (Math.random() * 5);
        status = 'compliant';
      }

      // Adjust for metric type (lower is better for delivery/response time)
      if (metricType.type === 'delivery_time' || metricType.type === 'response_time') {
        if (current <= metricType.target) status = 'compliant';
        else if (current <= metricType.threshold) status = 'warning';
        else status = 'breached';
      } else {
        if (current >= metricType.target) status = 'compliant';
        else if (current >= metricType.threshold) status = 'warning';
        else status = 'breached';
      }

      const deviation = Math.abs(((current - metricType.target) / metricType.target) * 100);

      metrics.push({
        id: `${supplier.supplier_id}-${metricType.type}-${idx}`,
        supplierId: supplier.supplier_id,
        supplierName: supplier.name,
        metric: metricType.type,
        current: parseFloat(current.toFixed(2)),
        threshold: metricType.threshold,
        target: metricType.target,
        unit: metricType.unit,
        status,
        deviationPercent: parseFloat(deviation.toFixed(1)),
        lastUpdated: new Date(Date.now() - Math.random() * 3600000),
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable',
      });
    });
  });

  return metrics;
};

export default function SLAMonitor() {
  const [metrics, setMetrics] = useState<SLAMetric[]>([]);
  const [filter, setFilter] = useState<'all' | 'breached' | 'warning' | 'compliant'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Initial load
    setMetrics(generateSLAMetrics());

    // Auto-refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(() => {
        setMetrics(generateSLAMetrics());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const filteredMetrics = metrics.filter(m => 
    filter === 'all' ? true : m.status === filter
  );

  const breachedCount = metrics.filter(m => m.status === 'breached').length;
  const warningCount = metrics.filter(m => m.status === 'warning').length;
  const compliantCount = metrics.filter(m => m.status === 'compliant').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'breached':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'breached':
        return 'destructive';
      case 'warning':
        return 'outline';
      case 'compliant':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'delivery_time':
        return 'Delivery Time';
      case 'response_time':
        return 'Response Time';
      case 'quality_score':
        return 'Quality Score';
      case 'uptime':
        return 'Uptime';
      default:
        return metric;
    }
  };

  const calculateProgress = (metric: SLAMetric) => {
    if (metric.metric === 'delivery_time' || metric.metric === 'response_time') {
      // For time metrics, lower is better
      return Math.max(0, Math.min(100, ((metric.threshold - metric.current) / metric.threshold) * 100));
    } else {
      // For percentage metrics, higher is better
      return (metric.current / metric.target) * 100;
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">SLA Monitoring</h2>
            <p className="text-muted-foreground mt-1">Real-time tracking of supplier service level agreements</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm py-2 px-4">
              <Bell className="w-4 h-4 mr-2" />
              Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
            </Badge>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="text-sm text-primary hover:underline"
            >
              Toggle
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('all')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metrics.length}</div>
                <p className="text-xs text-muted-foreground mt-1">All SLA metrics</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-red-500/50" onClick={() => setFilter('breached')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Breached</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{breachedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Critical violations</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-yellow-500/50" onClick={() => setFilter('warning')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Warning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-500">{warningCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Near threshold</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-green-500/50" onClick={() => setFilter('compliant')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{compliantCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Meeting targets</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Active Filter */}
        {filter !== 'all' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtering:</span>
            <Badge variant="outline">{filter.toUpperCase()}</Badge>
            <button
              onClick={() => setFilter('all')}
              className="text-sm text-primary hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* SLA Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMetrics.map((metric, idx) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              <Card className={`hover:shadow-md transition-shadow ${
                metric.status === 'breached' ? 'border-red-500/50' : 
                metric.status === 'warning' ? 'border-yellow-500/50' : 
                'border-green-500/20'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        {getStatusIcon(metric.status)}
                        {metric.supplierName}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {getMetricLabel(metric.metric)}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={getStatusColor(metric.status) as any} className="text-xs">
                        {metric.status.toUpperCase()}
                      </Badge>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Current</p>
                      <p className="font-semibold">{metric.current}{metric.unit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Target</p>
                      <p className="font-semibold text-green-600">{metric.target}{metric.unit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Threshold</p>
                      <p className="font-semibold text-yellow-600">{metric.threshold}{metric.unit}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Performance</span>
                      <span className="font-medium">{calculateProgress(metric).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={calculateProgress(metric)} 
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                    <span>Deviation: {metric.deviationPercent}%</span>
                    <span>Updated: {metric.lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredMetrics.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No metrics match the selected filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
