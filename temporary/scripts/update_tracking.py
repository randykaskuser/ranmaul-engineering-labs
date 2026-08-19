import re

def update_id():
    path = "d:/Development/website-elabs/website/content/id/notes/4-hal-setelah-kena-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_jht = """![Email Konfirmasi Wawancara BPJS Ketenagakerjaan](/assets/layoff/email-wawancara.jpeg)

Pada hari yang sudah dijadwalkan, petugas BPJS Ketenagakerjaan akan menghubungi kamu via WhatsApp untuk verifikasi data dan dokumen. Pastikan kamu sudah menyiapkan dokumen fisik/asli yang diminta.

![Pesan WA dari Petugas BPJS Ketenagakerjaan](/assets/layoff/wa-petugas.jpeg)"""

    content = re.sub(r'!\[Email Konfirmasi Wawancara BPJS Ketenagakerjaan\]\(https://pub-9269550b73c24d10ba35c24e6a6a9b46\.r2\.dev/layoff/email-wawancara\.jpeg\).*?!\[Pesan WA dari Petugas BPJS Ketenagakerjaan\]\(https://pub-9269550b73c24d10ba35c24e6a6a9b46\.r2\.dev/layoff/wa-petugas\.jpeg\)', new_jht, content, flags=re.DOTALL)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def update_en():
    path = "d:/Development/website-elabs/website/content/en/notes/4-things-after-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_jht = """![BPJS Ketenagakerjaan Interview Confirmation Email](/assets/layoff/email-wawancara.jpeg)

On the scheduled day, a BPJS officer will contact you via WhatsApp to verify your data and documents. Ensure you have the original physical documents ready.

![WhatsApp Message from BPJS Officer](/assets/layoff/wa-petugas.jpeg)"""

    content = re.sub(r'!\[BPJS Ketenagakerjaan Interview Confirmation Email\]\(https://pub-9269550b73c24d10ba35c24e6a6a9b46\.r2\.dev/layoff/email-wawancara\.jpeg\).*?!\[WhatsApp Message from BPJS Officer\]\(https://pub-9269550b73c24d10ba35c24e6a6a9b46\.r2\.dev/layoff/wa-petugas\.jpeg\)', new_jht, content, flags=re.DOTALL)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

update_id()
update_en()
print("Images switched to local assets")
