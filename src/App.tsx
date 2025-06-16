
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import PoliceLogin from "./pages/PoliceLogin";
import RelativeRegister from "./pages/RelativeRegister";
import RelativeDashboard from "./pages/RelativeDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import ReportMissing from "./pages/ReportMissing";
import MyReports from "./pages/MyReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/role-select" element={<RoleSelect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/police-login" element={<PoliceLogin />} />
            <Route path="/relative-register" element={<RelativeRegister />} />
            <Route path="/relative-dashboard" element={
              <ProtectedRoute>
                <RelativeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/police-dashboard" element={
              <ProtectedRoute>
                <PoliceDashboard />
              </ProtectedRoute>
            } />
            <Route path="/report-missing" element={
              <ProtectedRoute>
                <ReportMissing />
              </ProtectedRoute>
            } />
            <Route path="/my-reports" element={
              <ProtectedRoute>
                <MyReports />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
