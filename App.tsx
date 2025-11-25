
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { CaseList } from './pages/cases/CaseList';
import { NewCase } from './pages/cases/NewCase';
import { CaseDetail } from './pages/cases/CaseDetail';
import { DivisionDashboard } from './pages/division/DivisionDashboard';
import { SubtaskDetail } from './pages/division/SubtaskDetail';
import { ExecutiveCockpit } from './pages/executive/ExecutiveCockpit';
import { ExecutiveKPI } from './pages/executive/ExecutiveKPI';
import { ExecutionList } from './pages/division/ExecutionList';
import { ExecutionDetail } from './pages/division/ExecutionDetail';
import { KnowledgeBase } from './pages/kb/KnowledgeBase';
import { UserManagement } from './pages/admin/UserManagement';
import { DivisionManagement } from './pages/admin/DivisionManagement';
import { useStore } from './store/useStore';
import './i18n';

// Simple Route Guard
const ProtectedRoute: React.FC<React.PropsWithChildren<{ allowedRoles: string[] }>> = ({ children, allowedRoles }) => {
  const { currentUser } = useStore();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role) && !allowedRoles.includes('all')) {
    // If admin, allow everything for simplicity in this mock
    if (currentUser.role === 'admin') return <>{children}</>;
    return <div className="p-8 text-center text-red-600 font-bold">Akses Ditolak (Role tidak sesuai)</div>;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/cases" replace />} />
          
          {/* Global Case List for All Roles */}
          <Route path="cases" element={
            <ProtectedRoute allowedRoles={['all', 'requester', 'reviewer', 'executive', 'admin']}>
              <CaseList />
            </ProtectedRoute>
          } />

          {/* Requester Routes */}
          <Route path="cases/new" element={
            <ProtectedRoute allowedRoles={['requester', 'admin']}>
              <NewCase />
            </ProtectedRoute>
          } />
          <Route path="cases/:id" element={
            <ProtectedRoute allowedRoles={['requester', 'reviewer', 'admin', 'executive']}>
              <CaseDetail />
            </ProtectedRoute>
          } />

          {/* Reviewer Routes */}
          <Route path="division" element={
            <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
              <DivisionDashboard />
            </ProtectedRoute>
          } />
          <Route path="division/subtasks/:id" element={
            <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
              <SubtaskDetail />
            </ProtectedRoute>
          } />
          <Route path="division/executions" element={
            <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
              <ExecutionList />
            </ProtectedRoute>
          } />
          <Route path="division/executions/:caseId" element={
            <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
              <ExecutionDetail />
            </ProtectedRoute>
          } />

          {/* Executive Routes */}
          <Route path="executive" element={
            <ProtectedRoute allowedRoles={['executive', 'admin']}>
              <ExecutiveCockpit />
            </ProtectedRoute>
          } />
          <Route path="executive/kpi" element={
            <ProtectedRoute allowedRoles={['executive', 'admin']}>
              <ExecutiveKPI />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="admin/users" element={
             <ProtectedRoute allowedRoles={['admin']}>
               <UserManagement />
             </ProtectedRoute>
          } />
          <Route path="admin/divisions" element={
             <ProtectedRoute allowedRoles={['admin']}>
               <DivisionManagement />
             </ProtectedRoute>
          } />

           {/* Shared Routes */}
           <Route path="kb" element={
            <ProtectedRoute allowedRoles={['all', 'requester', 'reviewer', 'executive', 'admin']}>
              <KnowledgeBase />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;