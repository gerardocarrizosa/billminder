import * as Yup from 'yup';

export const userProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name too short')
    .max(50, 'Name too long')
    .required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9()\-\s+]+$/, 'Invalid phone number')
    .required('Phone number is required'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Please select a valid option')
    .required('Gender is required'),
  profilePhoto: Yup.string(),
});
