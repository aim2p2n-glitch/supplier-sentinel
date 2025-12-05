import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { TopRiskSuppliers } from '@/components/dashboard/TopRiskSuppliers';
import { RecentAlerts } from '@/components/dashboard/RecentAlerts';
import { SupplierTable } from '@/components/suppliers/SupplierTable';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { ReportModal } from '@/components/modals/ReportModal';
import { suppliers, alerts } from '@/data/mockData';

const ITEMS_PER_PAGE = 5;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reportSupplierId, setReportSupplierId] = useState<string | null>(null);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.supplier_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleGenerateReport = (supplierId: string) => {
    setReportSupplierId(supplierId);
  };

  const selectedSupplier = reportSupplierId 
    ? suppliers.find(s => s.supplier_id === reportSupplierId) || null
    : null;

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <header className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, <span className="text-gradient">Procurement Manager</span>
          </h1>
          <p className="text-muted-foreground">
            Monitor supplier performance, identify risks, and make data-driven decisions.
          </p>
        </header>

        {/* Summary Cards */}
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">Performance Summary</h2>
          <SummaryCards suppliers={suppliers} alerts={alerts} />
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopRiskSuppliers suppliers={suppliers} />
          <RecentAlerts alerts={alerts} />
        </div>

        {/* Supplier List */}
        <section aria-labelledby="suppliers-heading" className="card-base overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 id="suppliers-heading" className="text-lg font-semibold text-foreground">All Suppliers</h2>
                <p className="text-sm text-muted-foreground">{filteredSuppliers.length} suppliers found</p>
              </div>
              <div className="w-full sm:w-72">
                <SearchInput
                  value={searchQuery}
                  onChange={(value) => {
                    setSearchQuery(value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search suppliers..."
                />
              </div>
            </div>
          </div>

          <SupplierTable 
            suppliers={paginatedSuppliers} 
            onGenerateReport={handleGenerateReport}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredSuppliers.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </section>
      </div>

      {/* Report Modal */}
      <ReportModal
        supplier={selectedSupplier}
        isOpen={!!reportSupplierId}
        onClose={() => setReportSupplierId(null)}
      />
    </MainLayout>
  );
};

export default Index;
