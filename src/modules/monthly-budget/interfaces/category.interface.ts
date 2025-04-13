import * as yup from 'yup';
import { Subcategory } from './subcategory.interface';
import { CategoriesEnum } from '@/modules/categories/categories.enum';

export const categorySchema = yup.object().shape({
  id: yup
    .number()
    .oneOf(Object.values(CategoriesEnum).filter((v) => typeof v === 'number'))
    .required(),
  name: yup.string().required('El nombre de la categoría es requerido'),
  color: yup.string().required('El color es requerido'),
});

export type Category = yup.InferType<typeof categorySchema>;

export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}
