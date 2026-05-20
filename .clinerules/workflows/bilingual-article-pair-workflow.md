# Bilingual article pairing (EN ↔ ID) (Workspace Workflow)

Use this when creating or maintaining bilingual equivalents.

## Steps

1. Decide the canonical concept (`canonicalGroup`).
2. Create EN + ID entries as independent localized writing.
3. Ensure both entries share the same `canonicalGroup`.
4. If one entry is derived from the other, set `translationOf` appropriately.
5. Add cross-locale links between equivalents (when available).
6. Verify both routes match the schema:
   - `/en/{domain}/{slug}`
   - `/id/{domain}/{slug}`
