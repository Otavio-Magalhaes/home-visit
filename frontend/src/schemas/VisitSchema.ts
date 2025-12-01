import { z } from "zod";

export const visitFormSchema = z.object({
  // Vínculos
  residence_id: z.string().min(1, "Selecione uma residência"),
  resident_id: z.string().min(1, "Selecione um morador"),

  // Visita
  desfecho: z.enum(["REALIZADA", "RECUSADA", "AUSENTE"]),
  data_visita: z.string(),
  observacoes: z.string().optional(),

  // --- SAÚDE (Só se REALIZADA) ---
  
  // Gerais & Vícios
  peso_situacao: z.enum(["abaixo_do_peso", "peso_adequado", "acima_do_peso"]).optional(),
  esta_gestante: z.boolean().default(false),
  maternidade_referencia: z.string().optional(),
  esta_fumante: z.boolean().default(false),
  usa_alcool: z.boolean().default(false),
  usa_outras_drogas: z.boolean().default(false),

  // Doenças Crônicas
  tem_hipertensao: z.boolean().default(false),
  tem_diabetes: z.boolean().default(false),
  teve_avc_derrame: z.boolean().default(false),
  teve_infarto: z.boolean().default(false),
  tem_hanseniase: z.boolean().default(false),
  tem_tuberculose: z.boolean().default(false),
  tem_cancer: z.boolean().default(false),

  // Doenças com Detalhes (Arrays)
  tem_doenca_cardiaca: z.boolean().default(false),
  doencas_cardiacas_tipos: z.string().optional(),
  tem_problemas_rins: z.boolean().default(false),
  problemas_rins_tipos: z.string().optional(),
  tem_doenca_respiratoria: z.boolean().default(false),
  doenca_respiratoria_tipos: z.string().optional(),

  // Internação & Mental
  internacao_ultimos_12_meses: z.boolean().default(false),
  causa_internacao: z.string().optional(),
  diagnostico_problema_mental: z.boolean().default(false),

  // Mobilidade & Práticas
  esta_acamado: z.boolean().default(false),
  esta_domiciliado: z.boolean().default(false),
  usa_plantas_medicinais: z.boolean().default(false),
  plantas_medicinais_desc: z.string().optional(),
  usa_praticas_integrativas: z.boolean().default(false),

  // Outros
  outras_condicoes_1: z.string().optional(),
  outras_condicoes_2: z.string().optional(),
  outras_condicoes_3: z.string().optional(),

  // Situação de Rua
  em_situacao_rua: z.boolean().default(false),
  tempo_situacao_rua: z.enum(["menos_6_meses", "de_6_a_12_meses", "de_1_a_5_anos", "mais_5_anos"]).optional(),
  recebe_beneficio: z.boolean().default(false),
  possui_referencia_familiar: z.boolean().default(false),
  visita_familiar_frequente: z.boolean().default(false),
  grau_parentesco_referencia: z.string().optional(),
  acompanhado_outra_instituicao: z.boolean().default(false),
  instituicao_acompanhamento: z.string().optional(),
  frequencia_alimentacao: z.enum(["uma_vez", "duas_ou_tres_vezes", "mais_de_tres_vezes"]).optional(),
  origem_alimentacao: z.string().optional(), // Array
  tem_acesso_higiene_pessoal: z.boolean().default(false),
  higiene_pessoal_tipos: z.string().optional(), // Array
});

export type VisitFormValues = z.infer<typeof visitFormSchema>;