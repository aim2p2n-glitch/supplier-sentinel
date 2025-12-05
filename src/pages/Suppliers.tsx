import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { SupplierTable } from '@/components/suppliers/SupplierTable';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { ReportModal } from '@/components/modals/ReportModal';
import { suppliers } from '@/data/mockData';

const ITEMS_PER_PAGE = 10;

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [reportSupplierId, setReportSupplierId] = useState<string | null>(null);

  const regions = useMemo(() => {
    const uniqueRegions = new Set(suppliers.map(s => s.region));
    return ['all', ...Array.from(uniqueRegions)];
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.supplier_id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRisk = riskFilter === 'all' || supplier.risk_level === riskFilter;
      const matchesRegion = regionFilter === 'all' || supplier.region === regionFilter;

      return matchesSearch && matchesRisk && matchesRegion;
    });
  }, [searchQuery, riskFilter, regionFilter]);

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
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Supplier Management</h1>
          <p className="text-muted-foreground">
            View and manage all suppliers in your network.
          </p>
        </motion.header>

        {/* Filters */}
        <motion.div 
          className="card-base p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, ID, or region..."
              />
            </div>
            
            <div className="flex gap-4">
              <div className="w-40">
                <label htmlFor="risk-filter" className="sr-only">Filter by Risk Level</label>
                <select
                  id="risk-filter"
                  value={riskFilter}
                  onChange={(e) => {
                    setRiskFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="input-base"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                </select>
              </div>
              
              <div className="w-48">
                <label htmlFor="region-filter" className="sr-only">Filter by Region</label>
                <select
                  id="region-filter"
                  value={regionFilter}
                  onChange={(e) => {
                    setRegionFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="input-base"
                >
                  <option value="all">All Regions</option>
                  {regions.slice(1).map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Supplier Table */}
        <motion.section 
          className="card-base overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-4 border-b border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''}
            </p>
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

      <ReportModal
        supplier={selectedSupplier}
        isOpen={!!reportSupplierId}
        onClose={() => setReportSupplierId(null)}
      />
    </MainLayout>
  );
};

export default Suppliers;
