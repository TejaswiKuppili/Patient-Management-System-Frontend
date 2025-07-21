// src/features/doctor/api/doctorApi.ts

import apiClient from "../../../features/auth/api/apiClient";
import { Doctor } from "../types/doctor";

// export const fetchDoctors = async (): Promise<Doctor[]> => {
//   const response = await apiClient.get<{
//     success: boolean;
//     message: string | null;
//     data: Doctor[];
//     statusCode: number;
//   }>("/api/doctor");

//   return response.data.data;
// };

export const fetchDoctors = async (): Promise<Doctor[]> => {
  const response = await apiClient.get<Doctor[]>("/api/doctor");
  return response.data;
};
