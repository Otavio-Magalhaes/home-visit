import  {Dexie, type Table } from 'dexie';

export interface IResidenciaCache {
  id: number; // ID real do Postgres
  responsavel_id: number;
  
  // Endereço Completo (Essencial para busca)
  cep: string;
  municipio: string;
  uf: string;
  bairro: string;
  tipo_logradouro: string;
  nome_logradouro: string;
  numero: string;
  complemento?: string;
  ponto_referencia?: string;
  
  // Organização
  microarea: string; // Muito usado para filtrar a lista do dia
  tipo_imovel: string;
}

export interface IMoradorCache {
  id: string; // UUID vindo do backend
  residence_id: number; // Chave estrangeira para ligar com a casa
  
  // Identificação Pessoal
  nome_completo: string;
  nome_social?: string;
  cpf?: string;
  cns?: string;
  data_nascimento: string; // Guardamos como string (ISO) para facilitar serialização
  sexo: string;
  
  // Filiação (Crucial para diferenciar homônimos)
  nome_mae: string;
  
  // Status
  eh_responsavel_familiar: boolean;
}

// --- OUTBOX: DADOS CRIADOS OFFLINE ---

export interface IRegistroOffline {
  id?: number;       // ID interno do IndexedDB (auto-increment)
  temp_id: string;   // UUID gerado no front (controle de vínculo temporário)
  tipo: 'residencia' | 'morador' | 'visita'; 
  payload: any;      // O JSON completo que será enviado para a API
  synced: number;    // 0 = Pendente, 1 = Enviado
  created_at: Date;
}

class SaudeAppDB extends Dexie {
  // Fila de Sincronização (Upload)
  syncQueue!: Table<IRegistroOffline, number>;
  
  // Tabelas de Cache (Download/Espelho)
  residences!: Table<IResidenciaCache, number>;
  residents!: Table<IMoradorCache, string>;

  constructor() {
    super('SaudeAppDB');
    
    // Versão 1: (Mantida para histórico, se houver migração)
    this.version(1).stores({
      syncQueue: '++id, temp_id, tipo, synced' 
    });

    // Versão 2: Adicionando tabelas de Cache com Índices
    // NOTA: Os campos listados aqui são os que você poderá usar no .where()
    this.version(2).stores({
      syncQueue: '++id, temp_id, tipo, synced',
      
      // Busca de casas: Pelo ID, Bairro, Microárea, Rua ou CEP
      residences: 'id, bairro, microarea, nome_logradouro, cep', 
      
      // Busca de pessoas: Pelo ID, Nome, CPF, CNS ou Casa (para listar quem mora lá)
      residents: 'id, nome_completo, cpf, cns, residence_id'
    });
  }
}

export const db = new SaudeAppDB();