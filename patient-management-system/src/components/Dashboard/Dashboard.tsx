import { Box, AppBar, Toolbar, Typography, Button, Stack, IconButton, colors } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import DashboardRoutes from '../../routes/DashboardRoutes';
import { CustomButton } from '../common/Custom';
import { useAuthContext } from '../../features/auth/AuthProvider';

const dashboardNavButtonStyle = {
  font: '12px Roboto, sans-serif',
  fontWeight: 'bold',
  color: '00b3b3',
  backgroundColor: '#D3EDE8',
  '&:hover': { backgroundColor: '#F5FBF9' },
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const userRole = user?.roleName;
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
          {userRole === 'Admin' && (
            <>
              <CustomButton component={Link} to="/dashboard/assign-roles" sx={dashboardNavButtonStyle}>
                Assign Roles
              </CustomButton>
              <CustomButton component={Link} to="/dashboard/patients" sx={dashboardNavButtonStyle}>
                Patients List
              </CustomButton>
              <CustomButton component={Link} to="/dashboard/appointments" sx={dashboardNavButtonStyle}>
                Appointments
              </CustomButton>
            </>
          )}

          {userRole === 'Doctor' && (
            <>
              <CustomButton component={Link} to="/dashboard/my-patients" sx={dashboardNavButtonStyle}>
                My Patients
              </CustomButton>
              <CustomButton component={Link} to="/dashboard/my-appointments" sx={dashboardNavButtonStyle}>
                My Appointments
              </CustomButton>
            </>
          )}
        </Stack>
          {/* <Stack direction="row" spacing={3}>
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
          </Stack> */}

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