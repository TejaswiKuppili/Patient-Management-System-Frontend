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
  const resetForm = () => {
    setVitals({
      recordedAt: '',
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
    });
  };
  // Utility to allow only numeric or medically valid characters
  const handleInputChange = (field: string, value: string) => {
    let valid = true;

    switch (field) {
      case 'bloodPressure':
       
  valid = /^(\d{0,3})(\/\d{0,2})?$/.test(value);

 // numbers and '/'
        break;
      case 'heartRate':
        
  valid = /^(\d{0,3})$/.test(value);
  break;

      case 'temperature':
         valid = /^(\d{0,3})$/.test(value);
  break;

      case 'respiratoryRate':
        valid = /^\d{0,2}$/.test(value); // only digits
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
          helperText="Enter temperature in °C (e.g., 98)"
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
        <CustomButton variant="outlined"
          onClick={()=>{
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
        <CustomButton variant="contained" onClick={onSubmit}>
          Submit
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddVitalsDialog;
