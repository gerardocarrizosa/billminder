// import * as Yup from 'yup';

// export const userProfileSchema = Yup.object().shape({
//   name: Yup.string()
//     .min(2, 'Name too short')
//     .max(50, 'Name too long')
//     .required('Name is required'),
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   phoneNumber: Yup.string().matches(/^[0-9()\-\s+]+$/, 'Invalid phone number'),
//   // .required('Phone number is required'),
//   gender: Yup.string().oneOf(
//     ['male', 'female', 'other'],
//     'Please select a valid option'
//   ),
//   // .required('Gender is required'),
//   profilePhoto: Yup.string(),
// });

import * as Yup from 'yup';

export const userValidationSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  uid: Yup.string().required('UID is required'),
  gender: Yup.mixed<'male' | 'female' | 'other'>()
    .oneOf(['male', 'female', 'other'], 'Invalid gender')
    .optional(),
  dateOfBirth: Yup.string()
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Date of birth must be in YYYY-MM-DD format'
    )
    .optional(),
  phoneNumber: Yup.string()
    .matches(/^\+?[0-9]{7,15}$/, 'Invalid phone number')
    .optional(),
  profilePhoto: Yup.string().url('Invalid URL').optional(),
});
