import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface AppointmentDialogProps {
  open: boolean;
  mode: 'book' | 'edit';
  eventData: {
    title?: string;
    start: string;
    end: string;
  };
  onClose: () => void;
  onSave: (updatedEvent: { title: string; start: string; end: string }) => void;
  onDelete?: () => void;
}

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  open,
  mode,
  eventData,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState(eventData.title || '');

  useEffect(() => {
    setTitle(eventData.title || '');
  }, [eventData]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title, start: eventData.start, end: eventData.end });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === 'book' ? 'Book Appointment' : 'Edit Appointment'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Patient Name"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="mt-2 text-sm text-gray-500">
          <p>
            <strong>Start:</strong> {new Date(eventData.start).toLocaleString()}
          </p>
          <p>
            <strong>End:</strong> {new Date(eventData.end).toLocaleString()}
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        {mode === 'edit' && (
          <Button color="error" onClick={onDelete}>
            Cancel Appointment
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === 'book' ? 'Book' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDialog;
