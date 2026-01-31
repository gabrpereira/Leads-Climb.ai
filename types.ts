
export type LeadStatus = 'PROSPECTADO' | 'NOVO' | 'PENDENTE';

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  nicho: string;
  status: LeadStatus;
  empresa?: string;
  cargo?: string;
  created_at?: string;
}

export interface GenerationResult {
  leads: Partial<Lead>[];
}
