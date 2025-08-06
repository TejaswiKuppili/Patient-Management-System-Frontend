import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import Calendar from '../common/Calendar/Calendar';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { Appointment } from './types/appointment';
import { bookAppointment, deleteAppointment, fetchAllPatients, fetchAppointmentsByDoctor } from './api/appointmentApi';
import { Patient } from '../Patients/patientTypes';
import { toast } from 'react-toastify';
import { CustomButton } from '../common/Custom/CustomButton';
import axios from 'axios';

const DoctorCalendar = () => {
  const { doctorId: doctorIdParam, doctorName } = useParams();
  const doctorId = Number(doctorIdParam);
  const [events, setEvents] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<DateSelectArg | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<number>(0);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventEndTime, setSelectedEventEndTime] = useState<Date | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadData = async () => {
    if (!doctorId) return;
  
    try {
      const [appointments, patientList] = await Promise.all([
        fetchAppointmentsByDoctor(doctorId),
        fetchAllPatients(),
      ]);

      const transformedAppointments: Appointment[] = appointments.map((appt: any) => ({
        id: appt.id,
        title: appt.patientName ?? 'Unknown',
        start: appt.appointmentStartTime,
        end: appt.appointmentEndTime,
      }));
      
      setEvents(transformedAppointments);      
  
      setPatients(patientList);
  
      return { appointments, patientList };
    } catch (err) {
      console.error('Data fetch failed:', err);
    }
  };  

  useEffect(() => {
    loadData(); // ✅ works now
  }, [doctorId]);

  const handleSelectSlot = (arg: DateSelectArg) => {
    setSelectedSlot(arg);
    setDialogOpen(true);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const event = arg.event;
    const eventId = (arg.event as any)._def.publicId;
    const eventEnd = new Date((event.end ?? event.start)!);

    setSelectedEventId(Number(eventId));
    setSelectedEventEndTime(eventEnd);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPatient(0);
    setSelectedSlot(null);
  };


  const handleBookAppointment = async () => {
    if (!doctorId || !selectedSlot || !selectedPatient) return;

    const now = new Date();
    const slotStart = new Date(selectedSlot.startStr);

    if (slotStart < now) {
      toast.error("Cannot book an appointment in the past.");
      return;
    }

    const patient = patients.find((p) => p.id === selectedPatient);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";

    try {
      await bookAppointment(
        doctorId,
        selectedPatient,
        selectedSlot.startStr,
        selectedSlot.endStr
      );

      await loadData();
      handleCloseDialog();
      toast.success('Appointment booked successfully for ' + patientName);
    } 
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400) {
          toast.error("This time slot is already booked. Please select a different slot.");
        } else {
          toast.error("Failed to book appointment. Please try again later.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleDeleteAppointment = async () => {
    try {
      if (selectedEventEndTime && selectedEventEndTime < new Date()) {
        toast.error('Cannot delete past appointments');
        return;
      }

      if (selectedEventId) {
        await deleteAppointment(selectedEventId);
        await loadData();
        toast.success('Appointment deleted');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete appointment');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedEventId(null);
      setSelectedEventEndTime(null);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: '1000px',
          padding: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          maxHeight: '85vh',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom color="primary">
          Calendar for Dr. {decodeURIComponent(doctorName || '')}
        </Typography>

        <Box
          sx={{
            height: '70vh', // you can adjust height here
            overflowY: 'auto',
          }}
        >
          <Calendar
            events={events.map(e => ({ ...e, id: e.id }))}
            onSelectSlot={handleSelectSlot}
            onEventClick={handleEventClick}
          />
        </Box>
      </Paper>


      {/* Dialog for booking appointment */}
      <Dialog fullWidth maxWidth="sm" open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle align="center" color="primary">Book Appointment</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Select Patient"
            fullWidth
            margin="normal"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(Number(e.target.value))}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              },
            }}
          >
            {Array.isArray(patients) && patients.length > 0 ? (
              patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.firstName + " " + patient.lastName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No patients found</MenuItem>
            )}
          </TextField>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleCloseDialog}
           sx={{
             color: '#007b83',
             borderColor: '#007b83',
            '&:hover': { borderColor: '#F5FBF9', color: '#F5FBF9' },
          }}
          >
            Cancel
          </CustomButton>
          <Button onClick={handleBookAppointment} variant="contained" color="primary">
            Book Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for deleting appointment */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle align="center">Delete Appointment</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this appointment?
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => setDeleteDialogOpen(false)}
            sx = {{ '&:hover': { borderColor: '#F5FBF9', color: '#F5FBF9' }}}>
            Cancel
          </CustomButton>
          <Button
            onClick={handleDeleteAppointment}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorCalendar;
