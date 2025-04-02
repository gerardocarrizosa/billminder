import * as yup from 'yup';
import { paymentSchema } from './payment.validation-schema';

export type Payment = yup.InferType<typeof paymentSchema>;
