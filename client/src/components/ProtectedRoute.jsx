import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0f] flex items-center justify-center flex-col gap-4">
        <div className="font-mono text-[#00ff88] text-xl tracking-widest animate-pulse drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]">
          INITIALIZING SESSION...
        </div>
        <div className="w-64 h-1 bg-gray-800 rounded overflow-hidden">
          <div className="h-full bg-[#00ff88] w-1/2 animate-[slide_1s_ease-in-out_infinite_alternate]"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
