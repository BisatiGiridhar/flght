import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { fetchWithAuth } from "@/lib/api";
import type { InsertBooking } from "@shared/schema";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (booking: InsertBooking) => {
      const res = await fetchWithAuth(api.bookings.create.path, {
        method: api.bookings.create.method,
        body: JSON.stringify(booking),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create booking");
      return api.bookings.create.responses[201].parse(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.userBookings.path, variables.userId] });
      queryClient.invalidateQueries({ queryKey: [api.bookings.all.path] });
      queryClient.invalidateQueries({ queryKey: [api.flights.get.path, variables.flightId] });
    },
  });
}

export function useUserBookings(userId: number | undefined) {
  return useQuery({
    queryKey: [api.bookings.userBookings.path, userId],
    queryFn: async () => {
      if (!userId) return [];
      const url = buildUrl(api.bookings.userBookings.path, { id: userId });
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error("Failed to fetch user bookings");
      const data = await res.json();
      return api.bookings.userBookings.responses[200].parse(data);
    },
    enabled: !!userId,
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: [api.bookings.all.path],
    queryFn: async () => {
      const res = await fetchWithAuth(api.bookings.all.path);
      if (!res.ok) throw new Error("Failed to fetch all bookings");
      const data = await res.json();
      return api.bookings.all.responses[200].parse(data);
    },
  });
}
