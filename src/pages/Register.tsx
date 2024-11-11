import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './RegisterForm.css'; // Import external CSS file for animations
import { registerUser } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Password confirmation is required'),
  });

  const onSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setSubmitting(true);
    try {
      await registerUser(values);
      navigate('/login');
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration error:', error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error('Registration error:', error.message);
      } else {
        console.error('An unexpected error occurred');
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>
        <p className="text-center text-gray-600 mb-8">Please fill in the information below to create your account.</p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-6">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                <Field
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                <Field
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="last_name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="loading-dots flex items-center">
                    <div className="dot bg-white w-2.5 h-2.5 rounded-full mr-1 animate-bounce"></div>
                    <div className="dot bg-white w-2.5 h-2.5 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="dot bg-white w-2.5 h-2.5 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  'Register'
                )}
              </button>

              <p className="text-center text-gray-600 mt-4">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>.</p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterForm;