import { z } from "zod";

export const residentSchema = z.object({
  residence_id: z.string().min(1, "Selecione uma residência"),

  // --- IDENTIFICAÇÃO ---
  nome_completo: z.string().min(3, "Nome obrigatório"),
  nome_social: z.string().optional(),
  cpf: z.string().optional(), // Opcional pois pode não ter
  cns: z.string().optional(),
  data_nascimento: z.string().min(1, "Data obrigatória"),
  sexo: z.enum(["masculino", "feminino"]),
  raca_cor: z.enum(["branca", "preta", "parda", "amarela", "indigena"]),
  etnia: z.string().optional(), // Apenas se indígena
  nis_pis_pasep: z.string().optional(),

  // --- FILIAÇÃO ---
  nome_mae: z.string().min(1, "Nome da mãe é obrigatório (ou marque desconhecida)"),
  mae_desconhecida: z.boolean().default(false),
  nome_pai: z.string().optional(),
  pai_desconhecido: z.boolean().default(false),

  // --- NACIONALIDADE ---
  nacionalidade: z.enum(["brasileira", "naturalizado", "estrangeiro"]),
  pais_nascimento: z.string().optional(),
  dt_naturalizacao: z.string().optional(),
  portaria_naturalizacao: z.string().optional(),
  municipio_nascimento: z.string().optional(),

  // --- CONTATO ---
  telefone_celular: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),

  // --- RESPONSABILIDADE FAMILIAR ---
  eh_responsavel_familiar: z.boolean().default(false),
  cns_cpf_responsavel: z.string().optional(),
  relacao_parentesco: z.enum([
    "conjuge_companheiro", "filho", "enteado", "neto_bisneto", "pai_mae", 
    "sogro", "irmao_irma", "genro_nora", "outro_parente", "nao_parente"
  ]).optional(),

  // --- SOCIODEMOGRÁFICO ---
  ocupacao: z.string().optional(),
  frequenta_escola: z.boolean().default(false),
  escolaridade: z.enum([
    "creche", 
    "pre_escola", 
    "classe_alfabetizacao", 
    "fundamental_1_4", 
    "fundamental_5_8", 
    "fundamental_completo", 
    "fundamental_especial", 
    "eja_iniciais", 
    "eja_finais", 
    "medio", 
    "medio_especial", 
    "medio_eja", 
    "superior", 
    "alfabetizacao_adultos", 
    "nenhum"
  ]).optional(),
  
  situacao_mercado: z.enum([
    "empregador", "assalariado_com_carteira", "assalariado_sem_carteira",
    "autonomo_com_previdencia", "autonomo_sem_previdencia", "aposentado_pensionista", 
    "desempregado", "nao_trabalha", "servidor_publico", "outro"
  ]).optional(),

  responsavel_crianca: z.string().optional(), // Array transformado em string
  frequenta_cuidador: z.boolean().default(false),
  participa_grupos_comunitarios: z.boolean().default(false),
  possui_plano_saude: z.boolean().default(false),
  
  membro_povo_tradicional: z.boolean().default(false),
  povo_tradicional_desc: z.string().optional(),

  // --- IDENTIDADE & DEFICIÊNCIA ---
  orientacao_sexual: z.enum(["heterossexual", "gay", "lesbica", "bissexual", "outro"]).optional(),
  identidade_genero: z.enum(["homem_transexual", "mulher_transexual", "travesti", "outro"]).optional(),
  
  possui_deficiencia: z.boolean().default(false),
  deficiencias_tipo: z.string().optional(), // Array transformado em string

  // --- SAÍDA ---
  saida_cadastro: z.boolean().default(false),
  motivo_saida: z.string().optional(),
  data_obito: z.string().optional(),
  numero_do: z.string().optional()
});

export type ResidentFormValues = z.infer<typeof residentSchema>;