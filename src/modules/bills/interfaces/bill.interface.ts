import * as yup from 'yup';
import { billValidationSchema, categorySchema } from './bill.validation-schema';

// export interface Bill2 {
//   id: string;
//   userId: string;
//   name: string;
//   categoryId: string;
//   subCategoryId: string;
//   // amount: number;
//   dueDate: string;
//   recurrenceType: string;
//   cutOffDate: string;
//   paymentDeadline: string;
//   // isPaid: boolean;
// }

export type Bill = yup.InferType<typeof billValidationSchema>;

export type Category = yup.InferType<typeof categorySchema>;

// export interface Payment {
//   billId: string;
//   bill: Bill;
//   ammount: number;
//   status: 'due' | 'paid';
//   paidAt: Date;
//   createdAt: Date;
// }

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
