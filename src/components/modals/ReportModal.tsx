import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Supplier } from '@/services/api';
import { performanceSummaries } from '@/data/mockData';

interface ReportModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({ supplier, isOpen, onClose }: ReportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [report, setReport] = useState<typeof performanceSummaries['SUP001'] | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && supplier) {
      setIsGenerating(true);
      setReport(null);
      
      // Simulate AI generation delay
      const timer = setTimeout(() => {
        const summary = performanceSummaries[supplier.supplier_id] || {
          summary_id: `SUM_${supplier.supplier_id}`,
          supplier_id: supplier.supplier_id,
          summary_text: `${supplier.name} shows ${supplier.risk_level.toLowerCase()} risk profile with an overall score of ${supplier.overall_score}. On-time delivery stands at ${supplier.otd_percentage.toFixed(1)}% with a defect rate of ${supplier.defect_rate.toFixed(1)}%. Contract adherence is at ${supplier.contract_adherence}%. Continuous monitoring recommended.`,
          generated_date: new Date().toISOString(),
          key_insights: [
            `Overall performance score: ${supplier.overall_score}/100`,
            `On-time delivery rate: ${supplier.otd_percentage.toFixed(1)}%`,
            `Quality defect rate: ${supplier.defect_rate.toFixed(1)}%`,
            `Contract adherence: ${supplier.contract_adherence}%`,
          ],
          risk_flags: supplier.risk_level === 'Low' 
            ? ['No critical risks identified'] 
            : supplier.risk_level === 'Medium'
            ? ['Performance trending below target', 'Recommend quarterly review']
            : ['High risk - immediate attention required', 'Multiple KPIs below threshold'],
          data_sources_used: ['PurchaseOrders', 'QualityReports', 'DeliveryLogs', 'Contracts'],
        };
        setReport(summary);
        setIsGenerating(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, supplier]);

  const handleExportPDF = async () => {
    if (!reportRef.current || !supplier || !report) return;

    try {
      setIsExporting(true);

      const element = reportRef.current;
      
      // Capture the element as canvas with higher quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10;
      const imgWidth = pdfWidth - (2 * margin);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = margin;
      let pageCount = 0;

      // Add pages as needed
      while (heightLeft > 0) {
        if (pageCount > 0) {
          pdf.addPage();
        }
        
        // Calculate the source position for this page
        const sourceY = pageCount * (pdfHeight - 2 * margin) * (canvas.width / imgWidth);
        const sourceHeight = Math.min(
          (pdfHeight - 2 * margin) * (canvas.width / imgWidth),
          canvas.height - sourceY
        );
        
        // Create a canvas for this page section
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        const pageCtx = pageCanvas.getContext('2d');
        
        if (pageCtx) {
          pageCtx.drawImage(
            canvas,
            0, sourceY,
            canvas.width, sourceHeight,
            0, 0,
            canvas.width, sourceHeight
          );
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          const pageImgHeight = (sourceHeight * imgWidth) / canvas.width;
          
          pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, pageImgHeight);
        }
        
        heightLeft -= (pdfHeight - 2 * margin);
        pageCount++;
      }

      // Download the PDF
      const fileName = `${supplier.name.replace(/\s+/g, '_')}_Performance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      setIsExporting(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsExporting(false);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-title"
    >
      <div 
        className="card-base w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 id="report-title" className="text-lg font-semibold text-foreground">AI Performance Report</h2>
              <p className="text-sm text-muted-foreground">{supplier?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-btn" aria-label="Close modal">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 rounded-full border-3 border-muted border-t-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Generating AI report...</p>
              <p className="text-sm text-muted-foreground mt-1">Analyzing performance data</p>
            </div>
          ) : report ? (
            <div ref={reportRef} className="space-y-6 bg-white p-8 rounded-lg">
              {/* Report Header */}
              <div className="border-b-2 border-primary pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance Analysis Report</h1>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{supplier?.name}</p>
                    <p className="text-gray-500">Supplier ID: {supplier?.supplier_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Generated: {new Date(report.generated_date).toLocaleDateString()}</p>
                    <p className="text-gray-500">{new Date(report.generated_date).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              {/* Supplier Metrics Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs font-medium text-blue-600 uppercase mb-1">Overall Score</p>
                  <p className="text-2xl font-bold text-blue-900">{supplier?.overall_score}/100</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-green-600 uppercase mb-1">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-green-900">{supplier?.otd_percentage.toFixed(1)}%</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-xs font-medium text-amber-600 uppercase mb-1">Defect Rate</p>
                  <p className="text-2xl font-bold text-amber-900">{supplier?.defect_rate.toFixed(1)}%</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-xs font-medium text-purple-600 uppercase mb-1">Risk Level</p>
                  <p className="text-2xl font-bold text-purple-900">{supplier?.risk_level}</p>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">AI Analysis Summary</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">{report.summary_text}</p>
              </div>

              {/* Key Insights */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Key Insights</h3>
                </div>
                <div className="space-y-3">
                  {report.key_insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 text-base">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Flags */}
              <div className="bg-white border border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Risk Assessment</h3>
                </div>
                <div className="space-y-3">
                  {report.risk_flags.map((flag, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-md border-l-4 border-amber-600">
                      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                      </svg>
                      <p className="text-gray-700 text-base">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Sources */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Report Metadata</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Data Sources</p>
                    <p className="text-gray-700">{report.data_sources_used.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Report ID</p>
                    <p className="text-gray-700 font-mono">{report.summary_id}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  This report is confidential and intended for internal use only.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  © {new Date().getFullYear()} Supplier Sentinel - AI-Powered Supply Chain Analytics
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!isGenerating && report && (
          <div className="flex items-center justify-between gap-3 p-6 border-t border-border bg-muted/30 flex-shrink-0">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-muted transition-colors font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isExporting}
            >
              Close
            </button>
            <button 
              onClick={handleExportPDF} 
              className="flex items-center px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export PDF Report
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
