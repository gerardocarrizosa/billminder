import * as yup from 'yup';

export const userValidationSchema = yup.object({
  id: yup.string().required('ID is required'),
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  uid: yup.string().required('UID is required'),
  gender: yup
    .mixed<'male' | 'female' | 'other'>()
    .oneOf(['male', 'female', 'other'], 'Invalid gender')
    .optional(),
  dateOfBirth: yup
    .string()
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Date of birth must be in YYYY-MM-DD format'
    )
    .optional(),
  phoneNumber: yup
    .string()
    .matches(/^\+?[0-9]{7,15}$/, 'Invalid phone number')
    .optional(),
  profilePhoto: yup.string().url('Invalid URL').optional(),
});
