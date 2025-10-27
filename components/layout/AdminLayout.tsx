
import React, { useState, ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Header from './Header';

const AdminSidebar: React.FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => {
  const location = useLocation();
  const navItems = [
    { path: '/admin/dashboard', icon: 'fa-tachometer-alt', name: 'Dashboard' },
    { path: '/admin/students', icon: 'fa-user-graduate', name: 'Students' },
    { path: '/admin/teachers', icon: 'fa-chalkboard-teacher', name: 'Teachers' },
    { path: '/admin/expenses', icon: 'fa-wallet', name: 'Expenses' },
    { path: '/admin/partners', icon: 'fa-handshake', name: 'Partners' },
  ];

  return (
    <>
      <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-600 to-indigo-700 text-white z-40 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-center h-20 border-b border-white/20">
          <h1 className={`text-2xl font-bold transition-opacity duration-300 ${!isOpen && 'opacity-0'}`}>Admin</h1>
        </div>
        <nav className="mt-4">
          <ul>
            {navItems.map(item => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-4 my-2 mx-3 rounded-lg transition-colors duration-200 hover:bg-white/20 ${
                      isActive ? 'bg-white/30' : ''
                    }`
                  }
                  title={item.name}
                >
                  <i className={`fas ${item.icon} text-2xl w-12 text-center`}></i>
                  <span className={`ml-4 font-medium transition-opacity duration-300 ${!isOpen && 'opacity-0'}`}>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button onClick={toggle} className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/20 hover:bg-white/30 w-12 h-12 rounded-full">
            <i className={`fas fa-chevron-right transition-transform duration-300 ${isOpen && 'rotate-180'}`}></i>
        </button>
      </aside>
    </>
  );
};

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header title="Admin Portal" />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
