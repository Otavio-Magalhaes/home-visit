// src/pages/Dashboard/TeamManagement.tsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { getUsers } from '../../http/useGetUser';
import { toggleUserStatus } from '../../http/useUpdateUserStatus';

const TeamManagement = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users-list'],
    queryFn: getUsers,
  });

  const { mutate: toggleStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => toggleUserStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users-list'] }),
    onError: () => alert("Erro ao atualizar.")
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Carregando equipe...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="text-lasalle-blue" size={28} />
                Equipe do Projeto
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                Gerencie o acesso dos estudantes e professores.
            </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Colaborador</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contato</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Função</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acesso</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role?.name === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                  }`}>
                    {user.role?.name === 'admin' ? 'Coordenador' : 'Estudante'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {/* O Switch só aparece se quem está vendo for ADMIN (lógica no backend protege a ação) */}
                  <button
                    onClick={() => toggleStatus({ id: user.id, status: !user.is_active })}
                    title={user.is_active ? "Clique para bloquear" : "Clique para liberar"}
                    className={`
                        relative inline-flex h-6 w-11  cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                        ${user.is_active ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamManagement;