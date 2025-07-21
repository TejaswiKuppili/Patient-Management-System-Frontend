import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  CardActionArea,
  Box,
} from "@mui/material";
import useDoctors from "./useDoctorsHook";

const Appointments = () => {
  const { doctors, loading, error } = useDoctors();
  const navigate = useNavigate();

  if (loading)
    return (
      <Typography variant="h6" align="center" mt={4}>
        Loading doctors...
      </Typography>
    );
  if (error)
    return (
      <Typography variant="h6" align="center" color="error" mt={4}>
        {error}
      </Typography>
    );

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      gap={3}
      padding={4}
    >
      {doctors.map((doctor) => (
        <Box key={doctor.id} position="relative" width={280}>
          {/* Horizontal Top Ribbon */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 32,
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              zIndex: 1,
            }}
          >
            Book Appointment
          </Box>

          <Card
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: 3,
              textAlign: "center",
              pt: 5, // padding-top to avoid ribbon overlap
              transition: "0.3s",
              "&:hover": { transform: "scale(1.03)" },
              position: "relative",
            }}
          >
            <CardActionArea onClick={() => navigate(`/dashboard/appointments/${doctor.id}/${encodeURIComponent(doctor.name)}`)}>
              <CardContent>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    margin: "0 auto 10px",
                    bgcolor: "primary.main",
                    fontSize: 24,
                  }}
                >
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {doctor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {doctor.specialtyName}
                </Typography>
                {doctor.emailId && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {doctor.emailId}
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default Appointments;
