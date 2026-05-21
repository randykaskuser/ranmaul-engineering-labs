import type { ComponentProps, ReactNode } from "react";

type PreProps = ComponentProps<"pre">;

function getLanguageFromClassName(className?: string): string | null {
  const raw = className ?? "";
  const match = raw.match(/language-([a-z0-9+-]+)/i);
  return match?.[1] ?? null;
}

function getTextContent(node: ReactNode): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");

  if (typeof node === "object" && node) {
    const maybe = node as { props?: { children?: ReactNode } };
    if (maybe.props) {
      return getTextContent(maybe.props.children);
    }
  }
  return "";
}

export function CodeBlock({ children, className, ...props }: PreProps) {
  const lang = getLanguageFromClassName(className);
  const code = getTextContent(children);
  const hasContent = code.trim().length > 0;

  return (
    <figure className="mdx-codeblock not-prose">
      <div className="mdx-codeblock__bar">
        <div className="mdx-codeblock__meta">
          <span className="mdx-codeblock__lang">{lang ?? "code"}</span>
        </div>
        <button
          type="button"
          className="mdx-codeblock__copy"
          data-copy={hasContent ? code : ""}
          aria-label="Copy code"
          disabled
          title="Copy support can be enabled later via a small client enhancement"
        >
          Copy
        </button>
      </div>
      <pre {...props} className={className}>
        {children}
      </pre>
    </figure>
  );
}
