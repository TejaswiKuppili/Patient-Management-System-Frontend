// useDoctors.ts
import { useCallback, useEffect, useState } from "react";
import { Doctor } from "./types/doctor";
import { fetchDoctors } from "./api/doctorApi";

const useDoctors = (): {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchDoctors();

      const formattedDoctors = data.map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
        specialtyName: doctor.specialtyName,
        emailId: doctor.emailId,
      }));

      setDoctors(formattedDoctors);
      setError(null);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  return { doctors, loading, error, refetch: loadDoctors };
};

export default useDoctors;
