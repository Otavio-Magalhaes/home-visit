import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db.js';

// Ícones e UI
import { 
  Save, Loader2, ChevronRight, ChevronLeft, Home, User, 
  Stethoscope, AlertTriangle, HeartPulse, Brain, Soup, ShowerHead // Ícone de Chuveiro para Higiene
} from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Badge } from '@/components/ui/badge.js';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.js";
import { Textarea } from '@/components/ui/textarea.js';
import { Separator } from '@/components/ui/separator.js';
import CheckField from '@/components/CheckField.js';
import TextField from '@/components/TextField.js';
import { visitFormSchema, type VisitFormValues } from '@/schemas/VisitSchema.js';

export default function NewVisitWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      data_visita: new Date().toISOString().split('T')[0],
      desfecho: "REALIZADA",
      // Defaults para evitar erros de uncontrolled components
      esta_gestante: false, tem_hipertensao: false, tem_diabetes: false,
      esta_acamado: false, em_situacao_rua: false,
      esta_fumante: false, usa_alcool: false, usa_outras_drogas: false,
      tem_acesso_higiene_pessoal: false,
      tem_doenca_cardiaca: false, tem_problemas_rins: false, tem_doenca_respiratoria: false
    }
  });

  const selectedResidenceId = form.watch('residence_id');

  // --- QUERIES (Dexie) ---
  const residences = useLiveQuery(async () => {
    const serverData = await db.residences.toArray();
    const localData = await db.syncQueue.where('tipo').equals('residencia').filter(i => i.synced === 0).toArray();
    const localFormatted = localData.map(d => ({ id: d.temp_id, ...d.payload, isOffline: true }));
    return [...serverData, ...localFormatted];
  });

  const residents = useLiveQuery(async () => {
    if (!selectedResidenceId) return [];
    const serverData = await db.residents.filter(r => String(r.residence_id) === String(selectedResidenceId)).toArray();
    const localData = await db.syncQueue.where('tipo').equals('morador').filter(i => i.synced === 0 && String(i.payload.residence_id) === String(selectedResidenceId)).toArray();
    const localFormatted = localData.map(d => ({ id: d.temp_id, ...d.payload, isOffline: true }));
    return [...serverData, ...localFormatted];
  }, [selectedResidenceId]);

  // --- NAVEGAÇÃO ---
  const nextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    let isValid = false;
    if (step === 1) isValid = await form.trigger('residence_id');
    if (step === 2) isValid = await form.trigger('resident_id');
    if (isValid) { setStep(s => s + 1); window.scrollTo(0, 0); }
  };

  const prevStep = (e: React.MouseEvent) => { e.preventDefault(); setStep(s => s - 1); window.scrollTo(0, 0); };

  // --- SUBMIT ---
  const onSubmit = async (data: VisitFormValues) => {
    try {
      setIsSaving(true);
      
      // Helper: Transforma string separada por vírgula em Lista de Strings
      const splitArray = (val?: string | string[]) => {
          if (Array.isArray(val)) return val;
          return val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
      };

      const visitPayload = {
        resident_id: data.resident_id,
        desfecho: data.desfecho,
        data_visita: new Date(data.data_visita).toISOString(),
        observacoes: data.observacoes,
        
        // Objeto HealthSituation (só se realizada)
        health_situation: data.desfecho === 'REALIZADA' ? {
            ...data,
            // Remove campos da visita para não sujar o objeto de saúde
            resident_id: undefined, desfecho: undefined, data_visita: undefined, observacoes: undefined,
            
            // Formata os Arrays corretamente para o Backend
            doencas_cardiacas_tipos: splitArray(data.doencas_cardiacas_tipos),
            problemas_rins_tipos: splitArray(data.problemas_rins_tipos),
            doenca_respiratoria_tipos: splitArray(data.doenca_respiratoria_tipos),
            outras_condicoes: splitArray(data.outras_condicoes), // <--- Novo campo lista
            origem_alimentacao: splitArray(data.origem_alimentacao),
            higiene_pessoal_tipos: splitArray(data.higiene_pessoal_tipos),
        } : null
      };

      await db.syncQueue.add({
        temp_id: uuidv4(),
        tipo: 'visita',
        payload: visitPayload,
        synced: 0,
        created_at: new Date()
      });

      alert("Visita registrada com sucesso!");
      navigate('/app/home');
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar visita.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-24 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Nova Visita</h1>
        <Badge variant="secondary" className="text-sm">Passo {step} de 3</Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* --- PASSO 1: CASA --- */}
          {step === 1 && (
            <Card className="animate-in slide-in-from-right-4">
                <CardHeader><CardTitle className="flex items-center gap-2"><Home className="text-blue-600"/> Residência</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="residence_id" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Buscar por Endereço</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                <SelectContent className="max-h-60">
                                    {residences?.map((res: any) => (
                                        <SelectItem key={res.id} value={String(res.id)}>{res.nome_logradouro}, {res.numero} {res.isOffline && "(Novo)"}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button variant="outline" className="w-full mt-4" onClick={(e) => { e.preventDefault(); navigate('/app/nova-residencia'); }}>Cadastrar Nova Residência</Button>
                </CardContent>
            </Card>
          )}

          {/* --- PASSO 2: MORADOR --- */}
          {step === 2 && (
            <Card className="animate-in slide-in-from-right-4">
                <CardHeader><CardTitle className="flex items-center gap-2"><User className="text-purple-600"/> Morador</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="resident_id" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Moradores desta casa</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {residents?.map((res: any) => (
                                        <SelectItem key={res.id} value={String(res.id)}>{res.nome_completo}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    {(!residents || residents.length === 0) && (
                        <Button variant="outline" className="w-full mt-4 border-purple-200 text-purple-700" onClick={(e) => { e.preventDefault(); navigate('/app/novo-morador'); }}>+ Cadastrar Novo Morador</Button>
                    )}
                </CardContent>
            </Card>
          )}

          {/* --- PASSO 3: DADOS COMPLETOS --- */}
          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Dados da Visita</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <FormField control={form.control} name="data_visita" render={({ field }) => (
                                <FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name="desfecho" render={({ field }) => (
                                <FormItem><FormLabel>Desfecho</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent><SelectItem value="REALIZADA">Realizada</SelectItem><SelectItem value="RECUSADA">Recusada</SelectItem><SelectItem value="AUSENTE">Ausente</SelectItem></SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="observacoes" render={({ field }) => (
                            <FormItem><FormLabel>Observações</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                        )} />
                    </CardContent>
                </Card>

                {/* FICHA DE SAÚDE */}
                {form.watch('desfecho') === 'REALIZADA' && (
                    <div className="space-y-2">
                        <h3 className="font-bold text-gray-700 px-1 flex items-center gap-2"><Stethoscope size={18}/> Ficha de Saúde</h3>
                        
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            
                            {/* 1. CONDIÇÕES GERAIS */}
                            <AccordionItem value="geral" className="bg-white rounded-lg border px-4">
                                <AccordionTrigger><div className="flex items-center gap-2 text-gray-700"><HeartPulse size={16} className="text-red-500"/> Condições Gerais & Vícios</div></AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <FormField control={form.control} name="peso_situacao" render={({ field }) => (
                                        <FormItem><FormLabel>Situação de Peso</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="peso_adequado">Adequado</SelectItem><SelectItem value="abaixo_do_peso">Abaixo</SelectItem><SelectItem value="acima_do_peso">Acima</SelectItem></SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <CheckField form={form} name="esta_gestante" label="Gestante" />
                                        <CheckField form={form} name="esta_fumante" label="Fumante" />
                                        <CheckField form={form} name="usa_alcool" label="Álcool" />
                                        <CheckField form={form} name="usa_outras_drogas" label="Outras Drogas" />
                                    </div>
                                    {form.watch('esta_gestante') && (
                                        <TextField form={form} name="maternidade_referencia" label="Maternidade de Ref." />
                                    )}
                                </AccordionContent>
                            </AccordionItem>

                            {/* 2. DOENÇAS CRÔNICAS (Com os campos complexos) */}
                            <AccordionItem value="doencas" className="bg-white rounded-lg border px-4">
                                <AccordionTrigger><div className="flex items-center gap-2 text-gray-700"><AlertTriangle size={16} className="text-orange-500"/> Doenças Crônicas</div></AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <CheckField form={form} name="tem_hipertensao" label="Hipertensão" />
                                        <CheckField form={form} name="tem_diabetes" label="Diabetes" />
                                        <CheckField form={form} name="teve_avc_derrame" label="Teve AVC" />
                                        <CheckField form={form} name="teve_infarto" label="Teve Infarto" />
                                        <CheckField form={form} name="tem_cancer" label="Câncer" />
                                        <CheckField form={form} name="tem_hanseniase" label="Hanseníase" />
                                        <CheckField form={form} name="tem_tuberculose" label="Tuberculose" />
                                    </div>
                                    
                                    {/* Detalhamento de Doenças */}
                                    <Separator className="my-2"/>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <CheckField form={form} name="tem_doenca_cardiaca" label="Doença Cardíaca" />
                                            {form.watch('tem_doenca_cardiaca') && <TextField form={form} name="doencas_cardiacas_tipos" label="Quais? (Separe por vírgula)" />}
                                        </div>
                                        <div>
                                            <CheckField form={form} name="tem_doenca_respiratoria" label="Doença Respiratória" />
                                            {form.watch('tem_doenca_respiratoria') && <TextField form={form} name="doenca_respiratoria_tipos" label="Quais? (Asma, DPOC...)" />}
                                        </div>
                                        <div>
                                            <CheckField form={form} name="tem_problemas_rins" label="Problema nos Rins" />
                                            {form.watch('tem_problemas_rins') && <TextField form={form} name="problemas_rins_tipos" label="Quais? (Insuficiência...)" />}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* 3. SAÚDE MENTAL & INTERNAÇÃO */}
                            <AccordionItem value="mental" className="bg-white rounded-lg border px-4">
                                <AccordionTrigger><div className="flex items-center gap-2 text-gray-700"><Brain size={16} className="text-purple-500"/> Internação & Mental</div></AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <CheckField form={form} name="diagnostico_problema_mental" label="Problema Mental Diagnosticado?" />
                                    <CheckField form={form} name="internacao_ultimos_12_meses" label="Internado nos últimos 12 meses?" />
                                    {form.watch('internacao_ultimos_12_meses') && <TextField form={form} name="causa_internacao" label="Causa da Internação" />}
                                </AccordionContent>
                            </AccordionItem>

                            {/* 4. MOBILIDADE & PRÁTICAS (Com Outras Condições como Lista) */}
                            <AccordionItem value="outros" className="bg-white rounded-lg border px-4">
                                <AccordionTrigger><div className="flex items-center gap-2 text-gray-700"><Home size={16} className="text-green-500"/> Mobilidade & Outros</div></AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <CheckField form={form} name="esta_acamado" label="Acamado" />
                                        <CheckField form={form} name="esta_domiciliado" label="Domiciliado" />
                                        <CheckField form={form} name="usa_plantas_medicinais" label="Plantas Medicinais" />
                                        <CheckField form={form} name="usa_praticas_integrativas" label="Práticas Integrativas" />
                                    </div>
                                    {form.watch('usa_plantas_medicinais') && <TextField form={form} name="plantas_medicinais_desc" label="Quais Plantas?" />}
                                    
                                    <Separator className="my-2"/>
                                    <TextField form={form} name="outras_condicoes" label="Outras Condições de Saúde (Separe por vírgula)" placeholder="Ex: Alergia a dipirona, Dor nas costas" />
                                </AccordionContent>
                            </AccordionItem>

                             {/* 5. SITUAÇÃO DE RUA (Com Alimentação) */}
                             <AccordionItem value="rua" className="bg-white rounded-lg  px-4 border">
                                <AccordionTrigger><div className="flex items-center gap-2 text-gray-700"><Soup size={16} className="text-yellow-600"/> Situação de Rua</div></AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <CheckField form={form} name="em_situacao_rua" label="Está em situação de rua?" />
                                    
                                    {form.watch('em_situacao_rua') && (
                                        <div className="space-y-3 animate-in fade-in border-l-2 border-gray-100 pl-3 ml-1">
                                            <FormField control={form.control} name="tempo_situacao_rua" render={({ field }) => (
                                                <FormItem><FormLabel>Tempo na Rua</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="menos_6_meses">Menos de 6 meses</SelectItem>
                                                            <SelectItem value="de_6_a_12_meses">6 a 12 meses</SelectItem>
                                                            <SelectItem value="de_1_a_5_anos">1 a 5 anos</SelectItem>
                                                            <SelectItem value="mais_5_anos">Mais de 5 anos</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )} />
                                            <CheckField form={form} name="recebe_beneficio" label="Recebe algum benefício?" />
                                            <CheckField form={form} name="possui_referencia_familiar" label="Possui referência familiar?" />
                                            {form.watch('possui_referencia_familiar') && (
                                                <div className="pl-2 space-y-2">
                                                    <CheckField form={form} name="visita_familiar_frequente" label="Visita a família?" />
                                                    <TextField form={form} name="grau_parentesco_referencia" label="Grau Parentesco" />
                                                </div>
                                            )}
                                            <CheckField form={form} name="acompanhado_outra_instituicao" label="Acompanhado por instituição?" />
                                            {form.watch('acompanhado_outra_instituicao') && <TextField form={form} name="instituicao_acompanhamento" label="Qual instituição?" />}
                                            
                                            <Separator className="my-2"/>
                                            <FormLabel className="text-xs font-bold text-yellow-700">ALIMENTAÇÃO</FormLabel>
                                            <FormField control={form.control} name="frequencia_alimentacao" render={({ field }) => (
                                                <FormItem><FormLabel>Frequência Diária</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="uma_vez">1 vez</SelectItem>
                                                            <SelectItem value="duas_ou_tres_vezes">2 ou 3 vezes</SelectItem>
                                                            <SelectItem value="mais_de_tres_vezes">+ de 3 vezes</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )} />
                                            <TextField form={form} name="origem_alimentacao" label="Origem (Ex: Restaurante Popular, Doação...)" />
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>

                            {/* 6. HIGIENE PESSOAL (Novo Grupo Separado) */}
                            <AccordionItem value="higiene" className="bg-white  border rounded-lg  px-4 ">
                                <AccordionTrigger><div className="flex items-center gap-2 text-gray-700"><ShowerHead size={16} className="text-blue-500"/> Higiene Pessoal</div></AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <CheckField form={form} name="tem_acesso_higiene_pessoal" label="Tem acesso a Higiene Pessoal?" />
                                    {form.watch('tem_acesso_higiene_pessoal') && (
                                         <TextField form={form} name="higiene_pessoal_tipos" label="Quais meios? (Ex: Banho, Sanitário, Escovação...)" />
                                    )}
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                    </div>
                )}
            </div>
          )}

          {/* BOTÕES DE NAVEGAÇÃO */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-10 flex gap-3 shadow-lg">
            {step > 1 && <Button type="button" variant="outline" className="flex-1 h-12" onClick={prevStep}><ChevronLeft className="mr-1 h-5 w-5" /> Voltar</Button>}
            {step < 3 ? (
                <Button type="button" className="flex-1 h-12 bg-lasalle-blue text-lg" onClick={nextStep}>Próximo <ChevronRight className="ml-1 h-5 w-5" /></Button>
            ) : (
                <Button type="submit" className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white text-lg" disabled={isSaving}>{isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />} Finalizar Visita</Button>
            )}
          </div>

        </form>
      </Form>
    </div>
  );
}

