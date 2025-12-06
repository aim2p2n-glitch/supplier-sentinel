import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MetricCard } from '@/components/common/MetricCard';
import { SimpleBarChart, SimpleLineChart, DonutChart } from '@/components/common/SimpleChart';
import { ReportModal } from '@/components/modals/ReportModal';
import { supplierService } from '@/services/api';

const SupplierDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [showReportModal, setShowReportModal] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  // Fetch supplier from API
  const { data: supplier, isLoading, error } = useQuery({
    queryKey: ['supplier', id],
    queryFn: () => supplierService.getSupplierById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch quality reports from API
  const { data: qualityReports = [], isLoading: isLoadingQuality } = useQuery({
    queryKey: ['qualityReports', id],
    queryFn: () => supplierService.getQualityReports(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch delivery logs from API
  const { data: deliveryLogs = [], isLoading: isLoadingDelivery } = useQuery({
    queryKey: ['deliveryLogs', id],
    queryFn: () => supplierService.getDeliveryLogs(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch performance summaries from API
  const { data: performanceSummaries = [], isLoading: isLoadingSummaries } = useQuery({
    queryKey: ['performanceSummaries', id],
    queryFn: () => supplierService.getPerformanceSummaries(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const summary = performanceSummaries.length > 0 ? performanceSummaries[0] : null;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading supplier details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !supplier) {
    return (
      <MainLayout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold text-foreground mb-4">Supplier Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'The supplier you are looking for does not exist.'}
          </p>
          <Link to="/suppliers" className="btn-primary">
            Back to Suppliers
          </Link>
        </div>
      </MainLayout>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const handleCopyEmail = async () => {
    if (supplier?.email) {
      try {
        await navigator.clipboard.writeText(supplier.email);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'quality', label: 'Quality' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'contracts', label: 'Contracts' },
  ];

  // Mock historical data
  const monthlyOTD = [
    { label: 'Jul', value: 88 },
    { label: 'Aug', value: 91 },
    { label: 'Sep', value: 89 },
    { label: 'Oct', value: 93 },
    { label: 'Nov', value: 92 },
    { label: 'Dec', value: supplier.otd_percentage },
  ];

  // Calculate defect rate trend from quality reports
  const monthlyDefects = qualityReports.length > 0
    ? qualityReports.slice(-6).map((report, index) => ({
        label: new Date(report.inspection_date).toLocaleDateString('en-US', { month: 'short' }),
        value: report.defect_rate,
      }))
    : [
        { label: 'Jul', value: 2.1 },
        { label: 'Aug', value: 1.8 },
        { label: 'Sep', value: 2.4 },
        { label: 'Oct', value: 1.5 },
        { label: 'Nov', value: 1.3 },
        { label: 'Dec', value: supplier.defect_rate },
      ];

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
          <Link to="/" className="hover:text-foreground transition-colors">Dashboard</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to="/suppliers" className="hover:text-foreground transition-colors">Suppliers</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-foreground">{supplier.name}</span>
        </nav>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {supplier.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{supplier.name}</h1>
                <StatusBadge status={supplier.risk_level} />
              </div>
              <p className="text-muted-foreground">{supplier.region} • {supplier.supplier_id}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Contact: {supplier.contact_person} ({supplier.email})
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCopyEmail}
              className="btn-secondary relative"
            >
              {emailCopied ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact
                </>
              )}
            </button>
            <button 
              onClick={() => setShowReportModal(true)}
              className="btn-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
            </button>
          </div>
        </header>

        {/* AI Summary */}
        {isLoadingSummaries ? (
          <div className="ai-summary-box animate-slide-in">
            <div className="flex items-center justify-center py-4">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mr-3"></div>
              <span className="text-muted-foreground">Loading AI summary...</span>
            </div>
          </div>
        ) : summary && (
          <div className="ai-summary-box animate-slide-in">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-semibold text-foreground">AI Performance Summary</span>
              <span className="text-xs text-muted-foreground ml-auto">
                Updated {new Date(summary.generated_date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{summary.summary_text}</p>
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Overall Score"
            value={supplier.overall_score}
            trend={{ direction: 'up', value: '+3 pts' }}
          />
          <MetricCard
            label="On-Time Delivery"
            value={`${supplier.otd_percentage.toFixed(1)}%`}
            trend={{ direction: supplier.otd_percentage > 90 ? 'up' : 'down', value: supplier.otd_percentage > 90 ? 'Above target' : 'Below target' }}
          />
          <MetricCard
            label="Defect Rate"
            value={`${supplier.defect_rate.toFixed(1)}%`}
            trend={{ direction: supplier.defect_rate < 2 ? 'down' : 'up', value: supplier.defect_rate < 2 ? 'Good' : 'Needs attention' }}
          />
          <MetricCard
            label="Total Spend"
            value={formatCurrency(supplier.total_spend)}
            trend={{ direction: 'neutral', value: 'YTD' }}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex gap-4" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Score */}
              <div className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-4">Performance Score Breakdown</h3>
                <div className="flex items-center justify-center gap-8">
                  <DonutChart
                    value={supplier.overall_score}
                    color={supplier.overall_score >= 85 ? 'success' : supplier.overall_score >= 70 ? 'warning' : 'destructive'}
                    size={120}
                    strokeWidth={10}
                  />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-sm text-muted-foreground">Quality: {100 - supplier.defect_rate * 10}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">Delivery: {supplier.otd_percentage}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-warning" />
                      <span className="text-sm text-muted-foreground">Compliance: {supplier.contract_adherence}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OTD Trend */}
              <div className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-4">On-Time Delivery Trend</h3>
                <SimpleBarChart data={monthlyOTD} maxValue={100} color="primary" height={160} />
              </div>

              {/* Key Insights */}
              {summary && (
                <div className="card-base p-6">
                  <h3 className="font-semibold text-foreground mb-4">Key Insights</h3>
                  <ul className="space-y-3">
                    {summary.key_insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risk Flags */}
              {summary && (
                <div className="card-base p-6">
                  <h3 className="font-semibold text-foreground mb-4">Risk Flags</h3>
                  <ul className="space-y-3">
                    {summary.risk_flags.map((flag, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-warning">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-4">Defect Rate Trend</h3>
                <SimpleLineChart data={monthlyDefects} color="warning" height={160} />
              </div>
              
              <div className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-4">Recent Quality Reports</h3>
                {isLoadingQuality ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  </div>
                ) : qualityReports.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {qualityReports.map(qr => (
                      <div key={qr.report_id} className="p-3 rounded-lg bg-muted">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground">{qr.report_id}</span>
                          <StatusBadge status={qr.severity} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {qr.defect_count} defects in {qr.total_inspected_quantity} items ({qr.defect_rate.toFixed(2)}%)
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {qr.defect_type} • {new Date(qr.inspection_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No quality reports available</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-4">Delivery Performance</h3>
                <SimpleBarChart data={monthlyOTD} maxValue={100} color="success" height={160} />
              </div>
              
              <div className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-4">Recent Delivery Inspections</h3>
                {isLoadingDelivery ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  </div>
                ) : deliveryLogs.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {deliveryLogs.map(dl => (
                      <div key={dl.report_id} className="p-3 rounded-lg bg-muted">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground">{dl.report_id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            dl.severity === 'Low' 
                              ? 'bg-success/10 text-success' 
                              : dl.severity === 'Medium'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-destructive/10 text-destructive'
                          }`}>
                            {dl.severity} • {dl.defect_count} defects
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          PO: {dl.po_id} • Inspected: {dl.total_inspected_quantity} items
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {dl.defect_type} • {new Date(dl.inspection_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No delivery logs available</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-base p-6">
                <h3 className="font-semibold text-foreground mb-4">Contract Compliance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center justify-center">
                    <DonutChart
                      value={supplier.contract_adherence}
                      color={supplier.contract_adherence >= 95 ? 'success' : supplier.contract_adherence >= 85 ? 'warning' : 'destructive'}
                      size={100}
                      strokeWidth={8}
                    />
                    <p className="text-sm text-muted-foreground mt-3">Overall Adherence</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-3">SLA Terms</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                        <span className="text-sm text-muted-foreground">Max Delay Days</span>
                        <span className="font-medium text-foreground">5 days</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                        <span className="text-sm text-muted-foreground">Min Quality %</span>
                        <span className="font-medium text-foreground">98%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                        <span className="text-sm text-muted-foreground">Contract End</span>
                        <span className="font-medium text-foreground">Dec 31, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card-base p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="font-semibold text-foreground">Contact Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {supplier.contact_person.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{supplier.contact_person}</p>
                      <p className="text-sm text-muted-foreground">Primary Contact</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a href={`mailto:${supplier.email}`} className="text-sm text-foreground hover:text-primary transition-colors">
                          {supplier.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm text-foreground">{supplier.phone || '+1 (555) 123-4567'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm text-foreground">{supplier.region}</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full btn-primary mt-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ReportModal
        supplier={supplier}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </MainLayout>
  );
};

export default SupplierDetail;
