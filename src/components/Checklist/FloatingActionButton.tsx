import React, { useState } from 'react';
import { 
  PlusIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MapIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

interface FloatingActionButtonProps {
  onMarkAllOk: () => void;
  onMarkAllProblem: () => void;
  onToggleMap: () => void;
  onToggleList: () => void;
  showMap: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onMarkAllOk,
  onMarkAllProblem,
  onToggleMap,
  onToggleList,
  showMap
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      label: 'Marcar Todos OK',
      icon: CheckIcon,
      onClick: () => {
        onMarkAllOk();
        setIsOpen(false);
      },
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      label: 'Marcar Problemas',
      icon: ExclamationTriangleIcon,
      onClick: () => {
        onMarkAllProblem();
        setIsOpen(false);
      },
      color: 'bg-warning-500 hover:bg-warning-600'
    },
    {
      label: showMap ? 'Ver Lista' : 'Ver Mapa',
      icon: showMap ? ListBulletIcon : MapIcon,
      onClick: () => {
        showMap ? onToggleList() : onToggleMap();
        setIsOpen(false);
      },
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ];

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40">
      {/* Action buttons */}
      {isOpen && (
        <div className="mb-4 space-y-2 animate-slide-up">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                flex items-center space-x-2 px-4 py-2 ${action.color} text-white rounded-full shadow-lg
                transition-all duration-200 transform hover:scale-105
              `}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-sm font-medium whitespace-nowrap">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg
          flex items-center justify-center transition-all duration-200 transform hover:scale-105
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
};