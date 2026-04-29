import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";

// Code-split every route so visiting /admin doesn't download the homepage bundle
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminHub = lazy(() => import("./pages/AdminHub"));
const TeacherReportForm = lazy(() => import("./pages/TeacherReportForm"));
const AdminSavedReports = lazy(() => import("./pages/AdminSavedReports"));
const OwnerLogin = lazy(() => import("./pages/OwnerLogin"));
const OwnerLogs = lazy(() => import("./pages/OwnerLogs"));
const OwnerReportView = lazy(() => import("./pages/OwnerReportView"));
const OwnerReportEdit = lazy(() => import("./pages/OwnerReportEdit"));
const OwnerDrafts = lazy(() => import("./pages/OwnerDrafts"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen bg-background" aria-hidden="true" />
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/hub" element={<AdminHub />} />
              <Route path="/admin/write" element={<TeacherReportForm />} />
              <Route path="/admin/saved" element={<AdminSavedReports />} />
              <Route path="/admin/owner" element={<OwnerLogin />} />
              <Route path="/admin/logs" element={<OwnerLogs />} />
              <Route path="/admin/logs/:id" element={<OwnerReportView />} />
              <Route path="/admin/logs/:id/edit" element={<OwnerReportEdit />} />
              <Route path="/admin/drafts" element={<OwnerDrafts />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
