# Current PNG completion — 2026-11-21 18:47 Asia/Shanghai (UTC+8)

New separate character: public/art/ded-moroz-new-transparent.png, 692×1123 RGBA, 822218 bytes. Source generation: native 864×1152 JPEG on green; the image tool did not output native alpha despite the PNG request. Native-pixel matting created real transparent/partial-alpha fur edges; no upscaling or native-4K claim. Alpha statistics and dark/light edge proof: qc/ded-moroz-alpha-report.json and qc/ded-moroz-alpha-proof.jpg. Reproducible matting: scripts/matte-ded-moroz.py. The character is newly generated, not cut from the former room image.

The background is now a separate clean plate with the baked person removed; the website uses the new PNG as its independent host layer, avoiding duplicate Santas. Original clean plate: original-art/holiday-black-red-clean-plate.jpg. Black/red brand, gifts, grounded TV and 30–70% demo story remain.

Added compact numbered TV-channel menu across routes: Home, Televisions, Comparison, Cart; real navigation/drawer actions, current-route indicator, arrow-key focus and native Enter activation. This is an original television-inspired shopping navigation system, not an actual Android OS or copied TV platform. It does not replace the shop with a launcher grid.

Production build passed; 11 existing tests and 16 current browser checks passed, including 360/768/1024/1440 no-overflow and existing shopping/motion behavior. Desktop composite visually inspected; current desktop/mobile/offer/catalog frames captured under qc/holiday-world-*.png. No further redesign or video generation.

Limits: real inventory empty; demo explicit; sale percentages illustrative. Payment/dispatch/auth/backend/hosting absent. No claim of native alpha generation or 4K output.

Current evidence: qc/holiday-world-report.json; qc/ded-moroz-alpha-report.json. Server: http://127.0.0.1:5174/ on BOX only.
