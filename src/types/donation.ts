// Donation Request Types
export type RequestCategory = 'Books' | 'Clothes' | 'Stationery' | 'Electronics' | 'Other';

export interface DonationRequest {
  id?: string;
  name: string;
  address: string;
  district: string;
  grade: string;
  school: string;
  phoneNumber: string;
  category: RequestCategory;
  description: string;
  status: 'pending' | 'fulfilled' | 'in_progress';
  createdAt: Date;
  updatedAt: Date;
}

export const REQUEST_CATEGORIES: RequestCategory[] = [
  'Books',
  'Clothes',
  'Stationery',
  'Electronics',
  'Other',
];

export const GRADES = [
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11 (O/L)',
  'Grade 12 (A/L)',
  'Grade 13 (A/L)',
];

export const DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Mullaitivu',
  'Vavuniya',
  'Trincomalee',
  'Batticaloa',
  'Ampara',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle',
];
