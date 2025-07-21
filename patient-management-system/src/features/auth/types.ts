// This interface defines the structure of the request body for user registration.
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  rolename: string;
}

// This interface defines the structure of the request body for user login.
export interface LoginRequest {
  email: string;
  password: string;
}

// This interface defines the structure of the response received after a successful user login.
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userDetails: User[];
}

// This interface defines the structure of a user object, which includes an ID, name, email, and role.
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// This interface defines the structure of the response containing users and their roles.
export interface UsersWithRoles {
  users: User[];
  roles: string[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// This context will provide user information and authentication methods throughout the application.
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
