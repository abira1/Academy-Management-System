
import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white/30 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg p-6 transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          <i className={`fas ${icon} text-white text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default Card;
