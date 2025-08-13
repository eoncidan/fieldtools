import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { MobileNavigation } from './components/Layout/MobileNavigation';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Checklist } from './pages/Checklist';
import { Reports } from './pages/Reports';
import { Agenda } from './pages/Agenda';
import { Notes } from './pages/Notes';
import { GDC } from './pages/GDC';
import { Settings } from './pages/Settings';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Navigation className="desktop-only" />
        <main className="flex-1 p-4 md:p-6 mobile-container md:pb-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/gdc" element={<GDC />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
      <MobileNavigation className="mobile-only" />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;