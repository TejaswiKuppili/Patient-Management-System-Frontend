import { Dialog, DialogTitle, DialogContent, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Typography } from '@mui/material';

const ShowVitalsDialog = ({ open, onClose, selectedVitals }: any) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle>Vitals for Patient</DialogTitle>
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