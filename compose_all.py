# -*- coding: utf-8 -*-
"""统一重出所有作品截图：游戏＝横屏手机、网页＝浏览器窗口、移动端＝竖屏手机。"""
import os
import compose_hd as C
import frames as F

HD = C.HD
ORIG = C.ORIG
BASE = r"C:\Users\mio\WorkBuddy\2026-11-05-14-04-14\portfolio"
T = os.path.join(BASE, "shots", "tree")


def p(*a):
    return os.path.join(*a)


# 斩神：横屏手机
F.phone_land(p(HD, "zs-1-title.png"), "zhanshen-title.webp")
F.phone_land(p(ORIG, "02-floor.png"), "zhanshen-floor.webp")
F.phone_land(p(HD, "zs-4-fight2.png"), "zhanshen-fight.webp")
F.phone_land(p(HD, "zs-6-archive.png"), "zhanshen-archive.webp")
F.phone_land(p(ORIG, "03-weapon.png"), "zhanshen-weapon.webp")

# 喵喵：浏览器窗口
F.browser(p(ORIG, "02-forest.png"), "meow-forest.webp", "miolulu.github.io/meow-chime")
F.browser(p(ORIG, "01-welcome.png"), "meow-welcome.webp", "miolulu.github.io/meow-chime")
F.browser(p(ORIG, "04-create.png"), "meow-create.webp", "miolulu.github.io/meow-chime")
F.browser(p(ORIG, "03-playing.png"), "meow-play.webp", "miolulu.github.io/meow-chime")

# 余烬：浏览器窗口 + 竖屏手机
F.browser(p(ORIG, "01-cover.png"), "ember-cover.webp", "miolulu.github.io/ember-novel")
F.browser(p(ORIG, "03-reading.png"), "ember-read.webp", "miolulu.github.io/ember-novel")
F.browser(p(ORIG, "02-roles.png"), "ember-roles.webp", "miolulu.github.io/ember-novel")
C.phone(p(BASE, "shots", "ember-mobile-cover.png"), "ember-mobile-cover.webp")
C.phone(p(BASE, "shots", "ember-mobile-read.png"), "ember-mobile-read.webp")

# 树语：竖屏手机 + 界面卡
C.phone(p(T, "home.png"), "tree-home.webp")
C.screen_card(p(T, "notes.png"), radius=26, out_name="tree-notes.webp")
C.screen_card(p(T, "calendar.png"), radius=26, out_name="tree-calendar.webp")
C.screen_card(p(T, "write.png"), radius=26, out_name="tree-write.webp")
C.screen_card(p(T, "spirit.png"), radius=26, out_name="tree-spirit.webp")
C.screen_card(p(T, "note.png"), radius=26, out_name="tree-note.webp")
