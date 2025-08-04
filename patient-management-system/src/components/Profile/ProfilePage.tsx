import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { useAuthContext } from "../../features/auth/AuthProvider";
import { Profile } from "./types/profileTypes";
import { fetchUserProfile, updateUserProfile } from "./api/profileApi";
import { CustomButton } from "../common/Custom";

const ProfilePage: React.FC = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<Profile | null>(null);
   const [errors, setErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const data = await fetchUserProfile(user.id);
        setProfile(data);
      } catch (error) {
        toast.error("Failed to load profile.");
      }
    };

    loadProfile();
  }, [user]);

const handleTextFieldChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  if (!profile) return;

  // ✅ Validate Date of Birth
  if (name === "date") {
    const inputDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Strip time

    if (isNaN(inputDate.getTime()) || inputDate > today) {
      toast.error("Please enter a valid date of birth not in the future.");
      return;
    }
  }

  // ✅ Validate Phone Number
  if (name === "phoneNumber") {
    const numericOnly = value.replace(/\D/g, ""); // Remove non-digits
    if (numericOnly.length > 10) return;
    setProfile({ ...profile, phoneNumber: numericOnly });
    return;
  }

  // ✅ Default
  setProfile({ ...profile, [name]: value });
};

    const handleSelectChange = (e: SelectChangeEvent) => {
    if (profile) {
      setProfile({ ...profile, gender: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      await updateUserProfile(profile);
      toast.success("Profile updated successfully!");
    } catch (error){
      toast.error("Failed to update profile.");
    }
  };

  if (!profile) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100vw",
        maxWidth: "1000px",
        height: "auto",
        maxHeight: "85vh",
        overflowY: "auto",
        mt: "0px !important",
        m: "40px auto",
        p: 5,
        backgroundColor: "#ffffff",
      }}
    >
      {/* Profile Header */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Box position="relative">
          <Avatar
            src={profile.profilePicture}
            sx={{ width: 130, height: 130 }}
          />
          
          <IconButton
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "#fff",
              boxShadow: 1,
            }}
            size="small"
            onClick={() => alert("Should add profile picture change logic")}
  
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="h5" mt={2} fontWeight="bold">
          {profile.firstName} {profile.lastName}
        </Typography>
      </Box>

      {/* Personal Info */}
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={profile.firstName}
          onChange={handleTextFieldChange}
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={profile.lastName}
          onChange={handleTextFieldChange}
        />
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          label="Date of Birth"
          type="date"
          name="date"
          value={profile.date ?? ""}
          onChange={handleTextFieldChange}
          InputLabelProps={{ shrink: true }}
          inputProps={{
          max: new Date().toISOString().split("T")[0],
          }}
        />
        <Select 
          value={profile.gender || ""}
              label="Gender"
              name="gender"
              onChange={handleSelectChange}
              displayEmpty 
              fullWidth>
           <MenuItem value="" disabled>Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
      </Box>

      {/* Contact Info */}
      <Typography variant="h6" mt={4} gutterBottom>
        Contact Information
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleTextFieldChange}
          disabled
        />
        <TextField
          fullWidth
          label="Contact Number"
          name="phoneNumber"
          value={profile.phoneNumber || ""}
          onChange={handleTextFieldChange}
          error={Boolean(errors.phoneNumber)}
        />
      </Box>

      {/* Address Info */}
      <Typography variant="h6" mt={4} gutterBottom>
        Address Details
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <TextField
        fullWidth
        label="Address"
        name="address"
        value={profile.address || ""}
        onChange={handleTextFieldChange}
        sx={{ mb: 2 }}
      />

      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          label="City"
          name="city"
          value={profile.city || ""}
          onChange={handleTextFieldChange}
        />
        <TextField
          fullWidth
          label="State"
          name="state"
          value={profile.state || ""}
          onChange={handleTextFieldChange}
        />
        <TextField
          fullWidth
          label="Country"
          name="country"
          value={profile.country || ""}
          onChange={handleTextFieldChange}
        />
      </Box>

      {/* Bio */}
      <Typography variant="h6" mt={4} gutterBottom>
        About You
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Bio"
        name="bio"
        value={profile.bio || ""}
        onChange={handleTextFieldChange}
      />

      <Box mt={4} textAlign="center">
        <CustomButton variant="contained" size="large" onClick={handleSave}>
          Save Profile
        </CustomButton>
      </Box>
    </Paper>
  );
};

export default ProfilePage;

