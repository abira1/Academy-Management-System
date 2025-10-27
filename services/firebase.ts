// Firebase Realtime Database Integration
import { 
  ref, 
  push, 
  set, 
  get, 
  update, 
  remove, 
  onValue, 
  off,
  child,
  query,
  orderByKey 
} from 'firebase/database';
import { database } from '../config/firebase';
import { Student, Teacher, Expense, Partner } from '../types';

// Initial data to seed the database
const initialData = {
  students: {
    '1': { id: '1', name: 'Rahim Islam', studentId: 'S-001', phone: '01712345678', course: 'React Development', totalPayment: 20000, paid: 15000, due: 5000 },
    '2': { id: '2', name: 'Karina Ahmed', studentId: 'S-002', phone: '01812345679', course: 'UI/UX Design', totalPayment: 15000, paid: 15000, due: 0 },
  },
  teachers: {
    '1': { id: '1', name: 'Mr. Alamgir', salary: 30000, date: '2023-10-01' },
  },
  expenses: {
    '1': { id: '1', item: 'Office Rent', cost: 15000, date: '2023-10-05', description: 'Monthly rent for office space' },
    '2': { id: '2', item: 'Utility Bill', cost: 3500, date: '2023-10-07', description: 'Electricity and Internet' },
  },
  partners: {
    '1': { id: '1', username: 'PARTNER ONE', sharePercentage: 25, password: 'partner123' },
  }
};

// Initialize database with initial data if empty
const initializeDatabase = async () => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(dbRef);
    
    if (!snapshot.exists()) {
      console.log('Initializing database with initial data...');
      await set(dbRef, initialData);
      console.log('Database initialized successfully!');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Firebase Realtime Database Operations
const db = {
    students: {
        getAll: async (): Promise<Student[]> => {
            try {
                const studentsRef = ref(database, 'students');
                const snapshot = await get(studentsRef);
                
                if (snapshot.exists()) {
                    const studentsData = snapshot.val();
                    return Object.values(studentsData);
                }
                return [];
            } catch (error) {
                console.error('Error fetching students:', error);
                return [];
            }
        },
        
        add: async (data: Omit<Student, 'id'>): Promise<Student> => {
            try {
                const studentsRef = ref(database, 'students');
                const newStudentRef = push(studentsRef);
                const newStudent = { ...data, id: newStudentRef.key! };
                
                await set(newStudentRef, newStudent);
                return newStudent;
            } catch (error) {
                console.error('Error adding student:', error);
                throw error;
            }
        },
        
        update: async (id: string, data: Partial<Student>): Promise<Student | undefined> => {
            try {
                const studentRef = ref(database, `students/${id}`);
                await update(studentRef, data);
                
                // Return updated student
                const snapshot = await get(studentRef);
                return snapshot.exists() ? snapshot.val() : undefined;
            } catch (error) {
                console.error('Error updating student:', error);
                throw error;
            }
        },
        
        delete: async (id: string): Promise<void> => {
            try {
                const studentRef = ref(database, `students/${id}`);
                await remove(studentRef);
            } catch (error) {
                console.error('Error deleting student:', error);
                throw error;
            }
        },

        // Real-time listener
        onValue: (callback: (students: Student[]) => void) => {
            const studentsRef = ref(database, 'students');
            return onValue(studentsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const studentsData = snapshot.val();
                    const studentsArray = Object.values(studentsData) as Student[];
                    callback(studentsArray);
                } else {
                    callback([]);
                }
            });
        }
    },
    
    teachers: {
        getAll: async (): Promise<Teacher[]> => {
            try {
                const teachersRef = ref(database, 'teachers');
                const snapshot = await get(teachersRef);
                
                if (snapshot.exists()) {
                    const teachersData = snapshot.val();
                    return Object.values(teachersData);
                }
                return [];
            } catch (error) {
                console.error('Error fetching teachers:', error);
                return [];
            }
        },
        
        add: async (data: Omit<Teacher, 'id'>): Promise<Teacher> => {
            try {
                const teachersRef = ref(database, 'teachers');
                const newTeacherRef = push(teachersRef);
                const newTeacher = { ...data, id: newTeacherRef.key! };
                
                await set(newTeacherRef, newTeacher);
                return newTeacher;
            } catch (error) {
                console.error('Error adding teacher:', error);
                throw error;
            }
        },
        
        update: async (id: string, data: Partial<Teacher>): Promise<Teacher | undefined> => {
            try {
                const teacherRef = ref(database, `teachers/${id}`);
                await update(teacherRef, data);
                
                const snapshot = await get(teacherRef);
                return snapshot.exists() ? snapshot.val() : undefined;
            } catch (error) {
                console.error('Error updating teacher:', error);
                throw error;
            }
        },
        
        delete: async (id: string): Promise<void> => {
            try {
                const teacherRef = ref(database, `teachers/${id}`);
                await remove(teacherRef);
            } catch (error) {
                console.error('Error deleting teacher:', error);
                throw error;
            }
        },

        // Real-time listener
        onValue: (callback: (teachers: Teacher[]) => void) => {
            const teachersRef = ref(database, 'teachers');
            return onValue(teachersRef, (snapshot) => {
                if (snapshot.exists()) {
                    const teachersData = snapshot.val();
                    const teachersArray = Object.values(teachersData) as Teacher[];
                    callback(teachersArray);
                } else {
                    callback([]);
                }
            });
        }
    },
    
    expenses: {
        getAll: async (): Promise<Expense[]> => {
            try {
                const expensesRef = ref(database, 'expenses');
                const snapshot = await get(expensesRef);
                
                if (snapshot.exists()) {
                    const expensesData = snapshot.val();
                    return Object.values(expensesData);
                }
                return [];
            } catch (error) {
                console.error('Error fetching expenses:', error);
                return [];
            }
        },
        
        add: async (data: Omit<Expense, 'id'>): Promise<Expense> => {
            try {
                const expensesRef = ref(database, 'expenses');
                const newExpenseRef = push(expensesRef);
                const newExpense = { ...data, id: newExpenseRef.key! };
                
                await set(newExpenseRef, newExpense);
                return newExpense;
            } catch (error) {
                console.error('Error adding expense:', error);
                throw error;
            }
        },
        
        update: async (id: string, data: Partial<Expense>): Promise<Expense | undefined> => {
            try {
                const expenseRef = ref(database, `expenses/${id}`);
                await update(expenseRef, data);
                
                const snapshot = await get(expenseRef);
                return snapshot.exists() ? snapshot.val() : undefined;
            } catch (error) {
                console.error('Error updating expense:', error);
                throw error;
            }
        },
        
        delete: async (id: string): Promise<void> => {
            try {
                const expenseRef = ref(database, `expenses/${id}`);
                await remove(expenseRef);
            } catch (error) {
                console.error('Error deleting expense:', error);
                throw error;
            }
        },

        // Real-time listener
        onValue: (callback: (expenses: Expense[]) => void) => {
            const expensesRef = ref(database, 'expenses');
            return onValue(expensesRef, (snapshot) => {
                if (snapshot.exists()) {
                    const expensesData = snapshot.val();
                    const expensesArray = Object.values(expensesData) as Expense[];
                    callback(expensesArray);
                } else {
                    callback([]);
                }
            });
        }
    },
    
    partners: {
        getAll: async (): Promise<Partner[]> => {
            try {
                const partnersRef = ref(database, 'partners');
                const snapshot = await get(partnersRef);
                
                if (snapshot.exists()) {
                    const partnersData = snapshot.val();
                    return Object.values(partnersData);
                }
                return [];
            } catch (error) {
                console.error('Error fetching partners:', error);
                return [];
            }
        },
        
        add: async (data: Omit<Partner, 'id'>): Promise<Partner> => {
            try {
                const partnersRef = ref(database, 'partners');
                const newPartnerRef = push(partnersRef);
                const newPartner = { ...data, id: newPartnerRef.key! } as Partner;
                
                await set(newPartnerRef, newPartner);
                return newPartner;
            } catch (error) {
                console.error('Error adding partner:', error);
                throw error;
            }
        },
        
        update: async (id: string, data: Partial<Partner>): Promise<Partner | undefined> => {
            try {
                const partnerRef = ref(database, `partners/${id}`);
                await update(partnerRef, data);
                
                const snapshot = await get(partnerRef);
                return snapshot.exists() ? snapshot.val() : undefined;
            } catch (error) {
                console.error('Error updating partner:', error);
                throw error;
            }
        },
        
        delete: async (id: string): Promise<void> => {
            try {
                const partnerRef = ref(database, `partners/${id}`);
                await remove(partnerRef);
            } catch (error) {
                console.error('Error deleting partner:', error);
                throw error;
            }
        },

        // Real-time listener
        onValue: (callback: (partners: Partner[]) => void) => {
            const partnersRef = ref(database, 'partners');
            return onValue(partnersRef, (snapshot) => {
                if (snapshot.exists()) {
                    const partnersData = snapshot.val();
                    const partnersArray = Object.values(partnersData) as Partner[];
                    callback(partnersArray);
                } else {
                    callback([]);
                }
            });
        }
    }
};

// Authentication (keeping the existing system for now)
const auth = {
    signInWithUsernameAndPassword: async (username: string, password: string): Promise<{ username: string, role: 'admin' | 'reception' | 'partner', partnerId?: string } | null> => {
        try {
            // Admin credentials
            if (username.toUpperCase() === 'SHAH SULTAN' && password === '017ShahultaN@@##') {
                return { username: 'SHAH SULTAN', role: 'admin' };
            }
            
            // Reception credentials
            if (username.toUpperCase() === 'SSIA RECEPTION' && password === '017ReceptioN@@##') {
                return { username: 'SSIA RECEPTION', role: 'reception' };
            }
            
            // Partner login - check against Firebase database
            const partnersRef = ref(database, 'partners');
            const snapshot = await get(partnersRef);
            
            if (snapshot.exists()) {
                const partnersData = snapshot.val();
                const partners = Object.values(partnersData) as Partner[];
                const partner = partners.find(p => p.username.toUpperCase() === username.toUpperCase());
                
                if (partner && password === partner.password) {
                    return { username: partner.username, role: 'partner', partnerId: partner.id };
                }
            }
            
            return null;
        } catch (error) {
            console.error('Authentication error:', error);
            return null;
        }
    }
};

// Initialize database on first load
initializeDatabase();

export { db, auth };