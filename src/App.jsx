import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/Auth/AuthForm';
import Dashboard from './components/Dashboard/Dashboard';

function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return currentUser ? <Dashboard /> : <AuthForm />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;