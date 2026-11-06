# -*- coding: utf-8 -*-
"""把各项目截图统一装框：网页/游戏做成圆角屏幕卡，手机截图装进机身。输出 2x webp。"""
import os
from PIL import Image, ImageDraw, ImageFilter

HD = r"C:\Users\mio\WorkBuddy\2026-11-05-14-04-14\portfolio\shots\hd"
ORIG = r"C:\Users\mio\WorkBuddy\2026-11-05-14-04-14\portfolio\shots\originals"
OUT = r"C:\Users\mio\WorkBuddy\2026-11-05-14-04-14\portfolio\docs\assets\hd"
os.makedirs(OUT, exist_ok=True)

SS = 2  # 超采样倍数，避免圆角锯齿


def rounded_mask(size, radius, ss=SS):
    w, h = size
    m = Image.new("L", (w * ss, h * ss), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w * ss - 1, h * ss - 1], radius=radius * ss, fill=255)
    return m.resize((w, h), Image.LANCZOS)


def drop_shadow(mask, blur=34, dy=20, opacity=90):
    pad = blur * 2
    sh = Image.new("L", (mask.width + pad * 2, mask.height + pad * 2), 0)
    sh.paste(mask, (pad, pad))
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    sh = sh.point(lambda v: int(v * opacity / 255))
    return sh, pad


def screen_card(src, radius=22, border=(0, 0, 0, 26), out_name=None, max_w=2400):
    img = Image.open(src).convert("RGB")
    if img.width > max_w:
        img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
    w, h = img.size
    mask = rounded_mask((w, h), radius)

    body = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    body.paste(img, (0, 0), mask)

    # 1px 内描边，让屏幕边缘有实体感
    edge = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ed = ImageDraw.Draw(edge)
    ed.rounded_rectangle([0, 0, w - 1, h - 1], radius=radius, outline=border, width=2)
    edge.putalpha(Image.composite(edge.getchannel("A"), Image.new("L", (w, h), 0), mask))
    body = Image.alpha_composite(body, edge)

    shadow, pad = drop_shadow(mask, blur=38, dy=22, opacity=80)
    canvas = Image.new("RGBA", (mask.width + pad * 2, mask.height + pad * 2), (0, 0, 0, 0))
    slide = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    slide.paste((43, 33, 22, 255), (0, 0), shadow)
    canvas = Image.alpha_composite(canvas, slide)
    canvas.paste(body, (pad, pad), body)

    dst = os.path.join(OUT, out_name)
    canvas.save(dst, "WEBP", quality=92, method=6)
    print(out_name, canvas.size, round(os.path.getsize(dst) / 1024), "KB")


def phone(src, out_name, screen_w=1170, bezel=46, radius_ratio=0.135, max_h=2300):
    img = Image.open(src).convert("RGB")
    if img.width > screen_w:
        img = img.resize((screen_w, round(img.height * screen_w / img.width)), Image.LANCZOS)
    sw, sh = img.size
    r = round(sw * radius_ratio)

    fw, fh = sw + bezel * 2, sh + bezel * 2
    fr = r + bezel
    frame = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    fm = rounded_mask((fw, fh), fr)
    base = Image.new("RGBA", (fw, fh), (26, 23, 20, 255))
    frame.paste(base, (0, 0), fm)

    # 机身高光边
    hl = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    ImageDraw.Draw(hl).rounded_rectangle([1, 1, fw - 2, fh - 2], radius=fr, outline=(255, 255, 255, 60), width=3)
    frame = Image.alpha_composite(frame, hl)

    sm = rounded_mask((sw, sh), r)
    frame.paste(img, (bezel, bezel), sm)

    # 灵动岛
    d = ImageDraw.Draw(frame)
    island_w, island_h = round(sw * 0.29), round(sw * 0.085)
    ix = (fw - island_w) // 2
    d.rounded_rectangle([ix, bezel + round(sw * 0.028), ix + island_w, bezel + round(sw * 0.028) + island_h],
                        radius=island_h // 2, fill=(12, 10, 9, 255))

    shadow, pad = drop_shadow(fm, blur=44, dy=26, opacity=75)
    canvas = Image.new("RGBA", (fw + pad * 2, fh + pad * 2), (0, 0, 0, 0))
    shr = Image.new("L", canvas.size, 0)
    shr.paste(shadow.crop((pad, pad, pad + fw, pad + fh)), (pad, pad))
    sl = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sl.paste((43, 33, 22, 255), (0, 0), shr)
    canvas = Image.alpha_composite(canvas, sl)
    canvas.paste(frame, (pad, pad), frame)

    if canvas.height > max_h:
        k = max_h / canvas.height
        canvas = canvas.resize((round(canvas.width * k), max_h), Image.LANCZOS)

    dst = os.path.join(OUT, out_name)
    canvas.save(dst, "WEBP", quality=92, method=6)
    print(out_name, canvas.size, round(os.path.getsize(dst) / 1024), "KB")


screen_card(os.path.join(HD, "zs-6-archive.png"), out_name="zhanshen-archive.webp")
screen_card(os.path.join(HD, "zs-4-fight2.png"), out_name="zhanshen-fight.webp")
screen_card(os.path.join(ORIG, "03-playing.png"), radius=20, out_name="meow-play.webp")
screen_card(os.path.join(ORIG, "03-reading.png"), radius=20, out_name="ember-read.webp")
phone(os.path.join(HD, "tree-home.png"), "tree-home.webp")
