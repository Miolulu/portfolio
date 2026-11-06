# -*- coding: utf-8 -*-
"""给截图加真实设备/浏览器外壳：横屏手机、浏览器窗口。"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = r"C:\Users\mio\WorkBuddy\2026-11-05-14-04-14\portfolio"
OUT = os.path.join(BASE, "docs", "assets", "hd")
SS = 2

FONT_PATHS = [
    r"C:\Windows\Fonts\segoeui.ttf",
    r"C:\Windows\Fonts\arial.ttf",
]


def _font(size):
    for p in FONT_PATHS:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


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


def _save(canvas, out_name):
    dst = os.path.join(OUT, out_name)
    canvas.save(dst, "WEBP", quality=92, method=6)
    print(out_name, canvas.size, round(os.path.getsize(dst) / 1024), "KB")


def browser(src, out_name, url="miolulu.github.io", max_w=2400):
    """网页截图套浏览器窗口：顶部一条浅色栏 + 三个圆点 + 地址。"""
    img = Image.open(src).convert("RGB")
    if img.width > max_w:
        img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
    w, h = img.size

    bar = max(46, round(w * 0.032))
    r_out = max(12, round(w * 0.009))
    pad_x = round(w * 0.012)

    fw, fh = w + pad_x * 2, h + bar + pad_x
    frame = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    outer = rounded_mask((fw, fh), r_out)
    ImageDraw.Draw(frame).rectangle([0, 0, fw, fh], fill=(246, 243, 237, 255))
    frame.putalpha(outer)

    # 顶栏底部细线
    line = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    ImageDraw.Draw(line).rectangle([0, bar, fw, bar + 2], fill=(0, 0, 0, 26))
    frame = Image.alpha_composite(frame, line)

    # 三个圆点
    d = ImageDraw.Draw(frame)
    dot_r = max(5, round(bar * 0.11))
    cx = pad_x + dot_r
    for i in range(3):
        cy = bar // 2
        d.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=(216, 210, 199, 255))
        cx += dot_r * 3 + 8

    # 地址胶囊
    pill_w = round(fw * 0.44)
    pill_h = round(bar * 0.52)
    px = (fw - pill_w) // 2
    py = (bar - pill_h) // 2
    ImageDraw.Draw(frame).rounded_rectangle([px, py, px + pill_w, py + pill_h],
                                            radius=pill_h // 2, fill=(255, 255, 255, 255),
                                            outline=(0, 0, 0, 22), width=2)
    f = _font(max(13, round(pill_h * 0.5)))
    tw = d.textlength(url, font=f)
    d.text((px + (pill_w - tw) / 2, py + pill_h * 0.16), url, font=f, fill=(122, 116, 104, 255))

    # 网页内容
    sm = rounded_mask((w, h), max(4, r_out - 4))
    frame.paste(img, (pad_x, bar), sm)

    # 屏幕内描边 + 外阴影
    edge = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    ImageDraw.Draw(edge).rounded_rectangle([0, 0, fw - 1, fh - 1], radius=r_out,
                                           outline=(0, 0, 0, 30), width=2)
    frame = Image.alpha_composite(frame, edge)

    shadow, pad = drop_shadow(outer, blur=36, dy=20, opacity=70)
    canvas = Image.new("RGBA", (fw + pad * 2, fh + pad * 2), (0, 0, 0, 0))
    sl = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sl.paste((43, 33, 22, 255), (0, 0), shadow)
    canvas = Image.alpha_composite(canvas, sl)
    canvas.paste(frame, (pad, pad), frame)
    _save(canvas, out_name)


def phone_land(src, out_name, screen_w=2000, bezel_ratio=0.038, max_w=2400):
    """横屏手机：等宽机身 + 左侧竖条听筒位。"""
    img = Image.open(src).convert("RGB")
    if img.width > screen_w:
        img = img.resize((screen_w, round(img.height * screen_w / img.width)), Image.LANCZOS)
    sw, sh = img.size
    bezel = round(sw * bezel_ratio)
    r = round(sw * 0.055)

    fw, fh = sw + bezel * 2, sh + bezel * 2
    fr = r + bezel
    frame = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    fm = rounded_mask((fw, fh), fr)
    base = Image.new("RGBA", (fw, fh), (26, 23, 20, 255))
    frame.paste(base, (0, 0), fm)

    hl = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    ImageDraw.Draw(hl).rounded_rectangle([1, 1, fw - 2, fh - 2], radius=fr,
                                         outline=(255, 255, 255, 55), width=3)
    frame = Image.alpha_composite(frame, hl)

    sm = rounded_mask((sw, sh), r)
    frame.paste(img, (bezel, bezel), sm)

    # 竖屏转横屏后，前置摄像头在左侧边缘中间
    d = ImageDraw.Draw(frame)
    cam = max(6, round(bezel * 0.22))
    cx = bezel // 2
    cy = fh // 2
    d.ellipse([cx - cam, cy - cam, cx + cam, cy + cam], fill=(12, 10, 9, 255))

    shadow, pad = drop_shadow(fm, blur=40, dy=24, opacity=75)
    canvas = Image.new("RGBA", (fw + pad * 2, fh + pad * 2), (0, 0, 0, 0))
    sl = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sl.paste((43, 33, 22, 255), (0, 0), shadow)
    canvas = Image.alpha_composite(canvas, sl)
    canvas.paste(frame, (pad, pad), frame)

    if canvas.width > max_w:
        k = max_w / canvas.width
        canvas = canvas.resize((max_w, round(canvas.height * k)), Image.LANCZOS)
    _save(canvas, out_name)
