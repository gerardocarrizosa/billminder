import * as yup from 'yup';
import { Subcategory } from './subcategory.interface';

export const categorySchema = yup.object().shape({
  id: yup.string().optional(),
  name: yup.string().required('El nombre de la categoría es requerido'),
  color: yup.string().required('El color es requerido'),
  createdAt: yup.date().required(),
});

export type Category = yup.InferType<typeof categorySchema>;

export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

// export const categories = [
//   {
//     name: 'Vivienda',
//     color: '#FF6B6B',
//     subCategories: [
//       { name: 'Renta*', necessity: true },
//       { name: 'Hipoteca*', necessity: true },
//       { name: 'Impuestos a la vivienda*', necessity: true },
//       { name: 'Reparaciones y mantenimiento*', necessity: true },
//       { name: 'Costos de asociación*', necessity: true },
//       { name: 'Renta', necessity: true },
//       { name: 'Renta', necessity: true },
//     ],
//   },
//   {
//     name: 'Alimentación',
//     color: '#6BCB77',
//     subCategories: [
//       { name: 'Despensa', necessity: true },
//       { name: 'Restaurantes y otros', necessity: false },
//     ],
//   },
//   {
//     name: 'Caridad',
//     color: '#4D96FF',
//     subCategories: [
//       { name: 'Impuestos', necessity: true },
//       { name: 'Donaciones y ofrendas', necessity: false },
//     ],
//   },
//   {
//     name: 'Transporte',
//     color: '#FFD93D',
//     subCategories: [
//       { name: 'Gasolina y aceite', necessity: true },
//       { name: 'Reparaciones y llantas', necessity: true },
//       { name: 'Licencia e impuestos', necessity: true },
//       { name: 'Estacionamiento y casetas', necessity: true },
//       { name: 'Transporte público y taxis*', necessity: true },
//     ],
//   },
//   {
//     name: 'Seguros',
//     color: '#FF6F91',
//     subCategories: [
//       { name: 'Vida', necessity: false },
//       { name: 'Gastos Médicos', necessity: false },
//       { name: 'Casa (inmueble y/o contenidos)', necessity: false },
//       { name: 'Auto', necessity: false },
//       { name: 'Discapacidad', necessity: false },
//       { name: 'Robo', necessity: false },
//       { name: 'Cuidado a largo plazo', necessity: false },
//     ],
//   },
//   {
//     name: 'Ahorro',
//     color: '#6A4C93',
//     subCategories: [
//       { name: 'Fondo de emergencias', necessity: false },
//       { name: 'Fondo para el retiro', necessity: false },
//       { name: 'Fondo para la educación', necessity: false },
//     ],
//   },
//   {
//     name: 'Servicios',
//     color: '#0081CF',
//     subCategories: [
//       { name: 'Electricidad', necessity: true },
//       { name: 'Gas', necessity: true },
//       { name: 'Agua', necessity: true },
//       { name: 'Recolección de residuos', necessity: true },
//       { name: 'Celular', necessity: true },
//       { name: 'Internet', necessity: true },
//       { name: 'Cable', necessity: false },
//     ],
//   },
//   {
//     name: 'Salud',
//     color: '#00C9A7',
//     subCategories: [
//       { name: 'Medicamentos', necessity: true },
//       { name: 'Doctor', necessity: true },
//       { name: 'Dentista', necessity: true },
//       { name: 'Oculista', necessity: true },
//       { name: 'Vitaminas', necessity: true },
//       { name: 'Suministros médicos', necessity: true },
//       { name: 'Otros gastos de salud', necessity: true },
//     ],
//   },
//   {
//     name: 'Vestimenta',
//     color: '#FF922B',
//     subCategories: [
//       { name: 'Adultos', necessity: true },
//       { name: 'Niños', necessity: true },
//       { name: 'Limpieza', necessity: true },
//     ],
//   },
//   {
//     name: 'Recreación',
//     color: '#845EC2',
//     subCategories: [
//       { name: 'Entretenimiento', necessity: false },
//       { name: 'Vacaciones', necessity: false },
//     ],
//   },
//   {
//     name: 'Personal',
//     color: '#2C73D2',
//     subCategories: [
//       { name: 'Cuidado de niños*', necessity: true },
//       { name: 'Artículos de aseo personal*', necessity: true },
//       { name: 'Cosméticos y aseo del cabello*', necessity: true },
//       { name: 'Educación', necessity: false },
//       { name: 'Libros y utencilios', necessity: false },
//       { name: 'Pensión alimenticia', necessity: false },
//       { name: 'Manutención de hijos', necessity: false },
//       { name: 'Subscripciones', necessity: false },
//       { name: 'Costos de organización', necessity: false },
//       { name: 'Regalos', necessity: false },
//       { name: 'Reemplazo de muebles', necessity: false },
//       { name: 'Dinero de bolsillo 1', necessity: false },
//       { name: 'Dinero de bolsillo 2', necessity: false },
//       { name: 'Suministros para bebé', necessity: false },
//       { name: 'Suministros para mascotas', necessity: false },
//       { name: 'Musica y tecnología', necessity: false },
//       { name: 'Varios', necessity: false },
//       { name: 'Contador', necessity: false },
//       { name: 'Otros gastos personales 1', necessity: false },
//       { name: 'Otros gastos personales 2', necessity: false },
//     ],
//   },
//   {
//     name: 'Deuda',
//     color: '#FFC75F',
//     subCategories: [
//       { name: 'Crédito automotriz 1', necessity: false },
//       { name: 'Crédito automotriz 2', necessity: false },
//       { name: 'Tarjeta de crédito 1', necessity: false },
//       { name: 'Tarjeta de crédito 2', necessity: false },
//       { name: 'Tarjeta de crédito 3', necessity: false },
//       { name: 'Tarjeta de crédito 4', necessity: false },
//       { name: 'Tarjeta de crédito 5', necessity: false },
//       { name: 'Crédito de estudio 1', necessity: false },
//       { name: 'Crédito de estudio 2', necessity: false },
//       { name: 'Crédito de estudio 3', necessity: false },
//       { name: 'Crédito de estudio 4', necessity: false },
//       { name: 'Crédito personal 1', necessity: false },
//       { name: 'Crédito personal 2', necessity: false },
//       { name: 'Otra deuda 1', necessity: false },
//       { name: 'Otra deuda 2', necessity: false },
//       { name: 'Otra deuda 3', necessity: false },
//     ],
//   },
// ];
