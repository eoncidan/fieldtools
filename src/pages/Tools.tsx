import React from 'react';
import { 
  WrenchScrewdriverIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  PlusIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export const Tools: React.FC = () => {
  const tools = [
    {
      id: 'room-verification',
      name: 'Verificação de Salas',
      description: 'Sistema de checklist para verificação de salas de videoconferência com relatórios otimizados',
      status: 'active',
      path: '/checklist',
      icon: WrenchScrewdriverIcon,
      color: 'bg-green-500',
      features: ['Processo por andar completo', 'Verificação individual', 'Relatórios em múltiplos formatos', 'Mapa de localização']
    },
    {
      id: 'calendar-agenda',
      name: 'Agenda',
      description: 'Calendário simples para marcar eventos e gerenciar tarefas pendentes',
      status: 'active',
      path: '/agenda',
      icon: CalendarDaysIcon,
      color: 'bg-blue-500',
      features: ['Calendário compacto', 'Lista diária', 'Eventos e tarefas', 'Interface intuitiva']
    },
    {
      id: 'notes-scratch',
      name: 'Bloco de Rascunho',
      description: 'Local para anotações salvas em tempo real, ideal para rascunhos e ideias',
      status: 'active',
      path: '/notes',
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      features: ['Salvamento automático', 'Interface limpa', 'Organização por blocos', 'Acesso rápido']
    }
  ];

  const handleAddTool = () => {
    alert('Funcionalidade para adicionar novas ferramentas será implementada em breve!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ferramentas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie e acesse todas as ferramentas disponíveis
          </p>
        </div>
        
        <button
          onClick={handleAddTool}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nova Ferramenta</span>
        </button>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => {
          const IconComponent = tool.icon;
          
          return (
            <div
              key={tool.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tool.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    tool.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {tool.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {tool.description}
              </p>
              
              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recursos:
                </h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-2">
                <a
                  href={tool.path}
                  className="flex-1 text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors duration-200"
                >
                  Acessar
                </a>
                <button
                  onClick={() => alert('Configurações da ferramenta em desenvolvimento')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm rounded-lg transition-colors duration-200"
                >
                  <CogIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Add New Tool Card */}
        <div
          onClick={handleAddTool}
          className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-200 cursor-pointer group"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
              <PlusIcon className="h-6 w-6 text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 mb-2 transition-colors duration-200">
              Adicionar Ferramenta
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Clique para adicionar uma nova ferramenta ao sistema
            </p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Sobre as Ferramentas
            </h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
              Este ambiente foi projetado para comportar múltiplas ferramentas de produtividade. 
              Atualmente, temos 3 ferramentas ativas e funcionando.
            </p>
            <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
              <li>• <strong>Verificação de Salas:</strong> Sistema completo de checklist com relatórios</li>
              <li>• <strong>Agenda:</strong> Calendário para eventos e tarefas</li>
              <li>• <strong>Bloco de Rascunho:</strong> Anotações em tempo real</li>
              <li>• Interface unificada para fácil navegação entre ferramentas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};