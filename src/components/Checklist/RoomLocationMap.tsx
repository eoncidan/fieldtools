import React from 'react';
import { MapPinIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Room, RoomCheck } from '../../types';

interface RoomLocationMapProps {
  floor: number;
  rooms: Room[];
  roomChecks: Record<string, RoomCheck>;
  onRoomSelect: (roomId: string) => void;
  selectedRoom?: string;
}

export const RoomLocationMap: React.FC<RoomLocationMapProps> = ({
  floor,
  rooms,
  roomChecks,
  onRoomSelect,
  selectedRoom
}) => {
  const getRoomStatus = (roomId: string) => {
    const check = roomChecks[roomId];
    if (!check) return 'unchecked';
    
    const hasUnchecked = check.items.some(item => item.status === 'unchecked');
    if (hasUnchecked) return 'unchecked';
    
    const hasProblems = check.items.some(item => item.status === 'problem');
    return hasProblems ? 'problem' : 'ok';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'problem':
        return <ExclamationTriangleIcon className="h-4 w-4 text-warning-600" />;
      default:
        return <MapPinIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-100 border-green-300 text-green-700';
      case 'problem':
        return 'bg-warning-100 border-warning-300 text-warning-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  // Simple grid layout for room positioning
  const getGridPosition = (index: number, total: number) => {
    const cols = Math.ceil(Math.sqrt(total));
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    return {
      gridColumn: col + 1,
      gridRow: row + 1
    };
  };

  const floorRooms = rooms.filter(room => room.floor === floor && room.hasVideoConference);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mapa do {floor}º Andar
        </h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">OK</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warning-100 border border-warning-300 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Problema</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Pendente</span>
          </div>
        </div>
      </div>

      <div 
        className="grid gap-2 min-h-[300px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(floorRooms.length))}, 1fr)`,
          gridTemplateRows: `repeat(${Math.ceil(floorRooms.length / Math.ceil(Math.sqrt(floorRooms.length)))}, 1fr)`
        }}
      >
        {floorRooms.map((room, index) => {
          const status = getRoomStatus(room.id);
          const isSelected = selectedRoom === room.id;
          
          return (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room.id)}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : `border-transparent ${getStatusColor(status)} hover:shadow-md`
                }
              `}
              style={getGridPosition(index, floorRooms.length)}
            >
              <div className="flex items-center justify-between mb-1">
                {getStatusIcon(status)}
                <span className="text-xs font-medium">
                  {room.name.split(' ').pop()}
                </span>
              </div>
              <div className="text-xs opacity-75">
                {room.equipments.length} itens
              </div>
            </button>
          );
        })}
      </div>

      {selectedRoom && (
        <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div className="text-sm font-medium text-primary-700 dark:text-primary-300">
            Sala Selecionada: {floorRooms.find(r => r.id === selectedRoom)?.name}
          </div>
          <div className="text-xs text-primary-600 dark:text-primary-400 mt-1">
            Status: {getRoomStatus(selectedRoom) === 'ok' ? 'OK' : 
                     getRoomStatus(selectedRoom) === 'problem' ? 'Com problemas' : 'Pendente'}
          </div>
        </div>
      )}
    </div>
  );
};