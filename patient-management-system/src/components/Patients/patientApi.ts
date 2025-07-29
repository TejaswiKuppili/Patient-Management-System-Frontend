import apiClient from "../../features/auth/api/apiClient";
import { useAuth } from "../../features/hooks/useAuth";
import { Patient, Vitals } from "./patientTypes";

//API call to fetch all patients
export const fetchPatients = async (): Promise<Patient[]> => {
  const response = await apiClient.get<{
    success: boolean;
    message: string | null;
    data: Patient[];
    statusCode: number;
  }>("/api/patient/getAllPatients");
  return response.data.data;
};

//API call to add a new patient
export const addPatient = async (patient: {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  contactNumber: string;
  address: string;
  reasonForVisit: string;
}) => {
  const payload = {
    FirstName: patient.firstName,
    LastName: patient.lastName,
    DateOfBirth: patient.dateOfBirth,
    Gender: patient.gender,
    ContactNumber: patient.contactNumber,
    Address: patient.address,
    ReasonForVisit: patient.reasonForVisit,
    CreatedBy: localStorage.getItem("User ID"),
  };
  const response = await apiClient.post("/api/patient/addPatient", payload);
  return response.data;
};

//API call to fetch vitals by patient ID
export const fetchVitalsByPatientId = async (patientId: number) => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    data: Vitals[]|null;
    statusCode: number;
  }>(`/api/vital/getVitals/${patientId}`);
  console.log("Vitals fetched:", response.data.data);
  return response.data.data ?? [];
};

//API call to add vitals for a patient
export const addVitals = async (vitals: {
  patientId: number;
  recordedAt: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
}) => {
  const payload = {
    PatientId: vitals.patientId,
    RecordedAt: vitals.recordedAt,
    BloodPressure: vitals.bloodPressure,
    HeartRate: vitals.heartRate,
    Temperature: vitals.temperature,
    RespiratoryRate: vitals.respiratoryRate,
    CreatedBy: localStorage.getItem("User ID"),
  };
  const response = await apiClient.post("/api/vital/addVitals", payload);
  return response.data;
};
