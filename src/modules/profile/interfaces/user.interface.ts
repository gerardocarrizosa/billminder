export interface User {
  id: string;
  name: string;
  email: string;
  uid: string;
  gender?: UserGender;
  dateOfBirth?: string;
  phoneNumber?: string;
  profilePhoto?: string;
}

export type UserGender = 'male' | 'female' | 'other';
