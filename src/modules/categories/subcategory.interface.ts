import * as yup from 'yup';
import { SubcategoriesEnum } from './subcategories.enum';

export const subcategorySchema = yup.object().shape({
  id: yup
    .number()
    .oneOf(
      Object.values(SubcategoriesEnum).filter((v) => typeof v === 'number')
    )
    .required(),
  name: yup.string().required('El nombre de la subcategoria es requerido'),
  necessity: yup.boolean().required(),
});

export type Subcategory = yup.InferType<typeof subcategorySchema>;
