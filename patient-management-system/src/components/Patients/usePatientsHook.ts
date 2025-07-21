import { useCallback, useEffect, useState } from "react";
import { Patient } from "./patientTypes";
import { fetchPatients } from "./patientApi";

// This hook fetches patients from the API and manages the state of patients, loading status, and errors.
const usePatients = (): {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPatients();
      // Transform the fetched data into the expected format
      const patients = data.map((patient: any, index: number) => ({
        id: patient.id,
        visitDate: patient.visitDate,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        contactNumber: patient.contactNumber,
        address: patient.address,
        reasonForVisit: patient.reasonForVisit,
      }));

      setPatients(patients);
      setError(null);
      setLoading(false);
    } catch {
      setError("Failed to load patients");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { patients, loading, error, refetch: loadUsers };
};

export default usePatients;
