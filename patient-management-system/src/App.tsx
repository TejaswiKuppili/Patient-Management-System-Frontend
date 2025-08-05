import './App.css';
import { Register } from './features/auth/pages/Register/Register';
import { Login } from './features/auth/pages/Login/Login';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/variables.css';
import { Dashboard } from './components/Dashboard/Dashboard';
import ProtectedRoute from './features/auth/ProtectedRoute';
import AssignRoles from './components/AssignRoles/AssignRoles';
import { AuthProvider } from './features/auth/AuthProvider';
import { ToastContainer } from 'react-toastify';
import AccessPending from './features/auth/pages/AccessPending/AccessPending';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/access-pending" element={<AccessPending />} />
          <Route
            path="/"
            element={<ProtectedRoute>
              <AssignRoles />
            </ProtectedRoute>} />
        </Routes>
      </AuthProvider>
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </>
  );
}

export default App;
