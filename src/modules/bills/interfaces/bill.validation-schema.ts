import * as yup from 'yup';

export const billValidationSchema = yup.object().shape({
  id: yup.string().optional(),
  userId: yup.string().required(),
  name: yup.string().required(),
  color: yup.string().required(),
  type: yup
    .mixed<'credit_card' | 'service' | 'subscription'>()
    .oneOf(['credit_card', 'service', 'subscription'])
    .required(),
  status: yup
    .mixed<'active' | 'inactive'>()
    .oneOf(['active', 'inactive'])
    .required(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required(),
});

export const categorySchema = yup.object().shape({
  id: yup.string().optional(),
  name: yup.string().required('Category name is required'),
  createdAt: yup.date().default(() => new Date()),
});
