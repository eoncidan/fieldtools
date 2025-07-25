import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  MoonIcon, 
  SunIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mobile-header bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm md:text-lg">SR</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">
              Sistema de Verificação de Salas
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              Controle diário de videoconferências
            </p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-sm font-bold text-gray-900 dark:text-white">
              VerificaSalas
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {theme === 'light' ? (
              <MoonIcon className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <SunIcon className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </button>

          <div className="flex items-center space-x-1 md:space-x-3 text-xs md:text-sm">
            <UserCircleIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">{user?.name}</span>
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};