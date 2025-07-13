import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';
import { TradePanelProvider } from '@/components/trade/TradePanelProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { TradingProvider } from '@/contexts/TradingContext';

// Pages

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Markets from '@/pages/Markets';
import Portfolio from '@/pages/Portfolio';
import Orders from '@/pages/Orders';
import News from '@/pages/News';
import Wallet from '@/pages/Wallet';
import Account from '@/pages/Account';
import ProfilePage from '@/pages/ProfilePage';
import Landing from '@/pages/Landing';
import KycPage from '@/pages/kyc/KycPage';
import KycReviewPage from '@/pages/admin/KycReviewPage';
import TradingPage from '@/pages/TradingPage';
import LeaderboardPage from '@/pages/leaderboard/LeaderboardPage';
import LearningCenterPage from '@/pages/learn/LearningCenterPage';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user && user.email && user.email.endsWith('@yourcompany.com');
  if (!isAdmin) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TradingProvider>
          <TradePanelProvider>
            <Router>
              <Routes>
              {/* Landing page is now the root */}
              <Route path="/" element={<Landing />} />
              {/* Auth page */}
              <Route path="/auth" element={<Auth />} />
              {/* Protected routes inside Layout */}
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="markets" element={<Markets />} />
                <Route
                  path="portfolio"
                  element={
                    <ProtectedRoute>
                      <Portfolio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route path="news" element={<News />} />
                <Route
                  path="wallet"
                  element={
                    <ProtectedRoute>
                      <Wallet />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="kyc"
                  element={
                    <ProtectedRoute>
                      <KycPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="trading"
                  element={
                    <ProtectedRoute>
                      <TradingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="leaderboard"
                  element={
                    <ProtectedRoute>
                      <LeaderboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="learn"
                  element={
                    <ProtectedRoute>
                      <LearningCenterPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
              <Route
                path="/admin/kyc-review"
                element={
                  <AdminRoute>
                    <KycReviewPage />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          <Toaster />
        </TradePanelProvider>
      </TradingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
