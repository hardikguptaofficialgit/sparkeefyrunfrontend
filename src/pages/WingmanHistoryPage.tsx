import { Link } from "react-router-dom";
import { PageHeader, LoadingState, EmptyState } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { useWingmanRuns } from "@/hooks/use-api";
import { formatDate } from "@/lib/utils";

export function WingmanHistoryPage() {
  const { data, isLoading } = useWingmanRuns();
  const runs = data?.data ?? [];

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Run History"
        description="Immutable snapshots of every Wingman session - person, context, and memory at time of run."
        action={
          <Button asChild>
            <Link to="/wingman/new">New Run</Link>
          </Button>
        }
      />

      {runs.length === 0 ? (
        <EmptyState
          title="No Wingman runs yet"
          description="Start a run with chat context to get thoughtful reply suggestions."
          action={
            <Button asChild>
              <Link to="/wingman/new">Start your first run</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {runs.map((run) => (
            <Link key={run.id} to={`/wingman/${run.id}`}>
              <Card className="transition-colors duration-200 hover:bg-card-hover">
                <CardContent className="flex items-start gap-3.5 p-4">
                  <PersonAvatar
                    personId={run.personSnapshot.id}
                    displayName={run.personSnapshot.displayName}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-medium">{run.personSnapshot.displayName}</h3>
                      {run.replayed ? <Badge variant="secondary">Replayed</Badge> : null}
                      <Badge variant={run.status === "succeeded" ? "success" : "secondary"}>
                        {run.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(run.createdAt)}</p>
                    {run.result?.suggestedReplies?.[0] ? (
                      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                        {run.result.suggestedReplies[0].text}
                      </p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
