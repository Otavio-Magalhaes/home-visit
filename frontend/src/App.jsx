import React from 'react';
import { Routes, Route } from 'react-router-dom';


// Import do Componente de Proteção
import { PrivateRoute } from './components/PrivateRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login'

function App() {
  return (
    <Routes>
      {/* Rota Pública - Login */}
      <Route path="/" element={ <Login/>} />
      
      {/* Rota Protegida - Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;