import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, PencilSimple } from "@phosphor-icons/react";
import { PageHeader, LoadingState } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePerson, useMemories, useCreateMemory, useUpdateMemory } from "@/hooks/use-api";
import type { Memory, MemorySource, MemoryType } from "@/lib/types";

const schema = z.object({
  type: z.enum(["preference", "boundary", "fact", "tone"]),
  content: z.string().trim().min(1).max(2000),
  confidence: z.coerce.number().min(0).max(1).optional(),
  source: z.enum(["manual", "inferred", "run"]).optional(),
});

type FormValues = z.infer<typeof schema>;

const typeLabels: Record<MemoryType, string> = {
  preference: "Preference",
  boundary: "Boundary",
  fact: "Fact",
  tone: "Tone",
};

const sourceLabels: Record<MemorySource, string> = {
  manual: "Manual",
  inferred: "Inferred",
  run: "From run",
};

export function MemoriesPage() {
  const { id = "" } = useParams();
  const { data: person, isLoading: personLoading } = usePerson(id);
  const { data: memoriesData, isLoading: memoriesLoading } = useMemories(id);
  const createMemory = useCreateMemory(id);
  const updateMemory = useUpdateMemory(id);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "preference", content: "", confidence: 1, source: "manual" },
  });

  const memoryType = watch("type");
  const memorySource = watch("source");

  if (personLoading || memoriesLoading || !person) return <LoadingState />;

  const memories = memoriesData?.data ?? [];

  const onSubmit = async (values: FormValues) => {
    await createMemory.mutateAsync({
      type: values.type,
      content: values.content,
      confidence: values.confidence ?? 1,
      source: values.source ?? "manual",
    });
    reset({ type: values.type, content: "", confidence: 1, source: "manual" });
  };

  const toggleActive = async (memoryId: string, active: boolean) => {
    await updateMemory.mutateAsync({ memoryId, active });
  };

  const startEdit = (memory: Memory) => {
    setEditingId(memory.id);
    reset({
      type: memory.type,
      content: memory.content,
      confidence: memory.confidence,
      source: memory.source,
    });
  };

  const saveEdit = async (memoryId: string, values: FormValues) => {
    await updateMemory.mutateAsync({
      memoryId,
      type: values.type,
      content: values.content,
      confidence: values.confidence,
      source: values.source,
    });
    setEditingId(null);
    reset({ type: "preference", content: "", confidence: 1, source: "manual" });
  };

  return (
    <div>
      <PageHeader
        title="Memories"
        description={`Relationship context for ${person.displayName} - preferences, boundaries, facts, and tone.`}
        action={
          <Button variant="secondary" asChild>
            <Link to={`/people/${id}`}>
              <ArrowLeft size={16} />
              Back
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add memory</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={memoryType}
                    onValueChange={(v) => setValue("type", v as MemoryType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Source <span className="text-muted-foreground">(optional)</span></Label>
                  <Select
                    value={memorySource ?? "manual"}
                    onValueChange={(v) => setValue("source", v as MemorySource)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(sourceLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="She prefers thoughtful voice notes over long texts"
                  rows={4}
                  {...register("content")}
                />
                {errors.content ? (
                  <p className="text-xs text-destructive">{errors.content.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidence">
                  Confidence <span className="text-muted-foreground">(optional, 0–1)</span>
                </Label>
                <Input
                  id="confidence"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  placeholder="1.0"
                  {...register("confidence")}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Add Memory"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active memories ({memories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {memories.length === 0 ? (
              <p className="text-sm text-muted leading-relaxed">
                No active memories yet. Add context to improve Wingman suggestions.
              </p>
            ) : (
              <div className="space-y-4">
                {memories.map((memory) => (
                  <div
                    key={memory.id}
                    className="rounded-2xl border border-border p-4 space-y-3"
                  >
                    {editingId === memory.id ? (
                      <form
                        onSubmit={handleSubmit((v) => saveEdit(memory.id, v))}
                        className="space-y-3"
                      >
                        <Textarea rows={3} {...register("content")} />
                        <div className="flex gap-2">
                          <Button type="submit" size="sm">
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge>{typeLabels[memory.type]}</Badge>
                            <Badge variant="teal">{sourceLabels[memory.source]}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(memory.confidence * 100)}% confidence
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => startEdit(memory)}
                            >
                              <PencilSimple size={14} />
                            </Button>
                            <Switch
                              checked={memory.active}
                              onCheckedChange={(checked) => toggleActive(memory.id, checked)}
                            />
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed">{memory.content}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
