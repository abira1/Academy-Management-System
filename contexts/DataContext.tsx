
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Student, Teacher, Expense, Partner } from '../types';
import { db } from '../services/firebase';

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  expenses: Expense[];
  partners: Partner[];
  loading: boolean;
  refreshData: () => void;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addPartner: (partner: Omit<Partner, 'id'>) => Promise<void>;
  updatePartner: (id: string, partner: Partial<Partner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsData, teachersData, expensesData, partnersData] = await Promise.all([
        db.students.getAll(),
        db.teachers.getAll(),
        db.expenses.getAll(),
        db.partners.getAll(),
      ]);
      setStudents(studentsData);
      setTeachers(teachersData);
      setExpenses(expensesData);
      setPartners(partnersData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Set up real-time listeners for all data types
    setLoading(true);
    
    // Students real-time listener
    const unsubscribeStudents = db.students.onValue((studentsData) => {
      setStudents(studentsData);
    });

    // Teachers real-time listener  
    const unsubscribeTeachers = db.teachers.onValue((teachersData) => {
      setTeachers(teachersData);
    });

    // Expenses real-time listener
    const unsubscribeExpenses = db.expenses.onValue((expensesData) => {
      setExpenses(expensesData);
    });

    // Partners real-time listener
    const unsubscribePartners = db.partners.onValue((partnersData) => {
      setPartners(partnersData);
    });

    // Set loading to false after initial data load
    setTimeout(() => setLoading(false), 1000);

    // Cleanup function to unsubscribe listeners
    return () => {
      unsubscribeStudents();
      unsubscribeTeachers();
      unsubscribeExpenses();
      unsubscribePartners();
    };
  }, []);

  // Student Actions
  const addStudent = async (student: Omit<Student, 'id'>) => { 
    await db.students.add(student); 
    // Real-time listener will handle state update automatically
  };
  const updateStudent = async (id: string, student: Partial<Student>) => { 
    await db.students.update(id, student); 
    // Real-time listener will handle state update automatically
  };
  const deleteStudent = async (id: string) => { 
    await db.students.delete(id); 
    // Real-time listener will handle state update automatically
  };

  // Teacher Actions
  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => { 
    await db.teachers.add(teacher); 
    // Real-time listener will handle state update automatically
  };
  const updateTeacher = async (id: string, teacher: Partial<Teacher>) => { 
    await db.teachers.update(id, teacher); 
    // Real-time listener will handle state update automatically
  };
  const deleteTeacher = async (id: string) => { 
    await db.teachers.delete(id); 
    // Real-time listener will handle state update automatically
  };
  
  // Expense Actions
  const addExpense = async (expense: Omit<Expense, 'id'>) => { 
    await db.expenses.add(expense); 
    // Real-time listener will handle state update automatically
  };
  const updateExpense = async (id: string, expense: Partial<Expense>) => { 
    await db.expenses.update(id, expense); 
    // Real-time listener will handle state update automatically
  };
  const deleteExpense = async (id: string) => { 
    await db.expenses.delete(id); 
    // Real-time listener will handle state update automatically
  };

  // Partner Actions
  const addPartner = async (partner: Omit<Partner, 'id'>) => { 
    await db.partners.add(partner); 
    // Real-time listener will handle state update automatically
  };
  const updatePartner = async (id: string, partner: Partial<Partner>) => { 
    await db.partners.update(id, partner); 
    // Real-time listener will handle state update automatically
  };
  const deletePartner = async (id: string) => { 
    await db.partners.delete(id); 
    // Real-time listener will handle state update automatically
  };


  return (
    <DataContext.Provider value={{ 
        students, teachers, expenses, partners, loading, 
        refreshData: fetchData,
        addStudent, updateStudent, deleteStudent,
        addTeacher, updateTeacher, deleteTeacher,
        addExpense, updateExpense, deleteExpense,
        addPartner, updatePartner, deletePartner
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
