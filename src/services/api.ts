const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://192.168.1.40:5000';

export interface ApiSupplier {
  supplier_id: string;
  name: string;
  region: string;
  contact_person: string;
  email_encrypted: string;
  email_masked: string | null;
  overall_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  last_summary_date: string;
  otd_percentage: number;
  defect_rate: number;
  contract_adherence: number;
  total_spend: number;
  category_name: string;
  sub_categories: string; // JSON string
}

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
  category_name?: string;
  sub_categories?: string[];
}

// API Response type for supplier detail endpoint
export interface ApiSupplierDetail {
  supplier: ApiSupplier[];
}

// API Response type for quality reports
export interface ApiQualityReport {
  defect_count: number;
  defect_type: string;
  inspection_date: string;
  po_id: string;
  report_id: string;
  severity: 'Low' | 'Medium' | 'High';
  supplier_id: string;
  total_inspected_quantity: number;
}

export interface ApiQualityResponse {
  quality: ApiQualityReport[];
}

// API Response type for delivery logs
export interface ApiDeliveryLog {
  defect_count: number;
  defect_type: string;
  inspection_date: string;
  po_id: string;
  report_id: string;
  severity: 'Low' | 'Medium' | 'High';
  supplier_id: string;
  total_inspected_quantity: number;
}

export interface ApiDeliveryResponse {
  delivery: ApiDeliveryLog[];
}

// Frontend types for quality and delivery
export interface QualityReport {
  report_id: string;
  po_id: string;
  supplier_id: string;
  inspection_date: string;
  defect_count: number;
  total_inspected_quantity: number;
  defect_type: string;
  severity: 'Low' | 'Medium' | 'High';
  defect_rate: number; // Calculated field
}

export interface DeliveryLog {
  report_id: string;
  po_id: string;
  supplier_id: string;
  inspection_date: string;
  defect_count: number;
  total_inspected_quantity: number;
  defect_type: string;
  severity: 'Low' | 'Medium' | 'High';
}

// API Response type for performance summaries
export interface ApiPerformanceSummary {
  summary_id: string;
  supplier_id: string;
  summary_text: string;
  generated_date: string;
  key_insights: string; // JSON string array
  risk_flags: string; // JSON string array
  data_sources_used: string; // JSON string array
}

export interface ApiPerformanceSummaryResponse {
  purchase_ord: ApiPerformanceSummary[];
}

// Frontend type for performance summary
export interface PerformanceSummary {
  summary_id: string;
  supplier_id: string;
  summary_text: string;
  generated_date: string;
  key_insights: string[];
  risk_flags: string[];
  data_sources_used: string[];
}

// Alert interface
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

// Dashboard Summary Response
export interface DashboardSummaryResponse {
  summary: {
    total_suppliers: number;
    average_score: number;
    at_risk_suppliers: number;
    active_alerts: number;
    critical_alerts: number;
  };
  topRiskSuppliers: ApiSupplier[];
  recentAlerts: Alert[];
}

export interface DashboardData {
  summary: {
    total_suppliers: number;
    average_score: number;
    at_risk_suppliers: number;
    active_alerts: number;
    critical_alerts: number;
  };
  topRiskSuppliers: Supplier[];
  recentAlerts: Alert[];
}

// Transform API response to frontend format
function transformSupplier(apiSupplier: ApiSupplier): Supplier {
  let subCategories: string[] = [];
  try {
    subCategories = JSON.parse(apiSupplier.sub_categories);
  } catch {
    subCategories = [];
  }

  return {
    supplier_id: apiSupplier.supplier_id,
    name: apiSupplier.name,
    region: apiSupplier.region,
    contact_person: apiSupplier.contact_person,
    email: apiSupplier.email_encrypted || apiSupplier.email_masked || '',
    overall_score: apiSupplier.overall_score,
    risk_level: apiSupplier.risk_level,
    last_summary_date: apiSupplier.last_summary_date,
    otd_percentage: apiSupplier.otd_percentage,
    defect_rate: apiSupplier.defect_rate,
    contract_adherence: apiSupplier.contract_adherence,
    total_spend: apiSupplier.total_spend,
    category_name: apiSupplier.category_name,
    sub_categories: subCategories,
  };
}

// Transform quality report from API format
function transformQualityReport(apiReport: ApiQualityReport): QualityReport {
  const defectRate = apiReport.total_inspected_quantity > 0
    ? (apiReport.defect_count / apiReport.total_inspected_quantity) * 100
    : 0;

  return {
    report_id: apiReport.report_id,
    po_id: apiReport.po_id,
    supplier_id: apiReport.supplier_id,
    inspection_date: apiReport.inspection_date,
    defect_count: apiReport.defect_count,
    total_inspected_quantity: apiReport.total_inspected_quantity,
    defect_type: apiReport.defect_type,
    severity: apiReport.severity,
    defect_rate: defectRate,
  };
}

// Transform delivery log from API format
function transformDeliveryLog(apiDelivery: ApiDeliveryLog): DeliveryLog {
  return {
    report_id: apiDelivery.report_id,
    po_id: apiDelivery.po_id,
    supplier_id: apiDelivery.supplier_id,
    inspection_date: apiDelivery.inspection_date,
    defect_count: apiDelivery.defect_count,
    total_inspected_quantity: apiDelivery.total_inspected_quantity,
    defect_type: apiDelivery.defect_type,
    severity: apiDelivery.severity,
  };
}

// Transform performance summary from API format
function transformPerformanceSummary(apiSummary: ApiPerformanceSummary): PerformanceSummary {
  let keyInsights: string[] = [];
  let riskFlags: string[] = [];
  let dataSources: string[] = [];

  try {
    keyInsights = JSON.parse(apiSummary.key_insights);
  } catch {
    keyInsights = [];
  }

  try {
    riskFlags = JSON.parse(apiSummary.risk_flags);
  } catch {
    riskFlags = [];
  }

  try {
    dataSources = JSON.parse(apiSummary.data_sources_used);
  } catch {
    dataSources = [];
  }

  return {
    summary_id: apiSummary.summary_id,
    supplier_id: apiSummary.supplier_id,
    summary_text: apiSummary.summary_text,
    generated_date: apiSummary.generated_date,
    key_insights: keyInsights,
    risk_flags: riskFlags,
    data_sources_used: dataSources,
  };
}

export const supplierService = {
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const url = `${API_BASE_URL}/supplier/dummy`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch suppliers: ${response.statusText}`);
      }
      
      const data: ApiSupplier[] = await response.json();
      const transformed = data.map(transformSupplier);
      
      return transformed;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  async getSupplierById(supplierId: string): Promise<Supplier | null> {
    try {
      const url = `${API_BASE_URL}/supplier`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplier_id: supplierId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch supplier: ${response.statusText}`);
      }
      
      const data: ApiSupplierDetail = await response.json();
      
      if (!data.supplier || data.supplier.length === 0) {
        return null;
      }
      
      return transformSupplier(data.supplier[0]);
    } catch (error) {
      console.error('Error fetching supplier by ID:', error);
      throw error;
    }
  },

  async getQualityReports(supplierId: string): Promise<QualityReport[]> {
    try {
      const url = `${API_BASE_URL}/supplier/quality`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplier_id: supplierId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quality reports: ${response.statusText}`);
      }
      
      const data: ApiQualityResponse = await response.json();
      return data.quality.map(transformQualityReport);
    } catch (error) {
      console.error('Error fetching quality reports:', error);
      throw error;
    }
  },

  async getDeliveryLogs(supplierId: string): Promise<DeliveryLog[]> {
    try {
      const url = `${API_BASE_URL}/supplier/delivery`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplier_id: supplierId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch delivery logs: ${response.statusText}`);
      }
      
      const data: ApiDeliveryResponse = await response.json();
      return data.delivery.map(transformDeliveryLog);
    } catch (error) {
      console.error('Error fetching delivery logs:', error);
      throw error;
    }
  },

  async getPerformanceSummaries(supplierId: string): Promise<PerformanceSummary[]> {
    try {
      const url = `${API_BASE_URL}/supplier/purchase-order`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplier_id: supplierId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch performance summaries: ${response.statusText}`);
      }
      
      const data: ApiPerformanceSummaryResponse = await response.json();
      return data.purchase_ord.map(transformPerformanceSummary);
    } catch (error) {
      console.error('Error fetching performance summaries:', error);
      throw error;
    }
  },

  async getDashboardSummary(): Promise<DashboardData> {
    try {
      const url = `${API_BASE_URL}/dashboard/summary`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard summary: ${response.statusText}`);
      }
      
      const data: DashboardSummaryResponse = await response.json();
      
      return {
        summary: data.summary,
        topRiskSuppliers: data.topRiskSuppliers.map(transformSupplier),
        recentAlerts: data.recentAlerts,
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  async getAlerts(activeOnly: boolean = false): Promise<Alert[]> {
    try {
      const url = `${API_BASE_URL}/alerts${activeOnly ? '?active=true' : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.statusText}`);
      }
      
      const data: { alerts: Alert[] } = await response.json();
      return data.alerts;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  async sendChatMessage(message: string, imageData?: string): Promise<string> {
    try {
      // If image is present, send to /image endpoint
      if (imageData) {
        const url = `${API_BASE_URL}/image`;
        
        // Convert base64 to blob
        const base64Response = await fetch(imageData);
        const blob = await base64Response.blob();
        
        const formData = new FormData();
        formData.append('file', blob, 'image.jpg');
        formData.append('message', message);
        
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to send chat message: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Handle array response
        if (Array.isArray(data)) {
          return data[0] || 'No response from server';
        }
        
        return data.response || data.message || 'No response from server';
      }
      
      // Send text-only message to /chat endpoint
      const url = `${API_BASE_URL}/chat`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send chat message: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle array response
      if (Array.isArray(data)) {
        return data[0] || 'No response from server';
      }
      
      return data.response || data.message || 'No response from server';
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },
};
