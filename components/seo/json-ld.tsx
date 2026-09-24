import { PERSON_NAME } from "@/lib/page-metadata";
import { GITHUB_URL, INSTAGRAM_URL, SITE_URL } from "@/lib/site";

/** schema.org Person for the site owner, reused as author/provider. */
export const PERSON_SCHEMA = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: PERSON_NAME,
  url: SITE_URL,
  jobTitle: "QA Engineer & Drone Pilot",
  sameAs: ["https://www.linkedin.com/in/randymaulana/", INSTAGRAM_URL, GITHUB_URL],
};

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Security: JSON.stringify does not escape "</script>", so a value containing it
      // would break out of this script block. Escaping "<" to its JSON unicode form
      // keeps the payload valid JSON while making it inert in HTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
