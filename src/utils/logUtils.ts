import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VerificationLog, Report } from '../types';

const LOG_STORAGE_KEY = 'conferenceroom_verification_logs';

export const saveVerificationLog = (
  report: Report,
  reportType: 'xlsx' | 'email' | 'pdf' | 'text'
): void => {
  const log: VerificationLog = {
    id: Date.now().toString(),
    timestamp: new Date(),
    floor: getFloorFromReport(report),
    verifierName: report.responsibleName,
    reportType,
    roomsChecked: report.summary.totalRooms,
    problemsFound: report.summary.problemRooms,
    reportData: report
  };

  // Save to localStorage
  const existingLogs = getVerificationLogs();
  const updatedLogs = [log, ...existingLogs];
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
};

export const getVerificationLogs = (): VerificationLog[] => {
  try {
    const logs = localStorage.getItem(LOG_STORAGE_KEY);
    if (logs) {
      return JSON.parse(logs).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp),
        reportData: {
          ...log.reportData,
          date: new Date(log.reportData.date)
        }
      }));
    }
  } catch (error) {
    console.error('Error loading verification logs:', error);
  }
  return [];
};

const getFloorFromReport = (report: Report): number => {
  // Determine floor based on room IDs in the report
  const roomIds = report.roomChecks.map(check => check.roomId);
  // This is a simplified approach - in a real app you'd have better floor detection
  return roomIds.some(id => id.includes('auditorio') || id.includes('inclusao')) ? 2 : 1;
};

export const exportAllLogs = (): void => {
  const logs = getVerificationLogs();
  
  if (logs.length === 0) {
    alert('Nenhum log encontrado para exportar.');
    return;
  }

  const workbook = XLSX.utils.book_new();
  
  // Summary sheet
  const summaryData = [
    ['Histórico de Verificações de Salas'],
    [''],
    ['Data/Hora', 'Andar', 'Verificador', 'Tipo Relatório', 'Salas', 'Problemas']
  ];

  logs.forEach(log => {
    summaryData.push([
      format(log.timestamp, "dd/MM/yyyy HH:mm", { locale: ptBR }),
      `${log.floor}º andar`,
      log.verifierName,
      log.reportType.toUpperCase(),
      log.roomsChecked,
      log.problemsFound
    ]);
  });

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

  // Individual log sheets (last 10 logs to avoid too many sheets)
  logs.slice(0, 10).forEach((log, index) => {
    const logData = [
      [`Verificação ${index + 1}`],
      [''],
      ['Data/Hora:', format(log.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })],
      ['Andar:', `${log.floor}º andar`],
      ['Verificador:', log.verifierName],
      [''],
      ['Sala', 'Item', 'Status', 'Observação']
    ];

    log.reportData.roomChecks.forEach(roomCheck => {
      roomCheck.items.forEach(item => {
        logData.push([
          roomCheck.roomId,
          item.name,
          item.status === 'ok' ? 'OK' : item.status === 'problem' ? 'Problema' : 'Não verificado',
          item.observation || ''
        ]);
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(logData);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Log ${index + 1}`);
  });

  const fileName = `historico-verificacoes-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};