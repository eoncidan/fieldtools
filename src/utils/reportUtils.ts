import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Report, RoomCheck } from '../types';
import { ROOMS } from '../data/rooms';

export const generateEmailContent = (report: Report): string => {
  const dateStr = format(report.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const timeStr = format(report.date, 'HH:mm', { locale: ptBR });
  
  const problemRooms = report.roomChecks.filter(check => 
    check.items.some(item => item.status === 'problem')
  );

  let content = `Bom dia!\n\n`;
  content += `Segue relatório de verificação das salas de videoconferência de ${dateStr} às ${timeStr}h.\n\n`;
  
  content += `📊 RESUMO GERAL:\n`;
  content += `• Total de salas: ${report.summary.totalRooms}\n`;
  content += `• Salas OK: ${report.summary.okRooms}\n`;
  content += `• Salas com problema: ${report.summary.problemRooms}\n\n`;

  if (problemRooms.length > 0) {
    content += `⚠️ SALAS COM PROBLEMAS:\n\n`;
    
    problemRooms.forEach(roomCheck => {
      const room = ROOMS.find(r => r.id === roomCheck.roomId);
      const problems = roomCheck.items.filter(item => item.status === 'problem');
      
      content += `🔸 ${room?.name}:\n`;
      problems.forEach(problem => {
        content += `   • ${problem.name}`;
        if (problem.observation) {
          content += ` - ${problem.observation}`;
        }
        content += '\n';
      });
      content += '\n';
    });
  } else {
    content += `✅ Todas as salas estão funcionando normalmente!\n\n`;
  }
  
  content += `Atenciosamente,\n${report.responsibleName}`;
  
  return content;
};

export const openOutlookWithReport = (report: Report): void => {
  const emailContent = generateEmailContent(report);
  const subject = encodeURIComponent(`Relatório de Verificação de Salas - ${format(report.date, "dd/MM/yyyy", { locale: ptBR })}`);
  const body = encodeURIComponent(emailContent);
  
  // Try Outlook desktop first, then web version
  const outlookDesktop = `outlook://compose?subject=${subject}&body=${body}`;
  const outlookWeb = `https://outlook.live.com/mail/0/deeplink/compose?subject=${subject}&body=${body}`;
  
  // Try to open desktop Outlook first
  const link = document.createElement('a');
  link.href = outlookDesktop;
  link.style.display = 'none';
  document.body.appendChild(link);
  
  try {
    link.click();
    // If desktop doesn't work, fallback to web after a short delay
    setTimeout(() => {
      window.open(outlookWeb, '_blank');
    }, 1000);
  } catch (error) {
    // Fallback to web version
    window.open(outlookWeb, '_blank');
  } finally {
    document.body.removeChild(link);
  }
};

export const openGmailWithReport = (report: Report): void => {
  const emailContent = generateEmailContent(report);
  const subject = encodeURIComponent(`Relatório de Verificação de Salas - ${format(report.date, "dd/MM/yyyy", { locale: ptBR })}`);
  const body = encodeURIComponent(emailContent);
  
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
  window.open(gmailUrl, '_blank');
};

export const exportToPDF = (report: Report) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Relatório de Verificação de Salas', 20, 30);
  
  const dateStr = format(report.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  doc.setFontSize(12);
  doc.text(`Data: ${dateStr}`, 20, 45);
  doc.text(`Responsável: ${report.responsibleName}`, 20, 55);
  
  // Summary
  doc.setFontSize(14);
  doc.text('Resumo:', 20, 75);
  doc.setFontSize(11);
  doc.text(`Total de salas: ${report.summary.totalRooms}`, 25, 85);
  doc.text(`Salas OK: ${report.summary.okRooms}`, 25, 95);
  doc.text(`Salas com problema: ${report.summary.problemRooms}`, 25, 105);
  
  // Problems
  let yPosition = 125;
  const problemRooms = report.roomChecks.filter(check => 
    check.items.some(item => item.status === 'problem')
  );
  
  if (problemRooms.length > 0) {
    doc.setFontSize(14);
    doc.text('Salas com Problemas:', 20, yPosition);
    yPosition += 15;
    
    problemRooms.forEach(roomCheck => {
      const room = ROOMS.find(r => r.id === roomCheck.roomId);
      const problems = roomCheck.items.filter(item => item.status === 'problem');
      
      doc.setFontSize(12);
      doc.text(`${room?.name}:`, 25, yPosition);
      yPosition += 10;
      
      problems.forEach(problem => {
        doc.setFontSize(10);
        let text = `• ${problem.name}`;
        if (problem.observation) {
          text += ` - ${problem.observation}`;
        }
        doc.text(text, 30, yPosition);
        yPosition += 8;
      });
      yPosition += 5;
    });
  }
  
  doc.save(`relatorio-salas-${format(report.date, 'yyyy-MM-dd')}.pdf`);
};

export const exportToExcel = (report: Report) => {
  const workbook = XLSX.utils.book_new();
  
  // Summary sheet
  const summaryData = [
    ['Relatório de Verificação de Salas'],
    [''],
    ['Data:', format(report.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })],
    ['Responsável:', report.responsibleName],
    [''],
    ['Resumo:'],
    ['Total de salas:', report.summary.totalRooms],
    ['Salas OK:', report.summary.okRooms],
    ['Salas com problema:', report.summary.problemRooms],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');
  
  // Details sheet
  const detailsData = [['Sala', 'Item', 'Status', 'Observação']];
  
  report.roomChecks.forEach(roomCheck => {
    const room = ROOMS.find(r => r.id === roomCheck.roomId);
    roomCheck.items.forEach(item => {
      detailsData.push([
        room?.name || '',
        item.name,
        item.status === 'ok' ? 'OK' : item.status === 'problem' ? 'Problema' : 'Não verificado',
        item.observation || ''
      ]);
    });
  });
  
  const detailsSheet = XLSX.utils.aoa_to_sheet(detailsData);
  XLSX.utils.book_append_sheet(workbook, detailsSheet, 'Detalhes');
  
  XLSX.writeFile(workbook, `relatorio-salas-${format(report.date, 'yyyy-MM-dd')}.xlsx`);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};