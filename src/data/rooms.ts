import { Room, CheckItem } from '../types';

export const FLOORS = [1, 2];

// Salas do 1º andar
export const FIRST_FLOOR_ROOMS: Room[] = [
  // Salas com equipamentos de videoconferência
  {
    id: 'tapira',
    name: 'Sala Tapira',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'Flipchart' },
      { category: 'Conexão', name: 'HDMI' }
    ]
  },
  {
    id: 'taquari',
    name: 'Sala Taquari',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Controle', name: 'Tablet' },
      { category: 'Controle', name: 'Painel' },
      { category: 'Telefone', name: 'Cisco' },
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Conexão', name: 'HDMI' }
    ]
  },
  {
    id: 'patrocinio',
    name: 'Sala Patrocinio',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' }
    ]
  },
  {
    id: 'transformacao',
    name: 'Sala Transformação',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Conexão', name: 'HDMI' }
    ]
  },
  {
    id: 'uberaba',
    name: 'Sala Uberaba',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Controle', name: 'Tablet' },
      { category: 'Imagem', name: 'Projetor' },
      { category: 'Conexão', name: 'Clickshare' }
    ]
  },
  {
    id: 'catalao',
    name: 'Sala Catalão',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Controle', name: 'Tablet' },
      { category: 'Imagem', name: 'Projetor' },
      { category: 'Conexão', name: 'Clickshare' }
    ]
  },
  {
    id: 'catalao-uberaba-junction',
    name: 'Junção Catalão/Uberaba',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Conexão', name: 'Clickshare (Uberaba)' },
      { category: 'Imagem', name: 'Projetor' },
      { category: 'Imagem', name: 'Camera' }
    ]
  },
  {
    id: 'sao-paulo',
    name: 'Sala São Paulo',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Conexão', name: 'Clickshare' }
    ]
  },
  {
    id: 'araxa',
    name: 'Sala Araxá',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Controle', name: 'Painel' },
      { category: 'Imagem', name: 'Flipchart' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'HDMI' }
    ]
  },
  {
    id: 'candeias',
    name: 'Sala Candeias',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'Camera' },
      { category: 'Imagem', name: 'TV' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Conexão', name: 'HDMI' }
    ]
  },
  {
    id: 'cubatao',
    name: 'Sala Cubatão',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'Camera' },
      { category: 'Imagem', name: 'TV' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Conexão', name: 'HDMI' }
    ]
  },
  {
    id: 'rio-verde',
    name: 'Sala Rio Verde',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'Camera' },
      { category: 'Imagem', name: 'TV' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Conexão', name: 'HDMI' }
    ]
  },
  {
    id: 'campo-grande',
    name: 'Sala Campo Grande',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Controle', name: 'Painel' },
      { category: 'Controle', name: 'Tablet' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Imagem', name: 'TV (1)' },
      { category: 'Imagem', name: 'TV (2)' },
      { category: 'Imagem', name: 'Camera' }
    ]
  },
  {
    id: 'cajati',
    name: 'Sala Cajati',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Controle', name: 'Painel' },
      { category: 'Controle', name: 'Tablet' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Imagem', name: 'TV (1)' },
      { category: 'Imagem', name: 'TV (2)' },
      { category: 'Imagem', name: 'Camera' }
    ]
  },
  {
    id: 'campo-grande-cajati-junction',
    name: 'Junção Campo Grande/Cajati',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Conexão', name: 'Clickshare (Campo Grande ou Cajati)' },
      { category: 'Imagem', name: 'TV (Cajati 1)' },
      { category: 'Imagem', name: 'TV (Cajati 2)' },
      { category: 'Imagem', name: 'TV (Campo Grande 1)' },
      { category: 'Imagem', name: 'TV (Campo Grande 2)' },
      { category: 'Imagem', name: 'Camera (Cajati e Campo Grande)' },
      { category: 'Controle', name: 'Tablet (Cajati e Campo Grande)' },
      { category: 'Controle', name: 'Painel (Cajati e Campo Grande)' }
    ]
  },
  {
    id: 'rondonopolis',
    name: 'Sala Rondonópolis',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Conexão', name: 'HDMI' }
    ]
  },
  {
    id: 'paranagua',
    name: 'Sala Paranaguá',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Conexão', name: 'HDMI' }
    ]
  },
  {
    id: 'rondonopolis-paranagua-rio-grande-junction',
    name: 'Junção Rondonópolis/Paranaguá/Rio Grande',
    floor: 1,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'Projetor' },
      { category: 'Controle', name: 'Tablet' },
      { category: 'Conexão', name: 'Clickshare' }
    ]
  },
  // Salas sem equipamentos de videoconferência
  {
    id: 'cabine',
    name: 'Cabine',
    floor: 1,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'rio-grande',
    name: 'Rio Grande',
    floor: 1,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'eficiencia',
    name: 'Eficiência',
    floor: 1,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'diversidade',
    name: 'Diversidade',
    floor: 1,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'inovacao',
    name: 'Inovação',
    floor: 1,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'bem-estar',
    name: 'Bem-Estar',
    floor: 1,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'sustentabilidade',
    name: 'Sustentabilidade',
    floor: 1,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'excelencia',
    name: 'Excelência',
    floor: 1,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'colaboracao',
    name: 'Colaboração',
    floor: 1,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'seguranca',
    name: 'Segurança',
    floor: 1,
    hasVideoConference: false,
    equipments: []
  }
];

// Salas do 2º andar
export const SECOND_FLOOR_ROOMS: Room[] = [
  {
    id: 'auditorio-junction',
    name: 'Junção Auditório/Inclusão/Aprendizagem/Habilidades Diversas',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV (1) (Auditório)' },
      { category: 'Imagem', name: 'TV (2) (Auditório)' },
      { category: 'Imagem', name: 'LED (1) (Auditório)' },
      { category: 'Imagem', name: 'LED (2) (Auditório)' },
      { category: 'Conexão', name: 'Clickshare (Auditório)' },
      { category: 'Conexão', name: 'HDMI (Auditório)' },
      { category: 'Conexão', name: 'Multimidia (Auditório)' },
      { category: 'Controle', name: 'Painel MTR (Auditório)' },
      { category: 'Controle', name: 'Painel Creston (Auditório)' },
      { category: 'Controle', name: 'Tablet (Auditório)' },
      { category: 'Imagem', name: 'TV (Inclusão)' },
      { category: 'Imagem', name: 'Camera (Inclusão)' },
      { category: 'Conexão', name: 'Clickshare (Inclusão)' },
      { category: 'Conexão', name: 'HDMI (Inclusão)' },
      { category: 'Controle', name: 'Painel MTR (Inclusão)' },
      { category: 'Controle', name: 'Painel Creston (Inclusão)' },
      { category: 'Imagem', name: 'TV (Aprendizagem)' },
      { category: 'Imagem', name: 'Camera (Aprendizagem)' },
      { category: 'Conexão', name: 'Clickshare (Aprendizagem)' },
      { category: 'Conexão', name: 'HDMI (Aprendizagem)' },
      { category: 'Controle', name: 'Painel MTR (Aprendizagem)' },
      { category: 'Controle', name: 'Painel Creston (Aprendizagem)' },
      { category: 'Imagem', name: 'TV (Habilidades Diversas)' },
      { category: 'Imagem', name: 'Camera (Habilidades Diversas)' },
      { category: 'Conexão', name: 'Clickshare (Habilidades Diversas)' },
      { category: 'Conexão', name: 'HDMI (Habilidades Diversas)' },
      { category: 'Controle', name: 'Painel MTR (Habilidades Diversas)' },
      { category: 'Controle', name: 'Painel Creston (Habilidades Diversas)' }
    ]
  },
  {
    id: 'auditorio',
    name: 'Auditório',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV (1)' },
      { category: 'Imagem', name: 'TV (2)' },
      { category: 'Imagem', name: 'LED (1)' },
      { category: 'Imagem', name: 'LED (2)' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Conexão', name: 'HDMI' },
      { category: 'Conexão', name: 'Multimidia' },
      { category: 'Controle', name: 'Painel MTR' },
      { category: 'Controle', name: 'Painel Creston' },
      { category: 'Controle', name: 'Tablet' }
    ]
  },
  {
    id: 'inclusao',
    name: 'Sala Inclusão',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Conexão', name: 'HDMI' },
      { category: 'Controle', name: 'Painel MTR' },
      { category: 'Controle', name: 'Painel Creston' }
    ]
  },
  {
    id: 'aprendizagem',
    name: 'Sala Aprendizagem',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Conexão', name: 'HDMI' },
      { category: 'Controle', name: 'Painel MTR' },
      { category: 'Controle', name: 'Painel Creston' }
    ]
  },
  {
    id: 'habilidades-diversas',
    name: 'Sala Habilidades Diversas',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Conexão', name: 'HDMI' },
      { category: 'Controle', name: 'Painel MTR' },
      { category: 'Controle', name: 'Painel Creston' }
    ]
  },
  {
    id: 'viletta',
    name: 'Sala Viletta',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Controle', name: 'Painel' }
    ]
  },
  {
    id: 'piura',
    name: 'Sala Piura',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Controle', name: 'Painel' }
    ]
  },
  {
    id: 'assuncao',
    name: 'Sala Assunção',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Controle', name: 'Painel' }
    ]
  },
  {
    id: 'pecuaria',
    name: 'Sala Pecuária',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Controle', name: 'Painel' }
    ]
  },
  {
    id: 'mineracao',
    name: 'Sala Mineração',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Controle', name: 'Painel' }
    ]
  },
  {
    id: 'village',
    name: 'Sala Village',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Controle', name: 'Painel' }
    ]
  },
  {
    id: 'voluntarios',
    name: 'Sala Voluntários',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Controle', name: 'Painel' }
    ]
  },
  {
    id: 'palmeirante',
    name: 'Sala Palmeirante',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Controle', name: 'Painel' }
    ]
  },
  {
    id: 'equidade',
    name: 'Sala Equidade',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Controle', name: 'Painel' }
    ]
  },
  {
    id: 'joc-orourke',
    name: 'Sala Joc O\'Rourke',
    floor: 2,
    hasVideoConference: true,
    equipments: [
      { category: 'Imagem', name: 'TV (1)' },
      { category: 'Imagem', name: 'TV (2)' },
      { category: 'Imagem', name: 'Camera' },
      { category: 'Conexão', name: 'Clickshare' },
      { category: 'Controle', name: 'Painel' }
    ]
  },
  // Salas sem equipamentos de videoconferência
  {
    id: 'racas-etnias',
    name: 'Raças e Etnias',
    floor: 2,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'orgulho',
    name: 'Orgulho',
    floor: 2,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'mulheres',
    name: 'Mulheres',
    floor: 2,
    hasVideoConference: false,
    equipments: []
  },
  {
    id: 'geracoes',
    name: 'Gerações',
    floor: 2,
    hasVideoConference: false,
    equipments: []
  }
];

export const ROOMS: Room[] = [...FIRST_FLOOR_ROOMS, ...SECOND_FLOOR_ROOMS];

export const createInitialCheckItems = (room: Room): CheckItem[] =>
  room.equipments.map(equipment => ({
    id: `${equipment.category.toLowerCase()}-${equipment.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name: `${equipment.category} - ${equipment.name}`,
    status: 'unchecked' as const,
    observation: '',
    category: equipment.category
  }));