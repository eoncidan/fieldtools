import React, { useState } from 'react';
import { CheckIcon, ExclamationTriangleIcon, BoltIcon } from '@heroicons/react/24/outline';
import { RoomCheck, CheckItem } from '../../types';

interface RoomCardProps {
  roomName: string;
  roomCheck: RoomCheck;
  onUpdateCheck: (roomCheck: RoomCheck) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ 
  roomName, 
  roomCheck, 
  onUpdateCheck 
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const markAllAsOk = () => {
    const updatedItems = roomCheck.items.map(item => ({
      ...item,
      status: 'ok' as const,
      observation: ''
    }));

    onUpdateCheck({
      ...roomCheck,
      items: updatedItems,
      timestamp: new Date()
    });

    setExpandedItem(null);
  };

  const updateItem = (itemId: string, status: CheckItem['status'], observation?: string) => {
    const updatedItems = roomCheck.items.map(item =>
      item.id === itemId
        ? { ...item, status, observation: observation || '' }
        : item
    );

    onUpdateCheck({
      ...roomCheck,
      items: updatedItems,
      timestamp: new Date()
    });

    if (status !== 'problem') {
      setExpandedItem(null);
    }
  };

  const getItemStatusIcon = (item: CheckItem) => {
    switch (item.status) {
      case 'ok':
        return <CheckIcon className="h-5 w-5 text-green-600" />;
      case 'problem':
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />;
      default:
        return <div className="h-5 w-5 border-2 border-gray-300 rounded" />;
    }
  };

  const allChecked = roomCheck.items.every(item => item.status !== 'unchecked');
  const hasProblems = roomCheck.items.some(item => item.status === 'problem');

  return (
    <div className={`mobile-room-card md:bg-white md:dark:bg-gray-800 md:rounded-lg border-2 transition-all duration-200 animate-slide-up ${
      hasProblems
        ? 'border-warning-300 dark:border-warning-600'
        : allChecked
        ? 'border-green-300 dark:border-green-600'
        : 'border-gray-200 dark:border-gray-600'
    }`}>
      <div className="mobile-room-header md:p-4 md:border-b md:border-gray-100 md:dark:border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
            {roomName}
          </h3>
          <div className="flex space-x-2">
            {allChecked && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                hasProblems
                  ? 'bg-warning-100 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300'
                  : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              }`}>
                {hasProblems ? 'Com problemas' : 'OK'}
              </span>
            )}
            {!allChecked && (
              <button
                onClick={markAllAsOk}
                className="flex items-center space-x-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium hover:bg-primary-200 dark:hover:bg-primary-900/30 transition-colors duration-200 whitespace-nowrap"
                title="Marcar todos como OK"
              >
                <BoltIcon className="h-3 w-3" />
                <span className="hidden sm:inline">Marcar Todos</span>
                <span className="sm:hidden">Todos</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        {roomCheck.items.map(item => (
          <div key={item.id} className="space-y-2">
            <div className="mobile-equipment-item md:flex md:items-center md:justify-between">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 block md:inline mb-2 md:mb-0">
                {item.name}
              </span>
              
              <div className="mobile-status-buttons md:flex md:space-x-2">
                <button
                  onClick={() => updateItem(item.id, 'ok')}
                  className={`mobile-status-button md:p-2 md:rounded-lg transition-colors duration-200 ${
                    item.status === 'ok'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/10'
                  }`}
                  title="Marcar como OK"
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => {
                    if (item.status === 'problem') {
                      updateItem(item.id, 'unchecked');
                      setExpandedItem(null);
                    } else {
                      updateItem(item.id, 'problem');
                      setExpandedItem(item.id);
                    }
                  }}
                  className={`mobile-status-button md:p-2 md:rounded-lg transition-colors duration-200 ${
                    item.status === 'problem'
                      ? 'bg-warning-100 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-warning-50 dark:hover:bg-warning-900/10'
                  }`}
                  title="Marcar como problema"
                >
                  <ExclamationTriangleIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {expandedItem === item.id && item.status === 'problem' && (
              <div className="mt-2 animate-slide-up">
                <textarea
                  value={item.observation || ''}
                  onChange={(e) => updateItem(item.id, 'problem', e.target.value)}
                  placeholder="Descreva o problema encontrado..."
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-warning-500 focus:border-warning-500 min-h-[80px]"
                  rows={2}
                />
              </div>
            )}

            {item.status === 'problem' && item.observation && expandedItem !== item.id && (
              <div className="text-xs text-warning-700 dark:text-warning-300 bg-warning-50 dark:bg-warning-900/20 p-2 rounded mt-1">
                {item.observation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};