import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { CustomButton } from '../common/Custom';

const AddVitalsDialog = ({
  open,
  onClose,
  onSubmit,
  vitals,
  setVitals,
  selectedPatient,
}: any) => {
  // Utility to allow only numeric or medically valid characters
  const handleInputChange = (field: string, value: string) => {
    let valid = true;

    switch (field) {
      case 'bloodPressure':
        valid = /^[\d/]*$/.test(value); // numbers and '/'
        break;
      case 'heartRate':
      case 'temperature':
      case 'respiratoryRate':
        valid = /^\d*$/.test(value); // only digits
        break;
      default:
        break;
    }

    if (valid) {
      setVitals((prev: any) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Record Vitals</DialogTitle>
      <DialogContent sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Patient"
          value={`${selectedPatient?.firstName} ${selectedPatient?.lastName}`}
          disabled
          fullWidth
        />
        <TextField
          label="Recorded At"
          type="datetime-local"
          value={vitals.recordedAt}
          disabled
          fullWidth
        />
        <TextField
          label="Blood Pressure"
          value={vitals.bloodPressure}
          onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
          fullWidth
          helperText="Enter systolic/diastolic (e.g., 120/80 )"
        />
        <TextField
          label="Heart Rate"
          value={vitals.heartRate}
          onChange={(e) => handleInputChange('heartRate', e.target.value)}
          fullWidth
          helperText="Beats per minute (e.g., 72 bpm)"
        />
        <TextField
          label="Temperature"
          value={vitals.temperature}
          onChange={(e) => handleInputChange('temperature', e.target.value)}
          fullWidth
          helperText="Enter temperature in °C (e.g., 98.6)"
        />
        <TextField
          label="Respiratory Rate"
          value={vitals.respiratoryRate}
          onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
          fullWidth
          helperText="Breaths per minute (e.g., 16)"
        />
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
        <CustomButton variant="contained" onClick={onSubmit}>
          Submit
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddVitalsDialog;
