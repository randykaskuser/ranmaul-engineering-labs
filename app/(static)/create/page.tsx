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
            <li>Create a new row/page in the Notion database (use “New Article” template).</li>
            <li>Keep <code>Draft=true</code> while writing.</li>
            <li>Fill required metadata fields.</li>
            <li>When ready, set <code>Draft=false</code> (publish signal).</li>
            <li>Wait for GitHub Actions sync (or run it manually).</li>
          </ol>

          <h2>Required metadata (must be filled before publish)</h2>
          <ul>
            <li>Title, Description</li>
            <li>Locale: <code>en</code> | <code>id</code></li>
            <li>Domain: <code>qa</code> | <code>fpv</code> | <code>fishkeeping</code></li>
            <li>Slug (lowercase hyphen)</li>
            <li>CanonicalGroup</li>
            <li>Tags (non-empty)</li>
            <li>PublishedAt, UpdatedAt</li>
          </ul>

          <h2>Security model</h2>
          <ul>
            <li>Notion DB stays private (not publicly shared).</li>
            <li>Editors can create/edit drafts.</li>
            <li>Only reviewers/admins should set <code>Draft=false</code>.</li>
          </ul>

          <h2>Translation (EN/ID)</h2>
          <ul>
            <li>Make a separate Notion row for each locale.</li>
            <li>Use the same <code>CanonicalGroup</code> to pair translations.</li>
            <li>Use localized slugs per locale.</li>
          </ul>

          <p>
            Full reference: see <code>docs/notion-sync.md</code> in the repo.
          </p>
        </div>
      </div>
    </section>
  );
}
