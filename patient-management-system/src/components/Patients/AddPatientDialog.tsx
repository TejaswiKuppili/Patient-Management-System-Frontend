import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select } from '@mui/material';
import { CustomButton } from '../common/Custom';

const AddPatientDialog = ({ open, onClose, onSubmit, newPatient, setNewPatient }: any) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        
      <DialogTitle>Add New Patient</DialogTitle>
      <DialogContent sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="First Name" value={newPatient.firstName} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, firstName: e.target.value }))} fullWidth />
        <TextField label="Last Name" value={newPatient.lastName} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, lastName: e.target.value }))} fullWidth />
        <TextField type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} value={newPatient.dateOfBirth} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, dateOfBirth: e.target.value }))} fullWidth />
        <Select value={newPatient.gender} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, gender: e.target.value }))} displayEmpty fullWidth>
          <MenuItem value="" disabled>Select Gender</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        <TextField label="Contact Number" value={newPatient.contactNumber} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, contactNumber: e.target.value }))} fullWidth />
        <TextField label="Address" value={newPatient.address} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, address: e.target.value }))} fullWidth />
        <TextField label="Reason for Visit" value={newPatient.reasonForVisit} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, reasonForVisit: e.target.value }))} fullWidth />
      </DialogContent>
      <DialogActions>
        <CustomButton variant="outlined" onClick={onClose}>Cancel</CustomButton>
        <CustomButton variant="contained" onClick={onSubmit}>Add Patient</CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddPatientDialog;
