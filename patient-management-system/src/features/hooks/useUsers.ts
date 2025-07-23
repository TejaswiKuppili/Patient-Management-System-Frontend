import { useCallback, useEffect, useState } from "react";
import { fetchUsersWithRoles } from "../auth/api/userApi";
import { User, UsersWithRoles } from "../auth/types";

// This hook fetches users and their roles from the API and manages the state of users, roles, loading status, and errors.
const useUsers = (): UsersWithRoles => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUsersWithRoles();
      const users = data.users.map((user: any, index: number) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        roleName: user.roleName,
      }));
      setUsers(users);
      setRoles(data.roles);
      setError(null); // Clear any previous error
    } catch (error) {
      setError("Failed to load users and roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, roles, loading, error, refetch: loadUsers };
};

export default useUsers;
