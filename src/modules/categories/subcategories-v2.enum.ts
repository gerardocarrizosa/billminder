export enum HousingSubcategories {
  rent,
  mortgage,
  taxes,
  repairs,
  association_costs,
}

export enum EatingSubcategories {
  groceries,
  restaurants,
}

export enum CharitySubcategories {
  taxes,
  donations,
}

export enum TransportationSubcategories {
  fuel,
  repairs,
  license,
  parking,
  public,
}

export enum InsuranceSubcategories {
  life,
  medical,
  home,
  auto,
  disability,
  theft,
  long_term_care,
}

export enum SavingsSubcategories {
  emergency,
  retirement,
  education,
}

export enum ServicesSubcategories {
  electricity,
  gas,
  water,
  waste,
  mobile,
  internet,
  cable,
}

export enum HealthSubcategories {
  medications,
  doctor,
  dentist,
  eye_doctor,
  vitamins,
  supplies,
  other,
}

export enum ClothingSubcategories {
  adults,
  children,
  cleaning,
}

export enum RecreationSubcategories {
  entertainment,
  vacation,
}

export enum PersonalSubcategories {
  childcare,
  personal_care,
  cosmetics,
  education,
  books,
  alimony,
  child_support,
  subscriptions,
  organization,
  gifts,
  furniture,
  pocket_money1,
  pocket_money2,
  baby_supplies,
  pet_supplies,
  music_tech,
  accountant,
  misc,
  other1,
  other2,
}

export enum DebtSubcategories {
  car_loan1,
  car_loan2,
  credit_card1,
  credit_card2,
  credit_card3,
  credit_card4,
  credit_card5,
  study_loan1,
  study_loan2,
  study_loan3,
  study_loan4,
  personal_loan1,
  personal_loan2,
  other_debt1,
  other_debt2,
  other_debt3,
}

// Type to represent all possible subcategory types
export type SubcategoryEnum =
  | HousingSubcategories
  | EatingSubcategories
  | CharitySubcategories
  | TransportationSubcategories
  | InsuranceSubcategories
  | SavingsSubcategories
  | ServicesSubcategories
  | HealthSubcategories
  | ClothingSubcategories
  | RecreationSubcategories
  | PersonalSubcategories
  | DebtSubcategories;
