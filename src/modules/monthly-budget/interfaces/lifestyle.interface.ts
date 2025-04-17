import * as yup from 'yup';

export const lifestyleBudgetSchema = yup.object().shape({
  subcategoryId: yup.number().required(),
  budget: yup.number().positive().required('Campo requerido'),
});

export const lifestyleSchema = yup.object().shape({
  id: yup.string().optional(),
  userId: yup.string().required('Campo requerido'),
  income: yup.number().required('Campo requerido'),
  budgets: yup.array().of(lifestyleBudgetSchema).required(),
});

export type LifestyleBudget = yup.InferType<typeof lifestyleBudgetSchema>;

export type Lifestyle = yup.InferType<typeof lifestyleSchema>;
