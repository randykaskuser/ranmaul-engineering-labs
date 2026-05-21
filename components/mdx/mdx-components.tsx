import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import Link from "next/link";
import Image from "next/image";
import { Note, Warning } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";

function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type NodeLike =
  | string
  | number
  | boolean
  | null
  | undefined
  | NodeLike[]
  | {
      props?: {
        children?: NodeLike;
      };
    };

function getTextContent(node: NodeLike): string {
  if (node === null || node === undefined) {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (typeof node === "boolean") {
    return "";
  }
  if (Array.isArray(node)) {
    return node.map((child) => getTextContent(child)).join("");
  }

  // React element-like
  if (typeof node === "object" && node.props) {
    return getTextContent(node.props.children);
  }

  return "";
}

type HeadingProps = ComponentProps<"h2">;

function MdxHeading({ children, className, ...props }: HeadingProps) {
  const text = getTextContent(children as NodeLike);
  const id = props.id ?? slugifyHeading(text);

  return (
    <h2 {...props} id={id} className={["mdx-heading", className ?? ""].join(" ")}>
      <a className="mdx-anchor" href={`#${id}`} aria-label={`Link to section: ${text}`}>
        #
      </a>
      {children}
    </h2>
  );
}

type Heading3Props = ComponentProps<"h3">;

function MdxHeading3({ children, className, ...props }: Heading3Props) {
  const text = getTextContent(children as NodeLike);
  const id = props.id ?? slugifyHeading(text);

  return (
    <h3 {...props} id={id} className={["mdx-heading", className ?? ""].join(" ")}>
      <a className="mdx-anchor" href={`#${id}`} aria-label={`Link to section: ${text}`}>
        #
      </a>
      {children}
    </h3>
  );
}

type AnchorProps = ComponentProps<"a">;

function SmartLink({ href, children, ...props }: AnchorProps) {
  const raw = typeof href === "string" ? href : "";

  if (raw.startsWith("/")) {
    return (
      <Link href={raw} className="underline underline-offset-4">
        {children}
      </Link>
    );
  }

  return (
    <a
      href={raw}
      className="underline underline-offset-4"
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}

type ImgProps = ComponentProps<"img">;

function MdxImage({ src, alt, width, height, ...props }: ImgProps) {
  const safeSrc = typeof src === "string" ? src : "";

  if (!safeSrc.startsWith("/")) {
    // External images are intentionally not optimized yet.
    // Keep output minimal to avoid Next/Image remotePatterns config.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={safeSrc} alt={alt ?? ""} {...props} />;
  }

  const w = typeof width === "number" ? width : 1600;
  const h = typeof height === "number" ? height : 900;

  return (
    <Image
      src={safeSrc}
      alt={alt ?? ""}
      width={w}
      height={h}
      className="h-auto w-full"
      sizes="(min-width: 1024px) 900px, 100vw"
      style={{ objectFit: "cover" }}
    />
  );
}

export const mdxComponents: MDXComponents = {
  a: SmartLink,
  img: MdxImage,
  h2: (props) => <MdxHeading {...props} className={["mt-12", props.className ?? ""].join(" ")} />,
  h3: (props) => <MdxHeading3 {...props} className={["mt-10", props.className ?? ""].join(" ")} />,
  pre: (props) => <CodeBlock {...props} />,
  table: (props) => (
    <div className="not-prose overflow-x-auto rounded-2xl border border-hairline">
      <table {...props} />
    </div>
  ),
  Note,
  Warning,
};
