// Mock user data for development
// These will be replaced with real API data later

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'advertiser' | 'owner' | 'both';
  createdAt: Date;
  emailVerified: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  isDefault: boolean;
}

export const mockUser: User = {
  id: 'user-1',
  email: 'alex.johnson@example.com',
  firstName: 'Alex',
  lastName: 'Johnson',
  fullName: 'Alex Johnson',
  phone: '+1 (555) 123-4567',
  avatarUrl: undefined,
  role: 'both',
  createdAt: new Date('2025-06-15'),
  emailVerified: true,
};

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    isDefault: true,
  },
  {
    id: 'pm-2',
    type: 'card',
    last4: '5555',
    brand: 'Mastercard',
    isDefault: false,
  },
];
