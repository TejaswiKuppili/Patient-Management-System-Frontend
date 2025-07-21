import { useEffect, useState } from 'react';
import { addUser, updateUserRole } from '../../features/auth/api/userApi';
import useUsers from '../../features/hooks/useUsers';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
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
import { Search } from '@mui/icons-material';
import { CustomButton, CustomContainer } from '../common/Custom';
import { toast } from 'react-toastify';
import { User } from '../../features/auth/types';

const AssignRoles = () => {
  const { users, roles, loading, error, refetch } = useUsers();
  const [updatedRoles, setUpdatedRoles] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<{key: keyof typeof users[0] | null; direction: 'asc' | 'desc'}>({
    key: null,
    direction: 'asc'
  });
  const [message, setMessage] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: roles[0] || '' });
  const [showAddUserForm, setShowAddUserForm] = useState(false);
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

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      setMessage('Please fill in all fields.');
      return;
    }
    try {
      await addUser(newUser);
      await refetch();
      toast.success(`User ${newUser.name} added successfully`);
      setNewUser({ name: '', email: '', role: roles[0] || '' });
      setShowAddUserForm(false);
    } catch {
      toast.error('Failed to add user.');
    }
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    setUpdatedRoles(prev => ({ ...prev, [userId]: newRole }));
  };

  const handleUpdate = async (userId: number) => {
    const newRole = updatedRoles[userId];
    console.log(userId, newRole)
    if (!newRole) return;

    const user = users.find(u => u.id === userId);
    const username = user?.name || 'Unknown';

    try {
      await updateUserRole(userId, newRole);
      toast.success(`Role updated for user ${username}`);
    } catch {
      toast.error('Failed to update role.');
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

          <CustomButton
            onClick={() => setShowAddUserForm(true)}
            variant="contained"
            sx={{
              width: '150px',
              color: '#fff',
              backgroundColor: '#00b3b3',
              '&:hover': { backgroundColor: '#009999' },
            }}
          >
            Add User
          </CustomButton>
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
                  <TableCell onClick={() => handleSort('role')} sx={{ cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
                    Current Role {sortConfig.key === 'role' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
                    Change Role
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
                    <TableCell  align="center">
                      No users found.
                    </TableCell>
                  </TableRow>) :
                sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Select
                          value={updatedRoles[user.id] ?? user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          size="small"
                          fullWidth
                        >
                          {roles.map(roleOption => (
                            <MenuItem key={roleOption} value={roleOption}>
                              {roleOption}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <CustomButton variant="outlined" onClick={() => handleUpdate(user.id)}
                          sx={{
                            color: '#007b83',
                            borderColor: '#007b83',
                            '&:hover': { borderColor: '#F5FBF9', color: '#F5FBF9' },
                          }}>
                          Update
                        </CustomButton>
                      </TableCell>
                    </TableRow>
                  ))}
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

      {/* Add User Dialog */}
      <Dialog open={showAddUserForm} onClose={() => setShowAddUserForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            value={newUser.name}
            onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
            fullWidth
          />
          <Select
            value={newUser.role}
            onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
            fullWidth
          >
            <MenuItem value="" disabled>Select Role</MenuItem>
            {roles.map(roleOption => (
              <MenuItem key={roleOption} value={roleOption}>
                {roleOption}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <CustomButton variant="contained" onClick={() => setShowAddUserForm(false)}>Cancel</CustomButton>
          <CustomButton variant="contained" onClick={handleAddUser}>Add User</CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignRoles;



// import { useEffect, useState } from 'react';
// import { addUser, updateUserRole } from '../../features/auth/api/userApi';
// import './AssignRoles.css';
// import useUsers from '../../features/hooks/useUsers';
// import Modal from '../common/Modal/Modal';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../features/hooks/useAuth';

// // This component allows an admin to assign roles to users, add new users, and update existing user roles.
// const AssignRoles = () => {
  // const { users, roles, loading, error, refetch } = useUsers();
  // const [updatedRoles, setUpdatedRoles] = useState<Record<string, string>>({});
  // const [message, setMessage] = useState('');
  // const[newUser, setNewUser] = useState({ name: '', email: '', role: roles[0] || '' });
  // const[showAddUserForm, setShowAddUserForm] = useState(false);

  // // This effect clears the message after 3 seconds.
  //   useEffect(() => {
  //     if (message) {
  //       const timer = setTimeout(() => setMessage(''), 3000);
  //       return () => clearTimeout(timer);
  //     }
  //   }, [message]);
  
  // // Replace this with your actual way of getting the current user's role.
  // // For example, if you have a useAuth hook:
  // // const { user } = useAuth();
  // // const currentRole = user?.role; 
  // // console.log(currentRole);

  // const currentRole = localStorage.getItem('Role');

  // if (currentRole !== 'Admin') {
  //   return <Navigate to="/unauthorized" />;
  // }

  // // This function validates the new user data, calls the API to add the user, and updates the UI accordingly.
  // const handleAddUser = async () => {
  //   try {
  //     if (!newUser.name || !newUser.email || !newUser.role) {
  //       setMessage("Please fill in all fields.");
  //       return;
  //     }
  //     await addUser(newUser);
  //     await refetch(); // refetch users after adding a new one
  //     setMessage(`User ${newUser.name} added successfully`);
  //     setNewUser({ name: '', email: '', role: roles[0] || '' });
  //     setShowAddUserForm(false);
  //   }
  //   catch {
  //     setMessage('Failed to add user.');
  //   }
  // };

  // // This function updates the state with the new role for the specified user.
  // const handleRoleChange = (userId: number, newRole: string) => {
  //   setUpdatedRoles(prev => ({ ...prev, [userId]: newRole }));
  // };

  // const handleUpdate = async (userId: number) => {
  //   const newRole = updatedRoles[userId];
  //   if (!newRole) return;

  //   const user = users.find(u => u.id === userId);
  //   const username = user?.name || 'Unknown';

  //   try {
  //     await updateUserRole(userId, newRole);
  //     setMessage(`Role updated for user ${username}`);
  //   } 
  //   catch {
  //     setMessage('Failed to update role.');
  //   }
  // };

//   return (
//     <div className="assign-roles-container">
//       <h2>Assign Roles</h2>
//       {message && <div className="info-message">{message}</div>}
//       {error && <div className="error-message">{error}</div>}

//       <button className="add-user-btn" onClick={() => setShowAddUserForm(true)}>Add User</button>

//       {loading ? (
//         <div>Loading users...</div>
//       ) : (
//         <div className={`users-table-scroll-wrapper ${showAddUserForm ? 'modal-open' : ''}`}>
//         <table className="users-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Current Role</th>
//               <th>Change Role</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map(user => (
//               <tr key={user.id}>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.role}</td>
//                 <td>
//                   <select
//                     value={updatedRoles[user.id] ?? user.role}
//                     onChange={e => handleRoleChange(user.id, e.target.value)}
//                   >
//                     {roles.map(roleOption => (
//                       <option key={roleOption} value={roleOption}>
//                         {roleOption}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td>
//                   <button onClick={() => handleUpdate(user.id)}>Update</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         </div>
//       )}
//       {showAddUserForm && (
//         <Modal onClose={() => setShowAddUserForm(false)}>        
//           <h3>Add New User</h3>
//           {error && <div className="error-message">{error}</div>}
//           <div className="modal-form">
//             <input
//               type="text"
//               placeholder="Name"
//               value={newUser.name}
//               onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={newUser.email}
//               onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
//             />
//             <select
//               value={newUser.role}
//               onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value }))}
//             >
//               <option value="" disabled>Select Role</option>
//               {roles.map(roleOption => (
//                 <option key={roleOption} value={roleOption}>
//                   {roleOption}
//                 </option>
//               ))}
//             </select>
//             <button onClick={handleAddUser}>Add User</button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default AssignRoles;