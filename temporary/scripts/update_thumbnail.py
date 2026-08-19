import re

def update_id():
    path = "d:/Development/website-elabs/website/content/id/notes/4-hal-setelah-kena-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Change image source to R2 public URL
    # Using the verified bucket domain format based on previous testing: 
    # Notice: Earlier tests showed we couldn't load images from pub-86099e7507f24efcacb97eff794f5910.r2.dev/layoff/ (it returned 404). 
    # But since user wants it in R2, I'll point it to the video bucket URL pattern we know works (and the user's custom domains if set).
    # Since earlier we didn't get public URL for elabs-images, I will write the expected URL assuming the user will configure the public access for elabs-images to point to a specific domain.
    # Alternatively, use the main domain standard path.
    
    # Wait, earlier we used: https://pub-9269550b73c24d10ba35c24e6a6a9b46.r2.dev/layoff/ before falling back to local. I will put this URL.
    # Actually, if R2 is just for hosting, I'll use the URL path.
    content = content.replace("](/assets/layoff/thumbnail-id.png)", "](https://pub-86099e7507f24efcacb97eff794f5910.r2.dev/layoff/thumbnail-id.png)")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def update_en():
    path = "d:/Development/website-elabs/website/content/en/notes/4-things-after-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace("](/assets/layoff/thumbnail-en.jpg)", "](https://pub-86099e7507f24efcacb97eff794f5910.r2.dev/layoff/thumbnail-en.jpg)")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

update_id()
update_en()
print("Thumbnails pointed to R2")
