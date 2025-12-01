import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers } from '../../http/useGetUser';
import { toggleUserStatus } from '../../http/useUpdateUserStatus';

// Hook para Listar (Query)
export const useTeamList = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users-list'],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });

  return { users, isLoading };
};

// Hook para Alterar Status (Mutation)
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => 
      toggleUserStatus(id, status),
      
    onSuccess: () => {
      // Recarrega a lista automaticamente após o sucesso
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
    },
    
    onError: (error) => {
      console.error("Erro ao atualizar status:", error);
      alert("Não foi possível atualizar o status do usuário.");
    }
  });
};