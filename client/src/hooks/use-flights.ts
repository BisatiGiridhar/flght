import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { fetchWithAuth } from "@/lib/api";
import type { InsertFlight, Flight } from "@shared/schema";

export function useSearchFlights(searchParams?: { from?: string; to?: string; date?: string }) {
  return useQuery({
    queryKey: [api.flights.search.path, searchParams],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (searchParams?.from) query.set("from", searchParams.from);
      if (searchParams?.to) query.set("to", searchParams.to);
      if (searchParams?.date) query.set("date", searchParams.date);
      
      const url = `${api.flights.search.path}${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error("Failed to search flights");
      
      const data = await res.json();
      return api.flights.search.responses[200].parse(data);
    },
  });
}

export function useFlight(id: number | string) {
  return useQuery({
    queryKey: [api.flights.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.flights.get.path, { id });
      const res = await fetchWithAuth(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch flight");
      
      const data = await res.json();
      return api.flights.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

export function useCreateFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (flight: InsertFlight) => {
      const res = await fetchWithAuth(api.flights.create.path, {
        method: api.flights.create.method,
        body: JSON.stringify(flight),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create flight");
      return api.flights.create.responses[201].parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.flights.search.path] });
    },
  });
}

export function useUpdateFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertFlight>) => {
      const url = buildUrl(api.flights.update.path, { id });
      const res = await fetchWithAuth(url, {
        method: api.flights.update.method,
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update flight");
      return api.flights.update.responses[200].parse(data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [api.flights.get.path, id] });
      queryClient.invalidateQueries({ queryKey: [api.flights.search.path] });
    },
  });
}

export function useDeleteFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.flights.delete.path, { id });
      const res = await fetchWithAuth(url, {
        method: api.flights.delete.method,
      });
      if (!res.ok) throw new Error("Failed to delete flight");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.flights.search.path] });
    },
  });
}
