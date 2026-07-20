import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Brain, ChatCircle, PencilSimple } from "@phosphor-icons/react";
import { PageHeader, LoadingState } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { usePerson, useUpdatePerson, useWingmanRuns } from "@/hooks/use-api";
import { formatDate } from "@/lib/utils";
import { ApiRequestError } from "@/lib/api";

const schema = z.object({
  displayName: z.string().trim().min(1).max(100),
  relationshipLabel: z.string().trim().max(100).optional(),
  pronouns: z.string().trim().max(50).optional(),
});

type FormValues = z.infer<typeof schema>;

export function PersonDetailPage() {
  const { id = "" } = useParams();
  const [editing, setEditing] = useState(false);
  const { data: person, isLoading } = usePerson(id);
  const { data: runsData } = useWingmanRuns(id);
  const updatePerson = useUpdatePerson(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (isLoading || !person) return <LoadingState />;

  const runs = runsData?.data ?? [];

  const onSubmit = async (values: FormValues) => {
    try {
      await updatePerson.mutateAsync({
        displayName: values.displayName,
        relationshipLabel: values.relationshipLabel || null,
        pronouns: values.pronouns || null,
      });
      setEditing(false);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        alert(err.message);
      }
    }
  };

  const startEdit = () => {
    reset({
      displayName: person.displayName,
      relationshipLabel: person.relationshipLabel ?? "",
      pronouns: person.pronouns ?? "",
    });
    setEditing(true);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start">
        <PersonAvatar personId={person.id} displayName={person.displayName} size="xl" />
        <div className="min-w-0 flex-1 sm:pt-1">
          <PageHeader
            title={person.displayName}
            description={person.relationshipLabel ?? "Relationship profile"}
            action={
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" onClick={startEdit} className="w-full sm:w-auto">
                  <PencilSimple size={16} />
                  Edit
                </Button>
                <Button asChild className="w-full sm:w-auto">
                  <Link to={`/people/${id}/memories`}>
                    <Brain size={16} />
                    Memories
                  </Link>
                </Button>
              </div>
            }
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display name</Label>
                  <Input id="displayName" {...register("displayName")} />
                  {errors.displayName ? (
                    <p className="text-xs text-destructive">{errors.displayName.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationshipLabel">Relationship</Label>
                  <Input id="relationshipLabel" {...register("relationshipLabel")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pronouns">Pronouns</Label>
                  <Input id="pronouns" {...register("pronouns")} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={isSubmitting}>
                    Save
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-muted">Display name</dt>
                  <dd className="font-medium mt-1">{person.displayName}</dd>
                </div>
                <div>
                  <dt className="text-muted">Relationship</dt>
                  <dd className="font-medium mt-1">{person.relationshipLabel ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-muted">Pronouns</dt>
                  <dd className="font-medium mt-1">{person.pronouns ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-muted">Created</dt>
                  <dd className="font-medium mt-1">{formatDate(person.createdAt)}</dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Recent Wingman Runs</CardTitle>
            <Button size="sm" asChild className="w-full sm:w-auto">
              <Link to={`/wingman/new?personId=${id}`}>
                <ChatCircle size={16} />
                New Run
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {runs.length === 0 ? (
              <p className="text-sm text-muted">No runs for this person yet.</p>
            ) : (
              <div className="space-y-3">
                {runs.slice(0, 5).map((run) => (
                  <Link
                    key={run.id}
                    to={`/wingman/${run.id}`}
                    className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-accent transition-colors duration-200"
                  >
                    <div>
                      <p className="text-sm font-medium">{formatDate(run.createdAt)}</p>
                      <p className="text-xs text-muted mt-1">
                        Snapshot: {run.personSnapshot.displayName}
                      </p>
                    </div>
                    <Badge variant={run.status === "succeeded" ? "success" : "secondary"}>
                      {run.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
