export interface Room {
  id: string;
  name: string;
  floor: number;
  hasVideoConference: boolean;
  equipments: Equipment[];
}

export interface Equipment {
  category: string;
  name: string;
}

export interface CheckItem {
  id: string;
  name: string;
  status: 'ok' | 'problem' | 'unchecked';
  observation?: string;
  category?: string;
}

export interface RoomCheck {
  roomId: string;
  items: CheckItem[];
  timestamp: Date;
}

export interface Report {
  id: string;
  date: Date;
  responsibleName: string;
  roomChecks: RoomCheck[];
  summary: {
    totalRooms: number;
    okRooms: number;
    problemRooms: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ChecklistStep {
  step: 'floor-selection' | 'user-input' | 'room-verification' | 'report-generation';
  data?: any;
}

export interface VerificationLog {
  id: string;
  timestamp: Date;
  floor: number;
  verifierName: string;
  reportType: 'xlsx' | 'email' | 'pdf' | 'text';
  roomsChecked: number;
  problemsFound: number;
  reportData: Report;
}