// src/features/dashboard/routes/DashboardRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import AssignRoles from '../components/AssignRoles/AssignRoles';
import Patients from '../components/Patients/Patients';
import Appointments from '../components/Appointments/Appointments';
import MedicalRecords from '../components/MedicalRecords/MedicalRecords';
import DoctorCalendar from '../components/Appointments/DoctorCalendar';

// This component defines the routes for the dashboard section of the application.
const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="assign-roles" element={<AssignRoles />} />
      <Route path="patients" element={<Patients />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="/appointments/:doctorId/:doctorName" element={<DoctorCalendar />} />
      <Route path="medical-records" element={<MedicalRecords />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default DashboardRoutes;
