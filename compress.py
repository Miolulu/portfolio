import os
from PIL import Image

ROOT = r"C:\Users\mio\WorkBuddy\2026-11-05-14-04-14\portfolio"
D = os.path.join(ROOT, "docs", "assets")
S = os.path.join(ROOT, "shots")

jobs = [
    # (src, dst, max_width, quality)
    (S + r"\docs\assets\ember\01-cover.png" if False else os.path.join(D, "ember", "01-cover.png"), "ember/01-cover.webp", 1600, 80),
    (os.path.join(D, "ember", "02-roles.png"), "ember/02-roles.webp", 1600, 80),
    (os.path.join(D, "ember", "03-reading.png"), "ember/03-reading.webp", 1600, 80),

    (os.path.join(D, "meow", "01-welcome.png"), "meow/01-welcome.webp", 1440, 80),
    (os.path.join(D, "meow", "02-forest.png"), "meow/02-forest.webp", 1440, 80),
    (os.path.join(D, "meow", "04-create.png"), "meow/03-create.webp", 1440, 80),

    (os.path.join(D, "zhanshen", "01-title.png"), "zhanshen/01-title.webp", 1440, 80),
    (os.path.join(D, "zhanshen", "02-floor.png"), "zhanshen/02-floor.webp", 1440, 80),
    (os.path.join(S, "zs-d0.png"), "zhanshen/03-story.webp", 1440, 80),
    (os.path.join(S, "zs-d2.png"), "zhanshen/04-combat.webp", 1440, 80),
    (os.path.join(S, "zs-archive.png"), "zhanshen/05-archive.webp", 1440, 80),
]

for src, rel, mw, q in jobs:
    if not os.path.exists(src):
        print("MISS", rel, src)
        continue
    im = Image.open(src).convert("RGB")
    if im.width > mw:
        im = im.resize((mw, round(im.height * mw / im.width)), Image.LANCZOS)
    dst = os.path.join(D, rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, "WEBP", quality=q, method=6)
    print(f"{rel:28s} {im.size[0]}x{im.size[1]}  {os.path.getsize(dst)//1024} KB")
