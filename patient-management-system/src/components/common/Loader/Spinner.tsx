import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Spinner = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color:"inherit",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Spinner;



// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import CircularProgress from '@mui/material/CircularProgress';

// const Spinner = () => {
//   return (
//     <Box
//       sx={{
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: 2,
//         backgroundColor: '#f9f9f9',
//       }}
//     >
//       {/* Custom Logo - replace with your logo if needed */}
//       <img
//         src="/logo.png" // ⬅️ place your logo in public/logo.png
//         alt="App Logo"
//         width="100"
//         height="100"
//         style={{ animation: 'spin 2s linear infinite' }}
//       />

//       {/* Spinner */}
//       <CircularProgress size={40} sx={{ color: '#007b83' }} />

//       {/* Optional text */}
//       <Typography variant="subtitle1" sx={{ color: '#666' }}>
//         Loading, please wait...
//       </Typography>

//       {/* CSS Animation */}
//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </Box>
//   );
// };

// export default Spinner;
