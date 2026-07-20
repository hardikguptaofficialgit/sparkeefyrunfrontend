import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash } from "@phosphor-icons/react";
import { v4 as uuidv4 } from "uuid";
import { PageHeader, LoadingState } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePeople, useCreateWingmanRun } from "@/hooks/use-api";
import { ApiRequestError } from "@/lib/api";

const messageSchema = z.object({
  role: z.enum(["user", "recipient"]),
  text: z.string().trim().min(1).max(4000),
  sentAt: z.string().optional(),
});

const schema = z.object({
  personId: z.string().uuid("Select a person"),
  message: z.string().trim().min(1).max(4000),
  tone: z.string().trim().max(100).optional(),
  goal: z.string().trim().max(500).optional(),
  recentMessages: z.array(messageSchema).max(40),
});

type FormValues = z.infer<typeof schema>;

export function NewWingmanRunPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPerson = searchParams.get("personId") ?? "";
  const { data: peopleData, isLoading } = usePeople();
  const createRun = useCreateWingmanRun();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      personId: preselectedPerson,
      message: "",
      tone: "warm",
      goal: "",
      recentMessages: [{ role: "recipient", text: "", sentAt: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "recentMessages" });
  const personId = watch("personId");

  useEffect(() => {
    if (preselectedPerson) setValue("personId", preselectedPerson);
  }, [preselectedPerson, setValue]);

  if (isLoading) return <LoadingState />;

  const people = peopleData?.data ?? [];

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const recentMessages = values.recentMessages
      .filter((m) => m.text.trim())
      .map((m) => ({
        role: m.role,
        text: m.text,
        ...(m.sentAt ? { sentAt: new Date(m.sentAt).toISOString() } : {}),
      }));

    try {
      const run = await createRun.mutateAsync({
        idempotencyKey: uuidv4(),
        personId: values.personId,
        input: {
          message: values.message,
          tone: values.tone || null,
          goal: values.goal || null,
        },
        context: { recentMessages },
      });
      navigate(`/wingman/${run.id}`);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title="New Wingman Run"
        description="Provide your ask and recent chat context. Wingman will suggest natural, emotionally aware replies."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Person</Label>
              <Select value={personId} onValueChange={(v) => setValue("personId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a person" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.personId ? (
                <p className="text-xs text-destructive">{errors.personId.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your ask</Label>
              <Textarea
                id="message"
                placeholder="She said I seem distant. Help me reply warmly without sounding desperate."
                rows={3}
                {...register("message")}
              />
              {errors.message ? (
                <p className="text-xs text-destructive">{errors.message.message}</p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">
                  Tone <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input id="tone" placeholder="warm, direct, playful" {...register("tone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">
                  Goal <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="goal"
                  placeholder="reassure without over-explaining"
                  {...register("goal")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Recent messages</CardTitle>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => append({ role: "recipient", text: "", sentAt: "" })}
            >
              <Plus size={16} />
              Add message
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-2xl border border-border p-3 sm:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="w-full shrink-0 space-y-2 sm:w-32">
                    <Label className="text-xs">Role</Label>
                    <Select
                      value={watch(`recentMessages.${index}.role`)}
                      onValueChange={(v) =>
                        setValue(`recentMessages.${index}.role`, v as "user" | "recipient")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recipient">Recipient</SelectItem>
                        <SelectItem value="user">You</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs">Message</Label>
                    <Textarea rows={2} {...register(`recentMessages.${index}.text`)} />
                  </div>
                  {fields.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="self-end sm:mt-6"
                      onClick={() => remove(index)}
                    >
                      <Trash size={16} />
                    </Button>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">
                    Sent at <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    {...register(`recentMessages.${index}.sentAt`)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Generating replies..." : "Generate Replies"}
        </Button>
      </form>
    </div>
  );
}
