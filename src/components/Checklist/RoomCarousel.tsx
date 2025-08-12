import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { RoomCard } from './RoomCard';
import { Room, RoomCheck } from '../../types';

interface RoomCarouselProps {
  rooms: Room[];
  roomChecks: Record<string, RoomCheck>;
  onUpdateCheck: (roomCheck: RoomCheck) => void;
}

export const RoomCarousel: React.FC<RoomCarouselProps> = ({
  rooms,
  roomChecks,
  onUpdateCheck
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextRoom = () => {
    setCurrentIndex((prev) => (prev + 1) % rooms.length);
  };

  const prevRoom = () => {
    setCurrentIndex((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  const goToRoom = (index: number) => {
    setCurrentIndex(index);
  };

  if (rooms.length === 0) return null;

  const currentRoom = rooms[currentIndex];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Verificação em Carrossel
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentIndex + 1} de {rooms.length}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevRoom}
          disabled={rooms.length <= 1}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div className="flex-1 mx-4">
          <div className="flex space-x-1 justify-center">
            {rooms.map((_, index) => (
              <button
                key={index}
                onClick={() => goToRoom(index)}
                className={`
                  w-2 h-2 rounded-full transition-colors duration-200
                  ${index === currentIndex 
                    ? 'bg-primary-500' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }
                `}
              />
            ))}
          </div>
        </div>

        <button
          onClick={nextRoom}
          disabled={rooms.length <= 1}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Current Room Card */}
      <div className="animate-fade-in">
        <RoomCard
          roomName={currentRoom.name}
          roomCheck={roomChecks[currentRoom.id] || {
            roomId: currentRoom.id,
            items: [],
            timestamp: new Date()
          }}
          onUpdateCheck={onUpdateCheck}
        />
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progresso</span>
          <span>{Math.round(((currentIndex + 1) / rooms.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / rooms.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};