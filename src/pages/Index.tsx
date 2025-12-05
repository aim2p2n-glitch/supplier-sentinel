import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { TopRiskSuppliers } from '@/components/dashboard/TopRiskSuppliers';
import { RecentAlerts } from '@/components/dashboard/RecentAlerts';
import { SupplierTable } from '@/components/suppliers/SupplierTable';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { ReportModal } from '@/components/modals/ReportModal';
import { ChatBot } from '@/components/chat/ChatBot';
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
      <div className="p-6 lg:p-8 space-y-8 relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="transform transition-all duration-500 hover:scale-[1.01]"
        >
          {/* <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, <span className="text-gradient">Mihika</span>
          </h1> */}
          <p className="text-muted-foreground">
            Monitor supplier performance, identify risks, and make data-driven decisions.
          </p>
        </motion.header>

        {/* Summary Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          aria-labelledby="summary-heading"
        >
          <h2 id="summary-heading" className="sr-only">Performance Summary</h2>
          <SummaryCards suppliers={suppliers} alerts={alerts} />
        </motion.section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="transform transition-all duration-300 hover:shadow-2xl"
          >
            <TopRiskSuppliers suppliers={suppliers} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="transform transition-all duration-300 hover:shadow-2xl"
          >
            <RecentAlerts alerts={alerts} />
          </motion.div>
        </div>

        {/* Supplier List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          aria-labelledby="suppliers-heading" 
          className="card-base overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
        >
          <div className="p-6 border-b border-border backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 id="suppliers-heading" className="text-lg font-semibold text-foreground">All Suppliers</h2>
                <p className="text-sm text-muted-foreground">{filteredSuppliers.length} suppliers found</p>
              </div>
              <div className="w-full sm:w-72 transform transition-all duration-300 hover:scale-105">
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
        </motion.section>
      </div>

      {/* Report Modal */}
      <ReportModal
        supplier={selectedSupplier}
        isOpen={!!reportSupplierId}
        onClose={() => setReportSupplierId(null)}
      />

      {/* Chatbot */}
      <ChatBot />
    </MainLayout>
  );
};

export default Index;
