import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from './pages/HomePage';
import { SearchResults } from './pages/SearchResults';
import { SchoolProfile } from './pages/SchoolProfile';
import { Comparison } from './pages/Comparison';
import { AIMatching } from './pages/AIMatching';
import { FinancingHub } from './pages/FinancingHub';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { AdminDashboard } from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import WeatherAlerts from './pages/WeatherAlerts';
import Inquiries from './pages/Inquiries';
import Reviews from './pages/Reviews';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastProvider';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public Routes - Marketplace */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/search" element={<Layout><SearchResults /></Layout>} />
                <Route path="/schools/:slug" element={<Layout><SchoolProfile /></Layout>} />
                <Route path="/compare" element={<Layout><Comparison /></Layout>} />
                <Route path="/find-match" element={<Layout><AIMatching /></Layout>} />
                <Route path="/financing" element={<Layout><FinancingHub /></Layout>} />
                
                {/* Auth Routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                
                {/* Admin Routes (Platform Admins Only) */}
                <Route path="/admin/dashboard" element={<Layout><AdminRoute><AdminDashboard /></AdminRoute></Layout>} />
                
                {/* Protected Routes - School Portal (School Admins) */}
                <Route path="/portal/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
                <Route path="/portal/bookings" element={<Layout><ProtectedRoute><Bookings /></ProtectedRoute></Layout>} />
                <Route path="/portal/weather" element={<Layout><ProtectedRoute><WeatherAlerts /></ProtectedRoute></Layout>} />
                <Route path="/portal/inquiries" element={<Layout><ProtectedRoute><Inquiries /></ProtectedRoute></Layout>} />
                <Route path="/portal/reviews" element={<Layout><ProtectedRoute><Reviews /></ProtectedRoute></Layout>} />
              </Routes>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
