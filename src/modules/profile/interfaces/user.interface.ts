export interface User {
  id: string;
  name: string;
  email: string;
  uid: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  phoneNumber?: string;
  profilePhoto?: string;
}
