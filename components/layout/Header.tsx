
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentBangladeshTime } from '../../utils/helpers';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { user, logout } = useAuth();
    const [currentTime, setCurrentTime] = useState(getCurrentBangladeshTime());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(getCurrentBangladeshTime());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="bg-white/50 backdrop-blur-lg sticky top-0 z-30 shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-700">{user?.username}</p>
                    <p className="text-xs text-gray-500">{currentTime}</p>
                </div>
                <button 
                    onClick={logout} 
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-md"
                    title="Logout"
                >
                    <i className="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </header>
    );
};

export default Header;
