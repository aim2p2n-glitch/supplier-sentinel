// Mock data based on the provided schema

export interface Supplier {
  supplier_id: string;
  name: string;
  region: string;
  contact_person: string;
  email: string;
  overall_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  last_summary_date: string;
  otd_percentage: number;
  defect_rate: number;
  contract_adherence: number;
  total_spend: number;
}

export interface Alert {
  alert_id: string;
  supplier_id: string;
  supplier_name: string;
  type: 'Quality' | 'Delivery' | 'Contract' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  timestamp: string;
  status: 'New' | 'Reviewed' | 'Resolved';
}

export interface PerformanceSummary {
  summary_id: string;
  supplier_id: string;
  summary_text: string;
  generated_date: string;
  key_insights: string[];
  risk_flags: string[];
  data_sources_used: string[];
}

export interface PurchaseOrder {
  po_id: string;
  supplier_id: string;
  order_date: string;
  delivery_due_date: string;
  actual_delivery_date: string | null;
  status: 'Ordered' | 'Shipped' | 'Delivered' | 'Cancelled';
  total_value_usd: number;
}

export interface QualityReport {
  report_id: string;
  po_id: string;
  supplier_id: string;
  inspection_date: string;
  defect_count: number;
  total_inspected_quantity: number;
  defect_type: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface DeliveryLog {
  delivery_id: string;
  po_id: string;
  supplier_id: string;
  shipment_date: string;
  received_date: string;
  transport_mode: string;
  delivery_status: 'OnTime' | 'Delayed';
  delay_days: number;
  damage_reported: boolean;
}

export const suppliers: Supplier[] = [
  {
    supplier_id: 'SUP001',
    name: 'Alpha Components Ltd.',
    region: 'North America',
    contact_person: 'John Mitchell',
    email: 'j.m****@alpha.com',
    overall_score: 87,
    risk_level: 'Low',
    last_summary_date: '2024-12-01',
    otd_percentage: 94.5,
    defect_rate: 1.2,
    contract_adherence: 98,
    total_spend: 2450000,
  },
  {
    supplier_id: 'SUP002',
    name: 'Beta Plastics Inc.',
    region: 'Asia Pacific',
    contact_person: 'Wei Chen',
    email: 'w.c****@beta.com',
    overall_score: 72,
    risk_level: 'Medium',
    last_summary_date: '2024-12-02',
    otd_percentage: 82.3,
    defect_rate: 3.8,
    contract_adherence: 89,
    total_spend: 1820000,
  },
  {
    supplier_id: 'SUP003',
    name: 'Gamma Electronics Co.',
    region: 'Europe',
    contact_person: 'Hans Mueller',
    email: 'h.m****@gamma.de',
    overall_score: 91,
    risk_level: 'Low',
    last_summary_date: '2024-12-03',
    otd_percentage: 96.8,
    defect_rate: 0.8,
    contract_adherence: 99,
    total_spend: 3200000,
  },
  {
    supplier_id: 'SUP004',
    name: 'Delta Manufacturing',
    region: 'South America',
    contact_person: 'Maria Santos',
    email: 'm.s****@delta.br',
    overall_score: 58,
    risk_level: 'High',
    last_summary_date: '2024-12-01',
    otd_percentage: 71.2,
    defect_rate: 5.6,
    contract_adherence: 78,
    total_spend: 980000,
  },
  {
    supplier_id: 'SUP005',
    name: 'Epsilon Materials',
    region: 'North America',
    contact_person: 'Sarah Johnson',
    email: 's.j****@epsilon.com',
    overall_score: 84,
    risk_level: 'Low',
    last_summary_date: '2024-12-04',
    otd_percentage: 91.5,
    defect_rate: 1.9,
    contract_adherence: 95,
    total_spend: 1650000,
  },
  {
    supplier_id: 'SUP006',
    name: 'Zeta Logistics Partners',
    region: 'Europe',
    contact_person: 'Pierre Dubois',
    email: 'p.d****@zeta.fr',
    overall_score: 79,
    risk_level: 'Medium',
    last_summary_date: '2024-12-02',
    otd_percentage: 85.7,
    defect_rate: 2.4,
    contract_adherence: 92,
    total_spend: 2100000,
  },
  {
    supplier_id: 'SUP007',
    name: 'Eta Precision Parts',
    region: 'Asia Pacific',
    contact_person: 'Takeshi Yamamoto',
    email: 't.y****@eta.jp',
    overall_score: 93,
    risk_level: 'Low',
    last_summary_date: '2024-12-04',
    otd_percentage: 98.2,
    defect_rate: 0.5,
    contract_adherence: 100,
    total_spend: 4500000,
  },
  {
    supplier_id: 'SUP008',
    name: 'Theta Industrial Supply',
    region: 'North America',
    contact_person: 'Michael Brown',
    email: 'm.b****@theta.com',
    overall_score: 65,
    risk_level: 'High',
    last_summary_date: '2024-12-01',
    otd_percentage: 76.4,
    defect_rate: 4.2,
    contract_adherence: 82,
    total_spend: 720000,
  },
  {
    supplier_id: 'SUP009',
    name: 'Iota Chemical Corp',
    region: 'Europe',
    contact_person: 'Emma Wilson',
    email: 'e.w****@iota.uk',
    overall_score: 88,
    risk_level: 'Low',
    last_summary_date: '2024-12-03',
    otd_percentage: 93.1,
    defect_rate: 1.5,
    contract_adherence: 96,
    total_spend: 2890000,
  },
  {
    supplier_id: 'SUP010',
    name: 'Kappa Fasteners Ltd',
    region: 'Asia Pacific',
    contact_person: 'Li Wei',
    email: 'l.w****@kappa.cn',
    overall_score: 76,
    risk_level: 'Medium',
    last_summary_date: '2024-12-02',
    otd_percentage: 84.9,
    defect_rate: 2.8,
    contract_adherence: 88,
    total_spend: 1350000,
  },
  {
    supplier_id: 'SUP011',
    name: 'Lambda Tech Solutions',
    region: 'North America',
    contact_person: 'David Lee',
    email: 'd.l****@lambda.com',
    overall_score: 82,
    risk_level: 'Low',
    last_summary_date: '2024-12-04',
    otd_percentage: 90.2,
    defect_rate: 1.8,
    contract_adherence: 94,
    total_spend: 1980000,
  },
  {
    supplier_id: 'SUP012',
    name: 'Mu Packaging Systems',
    region: 'South America',
    contact_person: 'Carlos Rodriguez',
    email: 'c.r****@mu.mx',
    overall_score: 69,
    risk_level: 'Medium',
    last_summary_date: '2024-12-01',
    otd_percentage: 79.8,
    defect_rate: 3.5,
    contract_adherence: 85,
    total_spend: 890000,
  },
];

export const alerts: Alert[] = [
  {
    alert_id: 'ALT001',
    supplier_id: 'SUP002',
    supplier_name: 'Beta Plastics Inc.',
    type: 'Delivery',
    severity: 'Critical',
    message: 'Critical Alert: 30% increase in lead time delays for component X over the past week. Potential impact on production line Y.',
    timestamp: '2024-12-04T09:15:00Z',
    status: 'New',
  },
  {
    alert_id: 'ALT002',
    supplier_id: 'SUP004',
    supplier_name: 'Delta Manufacturing',
    type: 'Quality',
    severity: 'High',
    message: 'Quality Alert: Defect rate exceeded 5% threshold. 12 defective units reported in last shipment batch.',
    timestamp: '2024-12-04T08:30:00Z',
    status: 'New',
  },
  {
    alert_id: 'ALT003',
    supplier_id: 'SUP008',
    supplier_name: 'Theta Industrial Supply',
    type: 'Contract',
    severity: 'Medium',
    message: 'Contract SLA breach: On-time delivery fell below 80% contractual minimum for 2 consecutive weeks.',
    timestamp: '2024-12-03T16:45:00Z',
    status: 'Reviewed',
  },
  {
    alert_id: 'ALT004',
    supplier_id: 'SUP006',
    supplier_name: 'Zeta Logistics Partners',
    type: 'Delivery',
    severity: 'Medium',
    message: 'Logistics delay detected: Port congestion in Rotterdam affecting 3 pending shipments.',
    timestamp: '2024-12-03T14:20:00Z',
    status: 'Reviewed',
  },
  {
    alert_id: 'ALT005',
    supplier_id: 'SUP010',
    supplier_name: 'Kappa Fasteners Ltd',
    type: 'Quality',
    severity: 'Low',
    message: 'Minor quality variance: Surface finish inconsistencies noted in 2% of inspected items.',
    timestamp: '2024-12-02T11:00:00Z',
    status: 'Resolved',
  },
];

export const performanceSummaries: Record<string, PerformanceSummary> = {
  'SUP001': {
    summary_id: 'SUM001',
    supplier_id: 'SUP001',
    summary_text: 'Alpha Components Ltd. has demonstrated strong performance over the past quarter. On-time delivery improved by 10% from the previous period, reaching 94.5%. However, a recent increase in packaging defect rate (+5% in the last 2 weeks) affecting Product Z warrants attention. Contract SLA compliance remains excellent at 98%. Recommended action: Schedule quality review meeting to address packaging concerns.',
    generated_date: '2024-12-04T10:00:00Z',
    key_insights: [
      'On-time delivery improved 10% quarter-over-quarter',
      'Packaging defect rate increased 5% in last 2 weeks',
      'Strong contract adherence at 98%',
      'Total spend YTD: $2.45M (within budget)',
    ],
    risk_flags: [
      'Packaging quality trend requires monitoring',
      'Single-source dependency for Component A',
    ],
    data_sources_used: ['PurchaseOrders', 'QualityReports', 'DeliveryLogs', 'Contracts'],
  },
  'SUP002': {
    summary_id: 'SUM002',
    supplier_id: 'SUP002',
    summary_text: 'Beta Plastics Inc. is showing concerning performance trends. Lead time delays have increased by 30% over the past week, primarily due to port congestion in the Asia Pacific region. Quality metrics remain stable but below target at 3.8% defect rate. Immediate action recommended to mitigate supply chain disruption risk for critical Component X.',
    generated_date: '2024-12-04T09:00:00Z',
    key_insights: [
      '30% increase in delivery delays this week',
      'Port congestion in APAC identified as root cause',
      'Defect rate stable at 3.8%',
      'Contract adherence at 89% (below 95% target)',
    ],
    risk_flags: [
      'Critical delivery delays affecting production',
      'Geographic concentration risk',
      'Contract SLA at risk of breach',
    ],
    data_sources_used: ['PurchaseOrders', 'DeliveryLogs', 'LogisticsData', 'Contracts'],
  },
  'SUP004': {
    summary_id: 'SUM004',
    supplier_id: 'SUP004',
    summary_text: 'Delta Manufacturing requires immediate attention. Performance has declined significantly with on-time delivery at 71.2% and defect rate at 5.6%. Root cause analysis indicates capacity constraints and quality control gaps. Recommend initiating supplier development program or identifying alternative sources.',
    generated_date: '2024-12-04T08:00:00Z',
    key_insights: [
      'On-time delivery critically low at 71.2%',
      'Defect rate exceeds acceptable threshold at 5.6%',
      'Contract adherence below minimum at 78%',
      'Capacity constraints identified',
    ],
    risk_flags: [
      'High risk of supply disruption',
      'Quality issues impacting downstream production',
      'Multiple SLA breaches recorded',
      'Financial stability concerns',
    ],
    data_sources_used: ['PurchaseOrders', 'QualityReports', 'DeliveryLogs', 'FinancialData'],
  },
};

export const purchaseOrders: PurchaseOrder[] = [
  { po_id: 'PO001', supplier_id: 'SUP001', order_date: '2024-11-15', delivery_due_date: '2024-12-01', actual_delivery_date: '2024-11-30', status: 'Delivered', total_value_usd: 125000 },
  { po_id: 'PO002', supplier_id: 'SUP001', order_date: '2024-11-20', delivery_due_date: '2024-12-05', actual_delivery_date: '2024-12-04', status: 'Delivered', total_value_usd: 89000 },
  { po_id: 'PO003', supplier_id: 'SUP001', order_date: '2024-11-28', delivery_due_date: '2024-12-10', actual_delivery_date: null, status: 'Shipped', total_value_usd: 156000 },
  { po_id: 'PO004', supplier_id: 'SUP002', order_date: '2024-11-10', delivery_due_date: '2024-11-25', actual_delivery_date: '2024-11-28', status: 'Delivered', total_value_usd: 78000 },
  { po_id: 'PO005', supplier_id: 'SUP002', order_date: '2024-11-22', delivery_due_date: '2024-12-08', actual_delivery_date: null, status: 'Shipped', total_value_usd: 92000 },
];

export const qualityReports: QualityReport[] = [
  { report_id: 'QR001', po_id: 'PO001', supplier_id: 'SUP001', inspection_date: '2024-11-30', defect_count: 12, total_inspected_quantity: 1000, defect_type: 'Packaging', severity: 'Low' },
  { report_id: 'QR002', po_id: 'PO002', supplier_id: 'SUP001', inspection_date: '2024-12-04', defect_count: 8, total_inspected_quantity: 800, defect_type: 'Dimensional', severity: 'Medium' },
  { report_id: 'QR003', po_id: 'PO004', supplier_id: 'SUP002', inspection_date: '2024-11-28', defect_count: 35, total_inspected_quantity: 950, defect_type: 'Surface', severity: 'High' },
];

export const deliveryLogs: DeliveryLog[] = [
  { delivery_id: 'DL001', po_id: 'PO001', supplier_id: 'SUP001', shipment_date: '2024-11-25', received_date: '2024-11-30', transport_mode: 'Air', delivery_status: 'OnTime', delay_days: 0, damage_reported: false },
  { delivery_id: 'DL002', po_id: 'PO002', supplier_id: 'SUP001', shipment_date: '2024-11-30', received_date: '2024-12-04', transport_mode: 'Sea', delivery_status: 'OnTime', delay_days: 0, damage_reported: false },
  { delivery_id: 'DL003', po_id: 'PO004', supplier_id: 'SUP002', shipment_date: '2024-11-18', received_date: '2024-11-28', transport_mode: 'Sea', delivery_status: 'Delayed', delay_days: 3, damage_reported: false },
];

// AI Agent Configuration
export const aiAgent = {
  name: 'VendorVerse AI Assistant',
  version: '2.1.0',
  description: 'Advanced AI-powered analytics engine for supplier performance monitoring and risk detection.',
  capabilities: [
    'Real-time performance anomaly detection',
    'Natural language summary generation',
    'Predictive risk scoring',
    'Root cause analysis',
    'Contract compliance monitoring',
    'Trend forecasting',
  ],
  models_used: [
    { name: 'Performance Analyzer', type: 'Time Series Analysis', accuracy: '94.2%' },
    { name: 'Risk Predictor', type: 'Classification Model', accuracy: '91.8%' },
    { name: 'Summary Generator', type: 'Large Language Model', accuracy: '96.5%' },
    { name: 'Anomaly Detector', type: 'Unsupervised Learning', accuracy: '89.3%' },
  ],
  data_refresh_interval: '15 minutes',
  last_model_update: '2024-12-01',
};
