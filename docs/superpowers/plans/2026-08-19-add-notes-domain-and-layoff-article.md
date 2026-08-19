# Add `notes` Domain + Bilingual Layoff Article — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `notes` domain to the site taxonomy and publish a bilingual (ID + EN) practical guide article about post-layoff actions.

**Architecture:** The site uses a dynamic `[domain]` route param validated against a `DOMAINS` constant in `lib/content.ts`. Adding `"notes"` to that array makes all routes work automatically. Contracts must be updated first (they gate agent behavior), then code, then content.

**Tech Stack:** Next.js App Router, TypeScript, MDX content files, gray-matter frontmatter.

## Global Constraints

- Domain value is `"notes"` (lowercase, no other variants).
- All MDX frontmatter must follow the contract in `.clinerules/frontmatter-and-slug-contract.md`.
- Slugs must match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`.
- Both articles are `draft: true` — author reviews before publishing.
- EN article is independently written, not a literal translation of the ID article.
- Nav order: QA → FPV → Fishkeeping → Notes (last position).

---

### Task 1: Update contracts to allow `notes` domain

**Files:**
- Modify: `.clinerules/routing-and-taxonomy-contract.md:14,23-29`
- Modify: `.clinerules/frontmatter-and-slug-contract.md:37`
- Modify: `AGENTS.md:186,196`

**Interfaces:**
- Consumes: nothing
- Produces: Updated contracts that allow `notes` as a valid domain value. All downstream tasks depend on this.

- [ ] **Step 1: Update routing-and-taxonomy-contract.md**

In `.clinerules/routing-and-taxonomy-contract.md`, change line 14 from:

```
- `domain`: `qa` | `fpv` | `fishkeeping`
```

to:

```
- `domain`: `qa` | `fpv` | `fishkeeping` | `notes`
```

And change lines 23-29 from:

```markdown
Top-level domains are fixed to:

- `qa`
- `fpv`
- `fishkeeping`

No extra top-level categories.
```

to:

```markdown
Top-level domains are fixed to:

- `qa`
- `fpv`
- `fishkeeping`
- `notes`

New domains require explicit contract amendment.
```

- [ ] **Step 2: Update frontmatter-and-slug-contract.md**

In `.clinerules/frontmatter-and-slug-contract.md`, change line 37 from:

```
- `domain` (`qa` | `fpv` | `fishkeeping`)
```

to:

```
- `domain` (`qa` | `fpv` | `fishkeeping` | `notes`)
```

- [ ] **Step 3: Update AGENTS.md**

In `AGENTS.md`, find and replace both occurrences:

Line 186 — change:
```
- `domain`: `qa` | `fpv` | `fishkeeping`
```
to:
```
- `domain`: `qa` | `fpv` | `fishkeeping` | `notes`
```

Line 196 — change:
```
- `domain` (`qa` | `fpv` | `fishkeeping`)
```
to:
```
- `domain` (`qa` | `fpv` | `fishkeeping` | `notes`)
```

- [ ] **Step 4: Commit**

```bash
git add .clinerules/routing-and-taxonomy-contract.md .clinerules/frontmatter-and-slug-contract.md AGENTS.md
git commit -m "docs: add notes domain to routing and frontmatter contracts"
```

---

### Task 2: Update code to recognize `notes` domain

**Files:**
- Modify: `lib/content.ts:14`
- Modify: `lib/site.ts:10` (insert after fishkeeping nav link)
- Modify: `components/layout/site-header.tsx:17`
- Modify: `scripts/notion-sync.mjs:39,348,355`
- Modify: `app/(static)/create/page.tsx:46`

**Interfaces:**
- Consumes: Updated contracts from Task 1
- Produces: `"notes"` is a valid `Domain` type. Nav shows "Notes" link. Notion sync accepts `notes` domain.

- [ ] **Step 1: Add `"notes"` to DOMAINS in lib/content.ts**

In `lib/content.ts`, change line 14 from:

```typescript
export const DOMAINS = ["qa", "fpv", "fishkeeping"] as const;
```

to:

```typescript
export const DOMAINS = ["qa", "fpv", "fishkeeping", "notes"] as const;
```

- [ ] **Step 2: Add Notes nav link in lib/site.ts**

In `lib/site.ts`, insert a new entry after the Fishkeeping line (after line 10):

```typescript
  { href: "/notes", label: "Notes" },
```

The resulting `NAV_LINKS` array should have this order:
```typescript
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/qa", label: "QA Notes" },
  { href: "/fpv", label: "FPV Flights" },
  { href: "/fishkeeping", label: "Fishkeeping" },
  { href: "/notes", label: "Notes" },
  { href: "/drone-portfolio", label: "Drone Portfolio" },
  { href: "/projects", label: "Projects" },
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
```

- [ ] **Step 3: Add `/notes` to localizedDomains in site-header.tsx**

In `components/layout/site-header.tsx`, change line 17 from:

```typescript
  const localizedDomains = ["/qa", "/fpv", "/fishkeeping"];
```

to:

```typescript
  const localizedDomains = ["/qa", "/fpv", "/fishkeeping", "/notes"];
```

- [ ] **Step 4: Update DOMAINS in notion-sync.mjs**

In `scripts/notion-sync.mjs`, make three changes:

Line 39 — change:
```javascript
const DOMAINS = new Set(["qa", "fpv", "fishkeeping"]);
```
to:
```javascript
const DOMAINS = new Set(["qa", "fpv", "fishkeeping", "notes"]);
```

Line 348 (inside `buildAutoFillSystemPrompt`) — change:
```javascript
    "- domain (string; ONLY return 'qa', 'fpv', or 'fishkeeping' based on the topic. Omit if already provided by user)",
```
to:
```javascript
    "- domain (string; ONLY return 'qa', 'fpv', 'fishkeeping', or 'notes' based on the topic. Omit if already provided by user)",
```

Line 355 (inside `buildAutoFillSystemPrompt`) — change:
```javascript
    "- CanonicalGroup should start with the domain prefix (e.g. 'qa-...', 'fpv-...', 'fishkeeping-...').",
```
to:
```javascript
    "- CanonicalGroup should start with the domain prefix (e.g. 'qa-...', 'fpv-...', 'fishkeeping-...', 'notes-...').",
```

- [ ] **Step 5: Update domain list in create page**

In `app/(static)/create/page.tsx`, change line 46 from:

```tsx
              <strong>Domain</strong>: <code>qa</code> | <code>fpv</code> | <code>fishkeeping</code>
```

to:

```tsx
              <strong>Domain</strong>: <code>qa</code> | <code>fpv</code> | <code>fishkeeping</code> | <code>notes</code>
```

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts lib/site.ts components/layout/site-header.tsx scripts/notion-sync.mjs "app/(static)/create/page.tsx"
git commit -m "feat: add notes domain to DOMAINS, nav, header, notion-sync, and create page"
```

---

### Task 3: Create content directories and write ID article

**Files:**
- Create: `content/id/notes/4-hal-setelah-kena-layoff.mdx`
- Create: `content/en/notes/` (empty directory, needed for EN article in Task 4)

**Interfaces:**
- Consumes: `"notes"` is a valid domain (Task 2)
- Produces: ID article MDX file at `content/id/notes/4-hal-setelah-kena-layoff.mdx`

- [ ] **Step 1: Create content directories**

```bash
mkdir -p content/id/notes content/en/notes
```

- [ ] **Step 2: Write the Indonesian article MDX**

Create `content/id/notes/4-hal-setelah-kena-layoff.mdx` with the following content:

```mdx
---
title: "4 Hal yang Harus Kamu Lakukan Setelah Kena Layoff"
description: "Panduan praktis tentang hak dan dokumen yang harus segera kamu urus setelah terkena PHK — mulai dari JHT, JKP, BPJS Kesehatan, hingga paklaring."
locale: "id"
domain: "notes"
slug: "4-hal-setelah-kena-layoff"
canonicalGroup: "4-things-after-layoff"
publishedAt: "2026-08-19"
updatedAt: "2026-08-19"
tags: ["career", "layoff"]
featured: false
draft: true
---

Kena layoff biasanya datang dengan banyak hal yang harus dipikirkan sekaligus.

Hari ini mungkin kamu masih kerja seperti biasa. Besok, akses email kantor sudah ditutup, Slack sudah tidak bisa dibuka, dan kamu mulai mikir: setelah ini harus ngapain?

Wajar kalau hal pertama yang terpikir adalah langsung update CV, buka LinkedIn, lalu mulai apply kerja ke mana-mana.

Tapi sebelum itu, ada beberapa hal administratif yang sebaiknya kamu urus dulu. Beberapa di antaranya adalah hak yang bisa kamu klaim, dan beberapa lainnya akan jauh lebih sulit diurus setelah kamu kehilangan akses ke sistem perusahaan.

Berikut 4 hal yang menurut saya sebaiknya langsung kamu lakukan setelah kena layoff atau PHK.

## 1. Klaim JHT BPJS Ketenagakerjaan

Kalau hubungan kerjamu sudah resmi berakhir karena PHK, salah satu hal pertama yang bisa kamu cek adalah saldo Jaminan Hari Tua (JHT).

Sederhananya, JHT adalah manfaat dari iuran yang selama ini terkumpul selama kamu bekerja.

Peserta yang mengalami PHK termasuk dalam kategori yang dapat mengajukan klaim JHT, tentu dengan memenuhi dokumen dan ketentuan yang berlaku.

Sebelum mulai mengajukan, siapkan dulu dokumen-dokumen penting seperti:

- KTP
- Kartu BPJS Ketenagakerjaan, fisik atau digital
- Dokumen atau bukti PHK
- Rekening bank atas nama sendiri
- NPWP jika memang diwajibkan sesuai kondisi klaim

Detail dokumen bukti PHK dan prosedur klaim bisa berbeda tergantung kondisi kamu, jadi sebaiknya cek langsung ketentuan terbaru dari BPJS Ketenagakerjaan.

Yang perlu diingat: JHT dan JKP itu dua program yang berbeda. Jadi jangan mengira setelah klaim JHT, otomatis kamu sudah mengurus semua manfaat setelah terkena PHK.

## 2. Jangan Lewatkan Jaminan Kehilangan Pekerjaan (JKP)

Ini salah satu hal yang menurut saya masih banyak orang lewatkan setelah terkena PHK.

JKP bukan pesangon. Dan JKP juga bukan JHT.

Kalau kamu memenuhi syarat, JKP bisa menjadi semacam jaring pengaman sementara sambil mencari pekerjaan baru.

Manfaatnya meliputi:

- Uang tunai
- Akses informasi pasar kerja
- Pelatihan kerja

Salah satu syarat utamanya adalah memiliki masa iur JKP minimal 12 bulan dalam 24 bulan sebelum PHK. Peserta juga harus memiliki komitmen untuk kembali bekerja dan memenuhi persyaratan administrasi, termasuk bukti PHK.

Pengajuannya dilakukan melalui SIAPkerja.

Yang penting, jangan terlalu lama menunda. Berdasarkan prosedur BPJS Ketenagakerjaan, pengajuan manfaat pertama JKP dapat diajukan paling lambat 3 bulan setelah PHK. Manfaatnya sendiri dapat diberikan hingga maksimal 6 bulan, dengan aktivitas pencarian kerja dan ketentuan lanjutan yang perlu dipenuhi.

Jadi, setelah terkena PHK, jangan hanya bertanya:

"Saya dapat pesangon berapa?"

Cek juga:

"Saya memenuhi syarat JKP atau tidak?"

Karena ini adalah dua hal yang berbeda.

## 3. Pastikan BPJS Kesehatan Kamu Tetap Aktif

Ini juga jangan sampai terlewat.

Setelah PHK, jangan langsung berasumsi bahwa status BPJS Kesehatan kamu otomatis aman atau otomatis tidak aktif. Status dan kelanjutan perlindungan perlu dicek berdasarkan kondisi kepesertaan dan ketentuan yang berlaku untuk situasi kamu.

Jangan menunggu sampai kamu atau anggota keluarga membutuhkan layanan kesehatan baru kemudian menyadari ada masalah dengan status kepesertaan.

Yang bisa kamu lakukan:

- Cek status kepesertaan melalui Mobile JKN
- Pastikan anggota keluarga yang terdaftar juga ikut dicek
- Hubungi kanal resmi BPJS Kesehatan jika ada perubahan status
- Tanyakan secara langsung bagaimana kelanjutan kepesertaan kamu setelah PHK

Kalau sebelumnya kamu mendengar bahwa peserta yang terkena PHK bisa mendapatkan perlindungan selama periode tertentu, termasuk skema hingga 6 bulan dalam kondisi tertentu, jangan langsung menganggap aturan tersebut otomatis berlaku untuk semua orang. Pastikan dulu status dan kelayakan kamu ke BPJS Kesehatan berdasarkan kondisi kepesertaanmu.

Lebih baik cek sekarang daripada baru tahu kartunya tidak aktif ketika sedang dibutuhkan.

## 4. Minta Paklaring Sebelum Akses Perusahaan Ditutup

Ini kelihatannya sederhana, tapi menurut saya cukup penting.

Minta paklaring atau surat keterangan kerja sebelum akses kantor kamu benar-benar ditutup.

Setelah resmi keluar, biasanya kamu akan kehilangan akses ke:

- Email perusahaan
- HR portal
- Sistem internal
- Dokumen-dokumen pekerjaan

Dan setelah itu, mengurus dokumen yang tertinggal bisa jadi lebih ribet.

Paklaring bisa berguna untuk:

- Melamar pekerjaan baru
- Verifikasi pengalaman kerja
- Membuktikan periode masa kerja
- Keperluan administrasi tertentu

Pastikan informasi di dalamnya benar, terutama:

- Nama lengkap
- Nama perusahaan
- Jabatan
- Periode bekerja
- Tanggal terakhir bekerja

Selain paklaring, saya juga menyarankan untuk menyimpan salinan dokumen berikut sebelum akses perusahaan hilang:

- Surat PHK
- Kontrak atau perjanjian kerja
- Slip gaji terakhir
- Dokumen pesangon atau kompensasi
- Bukti kepesertaan BPJS
- Dokumen lain yang menurut kamu mungkin dibutuhkan di masa depan

Kalau bisa, simpan semuanya di email atau cloud pribadi.

Jangan hanya mengandalkan email kantor.

## Jangan Langsung Panik dan Apply ke 100 Perusahaan

Kena layoff memang bikin kita ingin langsung bergerak cepat.

Update LinkedIn. Update CV. Hubungi recruiter. Mulai apply kerja.

Semua itu penting.

Tapi menurut saya, ambil sedikit waktu untuk memastikan urusan yang satu ini sudah beres terlebih dahulu.

**Checklist sederhananya:**

- [ ] Cek dan urus klaim JHT BPJS Ketenagakerjaan
- [ ] Cek apakah kamu memenuhi syarat JKP
- [ ] Laporkan dan ajukan JKP jika memenuhi persyaratan
- [ ] Pastikan status BPJS Kesehatan kamu dan keluarga
- [ ] Minta paklaring
- [ ] Simpan surat PHK, kontrak, slip gaji, dan dokumen kompensasi
- [ ] Pastikan semua dokumen penting sudah tersimpan di akun pribadi

Layoff memang bisa mengakhiri satu pekerjaan.

Tapi beberapa hari atau minggu pertama setelahnya juga merupakan waktu penting untuk memastikan hak dan dokumen kamu tidak ada yang tertinggal.

Urus yang penting dulu.

Setelah itu, baru fokus ke langkah berikutnya: mencari pekerjaan baru dan bangkit lagi.

---

*Catatan: Ketentuan JHT, JKP, dan kelanjutan kepesertaan BPJS dapat berubah atau bergantung pada status masing-masing peserta. Sebelum mengajukan klaim, selalu cek informasi terbaru melalui kanal resmi BPJS Ketenagakerjaan dan BPJS Kesehatan.*
```

- [ ] **Step 3: Verify the frontmatter parses correctly**

Run: `node -e "const m = require('gray-matter'); const fs = require('fs'); const f = fs.readFileSync('content/id/notes/4-hal-setelah-kena-layoff.mdx','utf8'); const p = m(f); console.log(JSON.stringify(p.data, null, 2))"`

Expected: Valid JSON with all required fields, `domain: "notes"`, `locale: "id"`, `draft: true`.

- [ ] **Step 4: Commit**

```bash
git add content/id/notes/4-hal-setelah-kena-layoff.mdx
git commit -m "content: add ID layoff practical guide article (draft)"
```

---

### Task 4: Write EN article

**Files:**
- Create: `content/en/notes/4-things-after-layoff.mdx`

**Interfaces:**
- Consumes: `"notes"` is a valid domain (Task 2), `canonicalGroup: "4-things-after-layoff"` from Task 3
- Produces: EN article MDX file at `content/en/notes/4-things-after-layoff.mdx`, linked via same `canonicalGroup`

- [ ] **Step 1: Write the English article MDX**

Create `content/en/notes/4-things-after-layoff.mdx` with the following content:

```mdx
---
title: "4 Things You Must Do After Getting Laid Off"
description: "A practical checklist of rights and documents you should handle immediately after a layoff — from severance fund claims to employment certificates."
locale: "en"
domain: "notes"
slug: "4-things-after-layoff"
canonicalGroup: "4-things-after-layoff"
publishedAt: "2026-08-19"
updatedAt: "2026-08-19"
tags: ["career", "layoff"]
featured: false
draft: true
---

Getting laid off usually comes with a lot of things to think about all at once.

One day you're working as usual. The next, your company email is locked, Slack is gone, and you're left wondering: what do I do now?

The natural first instinct is to update your resume, open LinkedIn, and start applying everywhere.

But before you do that, there are a few administrative things you should handle first. Some are benefits you're entitled to claim. Others become significantly harder to deal with once you lose access to company systems.

Here are 4 things I recommend doing immediately after being laid off.

## 1. Check Your Severance or Retirement Fund Eligibility

If your employment has officially ended due to a layoff, one of the first things to check is whether you're eligible for any accumulated employment benefits or retirement savings.

In many countries, employers are required to contribute to some form of retirement or severance fund on your behalf during your employment. After a layoff, you may be able to claim these funds.

Before starting the claim process, gather key documents:

- Government-issued ID
- Employment benefit card or account number
- Proof of termination (layoff letter)
- Bank account in your name
- Tax identification number if required

The exact process and required documents vary by country and provider. Check with your local employment benefits agency for current procedures.

Important: retirement fund claims and unemployment insurance are typically two separate programs. Don't assume that claiming one automatically covers the other.

## 2. Don't Skip Unemployment Benefits

This is something I think many people overlook after a layoff.

Unemployment benefits are not severance pay. They're a separate program.

If you qualify, unemployment benefits can serve as a temporary safety net while you search for your next role.

Benefits typically include:

- Cash assistance for a limited period
- Job market information and placement services
- Skills training or retraining programs

Eligibility usually requires a minimum contribution period before the layoff. You'll also need to demonstrate active job-seeking and meet administrative requirements, including proof of involuntary termination.

Applications are typically filed through your government's labor or employment agency.

Don't wait too long. In most jurisdictions, there's a deadline for filing — often within 2-3 months of your last working day. Benefits may be available for up to 6 months, subject to ongoing requirements.

So after being laid off, don't just ask:

"How much severance am I getting?"

Also check:

"Do I qualify for unemployment benefits?"

These are two different things.

## 3. Make Sure Your Health Insurance Stays Active

Don't overlook this one.

After a layoff, don't assume your health insurance is automatically safe or automatically canceled. Your coverage status depends on your specific enrollment and the regulations in your jurisdiction.

Don't wait until you or a family member needs medical care to discover there's a problem with your coverage.

What you can do:

- Check your insurance status through your provider's app or portal
- Verify that family members on your plan are also covered
- Contact your insurance provider directly if your employment status changed
- Ask specifically how your coverage continues after termination

If you've heard that laid-off employees may receive continued coverage for a certain period, don't assume that applies universally. Confirm your specific eligibility and status directly with your provider.

Better to check now than to find out your coverage lapsed when you actually need it.

## 4. Get Your Employment Certificate Before Company Access Is Cut

This seems simple, but I think it's important enough to call out.

Request your employment certificate or reference letter before your company access is fully revoked.

After your last day, you'll typically lose access to:

- Company email
- HR portals
- Internal systems
- Work documents

And after that, getting documents you forgot to save becomes much harder.

An employment certificate is useful for:

- Applying to new positions
- Verifying work experience
- Proving your tenure at the company
- Various administrative purposes

Make sure the information is accurate, especially:

- Your full name
- Company name
- Job title
- Employment period
- Last working date

Beyond the employment certificate, I also recommend saving copies of:

- Your termination or layoff letter
- Employment contract or agreement
- Last pay stubs
- Severance or compensation documents
- Benefits enrollment records
- Any other documents you might need in the future

If possible, save everything to your personal email or cloud storage.

Don't rely solely on your company email.

## Don't Panic and Apply to 100 Companies

Getting laid off makes you want to move fast.

Update LinkedIn. Update your resume. Reach out to recruiters. Start applying.

All of that matters.

But I'd recommend taking a little time to make sure the administrative side is handled first.

**Simple checklist:**

- [ ] Check and claim your retirement or severance fund
- [ ] Check if you qualify for unemployment benefits
- [ ] File for unemployment benefits if eligible
- [ ] Verify your health insurance status for you and your family
- [ ] Request your employment certificate
- [ ] Save your layoff letter, contract, pay stubs, and compensation documents
- [ ] Make sure all important documents are stored in your personal accounts

A layoff ends one job.

But the first few days and weeks after are also critical for making sure none of your rights or documents fall through the cracks.

Handle the important stuff first.

Then focus on what's next: finding a new job and getting back on your feet.

---

*Note: Employment benefit regulations, unemployment insurance, and health coverage continuation rules vary by country and individual circumstances. Always check the latest information from your local employment and insurance agencies before filing claims.*
```

- [ ] **Step 2: Verify the frontmatter parses correctly**

Run: `node -e "const m = require('gray-matter'); const fs = require('fs'); const f = fs.readFileSync('content/en/notes/4-things-after-layoff.mdx','utf8'); const p = m(f); console.log(JSON.stringify(p.data, null, 2))"`

Expected: Valid JSON with all required fields, `domain: "notes"`, `locale: "en"`, `draft: true`, `canonicalGroup: "4-things-after-layoff"`.

- [ ] **Step 3: Commit**

```bash
git add content/en/notes/4-things-after-layoff.mdx
git commit -m "content: add EN layoff practical guide article (draft)"
```

---

### Task 5: Build verification

**Files:**
- No files modified

**Interfaces:**
- Consumes: All changes from Tasks 1-4
- Produces: Confirmed build success

- [ ] **Step 1: Run TypeScript type check**

Run: `npx tsc --noEmit`

Expected: No type errors. The `Domain` type now includes `"notes"`.

- [ ] **Step 2: Run Next.js build**

Run: `npm run build`

Expected: Build succeeds. Routes `/en/notes/4-things-after-layoff` and `/id/notes/4-hal-setelah-kena-layoff` should not error (articles are `draft: true` so they won't be publicly visible, but the build should not crash).

- [ ] **Step 3: Verify domain pages render**

Run the dev server: `npm run dev`

Navigate to:
- `http://localhost:3000/en/notes` — should render (may show empty or no articles since both are drafts)
- `http://localhost:3000/id/notes` — same

Verify:
- No console errors
- Nav shows "Notes" link in correct position (after Fishkeeping)
- Locale switcher works on `/en/notes` ↔ `/id/notes`

- [ ] **Step 4: Commit build verification result**

If any fixes were needed, commit them. Otherwise, no commit needed.
