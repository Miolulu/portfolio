# -*- coding: utf-8 -*-
"""统一重出素材：竖屏作品＝竖屏手机（固定 1170×2532 屏），横屏作品＝横屏手机。"""
import os
import compose_hd as C
import frames as F

HD = C.HD
ORIG = C.ORIG
BASE = r"C:\Users\mio\WorkBuddy\2026-11-05-14-04-14\portfolio"
M = os.path.join(BASE, "shots", "mobile")


def p(*a):
    return os.path.join(*a)


# 斩神：横屏手机
F.phone_land(p(HD, "zs-1-title.png"), "zhanshen-title.webp")
F.phone_land(p(HD, "zs-4-fight2.png"), "zhanshen-fight.webp")
F.phone_land(p(ORIG, "02-floor.png"), "zhanshen-floor.webp")
F.phone_land(p(HD, "zs-6-archive.png"), "zhanshen-archive.webp")
F.phone_land(p(ORIG, "03-weapon.png"), "zhanshen-weapon.webp")

# 喵喵：横屏手机
F.phone_land(p(ORIG, "02-forest.png"), "meow-forest.webp")
F.phone_land(p(ORIG, "04-create.png"), "meow-create.webp")
F.phone_land(p(ORIG, "01-welcome.png"), "meow-welcome.webp")
F.phone_land(p(ORIG, "03-playing.png"), "meow-play.webp")

# 树语：竖屏手机
for name in ["tree-home", "tree-write", "tree-calendar", "tree-notes2", "tree-note2", "tree-spirit2"]:
    out = name.replace("2", "") + ".webp"
    C.phone(p(M, name + ".png"), out)

# 余烬：竖屏手机
for name in ["ember-cover", "ember-catalog", "ember-read", "ember-roles"]:
    C.phone(p(M, name + ".png"), name + ".webp")

print("all done")
