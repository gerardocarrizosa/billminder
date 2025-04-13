import { CategoriesEnum } from './categories.enum';
import * as se from './subcategories.enum';

export const categories = [
  {
    id: CategoriesEnum.housing,
    name: 'Vivienda',
    color: '#4CAF50', // Green
    subcategories: [
      {
        id: se.HousingSubcategories.rent,
        name: 'Renta',
        necessity: true,
      },
      {
        id: se.HousingSubcategories.mortgage,
        name: 'Hipoteca',
        necessity: true,
      },
      {
        id: se.HousingSubcategories.taxes,
        name: 'Impuestos a la vivienda',
        necessity: true,
      },
      {
        id: se.HousingSubcategories.repairs,
        name: 'Reparaciones y mantenimiento',
        necessity: true,
      },
      {
        id: se.HousingSubcategories.association_costs,
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
        id: se.EatingSubcategories.groceries,
        name: 'Despensa',
        necessity: true,
      },
      {
        id: se.EatingSubcategories.restaurants,
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
        id: se.CharitySubcategories.taxes,
        name: 'Impuestos',
        necessity: true,
      },
      {
        id: se.CharitySubcategories.donations,
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
        id: se.TransportationSubcategories.fuel,
        name: 'Gasolina y aceite',
        necessity: true,
      },
      {
        id: se.TransportationSubcategories.repairs,
        name: 'Reparaciones y llantas',
        necessity: true,
      },
      {
        id: se.TransportationSubcategories.license,
        name: 'Licencia e impuestos',
        necessity: true,
      },
      {
        id: se.TransportationSubcategories.parking,
        name: 'Estacionamiento y casetas',
        necessity: true,
      },
      {
        id: se.TransportationSubcategories.public,
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
        id: se.InsuranceSubcategories.life,
        name: 'Vida',
        necessity: false,
      },
      {
        id: se.InsuranceSubcategories.medical,
        name: 'Gastos Médicos',
        necessity: false,
      },
      {
        id: se.InsuranceSubcategories.home,
        name: 'Casa (inmueble y/o contenidos)',
        necessity: false,
      },
      {
        id: se.InsuranceSubcategories.auto,
        name: 'Auto',
        necessity: false,
      },
      {
        id: se.InsuranceSubcategories.disability,
        name: 'Discapacidad',
        necessity: false,
      },
      {
        id: se.InsuranceSubcategories.theft,
        name: 'Robo',
        necessity: false,
      },
      {
        id: se.InsuranceSubcategories.long_term_care,
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
        id: se.SavingsSubcategories.emergency,
        name: 'Fondo de emergencias',
        necessity: false,
      },
      {
        id: se.SavingsSubcategories.retirement,
        name: 'Fondo para el retiro',
        necessity: false,
      },
      {
        id: se.SavingsSubcategories.education,
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
        id: se.ServicesSubcategories.electricity,
        name: 'Electricidad',
        necessity: true,
      },
      {
        id: se.ServicesSubcategories.gas,
        name: 'Gas',
        necessity: true,
      },
      {
        id: se.ServicesSubcategories.water,
        name: 'Agua',
        necessity: true,
      },
      {
        id: se.ServicesSubcategories.waste,
        name: 'Recolección de residuos',
        necessity: true,
      },
      {
        id: se.ServicesSubcategories.mobile,
        name: 'Celular',
        necessity: true,
      },
      {
        id: se.ServicesSubcategories.internet,
        name: 'Internet',
        necessity: true,
      },
      {
        id: se.ServicesSubcategories.cable,
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
        id: se.HealthSubcategories.medications,
        name: 'Medicamentos',
        necessity: true,
      },
      {
        id: se.HealthSubcategories.doctor,
        name: 'Doctor',
        necessity: true,
      },
      {
        id: se.HealthSubcategories.dentist,
        name: 'Dentista',
        necessity: true,
      },
      {
        id: se.HealthSubcategories.eye_doctor,
        name: 'Oculista',
        necessity: true,
      },
      {
        id: se.HealthSubcategories.vitamins,
        name: 'Vitaminas',
        necessity: true,
      },
      {
        id: se.HealthSubcategories.supplies,
        name: 'Suministros médicos',
        necessity: true,
      },
      {
        id: se.HealthSubcategories.other,
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
        id: se.ClothingSubcategories.adults,
        name: 'Adultos',
        necessity: true,
      },
      {
        id: se.ClothingSubcategories.children,
        name: 'Niños',
        necessity: true,
      },
      {
        id: se.ClothingSubcategories.cleaning,
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
        id: se.RecreationSubcategories.entertainment,
        name: 'Entretenimiento',
        necessity: false,
      },
      {
        id: se.RecreationSubcategories.vacation,
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
        id: se.PersonalSubcategories.childcare,
        name: 'Cuidado de niños',
        necessity: true,
      },
      {
        id: se.PersonalSubcategories.personal_care,
        name: 'Artículos de aseo personal',
        necessity: true,
      },
      {
        id: se.PersonalSubcategories.cosmetics,
        name: 'Cosméticos y aseo del cabello',
        necessity: true,
      },
      {
        id: se.PersonalSubcategories.education,
        name: 'Educación',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.books,
        name: 'Libros y utencilios',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.alimony,
        name: 'Pensión alimenticia',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.child_support,
        name: 'Manutención de hijos',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.subscriptions,
        name: 'Subscripciones',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.organization,
        name: 'Costos de organización',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.gifts,
        name: 'Regalos',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.furniture,
        name: 'Reemplazo de muebles',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.pocket_money1,
        name: 'Dinero de bolsillo 1',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.pocket_money2,
        name: 'Dinero de bolsillo 2',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.baby_supplies,
        name: 'Suministros para bebé',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.pet_supplies,
        name: 'Suministros para mascotas',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.music_tech,
        name: 'Musica y tecnología',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.accountant,
        name: 'Contador',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.misc,
        name: 'Varios',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.other1,
        name: 'Otros gastos personales 1',
        necessity: false,
      },
      {
        id: se.PersonalSubcategories.other2,
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
        id: se.DebtSubcategories.car_loan1,
        name: 'Crédito automotriz 1',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.car_loan2,
        name: 'Crédito automotriz 2',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.credit_card1,
        name: 'Tarjeta de crédito 1',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.credit_card2,
        name: 'Tarjeta de crédito 2',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.credit_card3,
        name: 'Tarjeta de crédito 3',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.credit_card4,
        name: 'Tarjeta de crédito 4',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.credit_card5,
        name: 'Tarjeta de crédito 5',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.study_loan1,
        name: 'Crédito de estudio 1',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.study_loan2,
        name: 'Crédito de estudio 2',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.study_loan3,
        name: 'Crédito de estudio 3',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.study_loan4,
        name: 'Crédito de estudio 4',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.personal_loan1,
        name: 'Crédito personal 1',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.personal_loan2,
        name: 'Crédito personal 2',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.other_debt1,
        name: 'Otra deuda 1',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.other_debt2,
        name: 'Otra deuda 2',
        necessity: false,
      },
      {
        id: se.DebtSubcategories.other_debt3,
        name: 'Otra deuda 3',
        necessity: false,
      },
    ],
  },
];
