import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AIMentor } from "@/components/AIMentor";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import CodingAssessment from "./pages/CodingAssessment";
import CareerPath from "./pages/CareerPath";
import Upskilling from "./pages/Upskilling";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <SidebarTrigger />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
      <AIMentor />
    </div>
  </SidebarProvider>
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
