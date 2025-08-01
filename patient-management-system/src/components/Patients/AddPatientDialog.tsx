import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select } from '@mui/material';
import { CustomButton } from '../common/Custom';
import { useState } from 'react';

const AddPatientDialog = ({ open, onClose, onSubmit, newPatient, setNewPatient }: any) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Patient</DialogTitle>
      <DialogContent sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
         <TextField
          label="First Name"
          value={newPatient.firstName}
          onChange={(e) => {
            const input = e.target.value;
            if (/^[A-Za-z\s]*$/.test(input)) {
              setNewPatient((prev: any) => ({ ...prev, firstName: input }));
            }
          }}
          fullWidth
        />
        <TextField
          label="Last Name"
          value={newPatient.lastName}
          onChange={(e) => {
            const input = e.target.value;
            if (/^[A-Za-z\s]*$/.test(input)) {
              setNewPatient((prev: any) => ({ ...prev, lastName: input }));
            }
          }}
          fullWidth
        />
            <TextField
  type="date"
  label="Date of Birth"
  InputLabelProps={{ shrink: true }}
  inputProps={{
    max: new Date().toISOString().split("T")[0]
  }}
  value={newPatient.dateOfBirth}
  onChange={(e) => {
    const inputDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];
    if (inputDate <= today) {
      setNewPatient((prev: any) => ({ ...prev, dateOfBirth: inputDate }));
    }
  }}
  fullWidth
/>

       {/*
        <TextField type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} value={newPatient.dateOfBirth} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, dateOfBirth: e.target.value }))} fullWidth /> */}
        <Select value={newPatient.gender} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, gender: e.target.value }))} displayEmpty fullWidth>
          <MenuItem value="" disabled>Select Gender</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        <TextField
          label="Contact Number"
          value={newPatient.contactNumber}
         onChange={(e) => {
          const input = e.target.value;

          // Allow only digits and limit to 10 characters
          if (/^\d*$/.test(input) && input.length <= 10) {
            setNewPatient((prev: any) => ({
              ...prev,
              contactNumber: input,
            }));

            // Show error if less than 10 digits and not empty
            if (input.length > 0 && input.length < 10) {
              setErrors((prev) => ({
                ...prev,
                contactNumber: "Phone number must be 10 digits",
              }));
            } else {
              setErrors((prev) => ({
                ...prev,
                contactNumber: "",
              }));
            }
          }
        }}
          
          error={Boolean(errors.contactNumber)}
          helperText={errors.contactNumber}
          fullWidth
        />
        <TextField label="Address" value={newPatient.address} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, address: e.target.value }))} fullWidth />
        <TextField label="Reason for Visit" value={newPatient.reasonForVisit} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, reasonForVisit: e.target.value }))} fullWidth />
      </DialogContent>
      <DialogActions>
        <CustomButton variant="outlined" onClick={onClose}
        sx={{
          color: '#007b83',
          borderColor: '#007b83',
          '&:hover': { borderColor: '#F5FBF9', color: '#F5FBF9' },
        }}
        >
          Cancel
        </CustomButton>
        <CustomButton variant="contained" onClick={onSubmit}>Add Patient</CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddPatientDialog;
