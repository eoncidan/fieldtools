import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { StepFlowIndicator } from '../components/Checklist/StepFlowIndicator';
import { FloorSelectionStep } from '../components/Checklist/FloorSelectionStep';
import { UserInputStep } from '../components/Checklist/UserInputStep';
import { ReportGenerationStep } from '../components/Checklist/ReportGenerationStep';
import { RoomCard } from '../components/Checklist/RoomCard';
import { IndividualRoomVerification } from '../components/Checklist/IndividualRoomVerification';
import { RoomLocationMap } from '../components/Checklist/RoomLocationMap';
import { FloatingActionButton } from '../components/Checklist/FloatingActionButton';
import { RoomCarousel } from '../components/Checklist/RoomCarousel';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ROOMS, createInitialCheckItems } from '../data/rooms';
import { RoomCheck, Report, ChecklistStep } from '../types';
import { saveVerificationLog } from '../utils/logUtils';

export const Checklist: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useLocalStorage<Report[]>('conferenceroom_reports', []);
  
  // Checklist workflow state
  const [currentStep, setCurrentStep] = useState<ChecklistStep['step']>('floor-selection');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [verifierName, setVerifierName] = useState<string>('');
  const [roomChecks, setRoomChecks] = useState<Record<string, RoomCheck>>({});
  const [showIndividualVerification, setShowIndividualVerification] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<Report | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'carousel'>('grid');
  const [selectedRoomInMap, setSelectedRoomInMap] = useState<string | null>(null);

  // Initialize room checks when floor is selected
  useEffect(() => {
    if (selectedFloor && currentStep === 'room-verification') {
      const initialChecks: Record<string, RoomCheck> = {};
      ROOMS.filter(room => room.floor === selectedFloor && room.hasVideoConference).forEach(room => {
        initialChecks[room.id] = {
          roomId: room.id,
          items: createInitialCheckItems(room),
          timestamp: new Date()
        };
      });
      setRoomChecks(initialChecks);
    }
  }, [selectedFloor, currentStep]);

  const handleFloorSelect = (floor: number) => {
    setSelectedFloor(floor);
    setCurrentStep('user-input');
    setCompletedSteps(['floor-selection']);
  };

  const handleUserConfirm = (name: string) => {
    setVerifierName(name);
    setCurrentStep('room-verification');
    setCompletedSteps(['floor-selection', 'user-input']);
  };

  const handleBackToUserInput = () => {
    setCurrentStep('user-input');
    setCompletedSteps(['floor-selection']);
  };

  const handleBackToFloorSelection = () => {
    setCurrentStep('floor-selection');
    setCompletedSteps([]);
    setSelectedFloor(null);
    setVerifierName('');
    setRoomChecks({});
  };

  const updateRoomCheck = (updatedCheck: RoomCheck) => {
    setRoomChecks(prev => ({
      ...prev,
      [updatedCheck.roomId]: updatedCheck
    }));
  };

  const handleIndividualRoomUpdate = (updatedCheck: RoomCheck) => {
    // Update existing reports with the new room check
    const today = new Date().toDateString();
    const todayReports = reports.filter(report => 
      new Date(report.date).toDateString() === today
    );

    if (todayReports.length > 0) {
      const updatedReports = reports.map(report => {
        if (new Date(report.date).toDateString() === today) {
          const updatedRoomChecks = report.roomChecks.map(check =>
            check.roomId === updatedCheck.roomId ? updatedCheck : check
          );
          
          // Recalculate summary
          const checkedRooms = updatedRoomChecks.filter(check => 
            !check.items.some(item => item.status === 'unchecked')
          );
          const okRooms = checkedRooms.filter(check => 
            !check.items.some(item => item.status === 'problem')
          );
          const problemRooms = checkedRooms.filter(check => 
            check.items.some(item => item.status === 'problem')
          );

          return {
            ...report,
            roomChecks: updatedRoomChecks,
            summary: {
              totalRooms: report.summary.totalRooms,
              okRooms: okRooms.length,
              problemRooms: problemRooms.length
            }
          };
        }
        return report;
      });

      setReports(updatedReports);
    }
  };

  const generateReport = () => {
    if (!selectedFloor || !verifierName) return;

    const roomChecksList = Object.values(roomChecks);
    const checkedRooms = roomChecksList.filter(check => 
      !check.items.some(item => item.status === 'unchecked')
    );
    const okRooms = checkedRooms.filter(check => 
      !check.items.some(item => item.status === 'problem')
    );
    const problemRooms = checkedRooms.filter(check => 
      check.items.some(item => item.status === 'problem')
    );

    const report: Report = {
      id: Date.now().toString(),
      date: new Date(),
      responsibleName: verifierName,
      roomChecks: roomChecksList,
      summary: {
        totalRooms: roomChecksList.length,
        okRooms: okRooms.length,
        problemRooms: problemRooms.length
      }
    };

    setReports(prev => [report, ...prev]);
    setGeneratedReport(report);
    setCurrentStep('report-generation');
    setCompletedSteps(['floor-selection', 'user-input', 'room-verification']);
  };

  const handleReportGenerated = (type: 'xlsx' | 'email' | 'pdf' | 'text') => {
    if (generatedReport) {
      saveVerificationLog(generatedReport, type);
    }
  };

  const handleNewVerification = () => {
    setCurrentStep('floor-selection');
    setCompletedSteps([]);
    setSelectedFloor(null);
    setVerifierName('');
    setRoomChecks({});
    setGeneratedReport(null);
  };

  const handleMarkAllOk = () => {
    if (!selectedFloor) return;
    
    const updatedChecks: Record<string, RoomCheck> = {};
    floorRooms.forEach(room => {
      const items = createInitialCheckItems(room).map(item => ({
        ...item,
        status: 'ok' as const,
        observation: ''
      }));
      
      updatedChecks[room.id] = {
        roomId: room.id,
        items,
        timestamp: new Date()
      };
    });
    
    setRoomChecks(prev => ({ ...prev, ...updatedChecks }));
  };

  const handleMarkAllProblem = () => {
    // This would open a modal to select which items have problems
    alert('Funcionalidade para marcar problemas em massa será implementada');
  };

  const handleBackToVerification = () => {
    setCurrentStep('room-verification');
    setCompletedSteps(['floor-selection', 'user-input']);
  };

  // Check if current floor verification is complete
  const isFloorComplete = selectedFloor ? 
    Object.values(roomChecks).every(check => 
      !check.items.some(item => item.status === 'unchecked')
    ) : false;

  const floorRooms = selectedFloor ? 
    ROOMS.filter(room => room.floor === selectedFloor && room.hasVideoConference) : [];

  return (
    <div className="space-y-4 md:space-y-6 mobile-container md:px-0">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
            Checklist de Verificação
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Verificação diária das salas de videoconferência
          </p>
        </div>

        <button
          onClick={() => setShowIndividualVerification(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200 text-sm min-h-[44px]"
        >
          <WrenchScrewdriverIcon className="h-4 w-4" />
          <span>Verificação Individual</span>
        </button>
      </div>

      {/* Step Flow Indicator */}
      <StepFlowIndicator 
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      {/* Step Content */}
      {currentStep === 'floor-selection' && (
        <FloorSelectionStep onFloorSelect={handleFloorSelect} />
      )}

      {currentStep === 'user-input' && selectedFloor && (
        <UserInputStep
          selectedFloor={selectedFloor}
          onUserConfirm={handleUserConfirm}
          onBack={handleBackToFloorSelection}
        />
      )}

      {currentStep === 'room-verification' && selectedFloor && (
        <div className="space-y-4">
          {/* Progress and Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Verificando {selectedFloor}º Andar
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Responsável: {verifierName}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleBackToUserInput}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
                >
                  Voltar
                </button>
                {isFloorComplete && (
                  <button
                    onClick={generateReport}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 text-sm"
                  >
                    Finalizar Verificação
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Object.values(roomChecks).length > 0 ? 
                    (Object.values(roomChecks).filter(check => 
                      !check.items.some(item => item.status === 'unchecked')
                    ).length / Object.values(roomChecks).length) * 100 : 0}%` 
                }}
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {Object.values(roomChecks).filter(check => 
                !check.items.some(item => item.status === 'unchecked')
              ).length} de {Object.values(roomChecks).length} salas verificadas
            </div>
          </div>

          {/* Room Cards */}
          <div className="space-y-4">
            {/* View Mode Selector */}
            <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Grade
              </button>
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'carousel'
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Carrossel
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'map'
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Mapa
              </button>
            </div>

            {/* Content based on view mode */}
            {viewMode === 'grid' && (
              <div className="mobile-grid">
                {floorRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    roomName={room.name}
                    roomCheck={roomChecks[room.id] || {
                      roomId: room.id,
                      items: createInitialCheckItems(room),
                      timestamp: new Date()
                    }}
                    onUpdateCheck={updateRoomCheck}
                  />
                ))}
              </div>
            )}

            {viewMode === 'carousel' && (
              <RoomCarousel
                rooms={floorRooms}
                roomChecks={roomChecks}
                onUpdateCheck={updateRoomCheck}
              />
            )}

            {viewMode === 'map' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RoomLocationMap
                  floor={selectedFloor}
                  rooms={floorRooms}
                  roomChecks={roomChecks}
                  onRoomSelect={setSelectedRoomInMap}
                  selectedRoom={selectedRoomInMap}
                />
                {selectedRoomInMap && (
                  <RoomCard
                    roomName={floorRooms.find(r => r.id === selectedRoomInMap)?.name || ''}
                    roomCheck={roomChecks[selectedRoomInMap] || {
                      roomId: selectedRoomInMap,
                      items: createInitialCheckItems(floorRooms.find(r => r.id === selectedRoomInMap)!),
                      timestamp: new Date()
                    }}
                    onUpdateCheck={updateRoomCheck}
                  />
                )}
              </div>
            )}
          </div>

          {/* Floating Action Button */}
          <FloatingActionButton
            onMarkAllOk={handleMarkAllOk}
            onMarkAllProblem={handleMarkAllProblem}
            onToggleMap={() => setViewMode(viewMode === 'map' ? 'grid' : 'map')}
            onToggleList={() => setViewMode('grid')}
            showMap={viewMode === 'map'}
          />
        </div>
      )}

      {currentStep === 'report-generation' && generatedReport && (
        <ReportGenerationStep
          report={generatedReport}
          onReportGenerated={handleReportGenerated}
          onBack={handleBackToVerification}
          onNewVerification={handleNewVerification}
        />
      )}

      {/* Individual Room Verification Modal */}
      {showIndividualVerification && (
        <IndividualRoomVerification
          onClose={() => setShowIndividualVerification(false)}
          onRoomUpdated={handleIndividualRoomUpdate}
        />
      )}
    </div>
  );
};