import React, { useState } from 'react';
import { 
  CalendarDaysIcon,
  PlusIcon,
  ClockIcon,
  CheckIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'event' | 'task';
  completed?: boolean;
  description?: string;
}

export const Agenda: React.FC = () => {
  const [events, setEvents] = useLocalStorage<Event[]>('agenda_events', []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    type: 'event' as 'event' | 'task',
    description: ''
  });

  const currentMonth = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start: currentMonth, end: monthEnd });

  const selectedDateEvents = events
    .filter(event => isSameDay(new Date(event.date), selectedDate))
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      type: newEvent.type,
      completed: newEvent.type === 'task' ? false : undefined,
      description: newEvent.description
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({ title: '', time: '', type: 'event', description: '' });
    setShowAddForm(false);
  };

  const toggleTaskComplete = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, completed: !event.completed }
        : event
    ));
  };

  const deleteEvent = (eventId: string) => {
    if (confirm('Deseja excluir este item?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  const getEventCountForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), day)).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agenda
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus eventos e tarefas
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Novo Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ←
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded"
              >
                Hoje
              </button>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDays.map(day => {
              const eventCount = getEventCountForDay(day);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    p-2 text-sm rounded-lg transition-colors duration-200 relative
                    ${isSelected 
                      ? 'bg-primary-500 text-white' 
                      : isTodayDate
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  {format(day, 'd')}
                  {eventCount > 0 && (
                    <div className={`
                      absolute top-1 right-1 w-2 h-2 rounded-full
                      ${isSelected ? 'bg-white' : 'bg-primary-500'}
                    `} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </h3>
            {isToday(selectedDate) && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                Hoje
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map(event => (
                <div
                  key={event.id}
                  className={`
                    p-3 rounded-lg border transition-colors duration-200
                    ${event.type === 'task' && event.completed
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {event.type === 'task' && (
                          <button
                            onClick={() => toggleTaskComplete(event.id)}
                            className={`
                              w-4 h-4 rounded border-2 flex items-center justify-center
                              ${event.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                              }
                            `}
                          >
                            {event.completed && <CheckIcon className="h-3 w-3 text-white" />}
                          </button>
                        )}
                        <span className={`
                          font-medium text-sm
                          ${event.type === 'task' && event.completed
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-white'
                          }
                        `}>
                          {event.title}
                        </span>
                      </div>
                      
                      {event.time && (
                        <div className="flex items-center space-x-1 mt-1">
                          <ClockIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {event.time}
                          </span>
                        </div>
                      )}
                      
                      {event.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nenhum evento para este dia
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Novo {newEvent.type === 'event' ? 'Evento' : 'Tarefa'}
            </h3>
            
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="event"
                      checked={newEvent.type === 'event'}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as 'event' | 'task' }))}
                      className="mr-2"
                    />
                    Evento
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="task"
                      checked={newEvent.type === 'task'}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as 'event' | 'task' }))}
                      className="mr-2"
                    />
                    Tarefa
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Horário (opcional)
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
                  rows={2}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};