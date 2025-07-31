import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { CustomButton } from '../common/Custom';

const AddVitalsDialog = ({ open, onClose, onSubmit, vitals, setVitals, selectedPatient }: any) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Record Vitals</DialogTitle>
    <DialogContent sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Patient" value={`${selectedPatient?.firstName} ${selectedPatient?.lastName}`} disabled fullWidth />
      <TextField label="Recorded At" type="datetime-local" value={vitals.recordedAt} disabled fullWidth />
      <TextField label="Blood Pressure" value={vitals.bloodPressure} onChange={(e) => setVitals((prev: any) => ({ ...prev, bloodPressure: e.target.value }))} fullWidth />
      <TextField label="Heart Rate" value={vitals.heartRate} onChange={(e) => setVitals((prev: any) => ({ ...prev, heartRate: e.target.value }))} fullWidth />
      <TextField label="Temperature" value={vitals.temperature} onChange={(e) => setVitals((prev: any) => ({ ...prev, temperature: e.target.value }))} fullWidth />
      <TextField label="Respiratory Rate" value={vitals.respiratoryRate} onChange={(e) => setVitals((prev: any) => ({ ...prev, respiratoryRate: e.target.value }))} fullWidth />
    </DialogContent>
    <DialogActions>
      <CustomButton variant="outlined" onClick={onClose}>Cancel</CustomButton>
      <CustomButton variant="contained" onClick={onSubmit}>Submit</CustomButton>
    </DialogActions>
  </Dialog>
);

export default AddVitalsDialog;
