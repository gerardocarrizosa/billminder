import * as yup from 'yup';
import { billValidationSchema, categorySchema } from './bill.validation-schema';
import { Payment } from './payment.interface';

export type Bill = yup.InferType<typeof billValidationSchema>;

export type BillWithIncludes = Bill & { payments?: Payment[] };

export type BillCardStatus = 'paid' | 'due' | 'NA';

export interface BillCardData {
  bill: Bill;
  status: BillCardStatus;
}

export type Category = yup.InferType<typeof categorySchema>;

// export interface Expense {
//   name: string;
//   ammount: number;
//   categoryId: string;
//   subcategoryId: string;
//   createdAt: Date;
// }

// export interface Category {
//   name: string;
//   subcategories: Subcategory[];
// }

// export interface Subcategory {
//   name: string;
// }
