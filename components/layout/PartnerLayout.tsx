
import React, { ReactNode } from 'react';
import Header from './Header';

const PartnerLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Partner Portal" />
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

export default PartnerLayout;
