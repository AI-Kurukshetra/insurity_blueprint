import { ResetPasswordPanel } from "@/components/auth/reset-password-panel";
import { PageShell } from "@/components/page-shell";

export default function ResetPasswordPage() {
  return (
    <PageShell
      eyebrow="Recovery"
      title="Reset account password"
      description="Use the recovery link from Supabase to attach a reset session and choose a new password."
    >
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <ResetPasswordPanel />
        <article className="rounded-[1.8rem] border border-stone-200 bg-[#f7f1e5] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-title">Password recovery flow</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-stone-700">
            <p>Request a reset email from the login page.</p>
            <p>Open the Supabase recovery link on the same browser.</p>
            <p>Set the new password on this screen.</p>
            <p>Return to `/login` and sign back into the application.</p>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
