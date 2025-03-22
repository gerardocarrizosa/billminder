export interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other' | '';
  profilePhoto: string;
}
