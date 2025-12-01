import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { api } from '../lib/api';

export function useSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Monitoramento de status (igual ao anterior)
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    const updatePendingCount = async () => {
        const count = await db.syncQueue.where('synced').equals(0).count();
        setPendingCount(count);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    const interval = setInterval(updatePendingCount, 2000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  // --- FUNÇÃO DE UPLOAD INTELIGENTE ---
  const syncNow = async () => {
    if (!isOnline || isSyncing) return;
    
    // Ordena por ID para garantir que pais (criados antes) subam antes dos filhos
    const pendentes = await db.syncQueue.where('synced').equals(0).sortBy('id');
    
    if (pendentes.length === 0) return;

    setIsSyncing(true);
    let enviados = 0;

    try {
      console.log(`🔄 Iniciando sincronização de ${pendentes.length} itens...`);

      // Não usamos forEach ou map, pois precisamos esperar (await) cada um
      // e, CRUCIALMENTE, precisamos ler/atualizar a fila em tempo real
      for (const item of pendentes) {
        try {
          let endpoint = '';
          
          // Re-lê o item do banco para garantir que pegamos atualizações de cascata feitas no loop anterior
          const currentItem = await db.syncQueue.get(item.id!);
          if (!currentItem) continue; // Já foi processado ou deletado
          
          const payload = currentItem.payload;

          switch (currentItem.tipo) {
            case 'residencia': endpoint = '/residence/'; break;
            case 'morador': endpoint = '/resident/'; break;
            case 'visita': endpoint = '/visit/'; break;
          }

          if (endpoint) {
            // 1. Envia para a API
            const response = await api.post(endpoint, payload);
            const realId = response.data.id; // O ID real gerado pelo banco (ex: 55 ou uuid-real)
            const tempId = currentItem.temp_id; // O ID temporário (ex: uuid-temp)

            // 2. CASCATA DE ATUALIZAÇÃO DE IDs (O Segredo!)
            // Se o ID mudou (ou se era temporário), atualizamos quem depende dele na fila
            
            if (realId && tempId) {
                
                // CASO A: Acabei de criar uma RESIDÊNCIA
                if (currentItem.tipo === 'residencia') {
                    // Procuro Moradores na fila que dependem dessa casa antiga
                    await db.syncQueue
                        .where('tipo').equals('morador')
                        .filter(i => i.synced === 0)
                        .modify(dependente => {
                            // Se o morador aponta para a casa temporária...
                            // Atenção: Convertemos para string para comparar seguro
                            if (String(dependente.payload.residence_id) === String(tempId)) {
                                console.log(`🔗 Atualizando vínculo: Morador agora mora na casa ID ${realId}`);
                                dependente.payload.residence_id = realId; // Atualiza para o ID real
                            }
                        });
                }

                // CASO B: Acabei de criar um MORADOR
                if (currentItem.tipo === 'morador') {
                    // Procuro Visitas na fila que dependem desse morador antigo
                    await db.syncQueue
                        .where('tipo').equals('visita')
                        .filter(i => i.synced === 0)
                        .modify(dependente => {
                             if (String(dependente.payload.resident_id) === String(tempId)) {
                                console.log(`🔗 Atualizando vínculo: Visita agora é para o morador ID ${realId}`);
                                dependente.payload.resident_id = realId;
                             }
                        });
                }
            }

            // 3. Marca como enviado (Sucesso)
            await db.syncQueue.delete(currentItem.id!);
            enviados++;
          }

        } catch (error) {
          console.error(`❌ Erro ao sincronizar item ${item.tipo}:`, error);
          // Se der erro, paramos ou continuamos? 
          // Melhor continuar tentando os outros que não dependem desse.
        }
      }

      if (enviados > 0) {
        console.log(`✅ ${enviados} itens sincronizados e vínculos corrigidos!`);
      }

    } finally {
      setIsSyncing(false);
    }
  };

  // ... (syncDown mantido)
  const syncDown = async () => {
    if (!navigator.onLine) return;
    // ... sua lógica de syncDown existente ...
  };

  useEffect(() => {
    if (isOnline) syncNow();
  }, [isOnline]);

  return { isOnline, isSyncing, syncNow, syncDown, pendingCount };
}