import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const navItems = [
  { to: '/', label: 'Dashboard', icon: HomeIcon },
  { to: '/checklist', label: 'Checklist', icon: ClipboardDocumentListIcon },
  { to: '/reports', label: 'Relatórios', icon: ClockIcon },
  { to: '/settings', label: 'Configurações', icon: Cog6ToothIcon },
];

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  return (
    <nav className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 min-h-screen p-4 ${className}`}>
      <ul className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};