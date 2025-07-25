import React, { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

interface UserInputStepProps {
  selectedFloor: number;
  onUserConfirm: (name: string) => void;
  onBack: () => void;
}

export const UserInputStep: React.FC<UserInputStepProps> = ({
  selectedFloor,
  onUserConfirm,
  onBack
}) => {
  const [verifierName, setVerifierName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifierName.trim()) {
      onUserConfirm(verifierName.trim());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-center mb-6">
        <UserIcon className="h-16 w-16 text-primary-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Identificação do Verificador
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Informe quem será responsável pela verificação do {selectedFloor}º andar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="verifier-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome do Verificador
          </label>
          <input
            id="verifier-name"
            type="text"
            value={verifierName}
            onChange={(e) => setVerifierName(e.target.value)}
            placeholder="Digite seu nome completo"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={!verifierName.trim()}
            className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
};