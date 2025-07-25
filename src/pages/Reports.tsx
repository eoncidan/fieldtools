import React, { useState } from 'react';
import { 
  DocumentArrowDownIcon,
  EnvelopeIcon,
  ClipboardDocumentIcon,
  TrashIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Report } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  generateEmailContent, 
  exportToPDF, 
  exportToExcel, 
  copyToClipboard,
  openOutlookWithReport,
  openGmailWithReport
} from '../utils/reportUtils';

export const Reports: React.FC = () => {
  const [rawReports, setRawReports] = useLocalStorage<Report[]>('conferenceroom_reports', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmailPreview, setShowEmailPreview] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Convert date strings back to Date objects and filter out invalid dates
  const reports = React.useMemo(() => {
    return rawReports
      .map(report => ({
        ...report,
        date: new Date(report.date)
      }))
      .filter(report => !isNaN(report.date.getTime()));
  }, [rawReports]);

  const filteredReports = reports.filter(report => {
    const searchLower = searchTerm.toLowerCase();
    const dateStr = format(report.date, 'dd/MM/yyyy');
    const nameStr = report.responsibleName.toLowerCase();
    
    return dateStr.includes(searchLower) || nameStr.includes(searchLower);
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCopyEmail = async (report: Report) => {
    const emailContent = generateEmailContent(report);
    const success = await copyToClipboard(emailContent);
    
    if (success) {
      setCopySuccess(report.id);
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm('Tem certeza que deseja excluir este relatório?')) {
      setRawReports(prev => prev.filter(report => report.id !== reportId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Relatórios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Histórico de verificações realizadas
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por data ou responsável..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <div 
              key={report.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Verificação de {format(report.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {format(report.date, 'HH:mm')} • {report.responsibleName}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    title="Excluir relatório"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {report.summary.totalRooms}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Total de Salas
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {report.summary.okRooms}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Funcionando OK
                  </div>
                </div>
                <div className="text-center p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-warning-700 dark:text-warning-300">
                    {report.summary.problemRooms}
                  </div>
                  <div className="text-sm text-warning-600 dark:text-warning-400">
                    Com Problemas
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mobile-button-group">
                <button
                  onClick={() => openOutlookWithReport(report)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200 min-h-[44px]"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>Outlook</span>
                </button>
                
                <button
                  onClick={() => openGmailWithReport(report)}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200 min-h-[44px]"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>Gmail</span>
                </button>
                
                <button
                  onClick={() => setShowEmailPreview(
                    showEmailPreview === report.id ? null : report.id
                  )}
                  className="flex items-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors duration-200 min-h-[44px]"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>Ver E-mail</span>
                </button>
                
                <button
                  onClick={() => handleCopyEmail(report)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors duration-200 min-h-[44px]"
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  <span>{copySuccess === report.id ? 'Copiado!' : 'Copiar E-mail'}</span>
                </button>
                
                <button
                  onClick={() => exportToPDF(report)}
                  className="flex items-center space-x-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors duration-200 min-h-[44px]"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  <span>PDF</span>
                </button>
                
                <button
                  onClick={() => exportToExcel(report)}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200 min-h-[44px]"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  <span>Excel</span>
                </button>
              </div>

              {/* Email Preview */}
              {showEmailPreview === report.id && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Pré-visualização do E-mail:
                  </h4>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {generateEmailContent(report)}
                  </pre>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <DocumentArrowDownIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum relatório encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Tente buscar com outros termos' : 'Realize uma verificação para gerar seu primeiro relatório'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};