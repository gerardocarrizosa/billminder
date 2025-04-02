import * as yup from 'yup';

export const paymentSchema = yup.object({
  id: yup.string().optional(),
  billId: yup.string().required('Bill ID is required'),
  amount: yup
    .number()
    .positive('Amount must be a positive number')
    .required('Amount is required'),
  paidAt: yup.date().required('Paid date is required'),
  createdAt: yup.date().required('Created date is required'),
});
