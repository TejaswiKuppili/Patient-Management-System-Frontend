import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Paper,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/material.css';
import { useAuthContext } from '../../features/auth/AuthProvider';
import { CustomButton } from '../common/Custom';
import { Profile } from './types/profileTypes';
import { fetchUserProfile, updateUserProfile } from './api/profileApi';

const ProfilePage = () => {
    const { user } = useAuthContext();

    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        contactNumber: '',
        profilePicture: '',
        address: '',
        city: '',
        state: '',
        country: '',
        bio: '',
      });
      
    const [hasFetchedProfile, setHasFetchedProfile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formState, setFormState] = useState<Partial<Profile>>({});
    useEffect(() => {
      const loadProfile = async () => {
        if (!user) return;
    
        try {
          const userProfile = await fetchUserProfile(user.id);
          if (userProfile) {
            setProfile(prev => ({
              ...prev,
              ...userProfile,
            }));            
            setHasFetchedProfile(true);
          }
        } catch (err) {
          console.warn('Could not fetch full profile, falling back to context');
        }
      };
    
      loadProfile();
    }, [user]);         

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
          ...prev,
          [name]: value,
        }));
      };
      
      const handleSave = async () => {
        if (!user) return;
      
        try {
          await updateUserProfile({
            ...profile,
            ...formState,
          } as Profile);
      
          // After update, always fetch profile from backend
          const updatedProfile = await fetchUserProfile(user.id);
          setProfile(updatedProfile);
          setHasFetchedProfile(true);
          setIsEditing(false);
        } catch (err) {
          console.error('Failed to update profile:', err);
        }
      };      

    if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Paper
        elevation={3}
        sx={{
            width: '100vw',          
            maxWidth: '1000px',      // Limits max width for large screens
            height: 'auto',          // Auto height instead of fixed
            maxHeight: '85vh',       // Prevent overflow on very tall screens
            overflowY: 'auto',
            mt: '0px !important',
            m: '40px auto',          // Center with vertical spacing
            p: 5,
            backgroundColor: '#ffffff',
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
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
          />
        </Box>

        <Box display="flex" gap={2} mb={2}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={profile.dateOfBirth ?? ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Gender"
            name="gender"
            value={profile.gender}
            onChange={handleChange}
          />
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
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Contact Number"
            name="contactNumber"
            value={profile.contactNumber || ''}
            onChange={handleChange}
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
          value={profile.address || ''}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <Box display="flex" gap={2} mb={2}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={profile.city || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="State"
            name="state"
            value={profile.state || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={profile.country || ''}
            onChange={handleChange}
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
          value={profile.bio || ''}
          onChange={handleChange}
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
