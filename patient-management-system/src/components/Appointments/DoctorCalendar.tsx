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
} from '@mui/material';
import { Appointment } from './types/appointment';
import { bookAppointment, fetchAllPatients, fetchAppointmentsByDoctor } from './api/appointmentApi';
import { Patient } from '../Patients/patientTypes';

const DoctorCalendar = () => {
  const { doctorId: doctorIdParam, doctorName } = useParams();
  const doctorId = Number(doctorIdParam);
  const [events, setEvents] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<DateSelectArg | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<number>(0);

  useEffect(() => {
    if (!doctorId) return;

    const loadData = async () => {
      try {
        const [appointments, patientList] = await Promise.all([
          fetchAppointmentsByDoctor(doctorId),
          fetchAllPatients(),
        ]);
        
        setEvents(appointments);
        setPatients(patientList);
      } catch (err) {
        console.error('Data fetch failed:', err);
      }
    };
    

    loadData();
  }, [doctorId]);

  const handleSelectSlot = (arg: DateSelectArg) => {
    setSelectedSlot(arg);
    setDialogOpen(true);
  };

  const handleEventClick = (arg: EventClickArg) => {
    alert(`Clicked event: ${arg.event.title}`);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPatient(0);
    setSelectedSlot(null);
  };


  const handleBookAppointment = async () => {
    if (!doctorId || !selectedSlot || !selectedPatient) return;

    const patient = patients.find((p) => p.id === selectedPatient);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
    
    try {
      await bookAppointment(
        doctorId,
        selectedPatient,
        selectedSlot.startStr,
        selectedSlot.endStr
      );

      setEvents([
        {
          title: patientName,
          start: selectedSlot.startStr,
          end: selectedSlot.endStr,
        },
      ]);

      handleCloseDialog();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Calendar for Dr. {decodeURIComponent(doctorName || '')}
      </h2>

      <Calendar
        events={events}
        onSelectSlot={handleSelectSlot}
        onEventClick={handleEventClick}
      />

      <Dialog fullWidth open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle align='center'>Book Appointment</DialogTitle>
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
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBookAppointment} variant="contained" color="primary">
            Book Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DoctorCalendar;
