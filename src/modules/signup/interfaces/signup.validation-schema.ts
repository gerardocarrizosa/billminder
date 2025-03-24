import * as Yup from 'yup';

export const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name too short')
    .max(50, 'Name too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  terms: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions'
  ),
});

export type SignupFormValues = Yup.InferType<typeof signupSchema>;
