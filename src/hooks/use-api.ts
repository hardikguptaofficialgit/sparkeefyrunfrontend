import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { getUserId } from "@/lib/auth";
import type { Memory, Person, WingmanRun } from "@/lib/types";

export function useUserId() {
  return getUserId();
}

export function usePeople() {
  const userId = useUserId();
  return useQuery({
    queryKey: ["people", userId],
    queryFn: () => apiRequest<{ data: Person[] }>("/people", { userId }),
  });
}

export function usePerson(personId: string) {
  const userId = useUserId();
  return useQuery({
    queryKey: ["person", userId, personId],
    queryFn: () => apiRequest<Person>(`/people/${personId}`, { userId }),
    enabled: !!personId,
  });
}

export function useMemories(personId: string) {
  const userId = useUserId();
  return useQuery({
    queryKey: ["memories", userId, personId],
    queryFn: () => apiRequest<{ data: Memory[] }>(`/people/${personId}/memories`, { userId }),
    enabled: !!personId,
  });
}

export function useWingmanRuns(personId?: string) {
  const userId = useUserId();
  const query = personId ? `?personId=${personId}` : "";
  return useQuery({
    queryKey: ["wingman-runs", userId, personId ?? "all"],
    queryFn: () => apiRequest<{ data: WingmanRun[] }>(`/wingman-runs${query}`, { userId }),
  });
}

export function useWingmanRun(runId: string) {
  const userId = useUserId();
  return useQuery({
    queryKey: ["wingman-run", userId, runId],
    queryFn: () => apiRequest<WingmanRun>(`/wingman-runs/${runId}`, { userId }),
    enabled: !!runId,
  });
}

export function useCreatePerson() {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      displayName: string;
      relationshipLabel?: string | null;
      pronouns?: string | null;
    }) => apiRequest<Person>("/people", { method: "POST", body, userId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["people", userId] }),
  });
}

export function useUpdatePerson(personId: string) {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      displayName?: string;
      relationshipLabel?: string | null;
      pronouns?: string | null;
    }) => apiRequest<Person>(`/people/${personId}`, { method: "PATCH", body, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people", userId] });
      queryClient.invalidateQueries({ queryKey: ["person", userId, personId] });
    },
  });
}

export function useCreateMemory(personId: string) {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      type: Memory["type"];
      content: string;
      confidence?: number;
      source?: Memory["source"];
      active?: boolean;
    }) =>
      apiRequest<Memory>(`/people/${personId}/memories`, { method: "POST", body, userId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memories", userId, personId] }),
  });
}

export function useUpdateMemory(personId: string) {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memoryId,
      ...body
    }: {
      memoryId: string;
      type?: Memory["type"];
      content?: string;
      confidence?: number;
      source?: Memory["source"];
      active?: boolean;
    }) =>
      apiRequest<Memory>(`/people/${personId}/memories/${memoryId}`, {
        method: "PATCH",
        body,
        userId,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memories", userId, personId] }),
  });
}

export function useCreateWingmanRun() {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      idempotencyKey,
      ...body
    }: {
      idempotencyKey: string;
      personId: string;
      input: { message: string; tone?: string | null; goal?: string | null };
      context: { recentMessages: Array<{ role: "user" | "recipient"; text: string; sentAt?: string }> };
    }) =>
      apiRequest<WingmanRun>("/wingman-runs", {
        method: "POST",
        body,
        userId,
        idempotencyKey,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wingman-runs", userId] });
    },
  });
}
