import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select } from '@mui/material';
import { CustomButton } from '../common/Custom';
import { useState } from 'react';
import { validateDateOfBirth, validateFirstName, validatePhoneNumber } from '../../utils/validation';

const AddPatientDialog = ({ open, onClose, onSubmit, newPatient, setNewPatient }: any) => {
  const resetForm = () => {
    setNewPatient({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      contactNumber: '',
      address: '',
      reasonForVisit: '',
    });
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const error = validateFirstName(input);
     setErrors((prev: any) => ({
      ...prev,
      firstName: error,
    }));

    // Only update state if valid
    if (!error) {
      setNewPatient((prev: any) => ({
        ...prev,
        firstName: input,
      }));
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const error = validateFirstName(input);
     setErrors((prev: any) => ({
      ...prev,
      lastName: error,
    }));

    // Only update state if valid
    if (!error) {
      setNewPatient((prev: any) => ({
        ...prev,
        lastName: input,
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;

    const error = validateDateOfBirth(inputDate);
    setErrors((prev: any) => ({
      ...prev,
      dateOfBirth: error,
    }));

    // Only update state if valid
    if (!error) {
      setNewPatient((prev: any) => ({
        ...prev,
        dateOfBirth: inputDate,
      }));
    }
  };
  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Prevent updating state if more than 10 digits
    if (input.length > 10) return;

    setNewPatient((prev: any) => ({
      ...prev,
      contactNumber: input,
    }));

    const error = validatePhoneNumber(input);
    setErrors((prev) => ({
      ...prev,
      contactNumber: error,
    }));
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Patient</DialogTitle>
      <DialogContent sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
         <TextField
          label="First Name"
          value={newPatient.firstName}
          onChange={handleFirstNameChange}
          fullWidth
        />
        <TextField
          label="Last Name"
          value={newPatient.lastName}
          onChange={handleLastNameChange}
          fullWidth
        />
        <TextField
          type="date"
          label="Date of Birth"
          name="dateOfBirth"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            max: new Date().toISOString().split("T")[0]
          }}
          value={newPatient.dateOfBirth}
          onChange={handleDateChange}
          error={Boolean(errors.dateOfBirth)}
          helperText={errors.dateOfBirth}
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
          onChange={handleContactNumberChange}
          error={Boolean(errors.contactNumber)}
          helperText={errors.contactNumber}
          fullWidth
        />
        <TextField label="Address" value={newPatient.address} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, address: e.target.value }))} fullWidth />
        <TextField label="Reason for Visit" value={newPatient.reasonForVisit} onChange={(e) => setNewPatient((prev: any) => ({ ...prev, reasonForVisit: e.target.value }))} fullWidth />
      </DialogContent>
      <DialogActions>
        <CustomButton variant="outlined"
        onClick={() => {
          resetForm();
          onClose();
        }}
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
