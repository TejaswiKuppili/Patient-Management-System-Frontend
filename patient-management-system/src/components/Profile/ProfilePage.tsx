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

    // Only allow numeric values and up to 10 digits for phone number
    if (name === "phoneNumber") {
      // Block non-digit characters or more than 10 digits
      if (!/^\d{0,10}$/.test(value)) return;

      // Set error if less than 10 digits
      if (value.length > 0 && value.length < 10) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Phone number must be 10 digits",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }

    if (profile) {
      setProfile({ ...profile, [name]: value });
    }
  };

  // const handleTextFieldChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   if (profile) {
  //     setProfile({ ...profile, [name]: value });
  //   }
  // };

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
    } catch (error) {
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
          disabled // assuming email is not editable
        />
        <TextField
          fullWidth
          label="Contact Number"
          name="phoneNumber"
          value={profile.phoneNumber || ""}
          onChange={handleTextFieldChange}
          error={Boolean(errors.phoneNumber)}
          helperText={errors.phoneNumber}
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



// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Avatar,
//   TextField,
//   Paper,
//   Button,
//   Divider,
//   IconButton,
// } from '@mui/material';
// import EditIcon from "@mui/icons-material/Edit";
// import PhoneInput from "react-phone-input-2";
// import 'react-phone-input-2/lib/material.css';
// import { useAuthContext } from '../../features/auth/AuthProvider';
// import { CustomButton } from '../common/Custom';
// import { Profile } from './types/profileTypes';
// import { fetchUserProfile, updateUserProfile } from './api/profileApi';

// const ProfilePage = () => {
//     const { user } = useAuthContext();

//     const [profile, setProfile] = useState({
//         applicationUserId: 0,
//         firstName: '',
//         lastName: '',
//         date: '',
//         gender: '',
//         email: '',
//         phoneNumber: '',
//         profilePicture: '',
//         address: '',
//         city: '',
//         state: '',
//         country: '',
//         bio: '',
//       });
      
//     const [hasFetchedProfile, setHasFetchedProfile] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [formState, setFormState] = useState<Partial<Profile>>({});
//     useEffect(() => {
//       const loadProfile = async () => {
//         if (!user) return;
    
//         try {
//           console.log(user.id);
//           const userProfile = await fetchUserProfile(user.id);
//           setProfile(prev => ({
//             ...prev,
//             applicationUserId: user.id,
//             firstName: userProfile.firstName || '',
//             lastName: userProfile.lastName || '',
//             date: userProfile.date || '',
//             gender: userProfile.gender || '',
//             email: userProfile.email || '',
//             phoneNumber: userProfile.phoneNumber || '',
//             profilePicture: userProfile.profilePicture || '',
//             address: userProfile.address || '',
//             city: userProfile.city || '',
//             state: userProfile.state || '',
//             country: userProfile.country || '',
//             bio: userProfile.bio || '',
//           }));          
//             setHasFetchedProfile(true);        
//         } catch (err) {
//           console.warn('Could not fetch full profile, falling back to context');
//         }
//       };
    
//       loadProfile();
//     }, [user]);         

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = e.target;
//       setProfile(prev => ({
//         ...prev,
//         [name]: value ?? '',
//       }));
//     };
    
      
//       const handleSave = async () => {
//         if (!user) return;
//       console.log('save', user);
//         try {
//           console.log("Sending profile data:", {
//             ...profile,
//             ...formState,
//           });
          
//           await updateUserProfile({
//             ...profile,
//             ...formState,
//           });
      
//           // After update, always fetch profile from backend
//           const updatedProfile = await fetchUserProfile(user.id);
//           setProfile(updatedProfile);
//           setHasFetchedProfile(true);
//         } catch (err) {
//           console.error('Failed to update profile:', err);
//         }
//       };      

//     if (!profile) return <Typography>Loading...</Typography>;

//   return (
//     <Paper
//         elevation={3}
//         sx={{
//             width: '100vw',          
//             maxWidth: '1000px',      // Limits max width for large screens
//             height: 'auto',          // Auto height instead of fixed
//             maxHeight: '85vh',       // Prevent overflow on very tall screens
//             overflowY: 'auto',
//             mt: '0px !important',
//             m: '40px auto',          // Center with vertical spacing
//             p: 5,
//             backgroundColor: '#ffffff',
//         }}
//         >
//         {/* Profile Header */}
//         <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
//           <Box position="relative">
//             <Avatar
//               src={profile.profilePicture}
//               sx={{ width: 130, height: 130 }}
//             />
//             <IconButton
//               sx={{
//                 position: "absolute",
//                 bottom: 0,
//                 right: 0,
//                 bgcolor: "#fff",
//                 boxShadow: 1,
//               }}
//               size="small"
//               onClick={() => alert("Should add profile picture change logic")}
//             >
//               <EditIcon fontSize="small" />
//             </IconButton>
//           </Box>
//           <Typography variant="h5" mt={2} fontWeight="bold">
//             {profile.firstName} {profile.lastName}
//           </Typography>
//         </Box>

//         {/* Personal Info */}
//         <Typography variant="h6" gutterBottom>
//           Personal Information
//         </Typography>
//         <Divider sx={{ mb: 3 }} />

//         <Box display="flex" gap={2} mb={2}>
//           <TextField
//             fullWidth
//             label="First Name"
//             name="firstName"
//             value={profile.firstName}
//             onChange={handleChange}
//           />
//           <TextField
//             fullWidth
//             label="Last Name"
//             name="lastName"
//             value={profile.lastName}
//             onChange={handleChange}
//           />
//         </Box>

//         <Box display="flex" gap={2} mb={2}>
//           <TextField
//             fullWidth
//             label="Date of Birth"
//             type="date"
//             name="date"
//             value={profile.date ?? ''}
//             onChange={handleChange}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TextField
//             fullWidth
//             label="Gender"
//             name="gender"
//             value={profile.gender}
//             onChange={handleChange}
//           />
//         </Box>

//         {/* Contact Info */}
//         <Typography variant="h6" mt={4} gutterBottom>
//           Contact Information
//         </Typography>
//         <Divider sx={{ mb: 3 }} />

//         <Box display="flex" gap={2} mb={2}>
//           <TextField
//             fullWidth
//             label="Email"
//             name="email"
//             value={profile.email}
//             onChange={handleChange}
//           />
//           <TextField
//             fullWidth
//             label="Contact Number"
//             name="phoneNumber"
//             value={profile.phoneNumber || ''}
//             onChange={handleChange}
//           />
//         </Box>

//         {/* Address Info */}
//         <Typography variant="h6" mt={4} gutterBottom>
//           Address Details
//         </Typography>
//         <Divider sx={{ mb: 3 }} />

//         <TextField
//           fullWidth
//           label="Address"
//           name="address"
//           value={profile.address || ''}
//           onChange={handleChange}
//           sx={{ mb: 2 }}
//         />

//         <Box display="flex" gap={2} mb={2}>
//           <TextField
//             fullWidth
//             label="City"
//             name="city"
//             value={profile.city || ''}
//             onChange={handleChange}
//           />
//           <TextField
//             fullWidth
//             label="State"
//             name="state"
//             value={profile.state || ''}
//             onChange={handleChange}
//           />
//           <TextField
//             fullWidth
//             label="Country"
//             name="country"
//             value={profile.country || ''}
//             onChange={handleChange}
//           />
//         </Box>

//         {/* Bio */}
//         <Typography variant="h6" mt={4} gutterBottom>
//           About You
//         </Typography>
//         <Divider sx={{ mb: 3 }} />

//         <TextField
//           fullWidth
//           multiline
//           rows={3}
//           label="Bio"
//           name="bio"
//           value={profile.bio || ''}
//           onChange={handleChange}
//         />

//         <Box mt={4} textAlign="center">
//           <CustomButton variant="contained" size="large" onClick={handleSave}>
//             Save Profile
//           </CustomButton>
//         </Box>
//       </Paper>
//   );
// };

// export default ProfilePage;
