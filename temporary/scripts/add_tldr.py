import re

def update_id():
    path = "d:/Development/website-elabs/website/content/id/notes/4-hal-setelah-kena-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    tldr_id = """Berikut 4 hal yang menurut saya sebaiknya langsung kamu lakukan setelah kena layoff atau PHK.

## TL;DR: Action Items Cepat

Buru-buru? Ini ringkasan langkah dan *link* yang langsung bisa kamu eksekusi:

1. **Minta Paklaring (Surat Keterangan Kerja)**
   Segera *request* ke HR sebelum akses email diputus.
   <details>
   <summary>📄 Lihat Template Email Request Paklaring</summary>
   
   ```text
   Subject: Permohonan Surat Keterangan Kerja (Paklaring) - [Nama Lengkap]
   
   Halo Tim HR,
   
   Sehubungan dengan berakhirnya masa kerja saya pada [Tanggal Terakhir Kerja], saya ingin memohon bantuan untuk menerbitkan Surat Keterangan Kerja (Paklaring).
   
   Mohon agar surat tersebut mencantumkan nama lengkap, nomor KTP, posisi terakhir, serta masa kerja saya. Jika memungkinkan, mohon kirimkan softcopy ke email pribadi saya di [Alamat Email Pribadi].
   
   Terima kasih banyak atas bantuannya.
   
   Salam,
   [Nama Lengkap]
   ```
   </details>

2. **Klaim JKP (Jaminan Kehilangan Pekerjaan)**
   Klaim via portal [SIAPkerja](https://siapkerja.kemnaker.go.id/). Kamu butuh 3 dokumen syarat tambahan dari perusahaan.
   <details>
   <summary>📄 Lihat Template Email Request Syarat JKP</summary>
   
   ```text
   Subject: Permohonan Dokumen Persyaratan Klaim JKP - [Nama Lengkap]
   
   Halo Tim HR,
   
   Untuk keperluan klaim Jaminan Kehilangan Pekerjaan (JKP), saya membutuhkan beberapa dokumen kelengkapan pelaporan PHK dari perusahaan, yaitu:
   1. Surat Pemberitahuan dan Tanggapan PHK
   2. Tanda Terima Laporan PHK dari instansi terkait
   3. Dokumen Laporan PHK
   
   Mohon bantuannya untuk dapat membagikan salinan (softcopy) dari ketiga dokumen tersebut ke email pribadi saya.
   
   Terima kasih atas bantuan dan kerja samanya.
   
   Salam,
   [Nama Lengkap]
   ```
   </details>

3. **Amankan Status BPJS Kesehatan**
   Ganti status dari tanggungan perusahaan menjadi mandiri/peserta PHK (gratis 6 bulan). Lakukan via aplikasi **Mobile JKN** (menu *Pengaduan Layanan*) atau chat langsung ke **[WhatsApp PANDAWA BPJS Kesehatan](https://wa.me/628118165165)**.

4. **Klaim JHT (Jaminan Hari Tua) BPJS Ketenagakerjaan**
   Pencairan bisa dilakukan H+1 bulan setelah non-aktif. Langsung proses via aplikasi **JMO** (Menu: *Jaminan Hari Tua* -> *Klaim Manfaat JHT*) atau via web [Lapak Asik](https://lapakasik.bpjsketenagakerjaan.go.id/Klaim).

---
"""
    
    content = content.replace("Berikut 4 hal yang menurut saya sebaiknya langsung kamu lakukan setelah kena layoff atau PHK.", tldr_id)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def update_en():
    path = "d:/Development/website-elabs/website/content/en/notes/4-things-after-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    tldr_en = """Here are 4 things I recommend doing immediately after being laid off.

## TL;DR: Quick Action Items

Short on time? Here is the exact checklist and links you need right now:

1. **Request Your Employment Certificate (Paklaring)**
   Do this before you lose access to your company email.
   <details>
   <summary>📄 View Email Template</summary>
   
   ```text
   Subject: Request for Employment Certificate - [Your Name]
   
   Hi HR Team,
   
   Following the end of my employment on [Last Working Date], I would like to request my official Employment Certificate (Paklaring).
   
   Please ensure the document includes my full name, ID number, final job title, and employment period. If possible, please send the digital copy to my personal email at [Personal Email Address].
   
   Thank you for your assistance.
   
   Best regards,
   [Your Name]
   ```
   </details>

2. **Claim Unemployment Benefits (JKP)**
   Apply via [SIAPkerja](https://siapkerja.kemnaker.go.id/) (for Indonesia). You will need specific termination reporting documents from your HR.
   <details>
   <summary>📄 View Email Template to HR</summary>
   
   ```text
   Subject: Request for JKP Claim Required Documents - [Your Name]
   
   Hi HR Team,
   
   To process my JKP (Unemployment Benefit) claim, I need copies of the official termination reporting documents, specifically:
   1. Notice of Termination and Response (Surat Pemberitahuan & Tanggapan PHK)
   2. Receipt of Termination Report (Tanda Terima Laporan PHK)
   3. Official Termination Report (Laporan PHK)
   
   Could you please provide the digital copies of these documents to my personal email?
   
   Thank you for your help.
   
   Best regards,
   [Your Name]
   ```
   </details>

3. **Secure Your Health Insurance (BPJS Kesehatan)**
   Ensure you get your 6-month free coverage. Update your status via the **Mobile JKN** app (Customer Service menu) or chat directly with **[BPJS Health Official WhatsApp](https://wa.me/628118165165)**.

4. **Claim Your Severance Fund (JHT BPJS Ketenagakerjaan)**
   Available 1 month after your active status ends. Claim via the **JMO App** (Menu: *Jaminan Hari Tua* -> *Klaim Manfaat JHT*) or the [Lapak Asik portal](https://lapakasik.bpjsketenagakerjaan.go.id/Klaim).

---
"""
    
    content = content.replace("Here are 4 things I recommend doing immediately after being laid off.", tldr_en)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

update_id()
update_en()
print("TLDR added")
