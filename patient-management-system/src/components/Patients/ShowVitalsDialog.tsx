import { Dialog, DialogTitle, DialogContent, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Typography, Box, Tooltip, IconButton } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const ShowVitalsDialog = ({ open, onClose, selectedVitals }: any) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle color="primary">
      Vitals for Patient
      <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
        <Tooltip title="Cancel">
          <IconButton onClick={onClose} color="primary">
            <CancelOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </DialogTitle>
    <DialogContent>
      {selectedVitals.length === 0 ? (
        <Typography>No vitals recorded.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Recorded At</TableCell>
                <TableCell>Blood Pressure</TableCell>
                <TableCell>Heart Rate</TableCell>
                <TableCell>Temperature</TableCell>
                <TableCell>Respiratory Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedVitals.map((vitals: any, i: number) => (
                <TableRow key={i}>
                  <TableCell>{vitals.recordedAt}</TableCell>
                  <TableCell>{vitals.bloodPressure}</TableCell>
                  <TableCell>{vitals.heartRate}</TableCell>
                  <TableCell>{vitals.temperature}</TableCell>
                  <TableCell>{vitals.respiratoryRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DialogContent>
  </Dialog>
);

export default ShowVitalsDialog;