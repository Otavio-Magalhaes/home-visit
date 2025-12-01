import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db.js';
import { residentSchema, type ResidentFormValues } from '@/schemas/ResidentSchema.js';

// Ícones e UI
import { Save, Loader2, User, Home, FileText, Activity, Globe, Users, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.js";
import { Separator } from '@/components/ui/separator.js';
import CheckField from '@/components/CheckField.js';
import TextField from '@/components/TextField.js';
import { toast } from "sonner"
export default function NewResidentForm() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Busca residências (Cache + Local)
  const residences = useLiveQuery(async () => {
    const serverData = await db.residences.toArray();
    const localData = await db.syncQueue.where('tipo').equals('residencia').filter(i => i.synced === 0).toArray();
    const localFormatted = localData.map(d => ({ id: d.temp_id, ...d.payload, isOffline: true }));
    return [...serverData, ...localFormatted];
  });

  const form = useForm<ResidentFormValues>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      nacionalidade: "brasileira",
      sexo: "feminino",
      raca_cor: "parda",
      mae_desconhecida: false,
      pai_desconhecido: false,
      eh_responsavel_familiar: false,
      frequenta_escola: false,
      possui_deficiencia: false,
      saida_cadastro: false,
      membro_povo_tradicional: false,
      possui_plano_saude: false,
      participa_grupos_comunitarios: false,
      frequenta_cuidador: false
    }
  });

  const onSubmit = async (data: ResidentFormValues) => {
    try {
      setIsSaving(true);

      // Helper para arrays
      const splitArray = (val?: string) => val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];

      const novoMorador = {
        temp_id: uuidv4(),
        tipo: 'morador' as const,
        payload: {
            ...data,
            deficiencias_tipo: splitArray(data.deficiencias_tipo),
            responsavel_crianca: splitArray(data.responsavel_crianca),
            residence_id: String(data.residence_id) // Garante string para o sync
        },
        synced: 0,
        created_at: new Date()
      };

      await db.syncQueue.add(novoMorador);
      toast.sucess("Morador salvo no dispositivo!");
      navigate('/app/home');

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar morador.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Novo Morador</h1>
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-red-500">Cancelar</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))} className="space-y-6">

          {/* GRUPO 1: VÍNCULO DOMICILIAR (Sempre visível) */}
          <Card className="border-l-4 border-l-purple-500 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-700">
                    <Home className="text-purple-600" size={20} /> Vínculo Residencial
                </CardTitle>
            </CardHeader>
            <CardContent>
                <FormField control={form.control} name="residence_id" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Vincular à Casa *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione uma casa..." /></SelectTrigger></FormControl>
                            <SelectContent className="max-h-60">
                                {residences?.map((res: any) => (
                                    <SelectItem key={res.id} value={String(res.id)}>
                                        {res.nome_logradouro}, {res.numero} ({res.bairro}) {res.isOffline && "(Novo)"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="w-full space-y-2" defaultValue="identificacao">
            
            {/* 2. IDENTIFICAÇÃO */}
            <AccordionItem value="identificacao" className="bg-white rounded-lg border px-4">
                <AccordionTrigger><div className="flex items-center gap-2 text-gray-700"><User size={18} className="text-blue-600"/> Identificação</div></AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <FormField control={form.control} name="nome_completo" render={({ field }) => (
                        <FormItem><FormLabel>Nome Completo *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nome_social" render={({ field }) => (
                        <FormItem><FormLabel>Nome Social</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name="cpf" render={({ field }) => (
                            <FormItem><FormLabel>CPF</FormLabel><FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="data_nascimento" render={({ field }) => (
                            <FormItem><FormLabel>Nascimento *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name="cns" render={({ field }) => (
                            <FormItem><FormLabel>CNS (Cartão SUS)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="nis_pis_pasep" render={({ field }) => (
                            <FormItem><FormLabel>NIS / PIS</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <FormField control={form.control} name="sexo" render={({ field }) => (
                            <FormItem><FormLabel>Sexo *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="masculino">Masculino</SelectItem><SelectItem value="feminino">Feminino</SelectItem></SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="raca_cor" render={({ field }) => (
                            <FormItem><FormLabel>Raça/Cor *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="branca">Branca</SelectItem><SelectItem value="preta">Preta</SelectItem>
                                        <SelectItem value="parda">Parda</SelectItem><SelectItem value="amarela">Amarela</SelectItem><SelectItem value="indigena">Indígena</SelectItem>
                                    </SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )} />
                    </div>
                    {form.watch('raca_cor') === 'indigena' && <TextField form={form} name="etnia" label="Qual etnia?" />}
                    
                    <Separator />
                    <TextField form={form} name="nome_mae" label="Nome da Mãe *" />
                    <CheckField form={form} name="mae_desconhecida" label="Mãe desconhecida" />
                    
                    <TextField form={form} name="nome_pai" label="Nome do Pai" />
                    <CheckField form={form} name="pai_desconhecido" label="Pai desconhecido" />
                </AccordionContent>
            </AccordionItem>

            {/* 3. NACIONALIDADE */}
            <AccordionItem value="nacionalidade" className="bg-white rounded-lg border px-4">
                <AccordionTrigger><div className="flex items-center gap-2 text-gray-700"><Globe size={18} className="text-green-600"/> Nacionalidade & Local</div></AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                     <FormField control={form.control} name="nacionalidade" render={({ field }) => (
                        <FormItem><FormLabel>Nacionalidade</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="brasileira">Brasileira</SelectItem><SelectItem value="naturalizado">Naturalizado</SelectItem><SelectItem value="estrangeiro">Estrangeiro</SelectItem></SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                    
                    {form.watch('nacionalidade') === 'brasileira' && (
                        <TextField form={form} name="municipio_nascimento" label="Município de Nascimento" />
                    )}
                    {form.watch('nacionalidade') !== 'brasileira' && (
                        <>
                            <TextField form={form} name="pais_nascimento" label="País de Nascimento" />
                            <TextField form={form} name="dt_naturalizacao" label="Data Naturalização" placeholder="DD/MM/AAAA" />
                            <TextField form={form} name="portaria_naturalizacao" label="Portaria" />
                        </>
                    )}
                    
                    <Separator className="my-2"/>
                    <div className="grid grid-cols-2 gap-3">
                        <TextField form={form} name="telefone_celular" label="Celular" placeholder="(00) 00000-0000" />
                        <TextField form={form} name="email" label="E-mail" />
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* 4. SOCIODEMOGRÁFICO */}
            <AccordionItem value="social" className="bg-white rounded-lg border px-4">
                <AccordionTrigger><div className="flex items-center gap-2 text-gray-700"><Users size={18} className="text-orange-500"/> Social & Escolaridade</div></AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
                        <CheckField form={form} name="eh_responsavel_familiar" label="É Responsável Familiar?" />
                        {!form.watch('eh_responsavel_familiar') && (
                            <>
                                <TextField form={form} name="cns_cpf_responsavel" label="CNS/CPF do Responsável" />
                                <FormField control={form.control} name="relacao_parentesco" render={({ field }) => (
                                    <FormItem><FormLabel>Relação com Responsável</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="conjuge_companheiro">Cônjuge/Companheiro</SelectItem><SelectItem value="filho">Filho(a)</SelectItem>
                                                <SelectItem value="pai_mae">Pai/Mãe</SelectItem><SelectItem value="neto_bisneto">Neto/Bisneto</SelectItem>
                                                <SelectItem value="outro_parente">Outro Parente</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                            </>
                        )}
                    </div>
                    <FormField control={form.control} name="escolaridade" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Escolaridade</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                              <SelectContent className="max-h-60"> {/* max-h para scrolar se a lista for grande */}
                                  <SelectItem value="creche">Creche</SelectItem>
                                  <SelectItem value="pre_escola">Pré-escola (exceto CA)</SelectItem>
                                  <SelectItem value="classe_alfabetizacao">Classe de Alfabetização - CA</SelectItem>
                                  <SelectItem value="fundamental_1_4">Ensino Fundamental 1ª a 4ª séries</SelectItem>
                                  <SelectItem value="fundamental_5_8">Ensino Fundamental 5ª a 8ª séries</SelectItem>
                                  <SelectItem value="fundamental_completo">Ensino Fundamental Completo</SelectItem>
                                  <SelectItem value="fundamental_especial">Ensino Fundamental Especial</SelectItem>
                                  <SelectItem value="eja_iniciais">EJA - Séries Iniciais (Supletivo 1ª a 4ª)</SelectItem>
                                  <SelectItem value="eja_finais">EJA - Séries Finais (Supletivo 5ª a 8ª)</SelectItem>
                                  <SelectItem value="medio">Ensino Médio (Científico, Técnico, etc.)</SelectItem>
                                  <SelectItem value="medio_especial">Ensino Médio Especial</SelectItem>
                                  <SelectItem value="medio_eja">Ensino Médio EJA (Supletivo)</SelectItem>
                                  <SelectItem value="superior">Superior (Graduação, Mestrado, Doutorado)</SelectItem>
                                  <SelectItem value="alfabetizacao_adultos">Alfabetização para Adultos (Mobral, etc.)</SelectItem>
                                  <SelectItem value="nenhum">Nenhum</SelectItem>
                              </SelectContent>
                          </Select>
                      </FormItem>
                    )} />
                    <CheckField form={form} name="frequenta_escola" label="Frequenta Escola/Creche?" />
                    
                    <Separator />
                    <FormField control={form.control} name="situacao_mercado" render={({ field }) => (
                        <FormItem><FormLabel>Situação no Mercado de Trabalho</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="assalariado_com_carteira">Assalariado c/ Carteira</SelectItem><SelectItem value="autonomo_sem_previdencia">Autônomo</SelectItem>
                                    <SelectItem value="aposentado_pensionista">Aposentado</SelectItem><SelectItem value="desempregado">Desempregado</SelectItem>
                                    <SelectItem value="nao_trabalha">Não Trabalha</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                    <TextField form={form} name="ocupacao" label="Ocupação (CBO)" />

                    <Separator />
                    <div className="space-y-2">
                        <CheckField form={form} name="membro_povo_tradicional" label="Membro de Povo Tradicional?" />
                        {form.watch('membro_povo_tradicional') && <TextField form={form} name="povo_tradicional_desc" label="Qual povo?" />}
                        
                        <CheckField form={form} name="participa_grupos_comunitarios" label="Participa de Grupos Comunitários?" />
                        <CheckField form={form} name="possui_plano_saude" label="Possui Plano de Saúde?" />
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* 5. IDENTIDADE & DEFICIÊNCIA */}
            <AccordionItem value="identidade" className="bg-white rounded-lg border px-4">
                <AccordionTrigger><div className="flex items-center gap-2 text-gray-700"><HeartHandshake size={18} className="text-pink-500"/> Identidade & Deficiência</div></AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                         <FormField control={form.control} name="orientacao_sexual" render={({ field }) => (
                            <FormItem><FormLabel>Orientação Sexual</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Se desejar" /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="heterossexual">Heterossexual</SelectItem><SelectItem value="gay">Gay</SelectItem><SelectItem value="lesbica">Lésbica</SelectItem><SelectItem value="bissexual">Bissexual</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="identidade_genero" render={({ field }) => (
                            <FormItem><FormLabel>Identidade Gênero</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Se desejar" /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="homem_transexual">Homem Trans</SelectItem><SelectItem value="mulher_transexual">Mulher Trans</SelectItem><SelectItem value="travesti">Travesti</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                    </div>

                    <Separator />
                    <CheckField form={form} name="possui_deficiencia" label="Possui Deficiência?" />
                    {form.watch('possui_deficiencia') && (
                         <TextField form={form} name="deficiencias_tipo" label="Quais? (Auditiva, Visual, Motora...)" />
                    )}
                </AccordionContent>
            </AccordionItem>

          </Accordion>

          {/* BOTÃO FIXO */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-10">
            <Button type="submit" className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white shadow-md" disabled={isSaving}>
                {isSaving ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Salvando...</> : <><Save className="mr-2 h-5 w-5" /> Salvar Morador</>}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}