import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/http/useGetDashboadStats.js';
import type { FiltersType } from '@/@types/index.js';

export const useDashboardStats = (filters: Partial<FiltersType>) => {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats', filters],
    queryFn: () => getDashboardStats(filters),
    placeholderData: (prevData) => prevData, 
    staleTime: 1000 * 60 * 5, 
  });

  return { stats, isLoadingStats };
};