import * as yup from 'yup';

export const expenseSchema = yup.object().shape({
  id: yup.string().optional(),
  userId: yup.string().required('Campo requerido'),
  name: yup.string().required('El nombre del gasto es requerido'),
  amount: yup.number().positive().required(),
  categoryId: yup.string().required('La categoria del gasto es requerida'),
  subcategoryId: yup
    .string()
    .required('La subcategoria del gasto es requerida'),
  createdAt: yup.date().required(),
});

export type Expense = yup.InferType<typeof expenseSchema>;
