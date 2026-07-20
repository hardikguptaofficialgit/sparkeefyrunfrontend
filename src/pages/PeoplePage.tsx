import { Link } from "react-router-dom";
import { Plus } from "@phosphor-icons/react";
import { PageHeader, LoadingState, EmptyState } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/ui/person-avatar";
import { usePeople } from "@/hooks/use-api";

export function PeoplePage() {
  const { data, isLoading } = usePeople();
  const people = data?.data ?? [];

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="People"
        description="Manage the people you are supporting with Sparkeefy Wingman."
        action={
          <Button asChild>
            <Link to="/people/new">
              <Plus size={16} />
              Add Person
            </Link>
          </Button>
        }
      />

      {people.length === 0 ? (
        <EmptyState
          title="No people added"
          description="Create a person profile to store relationship context and memories."
          action={
            <Button asChild>
              <Link to="/people/new">Add your first person</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {people.map((person) => (
            <Link key={person.id} to={`/people/${person.id}`}>
              <Card className="h-full transition-colors duration-200 hover:bg-card-hover">
                <CardContent className="flex items-center gap-4 p-4">
                  <PersonAvatar personId={person.id} displayName={person.displayName} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium">{person.displayName}</h3>
                    <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                      {person.relationshipLabel ?? "No relationship label"}
                    </p>
                    {person.pronouns ? (
                      <p className="mt-2 text-xs text-muted-foreground/80">{person.pronouns}</p>
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
