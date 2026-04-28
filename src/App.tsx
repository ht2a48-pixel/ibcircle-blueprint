import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminReports from "./pages/AdminReports";
import AdminHub from "./pages/AdminHub";
import TeacherReportForm from "./pages/TeacherReportForm";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerLogs from "./pages/OwnerLogs";
import OwnerReportView from "./pages/OwnerReportView";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/hub" element={<AdminHub />} />
            <Route path="/admin/write" element={<TeacherReportForm />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/owner" element={<OwnerLogin />} />
            <Route path="/admin/logs" element={<OwnerLogs />} />
            <Route path="/admin/logs/:id" element={<OwnerReportView />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
