import React from 'react';
import { Box, Typography } from '@mui/material';
import { CustomContainer } from '../../../../components/common/Custom';

const AccessPending = () => {
  return (
    <CustomContainer>
      <Box textAlign="center" mt={10}>
        <Typography variant="h4" gutterBottom>
          Access Pending
        </Typography>
        <Typography variant="body1">
          Your account has been registered successfully, but access to the application is currently restricted.
          <br />
          Please wait while the Admin assigns your role.
        </Typography>
      </Box>
    </CustomContainer>
  );
};

export default AccessPending;
