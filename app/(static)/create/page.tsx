export default function CreateGuidePage() {
  return (
    <section className="section-space">
      <div className="container-reading">
        <header className="section-divider pb-8">
          <p className="type-kicker">Authoring</p>
          <h1 className="display-title mt-4 text-4xl text-ink md:text-6xl">Create & publish articles</h1>
          <p className="type-lede mt-5 max-w-[70ch]">
            Authoring is <span className="text-ink">Notion-first</span>. The website stays static and secure.
          </p>
        </header>

        <div className="article-prose mt-10">
          <h2>Workflow (quick)</h2>
          <ol>
            <li>
              Create a new row/page in the Notion database using the <strong>New Article</strong> template.
            </li>
            <li>
              Keep <code>Draft=true</code> while writing.
            </li>
            <li>
              Fill required metadata.
            </li>
            <li>
              Publish by setting <code>Draft=false</code> (or press the Notion <code>Publish</code> button if you use one).
            </li>
            <li>
              Wait for GitHub Actions sync (or run it manually).
            </li>
          </ol>

          <h2>Required metadata (before you publish)</h2>
          <p>This is the minimum contract for any page that has <code>Draft=false</code>:</p>
          <ul>
            <li>
              <strong>Title</strong>
            </li>
            <li>
              <strong>Description</strong> (1–2 sentences; metadata)
            </li>
            <li>
              <strong>Locale</strong>: <code>en</code> | <code>id</code>
            </li>
            <li>
              <strong>Domain</strong>: <code>qa</code> | <code>fpv</code> | <code>fishkeeping</code>
            </li>
            <li>
              <strong>Slug</strong> (lowercase hyphen)
            </li>
            <li>
              <strong>CanonicalGroup</strong> (stable ID shared across translations)
            </li>
            <li>
              <strong>Tags</strong> (must be non-empty)
            </li>
            <li>
              <strong>PublishedAt</strong>, <strong>UpdatedAt</strong>
            </li>
          </ul>

          <h2>Notion setup (recommended)</h2>
          <ul>
            <li>
              Use your <strong>existing Notion database</strong> (the one referenced by GitHub Actions secrets).
            </li>
            <li>
              Add a <strong>Database template</strong> named <strong>New Article</strong> (template ≠ row). Default:
              <code>Draft=true</code>.
            </li>
            <li>
              Create views: <strong>Draft Queue</strong>, <strong>Ready to Publish</strong>, <strong>Published</strong>.
            </li>
            <li>
              Optional: add a Notion <strong>Button</strong> property <code>Publish</code> that sets <code>Draft=false</code> and updates
              <code>UpdatedAt</code>.
            </li>
          </ul>

          <h2>Publishing safety</h2>
          <ul>
            <li>Keep the Notion DB private (not publicly shared).</li>
            <li>Editors can write drafts (<code>Draft=true</code>).</li>
            <li>
              Only reviewers/admins should be allowed to publish (<code>Draft=false</code> / press <code>Publish</code>).
            </li>
          </ul>

          <h2>Bilingual (EN/ID)</h2>
          <ul>
            <li>Make a separate Notion row for each locale.</li>
            <li>Use the same <code>CanonicalGroup</code> to pair translations.</li>
            <li>Use localized slugs per locale.</li>
          </ul>

          <h2>Full reference</h2>
          <p>
            See <code>docs/notion-sync.md</code> for the complete workflow, views, template, and troubleshooting.
          </p>
        </div>
      </div>
    </section>
  );
}
