import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { fetchWithAuth } from "@/lib/api";
import type { LoginRequest, InsertUser, User } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const token = localStorage.getItem("flightfinder_token");
      if (!token) return null;

      try {
        const res = await fetchWithAuth(api.auth.me.path);
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("flightfinder_token");
            return null;
          }
          throw new Error("Failed to fetch user");
        }
        const data = await res.json();
        return api.auth.me.responses[200].parse(data);
      } catch (err) {
        localStorage.removeItem("flightfinder_token");
        return null;
      }
    },
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const res = await fetchWithAuth(api.auth.login.path, {
        method: api.auth.login.method,
        body: JSON.stringify(credentials),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to login");
      }
      
      const parsed = api.auth.login.responses[200].parse(data);
      localStorage.setItem("flightfinder_token", parsed.token);
      return parsed.user;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData([api.auth.me.path], userData);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await fetchWithAuth(api.auth.register.path, {
        method: api.auth.register.method,
        body: JSON.stringify(userData),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to register");
      }
      
      const parsed = api.auth.register.responses[201].parse(data);
      localStorage.setItem("flightfinder_token", parsed.token);
      return parsed.user;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData([api.auth.me.path], userData);
    },
  });

  const logout = () => {
    localStorage.removeItem("flightfinder_token");
    queryClient.setQueryData([api.auth.me.path], null);
    queryClient.invalidateQueries();
  };

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout,
  };
}
