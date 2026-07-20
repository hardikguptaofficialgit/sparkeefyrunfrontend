import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreatePerson } from "@/hooks/use-api";
import { ApiRequestError } from "@/lib/api";

const schema = z.object({
  displayName: z.string().trim().min(1, "Name is required").max(100),
  relationshipLabel: z.string().trim().max(100).optional(),
  pronouns: z.string().trim().max(50).optional(),
});

type FormValues = z.infer<typeof schema>;

export function NewPersonPage() {
  const navigate = useNavigate();
  const createPerson = useCreatePerson();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", relationshipLabel: "", pronouns: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const person = await createPerson.mutateAsync({
        displayName: values.displayName,
        relationshipLabel: values.relationshipLabel || null,
        pronouns: values.pronouns || null,
      });
      navigate(`/people/${person.id}`);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError("root", { message: err.message });
      }
    }
  };

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Add Person"
        description="Create a profile for someone you are talking to."
      />

      <Card>
        <CardHeader>
          <CardTitle>Person details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" placeholder="Ananya" {...register("displayName")} />
              {errors.displayName ? (
                <p className="text-xs text-destructive">{errors.displayName.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationshipLabel">
                Relationship label <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="relationshipLabel"
                placeholder="dating, close friend, partner"
                {...register("relationshipLabel")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pronouns">
                Pronouns <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input id="pronouns" placeholder="she/her, he/him, they/them" {...register("pronouns")} />
            </div>

            {errors.root ? (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            ) : null}

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Person"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
