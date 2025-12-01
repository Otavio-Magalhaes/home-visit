import { useQuery } from '@tanstack/react-query';
import type { FiltersType } from '../components/layout/Sidebar';
import { getDashboardMapPins } from '../http/useGetDashboardMapPins';

export const useDashboardMap = (filters: Partial<FiltersType>) => {
  const { data: pinos = [], isLoading: isLoadingMap } = useQuery({
    queryKey: ['dashboard-map', filters],
    queryFn: () => getDashboardMapPins(filters),
    placeholderData: (prevData) => prevData, 
    staleTime: 1000 * 60 * 5, 
  });

  return { pinos, isLoadingMap };
};