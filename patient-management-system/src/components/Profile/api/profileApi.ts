import apiClient from "../../../features/auth/api/apiClient";

export const fetchUserProfile = async (userId: number) => {
  const response = await apiClient.get(`/api/profile/me/${userId}`);
  return response.data.data;
};

export const updateUserProfile = async (profileData: any) => {
  const response = await apiClient.put(`/api/profile/me/update}`, profileData);
  return response.data.data;
};
