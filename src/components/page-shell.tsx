import { ReactNode } from "react";
import { AuthStatus } from "@/components/auth/auth-status";
import { Navigation } from "@/components/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  cta?: ReactNode;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  cta,
  children,
}: PageShellProps) {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="app-shell-header rounded-[2rem] border border-white/55 bg-[linear-gradient(135deg,rgba(11,63,52,0.96),rgba(8,31,62,0.92))] px-6 py-6 text-white shadow-[0_20px_80px_rgba(15,23,42,0.2)] sm:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.34em] text-teal-100/80">
                  {eyebrow}
                </p>
                <h1 className="mt-3 text-4xl font-semibold leading-none tracking-[-0.04em] sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                  {description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                {cta}
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <ThemeToggle />
                  <AuthStatus />
                </div>
              </div>
            </div>
            <Navigation />
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
