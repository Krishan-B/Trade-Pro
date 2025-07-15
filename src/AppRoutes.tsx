import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Landing from './pages/Landing';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Help from './pages/Help';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthPage from './features/auth/AuthPage';

// Protected pages
import Portfolio from './pages/Portfolio';
import Orders from './pages/Orders';
import Markets from './pages/Markets';
import Analytics from './pages/Analytics';
import News from './pages/News';
import LearningCenterPage from './pages/learn/LearningCenterPage';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';
import Account from './pages/Account';
import KycPage from './pages/kyc/KycPage';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Landing
              hero={{
                title: "Trade <span class='text-primary'>Smarter</span><br />Invest <span class='text-primary'>Wiser</span>",
                subtitle: "Access global markets with our advanced multi-asset trading platform. Trade stocks, crypto, forex, and more with institutional-grade tools.",
              }}
              features={[
                { title: "Enterprise Security", description: "Bank-grade encryption and security protocols to keep your assets and data safe" },
                { title: "Real-Time Analytics", description: "Live price updates and advanced charting tools to make informed decisions" },
                { title: "Multi-Asset Platform", description: "Trade stocks, crypto, forex, commodities, and indices all from one account" },
                { title: "Fast Execution", description: "Lightning-fast order execution with minimal slippage across all markets" },
                { title: "Global Access", description: "Access markets worldwide with 24/7 trading on selected assets and instruments" },
                { title: "Community Insights", description: "Learn from other traders and follow market sentiment with social features" },
              ]}
              pricing={[
                { plan: "basic", price: "$0", features: ["Standard market access", "Basic charting tools", "Market research", "5 watchlists"] },
                { plan: "pro", price: "$29", features: ["All Basic features", "Advanced charts and indicators", "Priority execution", "Unlimited watchlists", "API access"] },
                { plan: "enterprise", price: "Custom", features: ["All Pro features", "Institutional liquidity", "Dedicated support team", "Custom integrations", "Advanced risk management"] },
              ]}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/legal/terms" element={<Terms />} />
        <Route path="/legal/privacy" element={<Privacy />} />
        <Route path="/help" element={<Help />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/markets" element={<ProtectedRoute><Markets /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
        <Route path="/news/:category" element={<ProtectedRoute><News /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><LearningCenterPage /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/kyc" element={<ProtectedRoute><KycPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;