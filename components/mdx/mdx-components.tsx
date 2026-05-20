import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import Link from "next/link";
import Image from "next/image";

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
  h2: (props) => <h2 {...props} className={["mt-12", props.className ?? ""].join(" ")} />,
  h3: (props) => <h3 {...props} className={["mt-10", props.className ?? ""].join(" ")} />,
  pre: (props) => <pre {...props} className={["not-prose", props.className ?? ""].join(" ")} />,
};
