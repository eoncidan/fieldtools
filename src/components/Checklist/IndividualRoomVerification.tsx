import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { RoomCard } from './RoomCard';
import { ROOMS, createInitialCheckItems } from '../../data/rooms';
import { RoomCheck, Report } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface IndividualRoomVerificationProps {
  onClose: () => void;
  onRoomUpdated: (roomCheck: RoomCheck) => void;
}

export const IndividualRoomVerification: React.FC<IndividualRoomVerificationProps> = ({
  onClose,
  onRoomUpdated
}) => {
  const [reports, setReports] = useLocalStorage<Report[]>('conferenceroom_reports', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [roomCheck, setRoomCheck] = useState<RoomCheck | null>(null);
  const [verifierName, setVerifierName] = useState('');

  const videoConferenceRooms = ROOMS.filter(room => room.hasVideoConference);
  
  const filteredRooms = videoConferenceRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoomSelect = (roomId: string) => {
    const room = ROOMS.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(roomId);
      setRoomCheck({
        roomId,
        items: createInitialCheckItems(room),
        timestamp: new Date()
      });
    }
  };

  const handleRoomCheckUpdate = (updatedCheck: RoomCheck) => {
    setRoomCheck(updatedCheck);
  };

  const handleSaveAndClose = () => {
    if (roomCheck) {
      // Save individual room report to history
      const room = ROOMS.find(r => r.id === roomCheck.roomId);
      if (room && verifierName.trim()) {
        const individualReport: Report = {
          id: `individual-${Date.now()}`,
          date: new Date(),
          responsibleName: verifierName.trim(),
          roomChecks: [roomCheck],
          summary: {
            totalRooms: 1,
            okRooms: roomCheck.items.some(item => item.status === 'problem') ? 0 : 1,
            problemRooms: roomCheck.items.some(item => item.status === 'problem') ? 1 : 0
          }
        };
        
        setReports(prev => [individualReport, ...prev]);
      }
      
      onRoomUpdated(roomCheck);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Verificação Individual de Sala
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!selectedRoom ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Verificador
                </label>
                <input
                  type="text"
                  value={verifierName}
                  onChange={(e) => setVerifierName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar sala..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomSelect(room.id)}
                    className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {room.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {room.floor}º andar • {room.equipments.length} equipamentos
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <button
                  onClick={() => {
                    setSelectedRoom(null);
                    setRoomCheck(null);
                  }}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  ← Voltar à seleção de salas
                </button>
              </div>

              {roomCheck && (
                <RoomCard
                  roomName={ROOMS.find(r => r.id === selectedRoom)?.name || ''}
                  roomCheck={roomCheck}
                  onUpdateCheck={handleRoomCheckUpdate}
                />
              )}

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAndClose}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                  disabled={!verifierName.trim()}
                >
                  Salvar Verificação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};