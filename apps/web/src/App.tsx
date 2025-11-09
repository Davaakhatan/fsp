import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from './pages/HomePage';
import { SearchResults } from './pages/SearchResults';
import { SchoolProfile } from './pages/SchoolProfile';
import { Comparison } from './pages/Comparison';
import { AIMatching } from './pages/AIMatching';
import { FinancingHub } from './pages/FinancingHub';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastProvider';
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
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/schools/:slug" element={<SchoolProfile />} />
                <Route path="/compare" element={<Comparison />} />
                <Route path="/find-match" element={<AIMatching />} />
                <Route path="/financing" element={<FinancingHub />} />
              </Routes>
            </Layout>
          </Router>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
