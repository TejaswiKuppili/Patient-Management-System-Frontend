import apiClient from "../../../features/auth/api/apiClient";
import { Patient } from "../../Patients/patientTypes";
import { Appointment } from "../types/appointment";

export const fetchAppointmentsByDoctor = async (
  doctorId: number
): Promise<Appointment[]> => {
  const response = await apiClient.get(`/api/appointment/doctor/${doctorId}`);
  return response.data.data;
};

export const fetchAllPatients = async (): Promise<Patient[]> => {
  const response = await apiClient.get("/api/patient/getAllPatients");
  return response.data.data;
};

export const bookAppointment = async (
  doctorId: number,
  patientId: number,
  appointmentStartTime: string,
  appointmentEndTime: string
) => {
  const payload = {
    doctorId,
    patientId,
    appointmentStartTime,
    appointmentEndTime,
    createdBy: localStorage.getItem("User ID"),
  };
  const response = await apiClient.post("/api/appointment", payload);
  return response.data;
};

export const deleteAppointment = async (
  appointmentId: number
): Promise<void> => {
  await apiClient.delete(`/api/appointment/${appointmentId}`);
};
