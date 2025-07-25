import React from 'react';
import { 
  BuildingOfficeIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

interface StepFlowIndicatorProps {
  currentStep: 'floor-selection' | 'user-input' | 'room-verification' | 'report-generation';
  completedSteps: string[];
}

const steps = [
  { id: 'floor-selection', label: 'Selecionar Andar', icon: BuildingOfficeIcon },
  { id: 'user-input', label: 'Identificar Verificador', icon: UserIcon },
  { id: 'room-verification', label: 'Verificar Salas', icon: ClipboardDocumentListIcon },
  { id: 'report-generation', label: 'Gerar Relatório', icon: DocumentArrowDownIcon },
];

export const StepFlowIndicator: React.FC<StepFlowIndicatorProps> = ({
  currentStep,
  completedSteps
}) => {
  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Progresso da Verificação
      </h3>
      
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200
                  ${status === 'completed' 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : status === 'current'
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'
                  }
                `}>
                  {status === 'completed' ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`
                  text-xs mt-2 text-center max-w-[80px] leading-tight
                  ${status === 'current' 
                    ? 'text-primary-700 dark:text-primary-300 font-medium' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-2 transition-all duration-200
                  ${completedSteps.includes(step.id) 
                    ? 'bg-green-500' 
                    : 'bg-gray-200 dark:bg-gray-600'
                  }
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};