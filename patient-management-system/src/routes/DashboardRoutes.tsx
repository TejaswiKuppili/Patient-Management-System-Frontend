// src/features/dashboard/routes/DashboardRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import AssignRoles from '../components/AssignRoles/AssignRoles';
import Patients from '../components/Patients/Patients';
import Appointments from '../components/Appointments/Appointments';
import DoctorCalendar from '../components/Appointments/DoctorCalendar';
import ProfilePage from '../components/Profile/ProfilePage';
import ProtectedRoute from '../features/auth/ProtectedRoute';

// This component defines the routes for the dashboard section of the application.
const DashboardRoutes = () => {
  return (
    <Routes>
      <Route
        path="assign-roles"
        element={
          <ProtectedRoute>
            <AssignRoles />
          </ProtectedRoute>
        }
      />
      <Route
        path="patients"
        element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        }
      />
      <Route
        path="appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/:doctorId/:doctorName"
        element={
          <ProtectedRoute>
            <DoctorCalendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default DashboardRoutes;
