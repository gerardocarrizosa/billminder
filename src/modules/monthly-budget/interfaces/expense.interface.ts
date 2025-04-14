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
  subcategoryId: yup.number().required(),
  // categoryId: yup.string().required('La categoria del gasto es requerida'),
  // subcategoryId: yup
  //   .string()
  //   .required('La subcategoria del gasto es requerida'),
  createdAt: yup.date().required(),
});

export type Expense = yup.InferType<typeof expenseSchema>;
