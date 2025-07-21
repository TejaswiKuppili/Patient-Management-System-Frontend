import apiClient from "./apiClient";
import { UsersWithRoles } from "../types";

//API call to fetch users with roles
export const fetchUsersWithRoles = async (): Promise<UsersWithRoles> => {
  const response = await apiClient.get<{
    success: boolean;
    message: string | null;
    data: UsersWithRoles;
    statusCode: number;
  }>("/api/users/roles");
  return response.data.data;
};

//API call to add a new user
export const addUser = async (user: {
  name: string;
  email: string;
  role: string;
}) => {
  const payload = {
    Name: user.name,
    Email: user.email,
    RoleName: user.role,
  };
  const response = await apiClient.post("/api/users/create", payload);
  return response.data;
};

//API call to update user role
export const updateUserRole = async (
  userId: number,
  newRole: string
): Promise<void> => {
  console.log("Updating user role:", { role: newRole });
  const response = await apiClient.put(`/api/users/roles/${userId}/role`, {
    role: newRole,
  });
  console.log(response.data);
  return response.data;
};
