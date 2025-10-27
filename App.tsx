
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageExpenses from './pages/admin/ManageExpenses';
import ManagePartners from './pages/admin/ManagePartners';
import ReceptionLayout from './components/layout/ReceptionLayout';
import ReceptionDashboard from './pages/reception/ReceptionDashboard';
import AddAdmission from './pages/reception/AddAdmission';
import ReceptionExpenses from './pages/reception/ReceptionExpenses';
import PartnerLayout from './components/layout/PartnerLayout';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import { UserRole } from './types';

const AdminRoutes: React.FC = () => (
  <AdminLayout>
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="students" element={<ManageStudents />} />
      <Route path="teachers" element={<ManageTeachers />} />
      <Route path="expenses" element={<ManageExpenses />} />
      <Route path="partners" element={<ManagePartners />} />
      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  </AdminLayout>
);

const ReceptionRoutes: React.FC = () => (
  <ReceptionLayout>
    <Routes>
      <Route path="dashboard" element={<ReceptionDashboard />} />
      <Route path="admissions" element={<AddAdmission />} />
      <Route path="expenses" element={<ReceptionExpenses />} />
      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  </ReceptionLayout>
);

const PartnerRoutes: React.FC = () => (
  <PartnerLayout>
    <Routes>
      <Route path="dashboard" element={<PartnerDashboard />} />
      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  </PartnerLayout>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode, requiredRole: UserRole }> = ({ children, requiredRole }) => {
    const { user } = useAuth();
    if (!user || user.role !== requiredRole) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};


const AppContent: React.FC = () => {
    const { user } = useAuth();

    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<ProtectedRoute requiredRole='admin'><AdminRoutes /></ProtectedRoute>} />
        <Route path="/reception/*" element={<ProtectedRoute requiredRole='reception'><ReceptionRoutes /></ProtectedRoute>} />
        <Route path="/partner/*" element={<ProtectedRoute requiredRole='partner'><PartnerRoutes /></ProtectedRoute>} />
        <Route
            path="*"
            element={
                !user ? <Navigate to="/login" /> :
                user.role === 'admin' ? <Navigate to="/admin" /> :
                user.role === 'reception' ? <Navigate to="/reception" /> :
                <Navigate to="/partner" />
            }
        />
      </Routes>
    );
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;