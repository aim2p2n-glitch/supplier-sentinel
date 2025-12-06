# Supplier Detail Page - Backend API Requirements

## Current Page: `/suppliers/:supplierId`

When clicking on a supplier (e.g., SUP-001), the detail page shows comprehensive information using **4 different data sources**:

---

## 📊 **Data Currently Being Displayed:**

### 1. **Supplier Basic Info** ✅ (Already using API)
- From: `GET /supplier/dummy` → filter by supplier_id
- Fields: name, region, supplier_id, contact_person, email, overall_score, risk_level, otd_percentage, defect_rate, contract_adherence, total_spend

---

### 2. **Performance Summary** (AI-Generated Summary)
Currently using: `performanceSummaries` mock data

**Fields Needed:**
```typescript
{
  summary_id: string;              // e.g., "SUM_SUP001_20241206"
  supplier_id: string;             // e.g., "SUP-001"
  summary_text: string;            // AI-generated paragraph about supplier performance
  generated_date: string;          // ISO date when summary was generated
  key_insights: string[];          // Array of bullet points (3-5 insights)
  risk_flags: string[];            // Array of risk warnings
  data_sources_used: string[];    // e.g., ["PurchaseOrders", "QualityReports"]
}
```

**Example:**
```json
{
  "summary_id": "SUM_SUP-001_20241206",
  "supplier_id": "SUP-001",
  "summary_text": "Acme Components Ltd. demonstrates strong performance with a low risk profile. Overall score of 87.5 reflects consistent delivery and quality metrics. On-time delivery at 95.2% exceeds industry standards. Defect rate of 0.8% is well below acceptable thresholds.",
  "generated_date": "2025-01-10T09:30:00Z",
  "key_insights": [
    "Overall performance score: 87.5/100",
    "On-time delivery rate: 95.2% (Above Target)",
    "Quality defect rate: 0.8% (Excellent)",
    "Contract adherence: 99.2% (Outstanding)"
  ],
  "risk_flags": [
    "No critical risks identified",
    "Performance trending positively"
  ],
  "data_sources_used": ["PurchaseOrders", "QualityReports", "DeliveryLogs", "Contracts"]
}
```

**Recommended Endpoint:**
```
GET /supplier/{supplierId}/summary
```

---

### 3. **Quality Reports** (Quality Tab)
Currently using: `qualityReports` mock data

**Fields Needed:**
```typescript
{
  report_id: string;                // e.g., "QR001"
  po_id: string;                    // Purchase order reference
  supplier_id: string;              // e.g., "SUP-001"
  inspection_date: string;          // ISO date
  defect_count: number;             // Number of defects found
  total_inspected_quantity: number; // Total items inspected
  defect_type: string;              // e.g., "Packaging Damage", "Component Failure"
  severity: 'Low' | 'Medium' | 'High';
}
```

**Example:**
```json
[
  {
    "report_id": "QR-2025-001",
    "po_id": "PO-12345",
    "supplier_id": "SUP-001",
    "inspection_date": "2025-01-05T10:00:00Z",
    "defect_count": 5,
    "total_inspected_quantity": 1000,
    "defect_type": "Minor Scratches",
    "severity": "Low"
  },
  {
    "report_id": "QR-2025-002",
    "po_id": "PO-12346",
    "supplier_id": "SUP-001",
    "inspection_date": "2025-01-08T14:30:00Z",
    "defect_count": 2,
    "total_inspected_quantity": 500,
    "defect_type": "Packaging Damage",
    "severity": "Low"
  }
]
```

**Recommended Endpoint:**
```
GET /supplier/{supplierId}/quality-reports
```

---

### 4. **Delivery Logs** (Delivery Tab)
Currently using: `deliveryLogs` mock data

**Fields Needed:**
```typescript
{
  delivery_id: string;               // e.g., "DL001"
  po_id: string;                     // Purchase order reference
  supplier_id: string;               // e.g., "SUP-001"
  shipment_date: string;             // ISO date when shipped
  received_date: string;             // ISO date when received
  transport_mode: string;            // e.g., "Air", "Sea", "Road"
  delivery_status: 'OnTime' | 'Delayed';
  delay_days: number;                // 0 if on time, positive if delayed
  damage_reported: boolean;
}
```

**Example:**
```json
[
  {
    "delivery_id": "DL-2025-001",
    "po_id": "PO-12345",
    "supplier_id": "SUP-001",
    "shipment_date": "2025-01-01T08:00:00Z",
    "received_date": "2025-01-05T10:30:00Z",
    "transport_mode": "Air Freight",
    "delivery_status": "OnTime",
    "delay_days": 0,
    "damage_reported": false
  },
  {
    "delivery_id": "DL-2025-002",
    "po_id": "PO-12346",
    "supplier_id": "SUP-001",
    "shipment_date": "2025-01-03T09:00:00Z",
    "received_date": "2025-01-10T15:00:00Z",
    "transport_mode": "Sea Freight",
    "delivery_status": "Delayed",
    "delay_days": 2,
    "damage_reported": false
  }
]
```

**Recommended Endpoint:**
```
GET /supplier/{supplierId}/delivery-logs
```

---

### 5. **Purchase Orders** (Currently not displayed in tabs, but available in mock data)
Currently using: `purchaseOrders` mock data

**Fields Needed:**
```typescript
{
  po_id: string;                    // e.g., "PO001"
  supplier_id: string;              // e.g., "SUP-001"
  order_date: string;               // ISO date
  delivery_due_date: string;        // ISO date
  actual_delivery_date: string | null; // ISO date or null if not delivered
  status: 'Ordered' | 'Shipped' | 'Delivered' | 'Cancelled';
  total_value_usd: number;          // Order value in USD
}
```

**Example:**
```json
[
  {
    "po_id": "PO-12345",
    "supplier_id": "SUP-001",
    "order_date": "2024-12-15T00:00:00Z",
    "delivery_due_date": "2025-01-05T00:00:00Z",
    "actual_delivery_date": "2025-01-05T10:30:00Z",
    "status": "Delivered",
    "total_value_usd": 50000.00
  },
  {
    "po_id": "PO-12346",
    "supplier_id": "SUP-001",
    "order_date": "2024-12-20T00:00:00Z",
    "delivery_due_date": "2025-01-08T00:00:00Z",
    "actual_delivery_date": "2025-01-10T15:00:00Z",
    "status": "Delivered",
    "total_value_usd": 75000.00
  }
]
```

**Recommended Endpoint:**
```
GET /supplier/{supplierId}/purchase-orders
```

---

## 📋 **Summary of Required Endpoints:**

| Endpoint | Method | Purpose | Priority |
|----------|--------|---------|----------|
| `/supplier/{supplierId}/summary` | GET | AI performance summary | HIGH |
| `/supplier/{supplierId}/quality-reports` | GET | Quality inspection data | HIGH |
| `/supplier/{supplierId}/delivery-logs` | GET | Delivery performance data | HIGH |
| `/supplier/{supplierId}/purchase-orders` | GET | Order history | MEDIUM |

---

## 🎯 **What's Displayed in Each Tab:**

### **Overview Tab:**
- Supplier basic info (already using API ✅)
- Performance score breakdown (calculated from basic info)
- AI Performance Summary (needs endpoint)
- Key Insights (needs endpoint)
- Risk Flags (needs endpoint)
- Monthly OTD trend chart (mock data - can be calculated from delivery logs)
- Monthly Defect trend chart (mock data - can be calculated from quality reports)

### **Quality Tab:**
- Defect Rate Trend Chart (calculated from quality reports)
- Recent Quality Reports list (needs endpoint)
- Shows: report_id, severity, defect count, inspection date

### **Delivery Tab:**
- Delivery Performance Chart (calculated from delivery logs)
- Recent Deliveries list (needs endpoint)
- Shows: delivery_id, status (On Time/Delayed), transport mode, received date

### **Contracts Tab:**
- Contract Adherence percentage (from supplier basic info ✅)
- SLA Terms (currently hardcoded - could be from backend later)

---

## 🔧 **How to Use These Endpoints:**

Once backend provides these endpoints, I'll update the code to:

1. Replace `performanceSummaries` mock with API call
2. Replace `qualityReports` mock with API call
3. Replace `deliveryLogs` mock with API call
4. Replace `purchaseOrders` mock with API call (if needed)

All will use React Query for caching and loading states, just like the supplier list! 🚀

---

## 📝 **Notes:**

- All dates should be in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`)
- The AI summary can be generated on backend using same LLM endpoint you're already using
- Quality reports and delivery logs should be sorted by date (most recent first)
- You can add pagination if there are many records (optional)
