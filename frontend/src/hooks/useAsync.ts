import { api } from '@/libs/api.js';
import { db } from '@/libs/db.js';
import { useState, useEffect } from 'react';

import { toast } from 'sonner';

export function useSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

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

  const syncNow = async () => {
    if (!isOnline || isSyncing) return;
    
    const pendentes = await db.syncQueue.where('synced').equals(0).sortBy('id');
    
    if (pendentes.length === 0) return;

    setIsSyncing(true);
    let enviados = 0;

    try {
      console.log(`🔄 Iniciando Upload de ${pendentes.length} itens...`);
    
      for (const item of pendentes) {
        try {
          let endpoint = '';
          
          const currentItem = await db.syncQueue.get(item.id!);
          if (!currentItem) continue;
          
          const payload = currentItem.payload;

          switch (currentItem.tipo) {
            case 'residencia': endpoint = '/residence/'; break;
            case 'morador': endpoint = '/resident/'; break;
            case 'visita': endpoint = '/visit/'; break;
          }

          if (endpoint) {
            const response = await api.post(endpoint, payload);
            const realId = response.data.id; 
            const tempId = currentItem.temp_id; 

            if (realId && tempId) {
                if (currentItem.tipo === 'residencia') {
                    await db.syncQueue
                        .where('tipo').equals('morador')
                        .filter(i => i.synced === 0)
                        .modify(dependente => {
                            if (String(dependente.payload.residence_id) === String(tempId)) {
                                console.log(`🔗 Atualizando vínculo: Morador agora mora na casa ID ${realId}`);
                                dependente.payload.residence_id = realId;
                            }
                        });
                }

                if (currentItem.tipo === 'morador') {
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

            await db.syncQueue.delete(currentItem.id!);
            enviados++;
          }

        } catch (error) {
          console.error(`❌ Erro ao subir item ${item.tipo}:`, error);
        }
      }

      if (enviados > 0) {
        console.log(`✅ Upload concluído: ${enviados} itens enviados.`);
        await syncDown(); 
      }

    } finally {
      setIsSyncing(false);
    }
  };

  const syncDown = async () => {
    if (!navigator.onLine) {
        console.warn("Sem internet para baixar dados.");
        return;
    }

    try {
        setIsSyncing(true);
        console.log("⬇️ Iniciando Sync Down (Baixando dados do servidor)...");

        const [resResidences, resResidents] = await Promise.all([
            api.get('/residence/?limit=1000'),
            api.get('/resident/?limit=1000')
        ]);

        const serverResidences = resResidences.data;
        const serverResidents = resResidents.data;

        await db.transaction('rw', db.residences, db.residents, async () => {
            await db.residences.clear(); 
            await db.residences.bulkPut(serverResidences);

            await db.residents.clear();
            await db.residents.bulkPut(serverResidents);
        });
        toast.success(" Sincronização concluída!");
        console.log(`✅ Sync Down concluído! ${serverResidences.length} casas e ${serverResidents.length} moradores baixados.`);

    } catch (error) {
        toast.error("Erro ao baixar dados do servidor.");
        console.error("❌ Erro ao baixar dados do servidor:", error);
    } finally {
        setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isOnline) {
        syncNow();
    }
  }, [isOnline]);

  return { isOnline, isSyncing, syncNow, syncDown, pendingCount };
}