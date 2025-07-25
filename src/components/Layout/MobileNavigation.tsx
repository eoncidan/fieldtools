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
  { to: '/settings', label: 'Config', icon: Cog6ToothIcon },
];

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  return (
    <nav className={`mobile-nav ${className}`}>
      <div className="flex justify-around">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `mobile-nav-item ${
                isActive
                  ? 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};