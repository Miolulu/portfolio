import base64
import json
import mimetypes
import subprocess
import sys
import urllib.request
import ssl

REPO = "Miolulu/hospital-slayer-game"
ROOT = r"C:\Users\mio\WorkBuddy\2026-11-05-14-04-14\zhanshen-src\hospital-slayer-game-main"

proc = subprocess.run(
    ["git", "credential", "fill"],
    input="protocol=https\nhost=github.com\n\n",
    capture_output=True, text=True, shell=False,
)
tok = ""
for line in proc.stdout.splitlines():
    if line.startswith("password="):
        tok = line[len("password="):].strip()
if not tok:
    sys.exit("no token")

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def put(path, data, message):
    url = f"https://api.github.com/repos/{REPO}/contents/{path}"
    body = json.dumps({
        "message": message,
        "content": base64.b64encode(data).decode(),
        "branch": "main",
    }).encode()
    req = urllib.request.Request(url, data=body, method="PUT")
    req.add_header("Authorization", f"Bearer {tok}")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=120) as r:
            d = json.load(r)
            print("OK", path, d["content"]["size"], "bytes")
    except urllib.error.HTTPError as e:
        print("FAIL", path, e.code, e.read().decode()[:300])


sdk = '''(function () {
  var base = '/hospital-slayer-game/public/assets/';
  window.Builda = window.Builda || {};
  window.Builda.assets = window.Builda.assets || {
    url: function (path) {
      var p = String(path || '').replace(/^\\/+/, '');
      var prev;
      do { prev = p; p = p.replace(/^(res|assets|media)\\//, ''); } while (p !== prev);
      return base + p;
    }
  };
})();
'''

files = [
    ("play/index.html", open(ROOT + r"\dist\index.html", "rb").read(), "add playable build: page"),
    ("play/builda-sdk.js", sdk.encode(), "add playable build: local asset shim"),
    ("play/assets/index-CQtNa0x3.css", open(ROOT + r"\dist\assets\index-CQtNa0x3.css", "rb").read(), "add playable build: css"),
    ("play/assets/index-MdYvOVOY.js", open(ROOT + r"\dist\assets\index-MdYvOVOY.js", "rb").read(), "add playable build: js"),
]

for path, data, msg in files:
    put(path, data, msg)
