import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Loading from './components/common/Loading';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/students/StudentList';
import AddStudent from './pages/students/AddStudent';
import EditStudent from './pages/students/EditStudent';
import StudentDetails from './pages/students/StudentDetails';
import DropoutList from './pages/dropouts/DropoutList';
import DropoutDetails from './pages/dropouts/DropoutDetails';
import RecordDropout from './pages/dropouts/RecordDropout';
import DropoutAnalysis from './pages/dropouts/DropoutAnalysis';
import PathwayList from './pages/pathways/PathwayList';
import CreatePathway from './pages/pathways/CreatePathway';
import PathwayDetails from './pages/pathways/PathwayDetails';
import Reports from './pages/reports/Reports';
import Profile from './pages/settings/Profile';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loading fullScreen text="Authenticating..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/students" element={<StudentList />} />
      <Route path="/students/add" element={<AddStudent />} />
      <Route path="/students/:id" element={<StudentDetails />} />
      <Route path="/students/:id/edit" element={<EditStudent />} />
      <Route path="/dropouts" element={<DropoutList />} />
      <Route path="/dropouts/:id" element={<DropoutDetails />} />
      <Route path="/dropouts/record" element={<RecordDropout />} />
      <Route path="/dropouts/analysis" element={<DropoutAnalysis />} />
      <Route path="/pathways" element={<PathwayList />} />
      <Route path="/pathways/create" element={<CreatePathway />} />
      <Route path="/pathways/:id" element={<PathwayDetails />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Profile />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', background: '#1e293b', color: '#f8fafc', fontSize: '14px' } }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
