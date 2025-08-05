export const validateFirstName = (input: string): string => {
  if (!input) return "First Name is required.";
  if (input.length > 50) return "First Name cannot exceed 50 characters.";
  return "";
};

export const validateLastName = (input: string): string => {
  if (input.length > 50) return "Last Name cannot exceed 50 characters.";
  return "";
};

export const validatePhoneNumber = (input: string): string => {
  if (!/^\d*$/.test(input)) return "Only digits allowed";
  if (input.length > 0 && input.length < 10)
    return "Phone number must be 10 digits";
  return "";
};

export const validateEmail = (input: string): string => {
  if (!/^\S+@\S+\.\S+$/.test(input)) return "Invalid email format";
  return "";
};

export const validateDateOfBirth = (inputDate: string): string => {
  const today = new Date().toISOString().split("T")[0];

  if (inputDate > today) {
    return "Date of Birth cannot be in the future.";
  }

  return "";
};
