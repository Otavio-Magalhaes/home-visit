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
  return (
    <div className={`flex flex-col h-full ${collapsed ? "items-center" : "items-stretch"}`}>
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

      {/* Body */}
      <ScrollArea className={`flex-1 p-4 w-full ${collapsed ? "px-2" : "px-4"}`}>
        <div className="space-y-4">
          {/* Dashboards block */}
          <div>
            <p className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ${collapsed ? "hidden" : "block"}`}>DashBoard</p>
            <a
              href="/dashboard"
              className={`flex items-center gap-3 p-2 rounded-xl bg-white border ${collapsed ? "justify-center" : ""}`}
            >
              <div className={`p-1.5 rounded-lg bg-purple-100 text-purple-600`}>
                <ChartArea size={18} />
              </div>
              {!collapsed && <span className="font-medium text-sm">Dashboard</span>}
            </a>
          </div>

          {/* Conditional admin block */}
          {userInfo?.role === "admin" && (
            <div>
              <p className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ${collapsed ? "hidden" : "block"}`}>Gestão do Projeto</p>
              <a href="/dashboard/equipe" className={`flex items-center gap-3 p-2 rounded-xl bg-white border ${collapsed ? "justify-center" : ""}`}>
                <div className={`p-1.5 rounded-lg bg-purple-100 text-purple-600"`}>
                  <Users size={18} />
                </div>
                {!collapsed && <span className="font-medium text-sm">Equipe & Acessos</span>}
              </a>
            </div>
          )}

          <p className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ${collapsed ? "hidden" : "block"}`}>Filtros de Análise</p>

          {/* Accordion with sections */}
          <Accordion type="single" collapsible className="space-y-2">
            <SidebarAccordionItem
              value="geo"
              title="Geolocalização"
              icon={<MapPin size={18} />}
              collapsed={collapsed}
              iconClassName="bg-blue-100 text-blue-600"
            >
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">Raio de Busca</span>
                    <span className="font-bold text-lasalle-blue">{(filters.radius_meters / 1000).toFixed(1)} km</span>
                  </div>
                  <RangeSlider
                    min={100}
                    max={10000}
                    step={100}
                    value={filters.radius_meters}
                    onChange={(v: number) => onChange("radius_meters", v)}
                    collapsed={collapsed}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Microárea</label>
                  <Input value={filters.microarea || ""} onChange={(e) => onChange("microarea", e.target.value || null)} placeholder="Ex: 01, 05A..." />
                </div>
              </div>
            </SidebarAccordionItem>

            <SidebarAccordionItem
              value="saude"
              title="Saúde & Condições"
              icon={<HeartPulse size={18} />}
              collapsed={collapsed}
              iconClassName="bg-red-100 text-red-600"
            >
              <div className="space-y-3 pt-2">
                <p className="text-xs text-gray-400 font-medium">Doenças Crônicas</p>
                <FilterCheck label="Hipertensos" name="tem_hipertensao" checked={!!filters.tem_hipertensao} onChange={(v: any) => onChange("tem_hipertensao", v)} collapsed={collapsed} />
                <FilterCheck label="Diabéticos" name="tem_diabetes" checked={!!filters.tem_diabetes} onChange={(v: any) => onChange("tem_diabetes", v)} collapsed={collapsed} />
                <FilterCheck label="Doença Respiratória" name="tem_doenca_respiratoria" checked={!!filters.tem_doenca_respiratoria} onChange={(v: any) => onChange("tem_doenca_respiratoria", v)} collapsed={collapsed} />

                <div className="h-px bg-gray-100 my-2"></div>

                <p className="text-xs text-gray-400 font-medium">Grupos de Risco</p>
                <FilterCheck label="Gestantes" name="esta_gestante" checked={!!filters.esta_gestante} onChange={(v: any) => onChange("esta_gestante", v)} collapsed={collapsed} />
                <FilterCheck label="Acamados" name="esta_acamado" checked={!!filters.esta_acamado} onChange={(v: any) => onChange("esta_acamado", v)} collapsed={collapsed} />
                <FilterCheck label="Domiciliados" name="esta_domiciliado" checked={!!filters.esta_domiciliado} onChange={(v: any) => onChange("esta_domiciliado", v)} collapsed={collapsed} />

                <div className="h-px bg-gray-100 my-2"></div>

                <p className="text-xs text-gray-400 font-medium">Saúde Mental / Vícios</p>
                <FilterCheck label="Problema Mental" name="diagnostico_problema_mental" checked={!!filters.diagnostico_problema_mental} onChange={(v: any) => onChange("diagnostico_problema_mental", v)} collapsed={collapsed} />
                <FilterCheck label="Uso de Álcool" name="usa_alcool" checked={!!filters.usa_alcool} onChange={(v: any) => onChange("usa_alcool", v)} collapsed={collapsed} />
                <FilterCheck label="Tabagismo" name="esta_fumante" checked={!!filters.esta_fumante} onChange={(v: any) => onChange("esta_fumante", v)} collapsed={collapsed} />
              </div>
            </SidebarAccordionItem>

            <SidebarAccordionItem
              value="morador"
              title="Perfil do Morador"
              icon={<Users size={18} />}
              collapsed={collapsed}
              iconClassName="bg-green-100 text-green-600"
            >
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Sexo</label>
                  <Select onValueChange={(v: any) => onChange("sexo", v === "all" ? null : v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={collapsed ? "" : "Todos"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input value={filters.idade_minima || ""} onChange={(e) => onChange("idade_minima", e.target.value ? Number(e.target.value) : null)} placeholder="Idade Mín." />
                  <Input value={filters.idade_maxima || ""} onChange={(e) => onChange("idade_maxima", e.target.value ? Number(e.target.value) : null)} placeholder="Idade Máx." />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Escolaridade</label>
                  <Select onValueChange={(v: any) => onChange("escolaridade", v === "all" ? null : v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={collapsed ? "" : "Todas"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="creche">Creche</SelectItem>
                      <SelectItem value="pre_escola">Pre-Escola</SelectItem>
                      <SelectItem value="alfabetizacao">Alfabetização</SelectItem>
                      <SelectItem value="fundamental_1_4">Fund. 1ª-4ª</SelectItem>
                      <SelectItem value="fundamental_5_8">Fund. 5ª-8ª</SelectItem>
                      <SelectItem value="fundamental_completo">Fund. Completo</SelectItem>
                      <SelectItem value="medio">Médio Completo</SelectItem>
                      <SelectItem value="superior">Superior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FilterCheck label="Recebe Benefício (Bolsa Família)" name="recebe_beneficio" checked={!!filters.recebe_beneficio} onChange={(v: any) => onChange("recebe_beneficio", v)} collapsed={collapsed} />
              </div>
            </SidebarAccordionItem>

            <SidebarAccordionItem
              value="residencia"
              title="Infraestrutura"
              icon={<Home size={18} />}
              collapsed={collapsed}
              iconClassName="bg-yellow-100 text-yellow-700"
            >
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Abastecimento de Água</label>
                  <Select onValueChange={(v: any) => onChange("abastecimento_agua", v === "all" ? null : v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={collapsed ? "" : "Qualquer"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Qualquer</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                      <SelectItem value="rede_encanada">Rede Encanada</SelectItem>
                      <SelectItem value="poco_nascente">Poço / Nascente</SelectItem>
                      <SelectItem value="cisterna">Cisterna</SelectItem>
                      <SelectItem value="carro_pipa">Carro Pipa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Destino do Lixo</label>
                  <Select onValueChange={(v: any) => onChange("destino_lixo", v === "all" ? null : v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={collapsed ? "" : "Qualquer"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Qualquer</SelectItem>
                      <SelectItem value="coletado">Coletado</SelectItem>
                      <SelectItem value="queimado_enterrado">Queimado / Enterrado</SelectItem>
                      <SelectItem value="ceu_aberto">Céu Aberto</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Esgoto</label>
                  <Select onValueChange={(v: any) => onChange("escoamento_sanitario", v === "all" ? null : v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={collapsed ? "" : "Qualquer"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Qualquer</SelectItem>
                      <SelectItem value="rede_coletora_pluvial">Rede Coletora</SelectItem>
                      <SelectItem value="fossa_septica">Fossa Séptica</SelectItem>
                      <SelectItem value="fossa_rudimentar">Fossa Rudimentar</SelectItem>
                      <SelectItem value="ceu_aberto">Céu Aberto</SelectItem>
                      <SelectItem value="direto_rio_lago_mar">Direto Rio/Lago/Mar</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FilterCheck label="Possui Animais" name="possui_animais" checked={!!filters.possui_animais} onChange={(v: any) => onChange("possui_animais", v)} collapsed={collapsed} />
              </div>
            </SidebarAccordionItem>

            <SidebarAccordionItem
              value="vulnerabilidade"
              title="Vulnerabilidade Social"
              icon={<AlertTriangle size={18} />}
              collapsed={collapsed}
              iconClassName="bg-orange-100 text-orange-600"
            >
              <div className="space-y-3 pt-2">
                <FilterCheck label="Em Situação de Rua" name="em_situacao_rua" checked={!!filters.em_situacao_rua} onChange={(v: any) => onChange("em_situacao_rua", v)} collapsed={collapsed} />
              </div>
            </SidebarAccordionItem>
          </Accordion>
        </div>
      </ScrollArea>

      {/* Footer */}
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
            
            {/* Esconde o texto se estiver colapsado */}
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