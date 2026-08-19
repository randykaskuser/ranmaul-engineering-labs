import re

def update_id():
    path = "d:/Development/website-elabs/website/content/id/notes/4-hal-setelah-kena-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Use the local assets directory instead since R2 bucket public access domain is unknown
    content = content.replace("](https://pub-86099e7507f24efcacb97eff794f5910.r2.dev/layoff/thumbnail-id.png)", "](/assets/layoff/thumbnail-id.png)")
    content = content.replace("](/assets/layoff/email-wawancara.jpeg)", "](/assets/layoff/email-wawancara.jpeg)")
    content = content.replace("](/assets/layoff/wa-petugas.jpeg)", "](/assets/layoff/wa-petugas.jpeg)")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def update_en():
    path = "d:/Development/website-elabs/website/content/en/notes/4-things-after-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace("](https://pub-86099e7507f24efcacb97eff794f5910.r2.dev/layoff/thumbnail-en.jpg)", "](/assets/layoff/thumbnail-en.jpg)")
    content = content.replace("](/assets/layoff/email-wawancara.jpeg)", "](/assets/layoff/email-wawancara.jpeg)")
    content = content.replace("](/assets/layoff/wa-petugas.jpeg)", "](/assets/layoff/wa-petugas.jpeg)")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

update_id()
update_en()
print("Links reverted to local")
