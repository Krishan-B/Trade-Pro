import { AppProvider } from '@/contexts/AppContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import AppRoutes from '@/AppRoutes';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppRoutes />
        <Toaster />
      </AppProvider>
    </ThemeProvider>
  );
}
