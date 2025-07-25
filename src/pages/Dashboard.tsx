import React from 'react';
import { 
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { Report, Room } from '../types';
import { ROOMS } from '../data/rooms';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Dashboard: React.FC = () => {
  const [rawReports] = useLocalStorage<Report[]>('conferenceroom_reports', []);
  
  // Convert date strings back to Date objects
  const reports = React.useMemo(() => {
    return rawReports
      .map(report => ({
        ...report,
        date: new Date(report.date)
      }))
      .filter(report => !isNaN(report.date.getTime()));
  }, [rawReports]);
  
  // Get today's report
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayReport = reports.find(report => 
    format(report.date, 'yyyy-MM-dd') === today
  );
  
  // Calculate stats
  const totalRooms = ROOMS.filter(room => room.hasVideoConference).length;
  const checkedRooms = todayReport?.summary.okRooms + todayReport?.summary.problemRooms || 0;
  const okRooms = todayReport?.summary.okRooms || 0;
  const problemRooms = todayReport?.summary.problemRooms || 0;
  
  // Calculate recurring problems
  const getRecurringProblems = () => {
    const recentReports = reports.slice(0, 5); // Last 5 reports
    const problemCounts: Record<string, number> = {};
    
    recentReports.forEach(report => {
      report.roomChecks.forEach(roomCheck => {
        const room = ROOMS.find(r => r.id === roomCheck.roomId);
        if (room && roomCheck.items.some(item => item.status === 'problem')) {
          problemCounts[room.name] = (problemCounts[room.name] || 0) + 1;
        }
      });
    });
    
    return Object.entries(problemCounts)
      .filter(([_, count]) => count >= 2) // Rooms with problems in 2+ reports
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5);
  };
  
  const recurringProblems = getRecurringProblems();
  
  // Recent reports
  const recentReports = reports
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visão geral das verificações de hoje
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Salas"
          value={totalRooms}
          color="blue"
          icon={<BuildingOfficeIcon className="h-8 w-8" />}
        />
        
        <StatsCard
          title="Verificadas Hoje"
          value={checkedRooms}
          total={totalRooms}
          color="blue"
          icon={<ClockIcon className="h-8 w-8" />}
        />
        
        <StatsCard
          title="Funcionando OK"
          value={okRooms}
          color="green"
          icon={<CheckCircleIcon className="h-8 w-8" />}
        />
        
        <StatsCard
          title="Com Problemas"
          value={problemRooms}
          color="yellow"
          icon={<ExclamationTriangleIcon className="h-8 w-8" />}
        />
      </div>

      {/* Today's Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Status de Hoje
        </h2>
        
        {todayReport ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Última verificação: {format(todayReport.date, "HH:mm", { locale: ptBR })}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Responsável: {todayReport.responsibleName}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(checkedRooms / totalRooms) * 100}%` }}
              />
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progresso: {checkedRooms}/{totalRooms} salas verificadas 
              ({Math.round((checkedRooms / totalRooms) * 100)}%)
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma verificação realizada hoje
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Acesse o Checklist para começar a verificação
            </p>
          </div>
        )}
      </div>

      {/* Recurring Problems */}
      {recurringProblems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Salas com Problemas Recorrentes
          </h2>
          
          <div className="space-y-3">
            {recurringProblems.map(([roomName, count]) => (
              <div 
                key={roomName}
                className="flex items-center justify-between p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800"
              >
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                  <span className="font-medium text-warning-900 dark:text-warning-100">
                    {roomName}
                  </span>
                </div>
                <span className="text-sm text-warning-700 dark:text-warning-300">
                  {count} ocorrências
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Relatórios Recentes
        </h2>
        
        {recentReports.length > 0 ? (
          <div className="space-y-3">
            {recentReports.map(report => (
              <div 
                key={report.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {format(report.date, "dd 'de' MMMM", { locale: ptBR })}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {report.responsibleName} • {format(report.date, 'HH:mm')}
                  </div>
                </div>
                <div className="flex space-x-4 text-sm">
                  <span className="text-green-600 dark:text-green-400">
                    {report.summary.okRooms} OK
                  </span>
                  {report.summary.problemRooms > 0 && (
                    <span className="text-warning-600 dark:text-warning-400">
                      {report.summary.problemRooms} problemas
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum relatório encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};