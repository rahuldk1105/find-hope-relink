
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import RelativeDashboard from "./pages/RelativeDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import ReportMissing from "./pages/ReportMissing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/role-select" element={<RoleSelect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/relative-dashboard" element={<RelativeDashboard />} />
          <Route path="/police-dashboard" element={<PoliceDashboard />} />
          <Route path="/report-missing" element={<ReportMissing />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
