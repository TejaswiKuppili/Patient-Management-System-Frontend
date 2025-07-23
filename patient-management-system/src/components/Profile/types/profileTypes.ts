export interface Profile {
  applicationUserId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  country: string;
  profilePicture: string;
}
