import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MapPin, Save, Loader2, Locate, Home, Droplets, PawPrint, Phone, CheckCircle2 } from 'lucide-react';
import { toast } from "sonner"; 
import { db } from '@/lib/db.js';
import { residenceSchema, type ResidenceFormValues } from '@/schemas/ResidenceSchema.js';

// UI Components
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from '@/components/ui/form.js';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Textarea } from '@/components/ui/textarea.js';

export default function NewResidenceForm() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const form = useForm<ResidenceFormValues>({
    resolver: zodResolver(residenceSchema),
    defaultValues: {
      municipio: "Niterói",
      uf: "RJ",
      sem_numero: false,
      fora_de_area: false,
      revestimento_parede: true,
      disponibilidade_energia: true,
      possui_animais: false,
      numero_moradores: 1,
      numero_comodos: 1,
      animais_tipos: [] // Inicializa vazio
    }
  });

  const handleGetLocation = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('latitude', position.coords.latitude);
          form.setValue('longitude', position.coords.longitude);
          setGpsLoading(false);
        },
        (error) => {
          console.error("Erro GPS:", error);
          alert("Não foi possível obter a localização.");
          setGpsLoading(false);
        },
        { enableHighAccuracy: true } 
      );
    } else {
      alert("Seu dispositivo não suporta geolocalização.");
      setGpsLoading(false);
    }
  };

const onSubmit = async (data: ResidenceFormValues) => {
    try {
      setIsSaving(true);

      // Tratamento para animais_tipos (string -> array)
      let tiposAnimais = data.animais_tipos;
      if (typeof tiposAnimais === 'string') {
          // @ts-ignore
          tiposAnimais = tiposAnimais.split(',').map(s => s.trim()).filter(s => s !== "");
      }

      const novaResidencia = {
        temp_id: uuidv4(),
        tipo: 'residencia' as const,
        payload: {
            ...data,
            responsavel_id: 1, // Será substituído pelo backend
            animais_tipos: tiposAnimais
        },
        synced: 0,
        created_at: new Date()
      };

      // Salva no banco local (Dexie)
      await db.syncQueue.add(novaResidencia);

      // Feedback visual bonito
      toast.success("Residência salva!", {
        description: "Os dados foram guardados no dispositivo e serão enviados quando houver internet.",
        duration: 4000,
      });
      
      // Redireciona para a Home
      navigate('/app/home');

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar", {
        description: "Ocorreu um erro ao tentar registrar a residência. Tente novamente."
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- LÓGICA DE ERRO (VALIDAÇÃO) ---
  const onError = (errors: any) => {
    console.log("Erros de validação:", errors);
    // Mostra um toast amarelo/laranja avisando que falta preencher algo
    toast.warning("Formulário inválido", {
        description: "Verifique os campos obrigatórios destacados em vermelho."
    });
  };

  const lat = form.watch('latitude');
  const lng = form.watch('longitude');

  return (
    <div className="space-y-6 pb-24">
      
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Nova Residência</h1>
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-red-500">
            Cancelar
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          
          {/* --- GRUPO 1: LOCALIZAÇÃO --- */}
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-700">
                    <MapPin className="text-blue-600" size={20} /> Localização
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                
                {/* GPS */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    {!lat ? (
                        <Button type="button" variant="outline" onClick={handleGetLocation} disabled={gpsLoading} className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                            {gpsLoading ? <Loader2 className="animate-spin mr-2" /> : <Locate className="mr-2" />} Capturar GPS
                        </Button>
                    ) : (
                        <div className="text-green-700 text-sm font-bold flex flex-col items-center">
                            <span className="flex items-center gap-1"><MapPin size={14}/> GPS Capturado</span>
                            <span className="text-xs text-gray-500 font-normal">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
                        </div>
                    )}
                </div>

                {/* Endereço Básico */}
                <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="cep" render={({ field }) => (
                        <FormItem><FormLabel>CEP</FormLabel><FormControl><Input placeholder="00000-000" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="uf" render={({ field }) => (
                        <FormItem><FormLabel>UF</FormLabel><FormControl><Input placeholder="RJ" maxLength={2} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="municipio" render={({ field }) => (
                        <FormItem><FormLabel>Município</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="bairro" render={({ field }) => (
                        <FormItem><FormLabel>Bairro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                {/* Logradouro */}
                <div className="grid grid-cols-3 gap-3">
                    <FormField control={form.control} name="tipo_logradouro" render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormLabel>Tipo</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Rua">Rua</SelectItem>
                                    <SelectItem value="Av">Av</SelectItem>
                                    <SelectItem value="Beco">Beco</SelectItem>
                                    <SelectItem value="Travessa">Trav</SelectItem>
                                    <SelectItem value="Outro">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="nome_logradouro" render={({ field }) => (
                        <FormItem className="col-span-2"><FormLabel>Nome Logradouro *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                {/* Número e Complementos */}
                <div className="flex gap-3 items-end">
                    <FormField control={form.control} name="numero" render={({ field }) => (
                        <FormItem className="flex-1"><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="sem_numero" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 pb-2">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="font-normal text-xs">S/N</FormLabel>
                        </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="complemento" render={({ field }) => (
                    <FormItem><FormLabel>Complemento</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                
                <FormField control={form.control} name="ponto_referencia" render={({ field }) => (
                    <FormItem><FormLabel>Ponto de Referência</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />

                {/* Área e Flags */}
                <div className="grid grid-cols-2 gap-3 items-end">
                    <FormField control={form.control} name="microarea" render={({ field }) => (
                        <FormItem><FormLabel>Microárea *</FormLabel><FormControl><Input placeholder="Ex: 01" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="fora_de_area" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded border p-2">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="text-xs">Fora de Área (FA)</FormLabel>
                        </FormItem>
                    )} />
                </div>
            </CardContent>
          </Card>

          {/* --- GRUPO 2: CONTATO --- */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-700">
                    <Phone className="text-green-600" size={20} /> Contato
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="telefone_residencia" render={({ field }) => (
                        <FormItem><FormLabel>Tel. Residência</FormLabel><FormControl><Input type="tel" placeholder="(00) 0000-0000" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="telefone_contato" render={({ field }) => (
                        <FormItem><FormLabel>Celular / Contato</FormLabel><FormControl><Input type="tel" placeholder="(00) 90000-0000" {...field} /></FormControl></FormItem>
                    )} />
                </div>
            </CardContent>
          </Card>

          {/* --- GRUPO 3: CARACTERIZAÇÃO --- */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-700">
                    <Home className="text-purple-600" size={20} /> Caracterização
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="tipo_imovel" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo Imóvel</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="domicilio">Domicílio</SelectItem>
                                    <SelectItem value="comercio">Comércio</SelectItem>
                                    <SelectItem value="terreno_baldio">Terreno Baldio</SelectItem>
                                    <SelectItem value="ponto_estrategico">Ponto Estratégico</SelectItem>
                                    <SelectItem value="escola">Escola</SelectItem>
                                    <SelectItem value="creche">Creche</SelectItem>
                                    <SelectItem value="abrigo">Abrigo</SelectItem>
                                    <SelectItem value="ilpi">Instituição Idosos</SelectItem>
                                    <SelectItem value="unidade_prisional">Prisional</SelectItem>
                                    <SelectItem value="delegacia">Delegacia</SelectItem>
                                    <SelectItem value="estabelecimento_religioso">Religioso</SelectItem>
                                    <SelectItem value="outros">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="situacao_moradia" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Situação</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="proprio">Próprio</SelectItem>
                                    <SelectItem value="financiado">Financiado</SelectItem>
                                    <SelectItem value="alugado">Alugado</SelectItem>
                                    <SelectItem value="arrendado">Arrendado</SelectItem>
                                    <SelectItem value="cedido">Cedido</SelectItem>
                                    <SelectItem value="ocupacao">Ocupação</SelectItem>
                                    <SelectItem value="situacao_de_rua">Situação de Rua</SelectItem>
                                    <SelectItem value="outra">Outra</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="tipo_domicilio" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo Domicílio</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="casa">Casa</SelectItem>
                                    <SelectItem value="apartamento">Apartamento</SelectItem>
                                    <SelectItem value="comodo">Cômodo</SelectItem>
                                    <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="tipo_acesso" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Acesso</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="rua_pavimentada">Pavimentado</SelectItem>
                                    <SelectItem value="chao_batido">Chão Batido</SelectItem>
                                    <SelectItem value="fluvial">Fluvial</SelectItem>
                                    <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                </div>

                {/* Estrutura */}
                <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="numero_moradores" render={({ field }) => (
                        <FormItem><FormLabel>Nº Moradores</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="numero_comodos" render={({ field }) => (
                        <FormItem><FormLabel>Nº Cômodos</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="material_paredes" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Material Paredes</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                            <SelectContent >
                                <SelectItem value="alvenaria_tijolo">Alvenaria/Tijolo</SelectItem>
                                <SelectItem value="taipa">Taipa</SelectItem>
                                <SelectItem value="madeira_aparelhada">Madeira</SelectItem>
                                <SelectItem value="material_aproveitado">Mat. Aproveitado</SelectItem>
                                <SelectItem value="palha">Palha</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-2">
                    <FormField control={form.control} name="revestimento_parede" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 rounded border p-2">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="text-xs font-normal">Com Revestimento?</FormLabel>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="disponibilidade_energia" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 rounded border p-2">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="text-xs font-normal">Tem Energia?</FormLabel>
                        </FormItem>
                    )} />
                </div>

                {/* Rural (Condicional ou sempre visível?) */}
                <FormField control={form.control} name="condicao_posse_terra" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Posse da Terra (Rural)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Não se aplica" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="nao_se_aplica">Não se aplica</SelectItem>
                                <SelectItem value="proprietario">Proprietário</SelectItem>
                                <SelectItem value="parceiro_meeiro">Parceiro/Meeiro</SelectItem>
                                <SelectItem value="assentado">Assentado</SelectItem>
                                <SelectItem value="posseiro">Posseiro</SelectItem>
                                <SelectItem value="arrendatario">Arrendatário</SelectItem>
                                <SelectItem value="comodatario">Comodatário</SelectItem>
                                <SelectItem value="beneficiario_banco_da_terra">Beneficiário Banco Terra</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />
            </CardContent>
          </Card>

          {/* --- GRUPO 4: SANEAMENTO --- */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-700">
                    <Droplets className="text-blue-400" size={20} /> Saneamento
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="abastecimento_agua" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Abastecimento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="rede_encanada">Rede Encanada</SelectItem>
                                <SelectItem value="poco_nascente">Poço / Nascente</SelectItem>
                                <SelectItem value="cisterna">Cisterna</SelectItem>
                                <SelectItem value="carro_pipa">Carro Pipa</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />

                <FormField control={form.control} name="tratamento_agua" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tratamento Água</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="filtrada">Filtrada</SelectItem>
                                <SelectItem value="fervida">Fervida</SelectItem>
                                <SelectItem value="clorada">Clorada</SelectItem>
                                <SelectItem value="mineral">Mineral</SelectItem>
                                <SelectItem value="sem_tratamento">Sem Tratamento</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />

                <FormField control={form.control} name="escoamento_sanitario" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Esgoto</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="rede_coletora_pluvial">Rede Coletora</SelectItem>
                                <SelectItem value="fossa_septica">Fossa Séptica</SelectItem>
                                <SelectItem value="fossa_rudimentar">Fossa Rudimentar</SelectItem>
                                <SelectItem value="direto_rio_lago_mar">Direto Rio/Mar</SelectItem>
                                <SelectItem value="ceu_aberto">Céu Aberto</SelectItem>
                                <SelectItem value="outra">Outra</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />

                <FormField control={form.control} name="destino_lixo" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lixo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="coletado">Coletado</SelectItem>
                                <SelectItem value="queimado_enterrado">Queimado/Enterrado</SelectItem>
                                <SelectItem value="ceu_aberto">Céu Aberto</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />
            </CardContent>
          </Card>

          {/* --- GRUPO 5: ANIMAIS --- */}
          <Card className="shadow-sm mb-20">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-700">
                    <PawPrint className="text-orange-500" size={20} /> Animais
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="possui_animais" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 rounded-md border p-3">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none"><FormLabel>Possui Animais?</FormLabel></div>
                    </FormItem>
                )} />
                
                {form.watch("possui_animais") && (
                    <>
                        <FormField control={form.control} name="quantidade_animais" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantos?</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                            </FormItem>
                        )} />
                        
                        <FormField control={form.control} name="animais_tipos" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quais? (Separe por vírgula)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Gato, Cachorro, Galinha..." {...field} value={Array.isArray(field.value) ? field.value.join(", ") : field.value} onChange={e => field.onChange(e.target.value)} />
                                </FormControl>
                                <FormDescription>Ex: Gato, Cachorro</FormDescription>
                            </FormItem>
                        )} />
                    </>
                )}
            </CardContent>
          </Card>

          {/* BOTÃO FIXO */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-10">
            <Button type="submit" className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white shadow-md" disabled={isSaving}>
                {isSaving ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Salvando...</> : <><Save className="mr-2 h-5 w-5" /> Salvar Residência</>}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}