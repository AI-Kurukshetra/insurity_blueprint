import { redirectAuthenticatedUserFromAuthPage } from "@/lib/auth-server";
import { AuthPanel } from "@/components/auth/auth-panel";
import { LoginStateCard } from "@/components/auth/login-state-card";
import { PageShell } from "@/components/page-shell";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectAuthenticatedUserFromAuthPage();

  const params = searchParams ? await searchParams : undefined;
  const nextPath = params?.next?.startsWith("/") ? params.next : null;

  return (
    <PageShell
      eyebrow="Access"
      title="Sign in to SmartClaim Pro"
      description="Production app access now uses real Supabase email-password authentication with a linked role profile."
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <AuthPanel nextPath={nextPath} />
        <LoginStateCard />
      </section>
    </PageShell>
  );
}
