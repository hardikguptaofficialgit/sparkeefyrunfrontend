import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Copy, Check } from "@phosphor-icons/react";
import { PageHeader, LoadingState } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { useWingmanRun } from "@/hooks/use-api";
import { formatDate } from "@/lib/utils";

export function WingmanRunDetailPage() {
  const { id = "" } = useParams();
  const { data: run, isLoading } = useWingmanRun(id);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (isLoading || !run) return <LoadingState />;

  const copyReply = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div>
      <div className="mb-8 flex items-start gap-4">
        <PersonAvatar
          personId={run.personSnapshot.id}
          displayName={run.personSnapshot.displayName}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <PageHeader
            title="Run Details"
            description={`Wingman session for ${run.personSnapshot.displayName} - ${formatDate(run.createdAt)}`}
            action={
              <Button variant="secondary" asChild>
                <Link to="/wingman">Back to history</Link>
              </Button>
            }
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge variant={run.status === "succeeded" ? "success" : "secondary"}>{run.status}</Badge>
        {run.replayed ? <Badge variant="secondary">Replayed</Badge> : null}
        {run.failureCode ? <Badge variant="destructive">{run.failureCode}</Badge> : null}
      </div>

      {run.status === "succeeded" && run.result ? (
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-4">Suggested Replies</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {run.result.suggestedReplies.map((reply, index) => (
                <Card key={index} className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{reply.tone}</Badge>
                        <Badge
                          variant={
                            reply.riskLevel === "low"
                              ? "success"
                              : reply.riskLevel === "medium"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {reply.riskLevel} risk
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm leading-relaxed">{reply.text}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => copyReply(reply.text, index)}
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check size={16} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Reasoning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted leading-relaxed">{run.result.reasoning}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Used</CardTitle>
              </CardHeader>
              <CardContent>
                {run.result.memoryUsed.length === 0 ? (
                  <p className="text-sm text-muted">No memories matched this run.</p>
                ) : (
                  <ul className="space-y-2">
                    {run.result.memoryUsed.map((m) => (
                      <li key={m.id} className="text-sm flex items-start gap-2">
                        <Badge variant="secondary">{m.type}</Badge>
                        <span className="text-muted">{m.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted">
              This run did not complete successfully. Try again with a new idempotency key.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Immutable Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-muted">Person at run time</dt>
              <dd className="font-medium mt-1">{run.personSnapshot.displayName}</dd>
              <dd className="text-muted-foreground mt-1">
                {run.personSnapshot.relationshipLabel ?? "No label"}
                {run.personSnapshot.pronouns ? ` · ${run.personSnapshot.pronouns}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Run ID</dt>
              <dd className="font-mono text-xs mt-1 break-all">{run.id}</dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground mt-4">
            Person renames do not affect this snapshot. Historical runs remain accurate.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
