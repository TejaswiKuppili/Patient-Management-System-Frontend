import { Box, AppBar, Toolbar, Typography, Button, Stack, IconButton, colors } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import DashboardRoutes from '../../routes/DashboardRoutes';
import { CustomButton } from '../common/Custom';

const dashboardNavButtonStyle = {
  font: '12px Roboto, sans-serif',
  fontWeight: 'bold',
  color: '00b3b3',
  backgroundColor: '#D3EDE8',
  '&:hover': { backgroundColor: '#F5FBF9' },
};

export const Dashboard = ({ user }: { user?: { name?: string } }) => {
  const navigate = useNavigate();

  const logout = () => {
    // Clear auth tokens or session logic
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Box className="dashboard-container">
      <AppBar position="sticky" color="default" elevation={10}
      sx={{ backgroundColor: '#D3EDE8', top: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={3}>
            <CustomButton component={Link} to="/dashboard/assign-roles"
            sx={dashboardNavButtonStyle}>
              Assign Roles
            </CustomButton>
            <CustomButton component={Link} to="/dashboard/patients"
            sx={dashboardNavButtonStyle}>
              Patients List
            </CustomButton>
            <CustomButton component={Link} to="/dashboard/appointments"
            sx={dashboardNavButtonStyle}>
              Appointments
            </CustomButton>
            <CustomButton component={Link} to="/dashboard/medical-records"
            sx={dashboardNavButtonStyle}>
              Medical Records
            </CustomButton>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <CustomButton
              component={Link}
              to="/dashboard/profile"
              startIcon={<FontAwesomeIcon icon={faUser} />}
              sx={dashboardNavButtonStyle}
            >
              Profile
            </CustomButton>
            <CustomButton
              onClick={logout}
              sx={dashboardNavButtonStyle}
            >
              Logout
            </CustomButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box className="dashboard-content" sx={{ p: 3 }}>
        <DashboardRoutes />
      </Box>
    </Box>
  );
};



// import { Link, Outlet, Routes, Route } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser } from '@fortawesome/free-solid-svg-icons';
// import DashboardRoutes from '../../routes/DashboardRoutes';
// import './Dashboard.css';
// import { logout } from '../../features/auth/api/authApi';

// // This component serves as the main dashboard layout for authenticated users.
// export const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <nav className="dashboard-tabs">
//         <div className="tabs-left">
//           <Link to="/dashboard/assign-roles">Assign Roles</Link>
//           <Link to="/dashboard/patients">Patients List</Link>
//           <Link to="/dashboard/appointments">Appointments</Link>
//           <Link to="/dashboard/medical-records">Medical Records</Link>
//         </div>
//         <div className="tabs-right">
//           <Link to="/dashboard/profile" className="profile-link">
//             <FontAwesomeIcon icon={faUser} className="profile-icon" />
//              Profile
//           </Link>
//           {/* <button className="logout-btn" onClick={logout}>Logout</button> */}
//           <Link to="/login" className="logout-btn" onClick={logout}>Logout</Link>
//         </div>
//       </nav>

//       <div className="dashboard-content">
//         <DashboardRoutes />
//       </div>
//     </div>
//   );
// };
