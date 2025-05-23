#!/bin/bash

OUT_DIR="vercel-abuse-package"
mkdir -p "$OUT_DIR"

echo "[1/7] Exporting commit history..."
git log --pretty=format:"%h | %ad | %an | %s" --date=iso > "$OUT_DIR/commits.txt"

echo "[2/7] Copying LICENSE..."
cp LICENSE "$OUT_DIR/license.txt"

echo "[3/7] Downloading HTML..."
curl -sL https://praktikum-radar.vercel.app/index.html -o "$OUT_DIR/original_index.html"
curl -sL https://praktikumsradar.vercel.app/homepage.html -o "$OUT_DIR/infringing_homepage.html"

echo "[4/7] Creating diff..."
diff -u "$OUT_DIR/original_index.html" "$OUT_DIR/infringing_homepage.html" > "$OUT_DIR/html_diff.patch" || echo "(Differences found)"

echo "[5/7] Creating README..."
cat > "$OUT_DIR/README.txt" <<EOF
Evidence Package – GPLv3 Violation

Original project:
→ https://github.com/Nino678190/PraktikumRadar/
→ https://praktikum-radar.vercel.app/index.html

Infringing project:
→ https://praktikumsradar.vercel.app/homepage.html

Violations:
- No mention of GPLv3 license
- No credit to author
- No access to source code
- Presented as a closed-source product

Included files:
- commits.txt
- license.txt
- original_index.html
- infringing_homepage.html
- html_diff.patch
- screenshot_original.png
- screenshot_infringing.png

Author:
GitHub: https://github.com/Nino678190
EOF

echo "[6/7] Taking screenshots using Puppeteer..."
node screenshot.js

echo "[7/7] All files saved in: $OUT_DIR"
