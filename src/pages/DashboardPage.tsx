import { Link } from "react-router-dom";
import { ArrowRight, CaretRight } from "@phosphor-icons/react";
import { PageHeader, LoadingState, EmptyState } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar, PersonAvatarStack } from "@/components/ui/person-avatar";
import { usePeople, useWingmanRuns } from "@/hooks/use-api";
import { formatRelative } from "@/lib/utils";

export function DashboardPage() {
  const { data: peopleData, isLoading: peopleLoading } = usePeople();
  const { data: runsData, isLoading: runsLoading } = useWingmanRuns();

  const people = peopleData?.data ?? [];
  const runs = runsData?.data ?? [];
  const recentRuns = runs.slice(0, 5);
  const successRate = runs.length
    ? Math.round((runs.filter((r) => r.status === "succeeded").length / runs.length) * 100)
    : null;

  if (peopleLoading || runsLoading) return <LoadingState />;

  return (
    <div className="space-y-10">
      <PageHeader
        accent="Caring"
        title="shouldn't feel this hard"
        description="Your relationship wingman - remember context, find the right words, and reply with confidence."
        action={
          <Button asChild>
            <Link to="/wingman/new">
              New Wingman Run
              <ArrowRight size={16} />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>People</CardDescription>
            <div className="flex items-end justify-between gap-3">
              <CardTitle className="text-3xl">{people.length}</CardTitle>
              {people.length > 0 ? <PersonAvatarStack people={people} max={3} /> : null}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] text-muted-foreground">Recipients you are supporting</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Runs</CardDescription>
            <CardTitle className="text-3xl">{runs.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] text-muted-foreground">Wingman sessions completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-3xl">{successRate !== null ? `${successRate}%` : "-"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] text-muted-foreground">Runs with suggested replies</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-tight">Recent People</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/people">View all</Link>
            </Button>
          </div>

          {people.length === 0 ? (
            <EmptyState
              title="No people yet"
              description="Add someone you are talking to and start building relationship memory."
              action={
                <Button asChild>
                  <Link to="/people/new">Add Person</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-2">
              {people.slice(0, 4).map((person) => (
                <Link key={person.id} to={`/people/${person.id}`}>
                  <Card className="transition-colors duration-200 hover:bg-card-hover">
                    <CardContent className="flex items-center gap-3.5 p-3.5">
                      <PersonAvatar personId={person.id} displayName={person.displayName} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{person.displayName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {person.relationshipLabel ?? "No label"}
                        </p>
                      </div>
                      <CaretRight size={14} className="shrink-0 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-tight">Recent Runs</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/wingman">View all</Link>
            </Button>
          </div>

          {recentRuns.length === 0 ? (
            <EmptyState
              title="No runs yet"
              description="Start a Wingman run with chat context and get thoughtful reply suggestions."
              action={
                <Button asChild>
                  <Link to="/wingman/new">Start Run</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-2">
              {recentRuns.map((run) => (
                <Link key={run.id} to={`/wingman/${run.id}`}>
                  <Card className="transition-colors duration-200 hover:bg-card-hover">
                    <CardContent className="flex items-center gap-3.5 p-3.5">
                      <PersonAvatar
                        personId={run.personSnapshot.id}
                        displayName={run.personSnapshot.displayName}
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{run.personSnapshot.displayName}</p>
                        <p className="text-xs text-muted-foreground">{formatRelative(run.createdAt)}</p>
                        {run.result?.suggestedReplies?.[0] ? (
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/80">
                            {run.result.suggestedReplies[0].text}
                          </p>
                        ) : null}
                      </div>
                      <Badge variant={run.status === "succeeded" ? "success" : "secondary"}>
                        {run.status}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
