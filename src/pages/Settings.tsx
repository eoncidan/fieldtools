import React, { useState } from 'react';
import { 
  UserCircleIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Report } from '../types';
import { exportAllLogs, getVerificationLogs } from '../utils/logUtils';

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [reports, setReports] = useLocalStorage<Report[]>('conferenceroom_reports', []);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const verificationLogs = getVerificationLogs();

  const handleClearAllData = () => {
    if (showClearConfirm) {
      setReports([]);
      localStorage.removeItem('conferenceroom_reports');
      localStorage.removeItem('conferenceroom_verification_logs');
      setShowClearConfirm(false);
      alert('Todos os dados foram removidos com sucesso!');
    } else {
      setShowClearConfirm(true);
    }
  };

  const generateOutlookReminder = () => {
    const subject = encodeURIComponent('Lembrete: Verificação Diária das Salas de Videoconferência');
    const body = encodeURIComponent(
      'Lembrete automático para realizar a verificação diária das salas de videoconferência.\n\n' +
      'Itens a verificar em cada sala:\n' +
      '• Painel funcionando\n' +
      '• TV funcionando\n' +
      '• Câmera funcionando\n' +
      '• Microfone funcionando\n' +
      '• Conexão com fio funcionando\n' +
      '• Conexão sem fio funcionando\n\n' +
      'Acesse o sistema: ' + window.location.origin
    );
    
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${subject}&body=${body}`;
    window.open(outlookUrl, '_blank');
  };

  const generateGoogleCalendarReminder = () => {
    const title = encodeURIComponent('Verificação Diária das Salas de Videoconferência');
    const details = encodeURIComponent(
      'Lembrete automático para realizar a verificação diária das salas de videoconferência.\n\n' +
      'Acesse o sistema: ' + window.location.origin
    );
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&recur=RRULE:FREQ=DAILY`;
    window.open(googleUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie suas preferências e dados do sistema
        </p>
      </div>

      {/* User Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <UserCircleIcon className="h-12 w-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informações do Usuário
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Dados da conta atual
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {user?.name}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              E-mail
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {user?.email}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Aparência
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tema Atual
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {theme === 'light' ? 'Claro' : 'Escuro'}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
          >
            Alternar Tema
          </button>
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <DocumentTextIcon className="h-8 w-8 text-primary-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lembretes Automáticos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Configure lembretes diários no seu calendário
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={generateOutlookReminder}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg transition-colors duration-200"
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span>Agendar no Outlook</span>
          </button>
          
          <button
            onClick={generateGoogleCalendarReminder}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg transition-colors duration-200"
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span>Agendar no Google Calendar</span>
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <TrashIcon className="h-8 w-8 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Gerenciamento de Dados
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Controle seus dados armazenados
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Total de relatórios salvos: <strong>{reports.length}</strong>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Total de logs de verificação: <strong>{verificationLogs.length}</strong>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Os dados são armazenados localmente no seu navegador
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Exportar Logs de Verificação
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Baixe o histórico completo de todas as verificações realizadas
            </p>
            <button
              onClick={exportAllLogs}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Exportar Logs (Excel)</span>
            </button>
          </div>
          
          <div className={`border-2 rounded-lg p-4 ${showClearConfirm ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`}>
            {showClearConfirm ? (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900 dark:text-red-100">
                    Confirmar Exclusão
                  </span>
                </div>
                <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                  Esta ação não pode ser desfeita. Todos os relatórios e logs serão permanentemente removidos.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleClearAllData}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200"
                  >
                    Confirmar Exclusão
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Remove todos os relatórios e logs armazenados no sistema
                </p>
                <button
                  onClick={handleClearAllData}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Limpar Todos os Dados</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
        >
          Sair do Sistema
        </button>
      </div>
    </div>
  );
};