import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import TypingTest from './pages/TypingTest';
import Missions from './pages/Missions';
import Results from './pages/Results';
import DailyChallenge from './pages/DailyChallenge';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/test"
            element={
              <ProtectedRoute>
                <TypingTest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/missions"
            element={
              <ProtectedRoute>
                <Missions />
              </ProtectedRoute>
            }
          />
          <Route
  path="/results"
  element={
    <ProtectedRoute>
      <Results />
    </ProtectedRoute>
  }
/>
<Route
  path="/daily-challenge"
  element={
    <ProtectedRoute>
      <DailyChallenge />
    </ProtectedRoute>
  }
/>
          {/* Default */}
          <Route
            path="/"
            element={<Landing />}
          />

          {/* Unknown routes */}
          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;