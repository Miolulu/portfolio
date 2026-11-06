import base64
import pathlib
import re

BASE = pathlib.Path(r"C:\Users\mio\WorkBuddy\2026-11-05-14-04-14")
SRC = BASE / "作品集.html"
OUT = BASE / "卢璐-作品集.html"

s = SRC.read_text(encoding="utf-8")
cache = {}


def inline(m):
    rel = m.group(1)
    p = BASE / rel
    if not p.exists():
        print("MISS", rel)
        return m.group(0)
    if rel not in cache:
        b = base64.b64encode(p.read_bytes()).decode()
        cache[rel] = "data:image/jpeg;base64," + b
    return cache[rel]


s2 = re.sub(r'src="(portfolio/docs/assets/print/[^"]+)"', lambda m: 'src="' + inline(m) + '"', s)
OUT.write_text(s2, encoding="utf-8")
print("inlined", len(cache), "images;", round(OUT.stat().st_size / 1024 / 1024, 2), "MB")
print("leftover refs:", len(re.findall(r"portfolio/docs/assets", s2)))
