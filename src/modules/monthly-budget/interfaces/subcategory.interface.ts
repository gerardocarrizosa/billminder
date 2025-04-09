import * as yup from 'yup';

export const subcategorySchema = yup.object().shape({
  id: yup.string().optional(),
  name: yup.string().required('El nombre de la subcategoria es requerido'),
  categoryId: yup.string().required('Categoria es requerida'),
  necessity: yup.boolean().required(),
  createdAt: yup.date().required(),
});

export type Subcategory = yup.InferType<typeof subcategorySchema>;
