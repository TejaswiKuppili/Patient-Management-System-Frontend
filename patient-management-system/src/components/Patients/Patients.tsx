import { useState, useEffect } from 'react';
import usePatients from './usePatientsHook';
import { Patient, Vitals } from './patientTypes';
import { getLocalISODateTime } from '../../utils/dateUtils';
import { addPatient, addVitals, fetchVitalsByPatientId } from './patientApi';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  InputAdornment
} from '@mui/material';
import { CustomButton } from '../common/Custom';
import { Search } from '@mui/icons-material';
import { useDateFormatter } from '@react-aria/i18n';

const Patients = () => {
  const formatter = useDateFormatter({ dateStyle: "long" });
  const { patients, loading, error, refetch } = usePatients();
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [message, setMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddVitalsForm, setShowAddVitalsForm] = useState(false);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof typeof patients[0] | null; direction: 'asc' | 'desc'}>({
      key: null,
      direction: 'asc'
    });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    address: '',
    reasonForVisit: '',
  });

  const [vitals, setVitals] = useState({
    recordedAt: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
  });

  const [selectedVitals, setSelectedVitals] = useState<Vitals[]>([]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    setFilteredPatients(
      patients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [patients, searchTerm]);

  const handleSort = (key: keyof typeof patients[0]) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedPatients = [...filteredPatients].sort((a,b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if(typeof aValue === 'string' && typeof bValue === 'string'){
      return sortConfig.direction === 'asc'
        ?aValue.localeCompare(bValue)
        :bValue.localeCompare(aValue);
    }
    return 0;
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddPatient = async () => {
    if (
      !newPatient.firstName ||
      !newPatient.lastName ||
      !newPatient.dateOfBirth ||
      !newPatient.gender ||
      !newPatient.contactNumber ||
      !newPatient.address ||
      !newPatient.reasonForVisit
    ) {
      setMessage("Please fill in all the details.");
      return;
    }
  
    try {
      await addPatient(newPatient);
      await refetch();
      setMessage(`Patient ${newPatient.firstName} ${newPatient.lastName} added successfully`);
      setNewPatient({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        address: '',
        reasonForVisit: '',
      });
      setShowAddPatientForm(false);
    } catch (error: any) {
      setMessage(error.response?.data || error.message);
    }
  };
  
  const handleAddVitals = async () => {
    if (!vitals.recordedAt || !vitals.bloodPressure || !vitals.heartRate || !vitals.temperature || !vitals.respiratoryRate) {
      setMessage("Please fill in all vitals.");
      return;
    }

    if (!selectedPatient?.id) {
      setMessage("No patient selected.");
      return;
    }

    try {
      const vitalsPayload = {
        patientId: selectedPatient.id,
        ...vitals,
      };

      await addVitals(vitalsPayload);
      await refetch();
      setMessage(`Vitals recorded for ${selectedPatient.firstName} ${selectedPatient.lastName}`);
      setVitals({ recordedAt: '', bloodPressure: '', heartRate: '', temperature: '', respiratoryRate: '' });
      setShowAddVitalsForm(false);
    } catch (error: any) {
      setMessage(error.response?.data || error.message);
    }
  };

  const handleSelectedPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setVitals({
      recordedAt: getLocalISODateTime(),
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
    });
    setShowAddVitalsForm(true);
  };

  const handleShowVitals = async (patientId: number) => {
    try {
      const vitals = await fetchVitalsByPatientId(patientId);
      setSelectedVitals(vitals);
      setShowVitalsModal(true);
    } catch (error: any) {
      setMessage(error.response?.data || error.message);
    }
  };

  return (
    <Box sx={{ p: 5, pb: 2, backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#007b83' }}>Patients List</Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ width: '250px' }}
        />

        <CustomButton
          onClick={() => setShowAddPatientForm(true)}
          variant="contained"
          sx={{
            width: '150px',
            color: '#fff',
            backgroundColor: '#00b3b3',
            '&:hover': { backgroundColor: '#009999' },
          }}
        >
          Add Patient
        </CustomButton>
      </Box>
    </Box>

      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
{loading ? (
  <Box display="flex" justifyContent="center" mt={4}>
    <CircularProgress />
  </Box>
) : (
  <Box sx={{ mx: 'auto', mt: 3 }}>
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort('visitDate')} sx={{ cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
              Visit Date
            </TableCell>
            <TableCell onClick={() => handleSort('firstName')} sx={{ cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
              Name {sortConfig.key === 'firstName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </TableCell>
            <TableCell onClick={() => handleSort('dateOfBirth')} sx={{ cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
              DOB {sortConfig.key === 'dateOfBirth' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </TableCell>
            <TableCell onClick={() => handleSort('gender')} sx={{ cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
              Gender {sortConfig.key === 'gender' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#77D5CB' }}>Contact</TableCell>
            <TableCell onClick={() => handleSort('address')} sx={{ cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
              Address {sortConfig.key === 'address' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </TableCell>
            <TableCell onClick={() => handleSort('reasonForVisit')} sx={{ cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#77D5CB' }}>
              Reason {sortConfig.key === 'reasonForVisit' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#77D5CB' }}>Actions</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#77D5CB' }}>Vitals</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredPatients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">No patients found.</TableCell>
            </TableRow>
          ) : (
            sortedPatients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(patient => (
                <TableRow key={patient.id}>
                  <TableCell>{formatter.format(new Date())}</TableCell>
                  <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                  <TableCell>{formatter.format(new Date(patient.dateOfBirth))}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.contactNumber}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>{patient.reasonForVisit}</TableCell>
                  <TableCell>
                    <CustomButton
                      variant="outlined"
                      sx={{
                        color: '#007b83',
                        borderColor: '#007b83',
                        '&:hover': { borderColor: '#F5FBF9', color: '#F5FBF9' },
                      }}
                      onClick={() => handleSelectedPatient(patient)}
                    >
                      Add Vitals
                    </CustomButton>
                  </TableCell>
                  <TableCell>
                    <CustomButton
                      variant="outlined"
                      sx={{
                        color: '#007b83',
                        borderColor: '#007b83',
                        '&:hover': { borderColor: '#F5FBF9', color: '#F5FBF9' },
                      }}
                      onClick={() => handleShowVitals(patient.id)}
                    >
                      Show Vitals
                    </CustomButton>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={filteredPatients.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Box>
)}


      {/* Add Patient Dialog */}
      <Dialog open={showAddPatientForm} onClose={() => setShowAddPatientForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="First Name" value={newPatient.firstName} onChange={(e) => setNewPatient(prev => ({ ...prev, firstName: e.target.value }))} fullWidth />
          <TextField label="Last Name" value={newPatient.lastName} onChange={(e) => setNewPatient(prev => ({ ...prev, lastName: e.target.value }))} fullWidth />
          <TextField
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newPatient.dateOfBirth}
            onChange={(e) => setNewPatient(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            fullWidth
          />
          <Select
            value={newPatient.gender}
            onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value }))}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          <TextField label="Contact Number" value={newPatient.contactNumber} onChange={(e) => setNewPatient(prev => ({ ...prev, contactNumber: e.target.value }))} fullWidth />
          <TextField label="Address" value={newPatient.address} onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))} fullWidth />
          <TextField label="Reason for Visit" value={newPatient.reasonForVisit} onChange={(e) => setNewPatient(prev => ({ ...prev, reasonForVisit: e.target.value }))} fullWidth />
        </DialogContent>
        <DialogActions>
          <CustomButton variant="outlined" onClick={() => setShowAddPatientForm(false)}
            sx={{'&:hover': { borderColor: '#F5FBF9', color: '#F5FBF9' }}}>Cancel</CustomButton>
          <CustomButton variant="contained" onClick={handleAddPatient}>Add Patient</CustomButton>
        </DialogActions>
      </Dialog>


      {/* Add Vitals Dialog */}
      <Dialog open={showAddVitalsForm} onClose={() => setShowAddVitalsForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Record Vitals</DialogTitle>
        <DialogContent sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Patient" value={`${selectedPatient?.firstName} ${selectedPatient?.lastName}`} disabled fullWidth />
          <TextField label="Recorded At" type="datetime-local" value={vitals.recordedAt} disabled fullWidth />
          <TextField label="Blood Pressure" value={vitals.bloodPressure} onChange={(e) => setVitals(prev => ({ ...prev, bloodPressure: e.target.value }))} fullWidth />
          <TextField label="Heart Rate" value={vitals.heartRate} onChange={(e) => setVitals(prev => ({ ...prev, heartRate: e.target.value }))} fullWidth />
          <TextField label="Temperature" value={vitals.temperature} onChange={(e) => setVitals(prev => ({ ...prev, temperature: e.target.value }))} fullWidth />
          <TextField label="Respiratory Rate" value={vitals.respiratoryRate} onChange={(e) => setVitals(prev => ({ ...prev, respiratoryRate: e.target.value }))} fullWidth />
        </DialogContent>
        <DialogActions>
          <CustomButton variant='outlined'
          onClick={() => setShowAddVitalsForm(false)}
          sx={{
                          color: '#007b83',
                          borderColor: '#007b83',
                          '&:hover': { borderColor: '#F5FBF9', color: '#F5FBF9' },
            }}>
            Cancel
          </CustomButton>
          <CustomButton variant="contained" onClick={handleAddVitals}>Submit</CustomButton>
        </DialogActions>
      </Dialog>

      {/* Show Vitals Dialog */}
      <Dialog open={showVitalsModal} onClose={() => setShowVitalsModal(false)} fullWidth maxWidth="md">
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
                  {selectedVitals.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell>{v.recordedAt}</TableCell>
                      <TableCell>{v.bloodPressure}</TableCell>
                      <TableCell>{v.heartRate}</TableCell>
                      <TableCell>{v.temperature}</TableCell>
                      <TableCell>{v.respiratoryRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Patients;

// import { useState, useEffect } from 'react';
// import './Patients.css';
// import Modal from '../common/Modal/Modal';
// import usePatients from './usePatientsHook';
// import { Patient, Vitals } from './patientTypes';
// import { getLocalISODateTime } from '../../utils/dateUtils';
// import { addPatient, addVitals, fetchVitalsByPatientId } from './patientApi';
// import { useDateFormatter } from '@react-aria/i18n';

// // This component displays a list of patients, allows adding vitals for each patient, and handles the UI interactions.
// const Patients = () => {
//   const formatter = useDateFormatter({ dateStyle: "long" });
//   const { patients, loading, error, refetch } = usePatients();
//   const [message, setMessage] = useState('');
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const[showAddVitalsForm, setShowAddVitalsForm] = useState(false);
//   const [showAddPatientForm, setShowAddPatientForm] = useState(false);
//   const [newPatient, setNewPatient] = useState({
//     firstName: '',
//     lastName: '',
//     dateOfBirth: '',
//     gender: '',
//     contactNumber: '',
//     address: '',
//     reasonForVisit: '',
//   });

//   const [vitals, setVitals] = useState({
//     recordedAt: '',
//     bloodPressure: '',
//     heartRate: '',
//     temperature: '',
//     respiratoryRate: '',
//   });

//   const [selectedVitals, setSelectedVitals] = useState<Vitals[]>([]);
//   const [showVitalsModal, setShowVitalsModal] = useState(false);


//   // This effect clears the message after 3 seconds.
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(''), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // This function validates the new patient data, calls the API to add the patient, and updates the UI accordingly.
//   const handleAddPatient = async () => {
//     if (!newPatient.firstName || !newPatient.lastName || !newPatient.dateOfBirth || !newPatient.gender 
//       || !newPatient.contactNumber || !newPatient.address || !newPatient.reasonForVisit) 
//     {
//       setMessage("Please fill in all the details.");
//       return;
//     }
  
//     try {
//       const result = await addPatient(newPatient);
//       console.log("Patient added result:", result); // Check what server sends back
//       await refetch();
//       setMessage(`Patient ${newPatient.firstName} ${newPatient.lastName} added successfully`);
//       setNewPatient({
//         firstName: '',
//         lastName: '',
//         dateOfBirth: '',
//         gender: '',
//         contactNumber: '',
//         address: '',
//         reasonForVisit: '',
//       });
//       setShowAddPatientForm(false);
//     } catch (error: any) {
//       setMessage(error.response?.data || error.message);
//     }
//   };  

//   /*
//     This function sets the selected patient and opens the vitals form and 
//     initializes the vitals form with the current date and time.
//   */
  // const handleSelectedPatient = (patient: Patient) => {
  //   setSelectedPatient(patient);
  //   setVitals({
  //     recordedAt: getLocalISODateTime(),
  //     bloodPressure: '',
  //     heartRate: '',
  //     temperature: '',
  //     respiratoryRate: '',
  //   });
  //   setShowAddVitalsForm(true);
  // };

//   // This function sets the selected patient and opens the vitals form.
//   const handleAddVitals = async () => {
//     if (
//       !vitals.recordedAt ||
//       !vitals.bloodPressure ||
//       !vitals.heartRate ||
//       !vitals.temperature ||
//       !vitals.respiratoryRate
//     ) {
//       setMessage("Please fill in all vitals.");
//       return;
//     }
  
//     if (!selectedPatient?.id) {
//       setMessage("No patient selected.");
//       return;
//     }
  
//     try {
//       const vitalsPayload = {
//         patientId: selectedPatient.id,
//         ...vitals,
//       };
  
//       const result = await addVitals(vitalsPayload);
//       console.log("Vitals added result:", result); // Debug log
  
//       await refetch();
//       setMessage(`Vitals recorded for ${selectedPatient.firstName} ${selectedPatient.lastName}`);
  
//       setVitals({
//         recordedAt: '',
//         bloodPressure: '',
//         heartRate: '',
//         temperature: '',
//         respiratoryRate: '',
//       });
  
//       setShowAddVitalsForm(false);
//     } catch (error: any) {
//       setMessage(error.response?.data || error.message);
//     }
//   };

//   // This function displays the selected patient's vitals details.
//   const handleShowVitals = async (patientId: number) => {
//     try {
//       const vitals = await fetchVitalsByPatientId(patientId);
//       setSelectedVitals(vitals);
//       setShowVitalsModal(true);
//     } catch (error: any) {
//       setMessage(error.response?.data || error.message);
//     }
//   };
  

//   return (
//     <div className="patients-container">
//       <h2>Patients List</h2>
//       {message && <div className="info-message">{message}</div>}
//       {error && <div className="error-message">{error}</div>}
//       <button onClick={() => setShowAddPatientForm(true)}>Add Patient</button>
//       {loading ? (
//         <div>Loading patients...</div>
//       ) : (
//         <div className={`patients-table-scroll-wrapper ${showAddVitalsForm ? 'modal-open' : ''}`}>
//           <table className="patients-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Date of Birth</th>
//               <th>Gender</th>
//               <th>Contact Number</th>
//               <th>Address</th>
//               <th>Reason For Visit</th>
//               <th>Actions</th>
//               <th>Vitals Summary</th>
//             </tr>
//           </thead>
//           <tbody>
//             {patients.map((patient: Patient) => (
//               <tr key={patient.id}>
//                 <td>{`${patient.firstName} ${patient.lastName}` }</td>
//                 <td>{formatter.format(new Date(patient.dateOfBirth))}</td>
//                 <td>{patient.gender}</td>
//                 <td>{patient.contactNumber}</td>
//                 <td>{patient.address}</td>
//                 <td>{patient.reasonForVisit}</td>
//                 <td>
//                 <button onClick={() => handleSelectedPatient(patient)}>Add Vitals</button>
//                 </td>
//                 <td>
//                 <button onClick={() => handleShowVitals(patient.id)}>Show Vitals</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           </table>
//         </div>
//       )}

// {showAddPatientForm && (
//   <Modal onClose={() => setShowAddPatientForm(false)}
//   className="add-patient-btn">
//     <h3>Add Patient</h3>
//     <div className="modal-form">
//       <input
//         type="text"
//         placeholder="First Name"
//         value={newPatient.firstName}
//         onChange={e => setNewPatient(prev => ({ ...prev, firstName: e.target.value }))}
//       />
//       <input
//         type="text"
//         placeholder="Last Name"
//         value={newPatient.lastName}
//         onChange={e => setNewPatient(prev => ({ ...prev, lastName: e.target.value }))}
//       />
//       <input
//         type="text"
//         placeholder="Date Of Birth"
//         value={newPatient.dateOfBirth}
//         onFocus={e => (e.target.type = 'date')}
//         onBlur={e => (e.target.type = newPatient.dateOfBirth ? 'date' : 'text')}
//         onChange={e => setNewPatient(prev => ({ ...prev, dateOfBirth: e.target.value }))}
//       />

//       <select
//         value={newPatient.gender}
//         onChange={e => setNewPatient(prev => ({ ...prev, gender: e.target.value }))}
//       >
//         <option value="" disabled>Select Gender</option>
//         <option value="Male">Male</option>
//         <option value="Female">Female</option>
//         <option value="Female">Other</option>
//       </select>
//       <input
//         type="text"
//         placeholder="Contact Number"
//         value={newPatient.contactNumber}
//         onChange={e => setNewPatient(prev => ({ ...prev, contactNumber: e.target.value }))}
//       />
//       <input
//         type="text"
//         placeholder="Address"
//         value={newPatient.address}
//         onChange={e => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
//       />
//       <input
//         type="text"
//         placeholder="Reason for Visit"
//         value={newPatient.reasonForVisit}
//         onChange={e => setNewPatient(prev => ({ ...prev, reasonForVisit: e.target.value }))}
//       />
//       <button onClick={handleAddPatient}>Submit</button>
//     </div>
//   </Modal>
// )}

// {showAddVitalsForm && (
//         <Modal onClose={() => setShowAddVitalsForm(false)}
//         className="add-vitals-btn">
//           <h3>Record Vitals</h3>
//           <div className="modal-form">
//             <input type="text" value={`${selectedPatient?.firstName} ${selectedPatient?.lastName}`} disabled />
//             <input
//               type="datetime-local"
//               value={vitals.recordedAt}
//               disabled
//             />
//             <input
//               type="text"
//               placeholder="Blood Pressure"
//               value={vitals.bloodPressure}
//               onChange={e => setVitals(prev => ({ ...prev, bloodPressure: e.target.value }))}
//             />
//             <input
//               type="text"
//               placeholder="Heart Rate"
//               value={vitals.heartRate}
//               onChange={e => setVitals(prev => ({ ...prev, heartRate: e.target.value }))}
//             />
//             <input
//               type="text"
//               placeholder="Temperature"
//               value={vitals.temperature}
//               onChange={e => setVitals(prev => ({ ...prev, temperature: e.target.value }))}
//             />
//             <input
//               type="text"
//               placeholder="Respiratory Rate"
//               value={vitals.respiratoryRate}
//               onChange={e => setVitals(prev => ({ ...prev, respiratoryRate: e.target.value }))}
//             />
//             <button onClick={handleAddVitals}>Submit</button>
//           </div>
//         </Modal>
//       )}

//       {showVitalsModal && (
//         <Modal onClose={() => setShowVitalsModal(false)}
//         className="vitals-modal-box">
//           <h3>Vitals for Patient</h3>
//           {selectedVitals.length === 0 ? (
//             <div>No vitals recorded.</div>
//           ) : (
//             <table className="vitals-table">
//               <thead>
//                 <tr>
//                   <th>Recorded At</th>
//                   <th>Blood Pressure</th>
//                   <th>Heart Rate</th>
//                   <th>Temperature</th>
//                   <th>Respiratory Rate</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedVitals.map((vital, index) => (
//                   <tr key={index}>
//                     <td>{vital.recordedAt}</td>
//                     <td>{vital.bloodPressure}</td>
//                     <td>{vital.heartRate}</td>
//                     <td>{vital.temperature}</td>
//                     <td>{vital.respiratoryRate}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Patients;
