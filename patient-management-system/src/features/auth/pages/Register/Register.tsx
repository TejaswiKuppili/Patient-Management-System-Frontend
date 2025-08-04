import {Formik, Form, Field, ErrorMessage} from 'formik';
import {register as registerUser} from '../../api/authApi';
import { RegisterRequest } from '../../types';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import {useState} from 'react';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospitalSymbol } from '@fortawesome/free-solid-svg-icons';
import { CustomButton, CustomContainer, CustomTextField } from '../../../../components/common/Custom';
import { Alert, Box, Typography } from '@mui/material';
import { PasswordField } from '../../../../components/common/Custom/PasswordField';
import { toast } from 'react-toastify';

// Validation schema for the registration form
const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], "Passwords do not match").required('Confirm Password is required')
});

// This component handles user registration functionality
export const Register = () => {
    const navigate = useNavigate();
    const[serverError, setServerError] = useState('');
    const[loading, setLoading] = useState(false);

    const handleSubmit = async (values: RegisterRequest) => {
        setLoading(true);
        setServerError('');
        try{
          const response = await registerUser(values); // get success & message

          if (response.success === true) {
            toast.success(response.message || 'Registration successful! Please login to continue.');
            navigate('/login');
          } else {
            // setServerError(response.message || 'Registration failed.');
            toast.error(response.message || 'Registration failed. Please try again.');
          }
        }
          catch(error: any){
            const errorMessage = error?.response?.data?.message || 'Something went wrong';
            setServerError(errorMessage);
            toast.error(errorMessage);
        }
        finally{
            setLoading(false);
        }
    };

    return(
        <CustomContainer>
            <Box textAlign="center">
                <FontAwesomeIcon icon={faHospitalSymbol} size="2x" color="#007C7B" />
                <Typography variant="h5" component="h1" mt={1}
                sx = {{ fontWeight: 'bold', color: '#007b83' }}>
                    C9 SmartCare
                </Typography>
                <Typography variant="h6" mt={2} mb={3}
                sx = {{ fontWeight: 'bold', color: '#007b83' }}>
                    Register
                </Typography>
            </Box>

            <Formik
                initialValues = {{ name: '', email: '', password: '', confirmPassword: '', roleName: ''}}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <CustomTextField
              id="name"
              name="name"
              label="Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <CustomTextField
              id="email"
              name="email"
              label="Email"
              type="email"
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
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />

            {serverError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {serverError}
              </Alert>
            )}

            <CustomButton
              type="submit"
              loading={loading}
              variant="contained"
              sx={{ mt: 3, width: '100%' }}
            >
              Register
            </CustomButton>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#007C7B' }}>
                  Login
                </Link>
              </Typography>
            </Box>
          </Form>
        )}
            </Formik>
        </CustomContainer>
    );
}