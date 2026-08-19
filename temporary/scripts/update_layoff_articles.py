import re

def update_id():
    path = "d:/Development/website-elabs/website/content/id/notes/4-hal-setelah-kena-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Update section 3 (BPJS Kesehatan)
    kesehatan_replacement = """## 3. Pastikan BPJS Kesehatan Kamu Tetap Aktif

Ini juga jangan sampai terlewat. Setelah PHK, pastikan status kepesertaan BPJS Kesehatan kamu.

Berdasarkan aturan yang berlaku saat ini, pekerja yang terkena PHK **masih bisa menggunakan fasilitas BPJS Kesehatan selama 6 bulan secara gratis** tanpa perlu membayar iuran. Syaratnya, kamu memenuhi ketentuan dan pihak perusahaan sudah melaporkan pemutusan hubungan kerja tersebut ke pihak BPJS.

Namun, jangan langsung berasumsi statusmu otomatis aman. Yang bisa kamu lakukan:

- Cek status kepesertaan melalui aplikasi Mobile JKN.
- Pastikan anggota keluarga yang terdaftar juga tetap berstatus aktif.
- Jika status berubah menjadi non-aktif atau ditangguhkan, segera hubungi kanal resmi BPJS Kesehatan atau pastikan ke HRD perusahaan lama apakah laporan PHK sudah diproses.

Lebih baik cek sekarang daripada baru tahu kartunya tidak aktif ketika sedang dibutuhkan."""
    
    content = re.sub(r'## 3\. Pastikan BPJS Kesehatan Kamu Tetap Aktif.*?Lebih baik cek sekarang daripada baru tahu kartunya tidak aktif ketika sedang dibutuhkan\.', kesehatan_replacement, content, flags=re.DOTALL)

    # Append related links
    related_links = """---

### Referensi Tambahan

- [Korban PHK Masih Bisa Gunakan BPJS Kesehatan Selama 6 Bulan Gratis](https://www.kompas.com/tren/read/2026/05/21/200000665/korban-phk-masih-bisa-gunakan-bpjs-kesehatan-selama-6-bulan-gratis-ini?page=all)
- [Pemerintah Optimalkan Perlindungan Pekerja Lewat PP JKP & JKK](https://www.bpjsketenagakerjaan.go.id/berita/29344/Pemerintah-Optimalkan-Perlindungan-Pekerja-Lewat-PP-JKP-%26-JKK?utm_source=chatgpt.com)
- [PP No 6 Tahun 2025 tentang Penyelenggaraan Program Jaminan Kehilangan Pekerjaan](https://peraturan.bpk.go.id/Details/314623/pp-no-6-tahun-2025?utm_source=chatgpt.com)

*Catatan:"""
    content = content.replace("---\n\n*Catatan:", related_links)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def update_en():
    path = "d:/Development/website-elabs/website/content/en/notes/4-things-after-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Update section 3 (Health Insurance)
    health_replacement = """## 3. Make Sure Your Health Insurance Stays Active

Don't overlook this one. After a layoff, confirm the status of your health coverage immediately.

Depending on your jurisdiction, you may have specific protections. For example, in some systems (like Indonesia's BPJS Kesehatan), laid-off workers can **continue using their health insurance for up to 6 months for free**, provided their former employer has properly reported the termination. Other countries have systems like COBRA, which allow you to keep your plan by paying the premium yourself.

However, never assume your coverage is automatically active. What you can do:

- Check your insurance status through your provider's app or portal.
- Verify that family members on your plan are also still covered.
- If your status shows as inactive, contact your provider or your former employer's HR to ensure the layoff was properly reported.

Better to check now than to find out your coverage lapsed when you actually need it."""
    
    content = re.sub(r'## 3\. Make Sure Your Health Insurance Stays Active.*?Better to check now than to find out your coverage lapsed when you actually need it\.', health_replacement, content, flags=re.DOTALL)

    # Append related links
    related_links = """---

### Related References (Indonesian Guidelines)

- [BPJS Kesehatan: 6-Month Free Coverage for Layoff Victims](https://www.kompas.com/tren/read/2026/05/21/200000665/korban-phk-masih-bisa-gunakan-bpjs-kesehatan-selama-6-bulan-gratis-ini?page=all)
- [Government Optimizes Worker Protection via JKP & JKK](https://www.bpjsketenagakerjaan.go.id/berita/29344/Pemerintah-Optimalkan-Perlindungan-Pekerja-Lewat-PP-JKP-%26-JKK?utm_source=chatgpt.com)
- [Government Regulation (PP) No 6 Year 2025 on JKP](https://peraturan.bpk.go.id/Details/314623/pp-no-6-tahun-2025?utm_source=chatgpt.com)

*Note:"""
    content = content.replace("---\n\n*Note:", related_links)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

update_id()
update_en()
print("Done updating")
