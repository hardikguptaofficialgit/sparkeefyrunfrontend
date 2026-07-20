import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserId, setUserId, useDemoAccount, resetUserId } from "@/lib/auth";

function BadgeInline({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-xs bg-secondary border border-border px-2 py-1 rounded-full">
      {children}
    </code>
  );
}

export function SettingsPage() {
  const [userId, setLocalUserId] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalUserId(getUserId());
  }, []);

  const save = () => {
    setUserId(userId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    window.location.reload();
  };

  const useDemo = () => {
    useDemoAccount();
    setLocalUserId("demo-user");
    window.location.reload();
  };

  const reset = () => {
    const newId = resetUserId();
    setLocalUserId(newId);
    window.location.reload();
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Settings"
        description="Your session ID isolates your data. Each browser gets a unique ID in production."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Identity</CardTitle>
            <CardDescription>
              Each user ID isolates people, memories, and runs. User A cannot access User B&apos;s data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">x-user-id</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setLocalUserId(e.target.value)}
                placeholder="user-abc123"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={save}>{saved ? "Saved!" : "Save User ID"}</Button>
              <Button variant="secondary" onClick={useDemo}>
                Use Demo Account
              </Button>
              <Button variant="ghost" onClick={reset}>
                New Private ID
              </Button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Demo data is seeded for <code className="text-xs">demo-user</code>. Click &quot;Use Demo
              Account&quot; then refresh to see sample people, memories, and runs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Provider</CardTitle>
            <CardDescription>
              Wingman runs use Groq on the backend (configured server-side).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted">Provider:</span>{" "}
              <BadgeInline>Groq</BadgeInline>
            </p>
            <p>
              <span className="text-muted">Model:</span>{" "}
              <BadgeInline>Llama 3.1 8B Instant</BadgeInline>
            </p>
            <p className="text-muted leading-relaxed pt-2">
              API keys are stored in backend <code className="text-xs">.env</code> only - never
              exposed to the browser or logs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted">Backend URL:</span>{" "}
              <code className="text-xs bg-accent px-2 py-1 rounded-lg">
                {import.meta.env.VITE_API_URL ?? "http://localhost:4000/v1"}
              </code>
            </p>
            <p className="text-muted leading-relaxed">
              In production, replace x-user-id with JWT validation mapping to{" "}
              <code className="text-xs">sub</code> claim.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted leading-relaxed">
              Sparkeefy Wingman never logs messages, names, memories, prompts, or LLM responses.
              All sensitive fields are redacted from server logs.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
