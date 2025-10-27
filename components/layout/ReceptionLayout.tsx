
import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Header from './Header';

const ReceptionLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const navItems = [
        { path: '/reception/dashboard', icon: 'fa-border-all', name: 'Dashboard' },
        { path: '/reception/admissions', icon: 'fa-user-plus', name: 'Add Admission' },
        { path: '/reception/expenses', icon: 'fa-file-invoice-dollar', name: 'Add Expense' },
    ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Reception Portal" />
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-16">
                <div className="flex items-center space-x-4">
                    {navItems.map(item => (
                         <NavLink
                         key={item.name}
                         to={item.path}
                         className={({ isActive }) =>
                           `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                             isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                           }`
                         }
                       >
                         <i className={`fas ${item.icon} mr-2`}></i>
                         {item.name}
                       </NavLink>
                    ))}
                </div>
            </div>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default ReceptionLayout;
