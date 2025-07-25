import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

interface FloorSelectorProps {
  selectedFloor: number;
  onFloorChange: (floor: number) => void;
  floors: number[];
  roomCounts: Record<number, { total: number; checked: number; problems: number }>;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  selectedFloor,
  onFloorChange,
  floors,
  roomCounts
}) => {
  return (
    <div className="mb-4 md:mb-6">
      <div className="flex space-x-2 md:space-x-4">
        {floors.map(floor => {
          const counts = roomCounts[floor] || { total: 0, checked: 0, problems: 0 };
          const isSelected = selectedFloor === floor;
          
          return (
            <button
              key={floor}
              onClick={() => onFloorChange(floor)}
              className={`flex-1 p-3 md:p-4 rounded-lg border-2 transition-all duration-200 min-h-[80px] md:min-h-[100px] ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              <div className="text-center">
                <h3 className={`text-lg font-semibold ${
                  isSelected 
                    ? 'text-primary-700 dark:text-primary-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {floor}º Andar
                </h3>
                <div className="mt-1 md:mt-2 flex flex-col md:flex-row justify-center md:space-x-4 text-xs md:text-sm space-y-1 md:space-y-0">
                  <div className="text-gray-600 dark:text-gray-400">
                    {counts.checked}/{counts.total} verificadas
                  </div>
                  {counts.problems > 0 && (
                    <div className="text-warning-600 dark:text-warning-400 font-medium">
                      {counts.problems} com problema
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};