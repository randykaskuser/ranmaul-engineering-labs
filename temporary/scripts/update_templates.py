import re

def update_id():
    path = "d:/Development/website-elabs/website/content/id/notes/4-hal-setelah-kena-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_tldr_id = """Berikut 4 hal yang menurut saya sebaiknya langsung kamu lakukan setelah kena layoff atau PHK.

## TL;DR: Action Items Cepat

Buru-buru? Ini ringkasan langkah dan *link* yang langsung bisa kamu eksekusi:

1. **Minta Paklaring (Surat Keterangan Kerja)**
   Segera *request* ke HR sebelum akses email diputus.
   <details>
   <summary>📄 Lihat Template Email Request Paklaring</summary>
   
   ```text
   Subject: Request for Service Certificate (Paklaring) - [Your Name] - [Employee ID]

   Dear HR Team,

   I hope this email finds you well.

   My name is [Your Name], and my employment with [Company Name] recently ended, with my last working day being [Last Working Day].

   I am writing to formally request my Service Certificate (Paklaring) and any other related employment documents for my administrative records and future career purposes.

   Please find my details for your reference:

   Full Name: [Your Name]
   Employee ID: [Employee ID]
   Department/Role: [Your Role]
   Last Working Day: [Last Working Day]
   Personal Email: [Your Personal Email]

   Thank you for your assistance and for the opportunities I had during my time at [Company Name].

   Best regards,

   [Your Name]
   ```
   </details>

2. **Klaim JKP (Jaminan Kehilangan Pekerjaan)**
   Klaim via portal [SIAPkerja](https://siapkerja.kemnaker.go.id/). Kamu butuh 3 dokumen syarat tambahan dari perusahaan.
   <details>
   <summary>📄 Lihat Template Email Request Syarat JKP</summary>
   
   ```text
   Subject: Request for PHK Documents Required for BPJS Ketenagakerjaan (JKP) Claim

   Dear HR Team,

   I hope you are doing well.

   I would like to request copies of the following documents related to the termination of my employment with [Company Name]:

   1. Notification of Employment Termination / Pemberitahuan dan Tanggapan PHK
   2. Acknowledgement Receipt of the Employment Termination Report / Tanda Terima Laporan PHK
   3. Employment Termination Report / Laporan PHK

   These documents are required as part of the administrative process for my JKP claim.

   Please let me know if any additional information or verification is required from my side to process this request.

   Thank you for your assistance. I look forward to your response.

   Best regards,

   [Your Name]
   [Your Title]
   Employee ID: [Employee ID]
   Phone: [Your Phone Number]
   ```
   </details>

3. **Amankan Status BPJS Kesehatan**
   Ganti status dari tanggungan perusahaan menjadi mandiri/peserta PHK (gratis 6 bulan). Lakukan via aplikasi **Mobile JKN** (menu *Pengaduan Layanan*) atau chat langsung ke **[WhatsApp PANDAWA BPJS Kesehatan](https://wa.me/628118165165)**.

4. **Klaim JHT (Jaminan Hari Tua) BPJS Ketenagakerjaan**
   Pencairan bisa dilakukan H+1 bulan setelah non-aktif. Langsung proses via aplikasi **JMO** (Menu: *Jaminan Hari Tua* -> *Klaim Manfaat JHT*) atau via web [Lapak Asik](https://lapakasik.bpjsketenagakerjaan.go.id/Klaim).

---"""

    content = re.sub(r'Berikut 4 hal yang menurut saya sebaiknya langsung kamu lakukan setelah kena layoff atau PHK\.\n\n## TL;DR: Action Items Cepat.*?---\n', new_tldr_id, content, flags=re.DOTALL)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def update_en():
    path = "d:/Development/website-elabs/website/content/en/notes/4-things-after-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_tldr_en = """Here are 4 things I recommend doing immediately after being laid off.

## TL;DR: Quick Action Items

Short on time? Here is the exact checklist and links you need right now:

1. **Request Your Employment Certificate (Paklaring)**
   Do this before you lose access to your company email.
   <details>
   <summary>📄 View Email Template</summary>
   
   ```text
   Subject: Request for Service Certificate (Paklaring) - [Your Name] - [Employee ID]

   Dear HR Team,

   I hope this email finds you well.

   My name is [Your Name], and my employment with [Company Name] recently ended, with my last working day being [Last Working Day].

   I am writing to formally request my Service Certificate (Paklaring) and any other related employment documents for my administrative records and future career purposes.

   Please find my details for your reference:

   Full Name: [Your Name]
   Employee ID: [Employee ID]
   Department/Role: [Your Role]
   Last Working Day: [Last Working Day]
   Personal Email: [Your Personal Email]

   Thank you for your assistance and for the opportunities I had during my time at [Company Name].

   Best regards,

   [Your Name]
   ```
   </details>

2. **Claim Unemployment Benefits (JKP)**
   Apply via [SIAPkerja](https://siapkerja.kemnaker.go.id/) (for Indonesia). You will need specific termination reporting documents from your HR.
   <details>
   <summary>📄 View Email Template to HR</summary>
   
   ```text
   Subject: Request for PHK Documents Required for BPJS Ketenagakerjaan (JKP) Claim

   Dear HR Team,

   I hope you are doing well.

   I would like to request copies of the following documents related to the termination of my employment with [Company Name]:

   1. Notification of Employment Termination / Pemberitahuan dan Tanggapan PHK
   2. Acknowledgement Receipt of the Employment Termination Report / Tanda Terima Laporan PHK
   3. Employment Termination Report / Laporan PHK

   These documents are required as part of the administrative process for my JKP claim.

   Please let me know if any additional information or verification is required from my side to process this request.

   Thank you for your assistance. I look forward to your response.

   Best regards,

   [Your Name]
   [Your Title]
   Employee ID: [Employee ID]
   Phone: [Your Phone Number]
   ```
   </details>

3. **Secure Your Health Insurance (BPJS Kesehatan)**
   Ensure you get your 6-month free coverage. Update your status via the **Mobile JKN** app (Customer Service menu) or chat directly with **[BPJS Health Official WhatsApp](https://wa.me/628118165165)**.

4. **Claim Your Severance Fund (JHT BPJS Ketenagakerjaan)**
   Available 1 month after your active status ends. Claim via the **JMO App** (Menu: *Jaminan Hari Tua* -> *Klaim Manfaat JHT*) or the [Lapak Asik portal](https://lapakasik.bpjsketenagakerjaan.go.id/Klaim).

---"""

    content = re.sub(r'Here are 4 things I recommend doing immediately after being laid off\.\n\n## TL;DR: Quick Action Items.*?---\n', new_tldr_en, content, flags=re.DOTALL)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

update_id()
update_en()
print("Templates replaced")
