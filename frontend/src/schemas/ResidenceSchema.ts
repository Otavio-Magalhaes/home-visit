import { z } from "zod";

export const residenceSchema = z.object({
  // Endereço
  cep: z.string().min(8, "CEP inválido").max(9),
  municipio: z.string().min(1, "Obrigatório"),
  uf: z.string().length(2, "Use a sigla (ex: RJ)"),
  bairro: z.string().min(1, "Obrigatório"),
  tipo_logradouro: z.string().min(1, "Obrigatório"),
  nome_logradouro: z.string().min(1, "Obrigatório"),
  numero: z.string().min(1, "Obrigatório"),
  sem_numero: z.boolean().default(false),
  complemento: z.string().optional(),
  ponto_referencia: z.string().optional(),
  microarea: z.string().min(1, "Obrigatório"),
  fora_de_area: z.boolean().default(false),
  telefone_residencia: z.string().optional(),

  // Caracterização
  tipo_imovel: z.enum(["domicilio", "comercio", "terreno_baldio", "ponto_estrategico", "escola", "creche", "abrigo", "ilpi", "unidade_prisional", "unidade_medida_socioeducativa", "delegacia", "estabelecimento_religioso", "outros"]),
  situacao_moradia: z.enum(["proprio", "financiado", "alugado", "arrendado", "cedido", "ocupacao", "situacao_de_rua", "outra"]),
  tipo_domicilio: z.enum(["casa", "apartamento", "comodo", "outro"]),

  // Estrutura
  numero_moradores: z.coerce.number().min(0),
  numero_comodos: z.coerce.number().min(0),
  material_paredes: z.enum(["alvenaria_tijolo", "taipa", "madeira_aparelhada", "material_aproveitado", "palha", "outro"]),
  revestimento_parede: z.boolean().default(false),
  tipo_acesso: z.enum(["rua_pavimentada", "chao_batido", "fluvial", "outro"]),
  disponibilidade_energia: z.boolean().default(true),

  // Saneamento
  abastecimento_agua: z.enum(["rede_encanada", "poco_nascente", "cisterna", "carro_pipa", "outro"]),
  tratamento_agua: z.enum(["filtrada", "fervida", "clorada", "mineral", "sem_tratamento"]),
  escoamento_sanitario: z.enum(["rede_coletora_pluvial", "fossa_septica", "fossa_rudimentar", "direto_rio_lago_mar", "ceu_aberto", "outra"]),
  destino_lixo: z.enum(["coletado", "queimado_enterrado", "ceu_aberto", "outro"]),

  // Animais
  possui_animais: z.boolean().default(false),
  quantidade_animais: z.coerce.number().optional(),
  // Para simplificar no mobile, vamos usar um texto simples ou array de strings depois
  // animais_tipos: z.array(z.string()).optional(), 

  // Geo
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type ResidenceFormValues = z.infer<typeof residenceSchema>;