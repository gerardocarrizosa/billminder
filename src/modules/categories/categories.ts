import { CategoriesEnum } from './categories.enum';
import { CategoryWithSubcategories } from './category.interface';
import * as se from './subcategories.enum';

export const categories: CategoryWithSubcategories[] = [
  {
    id: CategoriesEnum.housing,
    name: 'Vivienda',
    color: '#4CAF50', // Green
    subcategories: [
      {
        id: se.SubcategoriesEnum.housing_rent,
        name: 'Renta',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.housing_mortgage,
        name: 'Hipoteca',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.housing_taxes,
        name: 'Impuestos a la vivienda',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.housing_repairs,
        name: 'Reparaciones y mantenimiento',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.housing_association_costs,
        name: 'Costos de asociación',
        necessity: true,
      },
    ],
  },
  {
    id: CategoriesEnum.eating,
    name: 'Alimentación',
    color: '#FF9800', // Orange
    subcategories: [
      {
        id: se.SubcategoriesEnum.eating_groceries,
        name: 'Despensa',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.eating_restaurants,
        name: 'Restaurantes y otros',
        necessity: false,
      },
    ],
  },
  {
    id: CategoriesEnum.charity,
    name: 'Caridad',
    color: '#9C27B0', // Purple
    subcategories: [
      {
        id: se.SubcategoriesEnum.charity_taxes,
        name: 'Impuestos',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.charity_donations,
        name: 'Donaciones y ofrendas',
        necessity: false,
      },
    ],
  },
  {
    id: CategoriesEnum.transportation,
    name: 'Transporte',
    color: '#2196F3', // Blue
    subcategories: [
      {
        id: se.SubcategoriesEnum.transportation_fuel,
        name: 'Gasolina y aceite',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.transportation_repairs,
        name: 'Reparaciones y llantas',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.transportation_license,
        name: 'Licencia e impuestos',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.transportation_parking,
        name: 'Estacionamiento y casetas',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.transportation_public,
        name: 'Transporte público y taxis*',
        necessity: true,
      },
    ],
  },
  {
    id: CategoriesEnum.insurance,
    name: 'Seguros',
    color: '#03A9F4', // Light Blue
    subcategories: [
      {
        id: se.SubcategoriesEnum.insurance_life,
        name: 'Vida',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.insurance_medical,
        name: 'Gastos Médicos',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.insurance_home,
        name: 'Casa (inmueble y/o contenidos)',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.insurance_auto,
        name: 'Auto',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.insurance_disability,
        name: 'Discapacidad',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.insurance_theft,
        name: 'Robo',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.insurance_long_term_care,
        name: 'Cuidado a largo plazo',
        necessity: false,
      },
    ],
  },
  {
    id: CategoriesEnum.savings,
    name: 'Ahorro',
    color: '#00BCD4', // Cyan
    subcategories: [
      {
        id: se.SubcategoriesEnum.savings_emergency,
        name: 'Fondo de emergencias',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.savings_retirement,
        name: 'Fondo para el retiro',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.savings_education,
        name: 'Fondo para la educación',
        necessity: false,
      },
    ],
  },
  {
    id: CategoriesEnum.services,
    name: 'Servicios',
    color: '#607D8B', // Blue Grey
    subcategories: [
      {
        id: se.SubcategoriesEnum.services_electricity,
        name: 'Electricidad',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.services_gas,
        name: 'Gas',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.services_water,
        name: 'Agua',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.services_waste,
        name: 'Recolección de residuos',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.services_mobile,
        name: 'Celular',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.services_internet,
        name: 'Internet',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.services_cable,
        name: 'Cable',
        necessity: false,
      },
    ],
  },
  {
    id: CategoriesEnum.health,
    name: 'Salud',
    color: '#E91E63', // Pink
    subcategories: [
      {
        id: se.SubcategoriesEnum.health_medications,
        name: 'Medicamentos',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.health_doctor,
        name: 'Doctor',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.health_dentist,
        name: 'Dentista',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.health_eye_doctor,
        name: 'Oculista',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.health_vitamins,
        name: 'Vitaminas',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.health_supplies,
        name: 'Suministros médicos',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.health_other,
        name: 'Otros gastos de salud',
        necessity: true,
      },
    ],
  },
  {
    id: CategoriesEnum.clothing,
    name: 'Vestimenta',
    color: '#673AB7', // Deep Purple
    subcategories: [
      {
        id: se.SubcategoriesEnum.clothing_adults,
        name: 'Adultos',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.clothing_children,
        name: 'Niños',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.clothing_cleaning,
        name: 'Limpieza',
        necessity: true,
      },
    ],
  },
  {
    id: CategoriesEnum.recreation,
    name: 'Recreación',
    color: '#FF5722', // Deep Orange
    subcategories: [
      {
        id: se.SubcategoriesEnum.recreation_entertainment,
        name: 'Entretenimiento',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.recreation_vacation,
        name: 'Vacaciones',
        necessity: false,
      },
    ],
  },
  {
    id: CategoriesEnum.personal,
    name: 'Personal',
    color: '#795548', // Brown
    subcategories: [
      {
        id: se.SubcategoriesEnum.personal_childcare,
        name: 'Cuidado de niños',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.personal_personal_care,
        name: 'Artículos de aseo personal',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.personal_cosmetics,
        name: 'Cosméticos y aseo del cabello',
        necessity: true,
      },
      {
        id: se.SubcategoriesEnum.personal_education,
        name: 'Educación',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_books,
        name: 'Libros y utencilios',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_alimony,
        name: 'Pensión alimenticia',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_child_support,
        name: 'Manutención de hijos',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_subscriptions,
        name: 'Subscripciones',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_organization,
        name: 'Costos de organización',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_gifts,
        name: 'Regalos',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_furniture,
        name: 'Reemplazo de muebles',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_pocket_money1,
        name: 'Dinero de bolsillo 1',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_pocket_money2,
        name: 'Dinero de bolsillo 2',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_baby_supplies,
        name: 'Suministros para bebé',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_pet_supplies,
        name: 'Suministros para mascotas',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_music_tech,
        name: 'Musica y tecnología',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_accountant,
        name: 'Contador',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_misc,
        name: 'Varios',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_other1,
        name: 'Otros gastos personales 1',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.personal_other2,
        name: 'Otros gastos personales 2',
        necessity: false,
      },
    ],
  },
  {
    id: CategoriesEnum.debt,
    name: 'Deuda',
    color: '#F44336', // Red
    subcategories: [
      {
        id: se.SubcategoriesEnum.debt_car_loan1,
        name: 'Crédito automotriz 1',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_car_loan2,
        name: 'Crédito automotriz 2',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_credit_card1,
        name: 'Tarjeta de crédito 1',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_credit_card2,
        name: 'Tarjeta de crédito 2',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_credit_card3,
        name: 'Tarjeta de crédito 3',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_credit_card4,
        name: 'Tarjeta de crédito 4',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_credit_card5,
        name: 'Tarjeta de crédito 5',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_study_loan1,
        name: 'Crédito de estudio 1',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_study_loan2,
        name: 'Crédito de estudio 2',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_study_loan3,
        name: 'Crédito de estudio 3',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_study_loan4,
        name: 'Crédito de estudio 4',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_personal_loan1,
        name: 'Crédito personal 1',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_personal_loan2,
        name: 'Crédito personal 2',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_other_debt1,
        name: 'Otra deuda 1',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_other_debt2,
        name: 'Otra deuda 2',
        necessity: false,
      },
      {
        id: se.SubcategoriesEnum.debt_other_debt3,
        name: 'Otra deuda 3',
        necessity: false,
      },
    ],
  },
];
