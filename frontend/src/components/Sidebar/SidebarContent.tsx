import { Link } from "react-router-dom";
import { AlertTriangle, ChartArea, FileDown, HeartPulse, Home, LogOut, MapPin, UserIcon, Users } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area.js";
import { Accordion } from "../ui/accordion.js";
import { SidebarAccordionItem } from "./SidebarAccordion.js";
import { RangeSlider } from "./RangeSlider.js";
import { Input } from "../ui/input.js";
import { FilterCheck } from "./SidebarFilterCheck.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.js";
import { Button } from "../ui/button.js";

export function SidebarContent({
  collapsed,
  onToggleCollapse,
  userInfo,
  filters,
  onChange,
  onClose,
  onExport,    
  onLogout,
  isExporting,
}: any) {
  
  const handleSelectChange = (key: string, value: string) => {
    onChange(key, value === "all" ? null : value);
  };

  // Checkbox Padrão: Marcado = true, Desmarcado = null (remove filtro)
  const handleCheckChange = (key: string, isChecked: boolean) => {
    onChange(key, isChecked ? true : null);
  };

  // Checkbox Invertido: Marcado = false (busca quem NÃO tem), Desmarcado = null
  const handleNegativeCheckChange = (key: string, isChecked: boolean) => {
    onChange(key, isChecked ? false : null);
  };

  return (
    <div className={`flex flex-col h-full ${collapsed ? "items-center" : "items-stretch"}`}>
      {/* --- HEADER --- */}
      <div className={`p-4 bg-lasalle-blue text-white shrink-0 w-full ${collapsed ? "flex-col items-center" : "flex items-center gap-3"}`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
            <UserIcon size={18} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm truncate">{userInfo?.name || "Agente"}</h3>
              <p className="text-xs text-blue-200 truncate">{userInfo?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* --- BODY (SCROLLABLE) --- */}
      <ScrollArea className={`flex-1 p-4 w-full ${collapsed ? "px-2" : "px-4"}`}>
        <div className="space-y-4">
          
          <div>
            <p className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ${collapsed ? "hidden" : "block"}`}>Painéis</p>
            
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-3 p-2 rounded-xl bg-white border hover:bg-gray-50 transition-colors ${collapsed ? "justify-center" : ""}`}
            >
              <div className={`p-1.5 rounded-lg bg-purple-100 text-purple-600`}>
                <ChartArea size={18} />
              </div>
              {!collapsed && <span className="font-medium text-sm text-gray-700">Visão Geral</span>}
            </Link>
          </div>

          {userInfo?.role === "admin" && (
            <div>
              <p className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ${collapsed ? "hidden" : "block"}`}>Gestão</p>
              <Link 
                to="/dashboard/equipe" 
                className={`flex items-center gap-3 p-2 rounded-xl bg-white border hover:bg-gray-50 transition-colors ${collapsed ? "justify-center" : ""}`}
              >
                <div className={`p-1.5 rounded-lg bg-purple-100 text-purple-600`}>
                  <Users size={18} />
                </div>
                {!collapsed && <span className="font-medium text-sm text-gray-700">Equipe</span>}
              </Link>
            </div>
          )}

          <p className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ${collapsed ? "hidden" : "block"}`}>Filtros de Dados</p>

          <Accordion type="single" collapsible className="space-y-2">
            
            {/* 1. GEOLOCALIZAÇÃO */}
            <SidebarAccordionItem value="geo" title="Geolocalização" icon={<MapPin size={18} />} collapsed={collapsed} iconClassName="bg-blue-100 text-blue-600">
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">Raio de Busca</span>
                    <span className="font-bold text-lasalle-blue">{(filters.radius_meters / 1000).toFixed(1)} km</span>
                  </div>
                  <RangeSlider min={100} max={10000} step={100} value={filters.radius_meters} onChange={(v: number) => onChange("radius_meters", v)} collapsed={collapsed} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Microárea</label>
                  <Input value={filters.microarea || ""} onChange={(e) => onChange("microarea", e.target.value || null)} placeholder="Ex: 01, 05A..." />
                </div>
              </div>
            </SidebarAccordionItem>

            {/* 2. INFRAESTRUTURA (RESIDÊNCIA) */}
            <SidebarAccordionItem value="residencia" title="Infraestrutura" icon={<Home size={18} />} collapsed={collapsed} iconClassName="bg-yellow-100 text-yellow-700">
              <div className="space-y-4 pt-2">
                {/* Tipo de Imóvel */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Tipo de Imóvel</label>
                    <Select onValueChange={(v) => handleSelectChange("tipo_imovel", v)}>
                        <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Qualquer" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Qualquer</SelectItem>
                            <SelectItem value="domicilio">Domicílio</SelectItem>
                            <SelectItem value="comercio">Comércio</SelectItem>
                            <SelectItem value="terreno_baldio">Terreno Baldio</SelectItem>
                            <SelectItem value="ponto_estrategico">Ponto Estratégico</SelectItem>
                            <SelectItem value="escola">Escola</SelectItem>
                            <SelectItem value="creche">Creche</SelectItem>
                            <SelectItem value="abrigo">Abrigo</SelectItem>
                            <SelectItem value="ilpi">ILPI (Idosos)</SelectItem>
                            <SelectItem value="unidade_prisional">Prisão</SelectItem>
                            <SelectItem value="delegacia">Delegacia</SelectItem>
                            <SelectItem value="estabelecimento_religioso">Religioso</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Saneamento Básico */}
                <div className="space-y-2 border-t pt-2 mt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Saneamento</p>
                    
                    <Select onValueChange={(v) => handleSelectChange("abastecimento_agua", v)}>
                        <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Água: Qualquer" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Água: Qualquer</SelectItem>
                            <SelectItem value="rede_encanada">Rede Encanada</SelectItem>
                            <SelectItem value="poco_nascente">Poço / Nascente</SelectItem>
                            <SelectItem value="cisterna">Cisterna</SelectItem>
                            <SelectItem value="carro_pipa">Carro Pipa</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(v) => handleSelectChange("tratamento_agua", v)}>
                        <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Tratamento: Qualquer" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tratamento: Qualquer</SelectItem>
                            <SelectItem value="filtrada">Filtrada</SelectItem> 
                            <SelectItem value="fervida">Fervida</SelectItem>
                            <SelectItem value="clorada">Clorada</SelectItem>
                            <SelectItem value="mineral">Mineral</SelectItem>
                            <SelectItem value="sem_tratamento">Sem Tratamento</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(v) => handleSelectChange("escoamento_sanitario", v)}>
                        <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Esgoto: Qualquer" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Esgoto: Qualquer</SelectItem>
                            <SelectItem value="rede_coletora_pluvial">Rede Coletora</SelectItem>
                            <SelectItem value="fossa_septica">Fossa Séptica</SelectItem>
                            <SelectItem value="fossa_rudimentar">Fossa Rudimentar</SelectItem>
                            <SelectItem value="ceu_aberto">Céu Aberto</SelectItem>
                            <SelectItem value="direto_rio_lago_mar">Direto Rio/Lago</SelectItem>
                            <SelectItem value="outra">Outro</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(v) => handleSelectChange("destino_lixo", v)}>
                        <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Lixo: Qualquer" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Lixo: Qualquer</SelectItem>
                            <SelectItem value="coletado">Coletado</SelectItem>
                            <SelectItem value="queimado_enterrado">Queimado/Enterrado</SelectItem>
                            <SelectItem value="ceu_aberto">Céu Aberto</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1 pt-1">
                    <FilterCheck label="Possui Animais" name="possui_animais" checked={!!filters.possui_animais} onChange={(v: any) => handleCheckChange("possui_animais", v)} collapsed={collapsed} />
                    <FilterCheck label="Energia Elétrica" name="disponibilidade_energia" checked={!!filters.disponibilidade_energia} onChange={(v: any) => handleCheckChange("disponibilidade_energia", v)} collapsed={collapsed} />
                </div>
              </div>
            </SidebarAccordionItem>

            {/* 3. PERFIL DO MORADOR */}
            <SidebarAccordionItem value="morador" title="Perfil do Morador" icon={<Users size={18} />} collapsed={collapsed} iconClassName="bg-green-100 text-green-600">
              <div className="space-y-4 pt-2">
                
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Sexo</label>
                        <Select onValueChange={(v) => handleSelectChange("sexo", v)}>
                            <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="masculino">Masculino</SelectItem>
                                <SelectItem value="feminino">Feminino</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Raça/Cor</label>
                        <Select onValueChange={(v) => handleSelectChange("raca_cor", v)}>
                            <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Todas" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="branca">Branca</SelectItem>
                                <SelectItem value="preta">Preta</SelectItem>
                                <SelectItem value="parda">Parda</SelectItem>
                                <SelectItem value="amarela">Amarela</SelectItem>
                                <SelectItem value="indigena">Indígena</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input className="h-8 text-xs" value={filters.idade_minima || ""} onChange={(e) => onChange("idade_minima", e.target.value ? Number(e.target.value) : null)} placeholder="Idade Mín." />
                  <Input className="h-8 text-xs" value={filters.idade_maxima || ""} onChange={(e) => onChange("idade_maxima", e.target.value ? Number(e.target.value) : null)} placeholder="Idade Máx." />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Escolaridade</label>
                  <Select onValueChange={(v) => handleSelectChange("escolaridade", v)}>
                    <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Todas" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="creche">Creche</SelectItem>
                      <SelectItem value="pre_escola">Pré-Escola</SelectItem>
                      <SelectItem value="fundamental_completo">Fund. Completo</SelectItem>
                      <SelectItem value="medio">Médio Completo</SelectItem>
                      <SelectItem value="superior">Superior</SelectItem>
                      <SelectItem value="nenhum">Nenhum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 border-t pt-2">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Identidade</label>
                    <Select onValueChange={(v) => handleSelectChange("orientacao_sexual", v)}>
                        <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Orientação Sexual" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Qualquer</SelectItem>
                            <SelectItem value="heterossexual">Heterossexual</SelectItem>
                            <SelectItem value="gay">Gay</SelectItem>
                            <SelectItem value="lesbica">Lésbica</SelectItem>
                            <SelectItem value="bissexual">Bissexual</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(v) => handleSelectChange("identidade_genero", v)}>
                        <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Identidade Gênero" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Qualquer</SelectItem>
                            <SelectItem value="homem_transexual">Homem Trans</SelectItem>
                            <SelectItem value="mulher_transexual">Mulher Trans</SelectItem>
                            <SelectItem value="travesti">Travesti</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1 mt-2">
                    <FilterCheck label="Possui Deficiência" name="possui_deficiencia" checked={!!filters.possui_deficiencia} onChange={(v: any) => handleCheckChange("possui_deficiencia", v)} collapsed={collapsed} />
                    <FilterCheck label="Frequenta Escola" name="frequenta_escola" checked={!!filters.frequenta_escola} onChange={(v: any) => handleCheckChange("frequenta_escola", v)} collapsed={collapsed} />
                    <FilterCheck label="Povo Tradicional" name="membro_povo_tradicional" checked={!!filters.membro_povo_tradicional} onChange={(v: any) => handleCheckChange("membro_povo_tradicional", v)} collapsed={collapsed} />
                    <FilterCheck label="Plano de Saúde" name="possui_plano_saude" checked={!!filters.possui_plano_saude} onChange={(v: any) => handleCheckChange("possui_plano_saude", v)} collapsed={collapsed} />
                    <FilterCheck label="Participa de Grupos" name="participa_grupos_comunitarios" checked={!!filters.participa_grupos_comunitarios} onChange={(v: any) => handleCheckChange("participa_grupos_comunitarios", v)} collapsed={collapsed} />
                    <FilterCheck label="Recebe Benefício (Bolsa)" name="recebe_beneficio" checked={!!filters.recebe_beneficio} onChange={(v: any) => handleCheckChange("recebe_beneficio", v)} collapsed={collapsed} />
                </div>
              </div>
            </SidebarAccordionItem>

            {/* 4. SAÚDE & CONDIÇÕES */}
            <SidebarAccordionItem value="saude" title="Saúde & Condições" icon={<HeartPulse size={18} />} collapsed={collapsed} iconClassName="bg-red-100 text-red-600">
              <div className="space-y-3 pt-2">
                
                {/* Peso */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Peso</label>
                    <Select onValueChange={(v) => handleSelectChange("peso_situacao", v)}>
                        <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Qualquer" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Qualquer</SelectItem>
                            <SelectItem value="abaixo_do_peso">Abaixo do Peso</SelectItem>
                            <SelectItem value="peso_adequado">Adequado</SelectItem>
                            <SelectItem value="acima_do_peso">Acima do Peso</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <p className="text-xs text-gray-400 font-medium mt-2">Doenças Crônicas</p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <FilterCheck label="Hipertensão" name="tem_hipertensao" checked={!!filters.tem_hipertensao} onChange={(v: any) => handleCheckChange("tem_hipertensao", v)} collapsed={collapsed} />
                    <FilterCheck label="Diabetes" name="tem_diabetes" checked={!!filters.tem_diabetes} onChange={(v: any) => handleCheckChange("tem_diabetes", v)} collapsed={collapsed} />
                    <FilterCheck label="Cardiopatia" name="tem_doenca_cardiaca" checked={!!filters.tem_doenca_cardiaca} onChange={(v: any) => handleCheckChange("tem_doenca_cardiaca", v)} collapsed={collapsed} />
                    <FilterCheck label="Rins" name="tem_problemas_rins" checked={!!filters.tem_problemas_rins} onChange={(v: any) => handleCheckChange("tem_problemas_rins", v)} collapsed={collapsed} />
                    <FilterCheck label="Respiratória" name="tem_doenca_respiratoria" checked={!!filters.tem_doenca_respiratoria} onChange={(v: any) => handleCheckChange("tem_doenca_respiratoria", v)} collapsed={collapsed} />
                    <FilterCheck label="Câncer" name="tem_cancer" checked={!!filters.tem_cancer} onChange={(v: any) => handleCheckChange("tem_cancer", v)} collapsed={collapsed} />
                    <FilterCheck label="AVC" name="teve_avc_derrame" checked={!!filters.teve_avc_derrame} onChange={(v: any) => handleCheckChange("teve_avc_derrame", v)} collapsed={collapsed} />
                    <FilterCheck label="Infarto" name="teve_infarto" checked={!!filters.teve_infarto} onChange={(v: any) => handleCheckChange("teve_infarto", v)} collapsed={collapsed} />
                    <FilterCheck label="Hanseníase" name="tem_hanseniase" checked={!!filters.tem_hanseniase} onChange={(v: any) => handleCheckChange("tem_hanseniase", v)} collapsed={collapsed} />
                    <FilterCheck label="Tuberculose" name="tem_tuberculose" checked={!!filters.tem_tuberculose} onChange={(v: any) => handleCheckChange("tem_tuberculose", v)} collapsed={collapsed} />
                </div>

                <div className="h-px bg-gray-100 my-2"></div>

                <p className="text-xs text-gray-400 font-medium">Situação & Vícios</p>
                <div className="space-y-1">
                    <FilterCheck label="Gestante" name="esta_gestante" checked={!!filters.esta_gestante} onChange={(v: any) => handleCheckChange("esta_gestante", v)} collapsed={collapsed} />
                    <FilterCheck label="Acamado" name="esta_acamado" checked={!!filters.esta_acamado} onChange={(v: any) => handleCheckChange("esta_acamado", v)} collapsed={collapsed} />
                    <FilterCheck label="Domiciliado" name="esta_domiciliado" checked={!!filters.esta_domiciliado} onChange={(v: any) => handleCheckChange("esta_domiciliado", v)} collapsed={collapsed} />
                    <FilterCheck label="Internado (12m)" name="internacao_ultimos_12_meses" checked={!!filters.internacao_ultimos_12_meses} onChange={(v: any) => handleCheckChange("internacao_ultimos_12_meses", v)} collapsed={collapsed} />
                    <FilterCheck label="Problema Mental" name="diagnostico_problema_mental" checked={!!filters.diagnostico_problema_mental} onChange={(v: any) => handleCheckChange("diagnostico_problema_mental", v)} collapsed={collapsed} />
                    <FilterCheck label="Usa Álcool" name="usa_alcool" checked={!!filters.usa_alcool} onChange={(v: any) => handleCheckChange("usa_alcool", v)} collapsed={collapsed} />
                    <FilterCheck label="Fumante" name="esta_fumante" checked={!!filters.esta_fumante} onChange={(v: any) => handleCheckChange("esta_fumante", v)} collapsed={collapsed} />
                    <FilterCheck label="Outras Drogas" name="usa_outras_drogas" checked={!!filters.usa_outras_drogas} onChange={(v: any) => handleCheckChange("usa_outras_drogas", v)} collapsed={collapsed} />
                    <FilterCheck label="Usa Plantas Med." name="usa_plantas_medicinais" checked={!!filters.usa_plantas_medicinais} onChange={(v: any) => handleCheckChange("usa_plantas_medicinais", v)} collapsed={collapsed} />
                    <FilterCheck label="Práticas Integ." name="usa_praticas_integrativas" checked={!!filters.usa_praticas_integrativas} onChange={(v: any) => handleCheckChange("usa_praticas_integrativas", v)} collapsed={collapsed} />
                </div>
              </div>
            </SidebarAccordionItem>

            <SidebarAccordionItem value="vulnerabilidade" title="Vulnerabilidade Social" icon={<AlertTriangle size={18} />} collapsed={collapsed} iconClassName="bg-orange-100 text-orange-600">
              <div className="space-y-3 pt-2">
                <FilterCheck label="Em Situação de Rua" name="em_situacao_rua" checked={!!filters.em_situacao_rua} onChange={(v: any) => handleCheckChange("em_situacao_rua", v)} collapsed={collapsed} />
                
                {filters.em_situacao_rua === true && (
                    <div className="pl-4 border-l-2 border-orange-200 mt-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Detalhes da Rua</p>
                        
                        <FilterCheck 
                            label="Sem Higiene Pessoal" 
                            name="tem_acesso_higiene_pessoal" 
                            checked={filters.tem_acesso_higiene_pessoal === false} 
                            onChange={(v: any) => handleNegativeCheckChange("tem_acesso_higiene_pessoal", v)} 
                            collapsed={collapsed} 
                        />
                        <FilterCheck 
                            label="Sem Ref. Familiar" 
                            name="possui_referencia_familiar" 
                            checked={filters.possui_referencia_familiar === false} 
                            onChange={(v: any) => handleNegativeCheckChange("possui_referencia_familiar", v)} 
                            collapsed={collapsed} 
                        />
                        
                        <div className="space-y-1 mt-2">
                            <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Alimentação</label>
                            <Select onValueChange={(v) => handleSelectChange("frequencia_alimentacao", v)}>
                                <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Frequência" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Qualquer</SelectItem>
                                    <SelectItem value="uma_vez">1x ao dia</SelectItem>
                                    <SelectItem value="duas_ou_tres_vezes">2-3x ao dia</SelectItem>
                                    <SelectItem value="mais_de_tres_vezes">+3x ao dia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
              </div>
            </SidebarAccordionItem>

          </Accordion>
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white shrink-0 w-full flex flex-col gap-3">
        <Button 
            onClick={onExport}
            disabled={isExporting}
            className={`
                w-full flex items-center gap-2 transition-all
                ${collapsed ? "justify-center px-0" : "justify-center"}
                ${isExporting 
                    ? 'bg-green-50 text-green-700 border border-green-200 cursor-wait' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }
            `}
        >
            {isExporting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <FileDown size={18} />
            )}
            
            {!collapsed && (isExporting ? "Gerando..." : "Extrair Dados")}
        </Button>

        <Button variant="outline" className={`w-full ${collapsed ? "justify-center" : "flex"}`} onClick={onLogout}> 
          <LogOut className={!collapsed ? "mr-2" : ""} />
          {!collapsed && "Sair do Sistema"}
        </Button>
      </div>
    </div>
  );
}