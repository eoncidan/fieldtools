import React from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface FloorSelectionStepProps {
  onFloorSelect: (floor: number) => void;
}

export const FloorSelectionStep: React.FC<FloorSelectionStepProps> = ({
  onFloorSelect
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-center mb-6">
        <BuildingOfficeIcon className="h-16 w-16 text-primary-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Selecione o Andar para Verificação
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Escolha qual andar você irá verificar hoje
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
        <button
          onClick={() => onFloorSelect(1)}
          className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2">
              1º
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Primeiro Andar
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              18 salas com videoconferência
            </div>
          </div>
        </button>

        <button
          onClick={() => onFloorSelect(2)}
          className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2">
              2º
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Segundo Andar
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              15 salas com videoconferência
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};