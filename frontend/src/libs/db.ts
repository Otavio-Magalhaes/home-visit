import  {Dexie, type Table } from 'dexie';

export interface IResidenciaCache {
  id: number; 
  responsavel_id: number;
  
  cep: string;
  municipio: string;
  uf: string;
  bairro: string;
  tipo_logradouro: string;
  nome_logradouro: string;
  numero: string;
  complemento?: string;
  ponto_referencia?: string;
  
  latitude?: number;
  longitude?: number;
  
  microarea: string;
  tipo_imovel: string;

  [key: string]: any; 
}

export interface IMoradorCache {
  id: string; // UUID vindo do backend
  residence_id: number; // Chave estrangeira
  
  nome_completo: string;
  nome_social?: string;
  cpf?: string;
  cns?: string;
  data_nascimento: string; 
  sexo: string;
  
  nome_mae: string;
  
  eh_responsavel_familiar: boolean;

  [key: string]: any;
}


export interface IRegistroOffline {
  id?: number;       
  temp_id: string;   
  tipo: 'residencia' | 'morador' | 'visita'; 
  payload: any;     
  synced: number;    
  created_at: Date;
}

class SaudeAppDB extends Dexie {
  syncQueue!: Table<IRegistroOffline, number>;
  
  residences!: Table<IResidenciaCache, number>;
  residents!: Table<IMoradorCache, string>;

  constructor() {
    super('SaudeAppDB');
    
    this.version(1).stores({
      syncQueue: '++id, temp_id, tipo, synced' 
    });

    this.version(2).stores({
      syncQueue: '++id, temp_id, tipo, synced',
      
      residences: 'id, bairro, microarea, nome_logradouro, cep', 
      
      residents: 'id, nome_completo, cpf, cns, residence_id'
    });
  }
}

export const db = new SaudeAppDB();