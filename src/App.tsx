import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TopNav } from "@/components/TopNav";
import { AIMentor } from "@/components/AIMentor";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Assessments from "./pages/Assessments";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import CodingAssessment from "./pages/CodingAssessment";
import CareerPath from "./pages/CareerPath";
import Upskilling from "./pages/Upskilling";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <TopNav />
    <main className="flex-1">{children}</main>
    <AIMentor />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/assessments" element={<ProtectedRoute><AppLayout><Assessments /></AppLayout></ProtectedRoute>} />
          <Route path="/assessment/:id" element={<ProtectedRoute><AppLayout><Assessment /></AppLayout></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><AppLayout><Results /></AppLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
          <Route path="/coding-assessment" element={<ProtectedRoute><AppLayout><CodingAssessment /></AppLayout></ProtectedRoute>} />
          <Route path="/career-path" element={<ProtectedRoute><AppLayout><CareerPath /></AppLayout></ProtectedRoute>} />
          <Route path="/upskilling" element={<ProtectedRoute><AppLayout><Upskilling /></AppLayout></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
