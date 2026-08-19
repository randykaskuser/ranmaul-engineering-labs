import re

def update_id():
    path = "d:/Development/website-elabs/website/content/id/notes/4-hal-setelah-kena-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add coverImage to frontmatter
    replacement = "featured: false\ndraft: false\ncoverImage: \"/assets/layoff/thumbnail-id.png\""
    content = re.sub(r'featured: false\ndraft: false', replacement, content)
    
    # Remove the embedded image from the content body
    content = re.sub(r'!\[4 Hal Setelah Kena Layoff Thumbnail\]\(/assets/layoff/thumbnail-id\.png\)\n\n', '', content)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def update_en():
    path = "d:/Development/website-elabs/website/content/en/notes/4-things-after-layoff.mdx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add coverImage to frontmatter
    replacement = "featured: false\ndraft: false\ncoverImage: \"/assets/layoff/thumbnail-en.jpg\""
    content = re.sub(r'featured: false\ndraft: false', replacement, content)
    
    # Remove the embedded image from the content body
    content = re.sub(r'!\[4 Things After Getting Laid Off Thumbnail\]\(/assets/layoff/thumbnail-en\.jpg\)\n\n', '', content)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

update_id()
update_en()
print("Frontmatter updated with coverImage")
