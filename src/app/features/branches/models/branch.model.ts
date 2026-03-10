export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  zipCode: string;
  distanceKm: number;
}

export interface BranchSearchVM {
  results: Branch[];
  isLoading: boolean;
  error: string | null;
  term: string;
}

export const INITIAL_BRANCH_VM: BranchSearchVM = {
  results: [],
  isLoading: false,
  error: null,
  term: '',
};

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'MI001',
    name: 'Filiale Milano Centro',
    city: 'Milano',
    address: 'Via Dante, 12',
    zipCode: '20121',
    distanceKm: 0.8,
  },
  {
    id: 'MI002',
    name: 'Filiale Milano Navigli',
    city: 'Milano',
    address: 'Via Corsico, 4',
    zipCode: '20144',
    distanceKm: 3.2,
  },
  {
    id: 'RM001',
    name: 'Filiale Roma Termini',
    city: 'Roma',
    address: 'Via Giolitti, 34',
    zipCode: '00185',
    distanceKm: 12.5,
  },
  {
    id: 'NA001',
    name: 'Filiale Napoli Centro',
    city: 'Napoli',
    address: 'Via Toledo, 156',
    zipCode: '80134',
    distanceKm: 24.0,
  },
  {
    id: 'TO001',
    name: 'Filiale Torino Porta Nuova',
    city: 'Torino',
    address: 'Corso Vittorio Emanuele II, 82',
    zipCode: '10121',
    distanceKm: 7.3,
  },
];
