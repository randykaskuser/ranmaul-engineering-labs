import type { ReactNode } from "react";

type Tone = "note" | "warning";

type Props = {
  tone: Tone;
  title?: string;
  children: ReactNode;
};

const toneLabel: Record<Tone, string> = {
  note: "Note",
  warning: "Warning",
};

export function Callout({ tone, title, children }: Props) {
  const label = title?.trim() ? title : toneLabel[tone];

  return (
    <aside className={`mdx-callout mdx-callout--${tone}`}>
      <div className="mdx-callout__title">{label}</div>
      <div className="mdx-callout__body">{children}</div>
    </aside>
  );
}

export function Note({ title, children }: Omit<Props, "tone">) {
  return (
    <Callout tone="note" title={title}>
      {children}
    </Callout>
  );
}

export function Warning({ title, children }: Omit<Props, "tone">) {
  return (
    <Callout tone="warning" title={title}>
      {children}
    </Callout>
  );
}
