import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Activities from './pages/Activities';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <Navbar />
      
      <main className="main-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
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
              path="/calculator" 
              element={
                <ProtectedRoute>
                  <Calculator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/activities" 
              element={
                <ProtectedRoute>
                  <Activities />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/achievements" 
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
