// Patient interface which describes the structure of a patient object.
export interface Patient {
  id: number;
  visitDate: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  address: string;
  reasonForVisit: string;
}

//Vitals interface which describes the structure of a patient's vitals data.
export interface Vitals {
  id: number;
  patientId: number;
  recordedAt: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
}
