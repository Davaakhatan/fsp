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
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import WeatherAlerts from './pages/WeatherAlerts';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
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
                
                {/* Protected Routes - School Portal */}
                <Route path="/portal/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
                <Route path="/portal/bookings" element={<Layout><ProtectedRoute><Bookings /></ProtectedRoute></Layout>} />
                <Route path="/portal/weather" element={<Layout><ProtectedRoute><WeatherAlerts /></ProtectedRoute></Layout>} />
              </Routes>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
