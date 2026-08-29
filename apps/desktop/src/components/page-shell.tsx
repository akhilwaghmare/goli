import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, actions, children }: PageShellProps) {
  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {actions}
      </header>
      {children}
    </section>
  );
}
