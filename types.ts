export interface Student {
  id: string;
  name: string;
  studentId: string;
  phone: string;
  course: string;
  totalPayment: number;
  paid: number;
  due: number;
}

export interface Teacher {
  id: string;
  name: string;
  salary: number;
  date: string;
}

export interface Expense {
  id: string;
  item: string;
  cost: number;
  date: string;
  description: string;
}

export interface Partner {
  id: string;
  username: string;
  sharePercentage: number;
  password?: string;
}

export type UserRole = 'admin' | 'reception' | 'partner';

export interface User {
  username: string;
  role: UserRole;
  partnerId?: string;
}