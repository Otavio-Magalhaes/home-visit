import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import { DashboardLayout } from './components/layout/DashboardLayout';
import TeamManagement from './pages/Dashboard/TeamManagement';
import { MobileLayout } from './components/layout/MobileLayout';
import  AppHome  from './pages/App/Home'
import NewResidenceForm from './pages/App/Form/NewResidenceForm';
import NewResidentForm from './pages/App/Form/NewResidentForm'
import NewVisitWizard from './pages/App/Form/NewVisitWizardForm';
import { Toaster } from "@/components/ui/sonner"; 
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* GRUPO DE ROTAS PROTEGIDAS DO DASHBOARD */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              {/* O Layout envolve todas as rotas filhas */}
              <DashboardLayout /> 
            </PrivateRoute>
          } 
        >
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/equipe" element={<TeamManagement />} />
        </Route>
        <Route path="/app" element={<PrivateRoute><MobileLayout /></PrivateRoute>}>
          <Route path="home" element={<AppHome />} />
          <Route path="nova-residencia" element={<NewResidenceForm />} />
          <Route path="novo-morador" element={<NewResidentForm />} />
          <Route path="nova-visita" element={<NewVisitWizard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
    
  );
}

export default App;