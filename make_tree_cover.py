import os
from PIL import Image, ImageDraw, ImageFilter

SRC = r"C:\Users\mio\WorkBuddy\2026-11-05-14-04-14\treewhisper-showcase\img"
DST = r"C:\Users\mio\WorkBuddy\2026-11-05-14-04-14\portfolio\docs\assets\tree"
os.makedirs(DST, exist_ok=True)

W, H = 1600, 1000
base = Image.new("RGB", (W, H), "#e9e3d6")
d = ImageDraw.Draw(base)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=(int(236 - 16 * t), int(230 - 18 * t), int(217 - 20 * t)))

PH = 780
items = [("01-tree-home.png", 118, 108), ("04-bottles.png", 604, 78), ("05-spirit.png", 1090, 112)]

canvas = base.convert("RGBA")
for name, x, y in items:
    im = Image.open(os.path.join(SRC, name)).convert("RGB")
    w = round(im.width * PH / im.height)
    im = im.resize((w, PH), Image.LANCZOS)

    pad = 6
    frame = Image.new("RGBA", (w + pad * 2, PH + pad * 2), (255, 255, 255, 255))
    frame.paste(im, (pad, pad))
    mask = Image.new("L", frame.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, frame.size[0] - 1, frame.size[1] - 1], 22, fill=255)

    # 阴影
    shadow = Image.new("RGBA", (frame.size[0] + 80, frame.size[1] + 80), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [40, 46, 40 + frame.size[0], 46 + frame.size[1]], 22, fill=(66, 55, 42, 105)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas.alpha_composite(shadow, (x - 40, y - 34))
    canvas.alpha_composite(frame, (x, y))

canvas.convert("RGB").save(os.path.join(DST, "01-cover.webp"), "WEBP", quality=84, method=6)
print("cover", os.path.getsize(os.path.join(DST, "01-cover.webp")) // 1024, "KB")

for src, out in [("01-tree-home.png", "02-home.webp"), ("04-bottles.png", "03-bottles.webp"), ("05-spirit.png", "04-spirit.webp")]:
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    im = im.resize((760, round(im.height * 760 / im.width)), Image.LANCZOS)
    im.save(os.path.join(DST, out), "WEBP", quality=82, method=6)
    print(out, os.path.getsize(os.path.join(DST, out)) // 1024, "KB")
