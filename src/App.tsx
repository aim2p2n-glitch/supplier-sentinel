import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import Suppliers from "./pages/Suppliers";
import SupplierDetail from "./pages/SupplierDetail";
import Alerts from "./pages/Alerts";
import Agent from "./pages/Agent";
import NotFound from "./pages/NotFound";
import IncidentsPage from "./pages/Incidents";
import SLAMonitor from "./pages/SLAMonitor";
import Interventions from "./pages/Interventions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/suppliers/:id" element={<SupplierDetail />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/sla-monitor" element={<SLAMonitor />} />
          <Route path="/interventions" element={<Interventions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
