import React from 'react';
import { 
  DocumentArrowDownIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import { Report } from '../../types';
import { 
  exportToPDF, 
  exportToExcel, 
  openOutlookWithReport,
  generateEmailContent,
  copyToClipboard
} from '../../utils/reportUtils';

interface ReportGenerationStepProps {
  report: Report;
  onReportGenerated: (type: 'xlsx' | 'email' | 'pdf' | 'text') => void;
  onBack: () => void;
  onNewVerification: () => void;
}

export const ReportGenerationStep: React.FC<ReportGenerationStepProps> = ({
  report,
  onReportGenerated,
  onBack,
  onNewVerification
}) => {
  const handleExportPDF = () => {
    exportToPDF(report);
    onReportGenerated('pdf');
  };

  const handleExportExcel = () => {
    exportToExcel(report);
    onReportGenerated('xlsx');
  };

  const handleSendEmail = () => {
    openOutlookWithReport(report);
    onReportGenerated('email');
  };

  const handleCopyText = async () => {
    const emailContent = generateEmailContent(report);
    const success = await copyToClipboard(emailContent);
    if (success) {
      onReportGenerated('text');
      alert('Relatório copiado para a área de transferência!');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-center mb-6">
        <DocumentArrowDownIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Verificação Concluída!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Escolha o formato do relatório que deseja gerar
        </p>
        
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {report.summary.totalRooms}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Total
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {report.summary.okRooms}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              OK
            </div>
          </div>
          <div className="text-center p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
            <div className="text-2xl font-bold text-warning-700 dark:text-warning-300">
              {report.summary.problemRooms}
            </div>
            <div className="text-xs text-warning-600 dark:text-warning-400">
              Problemas
            </div>
          </div>
        </div>
      </div>

      {/* Report Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleSendEmail}
          className="flex items-center justify-center space-x-3 p-4 border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg transition-colors duration-200"
        >
          <EnvelopeIcon className="h-6 w-6" />
          <span className="font-medium">Enviar por E-mail</span>
        </button>

        <button
          onClick={handleExportExcel}
          className="flex items-center justify-center space-x-3 p-4 border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg transition-colors duration-200"
        >
          <TableCellsIcon className="h-6 w-6" />
          <span className="font-medium">Exportar Excel</span>
        </button>

        <button
          onClick={handleExportPDF}
          className="flex items-center justify-center space-x-3 p-4 border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg transition-colors duration-200"
        >
          <DocumentArrowDownIcon className="h-6 w-6" />
          <span className="font-medium">Exportar PDF</span>
        </button>

        <button
          onClick={handleCopyText}
          className="flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
        >
          <DocumentTextIcon className="h-6 w-6" />
          <span className="font-medium">Copiar Texto</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Voltar à Verificação
        </button>
        <button
          onClick={onNewVerification}
          className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
        >
          Nova Verificação
        </button>
      </div>
    </div>
  );
};