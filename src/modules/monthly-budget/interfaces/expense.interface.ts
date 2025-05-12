import { CategoriesEnum } from '@/modules/categories/categories.enum';
import * as yup from 'yup';

export const expenseSchema = yup.object().shape({
  id: yup.string().optional(),
  userId: yup.string().required('Campo requerido'),
  name: yup.string().required('El nombre del gasto es requerido'),
  amount: yup.number().positive().required(),
  categoryId: yup
    .number()
    .oneOf(Object.values(CategoriesEnum).filter((v) => typeof v === 'number'))
    .required(),
  month: yup.number().integer().positive().required(),
  subcategoryId: yup.number().required(),
  createdAt: yup.date().required(),
});

export type Expense = yup.InferType<typeof expenseSchema>;
