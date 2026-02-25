import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Editor from "./pages/Editor";
import NotFound from "./pages/NotFound";
import CoffeeDemo from "./pages/demos/CoffeeDemo";
import ConstructionDemo from "./pages/demos/ConstructionDemo";
import TechStoreDemo from "./pages/demos/TechStoreDemo";
import FitnessDemo from "./pages/demos/FitnessDemo";
import TravelDemo from "./pages/demos/TravelDemo";
import DesignDemo from "./pages/demos/DesignDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/demo/coffee" element={<CoffeeDemo />} />
          <Route path="/demo/construction" element={<ConstructionDemo />} />
          <Route path="/demo/techstore" element={<TechStoreDemo />} />
          <Route path="/demo/fitness" element={<FitnessDemo />} />
          <Route path="/demo/travel" element={<TravelDemo />} />
          <Route path="/demo/design" element={<DesignDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
