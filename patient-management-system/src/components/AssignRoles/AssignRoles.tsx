import { useEffect, useState } from 'react';
import { deleteUser, updateUserRole } from '../../features/auth/api/userApi';
import useUsers from '../../features/hooks/useUsers';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  InputAdornment,
  TablePagination
} from '@mui/material';
import { Search, Delete, Edit } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { CustomButton, CustomContainer } from '../common/Custom';
import { toast } from 'react-toastify';
import { User } from '../../features/auth/types';

const AssignRoles = () => {
  const { users, roles, loading, error, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<{key: keyof typeof users[0] | null; direction: 'asc' | 'desc'}>({
    key: null,
    direction: 'asc'
  });
  const [message, setMessage] = useState('');
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState('');
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const currentRole = localStorage.getItem('Role');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
      setFilteredUsers(
        users.filter(user =>
          `${user.name}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, [users, searchTerm]);

    const handleSort = (key: keyof typeof users[0]) => {
      setSortConfig(prev => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    };

    const sortedUsers = [...filteredUsers].sort((a,b) => {
      if (!sortConfig.key) return 0;

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if(typeof aValue === 'string' && typeof bValue === 'string'){
        return sortConfig.direction === 'asc'
          ?aValue.localeCompare(bValue)
          :bValue.localeCompare(aValue);
      }
      return 0;
    })
    
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  if(currentRole !== 'Admin'){
    return <Navigate to="/unauthorized" />
  }

  const handleDeleteUser = async () => {
    try {
      if (!selectedUser) return;
  
      await deleteUser(selectedUser.id);
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    } finally {
      setShowDeleteUserDialog(false);
      setSelectedUser(null);
    }
  }

  const handleUpdate = async () => {
    if (!editUser) return;
    try {
      await updateUserRole(editUser.id, editRole);
      toast.success(`Role updated for user ${editUser.name}`);
      refetch(); // refresh user list
    } catch {
      toast.error('Failed to update role.');
    } finally {
      setShowEditUserDialog(false);
    }
  };

  return (
    <Box sx={{ p: 5, pb: 2, backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ color: '#007b83' }}>
          Assign Roles
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
                fullWidth
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                size="small"
                sx={{ width: '250px'}}
          />
        </Box>
      </Box>

      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : (
        <Box sx={{ mx: 'auto', mt: 3 }}>
          <TableContainer component={Paper}>
            <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort('name')} sx={{ cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
                  Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('email')} sx={{ cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
                  Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('roleName')} sx={{ cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
                  Current Role {sortConfig.key === 'roleName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            </Table>

            <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
              <Table>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell align="center" colSpan={4}>
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.roleName}</TableCell>
                      <TableCell>
                        <Box>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setEditUser(user);
                              setEditRole(user.roleName ?? '');
                              setShowEditUserDialog(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteUserDialog(true);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              </Table>
            </Box>
          </TableContainer>

          <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={filteredUsers.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
      )}

      {/* Edit User Dialog */}
      <Dialog
        open={showEditUserDialog}
        onClose={() => setShowEditUserDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            value={editUser?.name ?? ''}
            disabled
            fullWidth
          />
          <TextField
            label="Email"
            value={editUser?.email ?? ''}
            disabled
            fullWidth
          />
          <Select
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            fullWidth
          >
            {roles.map(role => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <CustomButton
            variant="outlined"
            onClick={() => setShowEditUserDialog(false)}
            sx={{ '&:hover': { borderColor: '#F5FBF9', color: '#F5FBF9' } }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="contained"
            onClick={handleUpdate}
          >
            Save
          </CustomButton>
        </DialogActions>
      </Dialog>
      {/* Delete User Dialog */}
      <Dialog
        open={showDeleteUserDialog}
        onClose={() => setShowDeleteUserDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Are you sure you want to delete user{' '}
            <strong>{selectedUser?.name ?? 'this user'}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <CustomButton variant="outlined" onClick={() => setShowDeleteUserDialog(false)}
          sx = {{'&:hover': { borderColor: '#F5FBF9', color: '#F5FBF9' }}}>
            Cancel
          </CustomButton>
          <CustomButton
            variant="contained"
            color="error"
            onClick={handleDeleteUser}
          >
            Delete
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignRoles;