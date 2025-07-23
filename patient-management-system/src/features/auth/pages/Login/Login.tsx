// import { Formik, Form } from 'formik';
// import { login as loginUser } from '../../api/authApi';
// import { LoginRequest } from '../../types';
// import * as Yup from 'yup';
// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHospitalSymbol } from '@fortawesome/free-solid-svg-icons';
// import {
//   Box,
//   Typography,
//   Alert,
// } from '@mui/material';
// import { CustomButton, CustomContainer, CustomTextField } from '../../../../components/common/Custom';
// import { PasswordField } from '../../../../components/common/Custom/PasswordField';
// import { toast } from 'react-toastify';

// const LoginSchema = Yup.object().shape({
//   email: Yup.string()
//     .required('Email is required')
//     // .email('Enter a valid email address')
//     .matches(
//       /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
//       'Email must be in a valid format like user@example.com'
//     ),

//   password: Yup.string()
//     .required('Password is required')
//     .min(5, 'Password must be at least 5 characters long')
//     .matches(/[a-z]/, 'Must include at least one lowercase letter')
//     .matches(/[A-Z]/, 'Must include at least one uppercase letter')
//     .matches(/\d/, 'Must include at least one number')
//     // .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must include at least one special character'),
// });

// export const Login = () => {
//   const [serverError, setServerError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (values: LoginRequest) => {
//     setLoading(true);
//     try {
//       const response = await loginUser(values);  
//       const userDetails = response?.userDetails;
//       const userRole = userDetails?.roleName ?? null;
  
//       if (!userRole) {
//         navigate('/access-pending'); // No role assigned yet
//       } 
//       else if (userRole === 'Admin') {
//         navigate('/dashboard/assign-roles'); // Admin role
//       } 
//       else if (userRole === 'Doctor'){
//         navigate('/dashboard/patients'); //Doctor role
//       }
//       else {
//         navigate('/access-pending'); // Other roles
//       }
  
//       toast.success('Login successful');
//     } catch (error: any) {
//       console.error('Login Error:', error);
//       setServerError(error?.response?.data?.message || 'Something went wrong');
//       toast.error('Login failed due to some connectivity issues. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <CustomContainer>
//       <Box textAlign="center">
//         <FontAwesomeIcon icon={faHospitalSymbol} size="2x" color="#007C7B" />
//         <Typography variant="h5" component="h1" mt={1}
//         sx = {{ fontWeight: 'bold', color: '#007b83' }}>
//           C9 SmartCare
//         </Typography>
//         <Typography variant="h6" mt={2} mb={3}
//         sx = {{ fontWeight: 'bold', color: '#007b83' }}>
//           Login
//         </Typography>
//       </Box>

//       <Formik
//         initialValues={{ email: '', password: '' }}
//         validationSchema={LoginSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting, handleChange, handleBlur, values, errors, touched }) => (
//           <Form autoComplete="off">
//             <Box mt={3}>
//               <CustomTextField
//                 id="email"
//                 name="email"
//                 label="Email"
//                 type="email"
//                 autoComplete="off"
//                 value={values.email}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.email && Boolean(errors.email)}
//                 helperText={touched.email && errors.email}
//               />

//             <PasswordField
//             id="password"
//             name="password"
//             label="Password"
//             type="password"
//             autoComplete="new-password"
//             value={values.password}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={touched.password && Boolean(errors.password)}
//             helperText={touched.password && errors.password}
//             />

//               {serverError && (
//                 <Alert severity="error" sx={{ mt: 2 }}>
//                   {serverError}
//                 </Alert>
//               )}

//               <CustomButton
//                 type="submit"
//                 variant="contained"
//                 loading={loading}
//                 sx={{ mt: 3, width: '100%' }}
//               >
//                 Login
//               </CustomButton>

//               <Box mt={2} textAlign="center">
//                 <Typography variant="body2">
//                   Don’t have an account?{' '}
//                   <Link to="/register" style={{ color: '#007C7B' }}>
//                     Register
//                   </Link>
//                 </Typography>
//               </Box>
//             </Box>
//           </Form>
//         )}
//       </Formik>
//     </CustomContainer>
//   );
// };


import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospitalSymbol } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { CustomButton, CustomContainer, CustomTextField } from '../../../../components/common/Custom';
import { PasswordField } from '../../../../components/common/Custom/PasswordField';
import { toast } from 'react-toastify';
import { LoginRequest } from '../../types';
import { useAuthContext } from '../../AuthProvider';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .matches(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Email must be in a valid format like user@example.com'
    ),
  password: Yup.string()
    .required('Password is required')
    .min(5, 'Password must be at least 5 characters long')
    .matches(/[a-z]/, 'Must include at least one lowercase letter')
    .matches(/[A-Z]/, 'Must include at least one uppercase letter')
    .matches(/\d/, 'Must include at least one number'),
});

export const Login = () => {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();

  const handleSubmit = async (values: LoginRequest) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      toast.success('Login successful');
    } catch (error: any) {
      console.error('Login Error:', error);
      setServerError(error?.response?.data?.message || 'Something went wrong');
      toast.error('Login failed due to some connectivity issues. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomContainer>
      <Box textAlign="center">
        <FontAwesomeIcon icon={faHospitalSymbol} size="2x" color="#007C7B" />
        <Typography variant="h5" component="h1" mt={1} sx={{ fontWeight: 'bold', color: '#007b83' }}>
          C9 SmartCare
        </Typography>
        <Typography variant="h6" mt={2} mb={3} sx={{ fontWeight: 'bold', color: '#007b83' }}>
          Login
        </Typography>
      </Box>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <Form autoComplete="off">
            <Box mt={3}>
              <CustomTextField
                id="email"
                name="email"
                label="Email"
                type="email"
                autoComplete="off"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <PasswordField
                id="password"
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              {serverError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {serverError}
                </Alert>
              )}

              <CustomButton
                type="submit"
                variant="contained"
                loading={loading}
                sx={{ mt: 3, width: '100%' }}
              >
                Login
              </CustomButton>

              <Box mt={2} textAlign="center">
                <Typography variant="body2">
                  Don’t have an account?{' '}
                  <Link to="/register" style={{ color: '#007C7B' }}>
                    Register
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </CustomContainer>
  );
};
