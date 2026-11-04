# smolchat website (static, Netlify)
Publish dir: project root (see netlify.toml). No build step.

## What to add
- `logos/smollabs_mascot.png` – mascot (also used as favicon). **Not yet provided.**
- `downloads/windows/<installer>.exe|.msi`, `downloads/macos/<installer>.dmg`, then set `file` (and optional `version`, `arch`, `size`) in `js/config.js`.
- `assets/videos/demo.mp4` + `poster.webp` (names configurable).
- Model manager / download screenshots: put in `assets/images/`, set in `extraShots`.
- Replace `#` links in `config.links`; set `confirmed: true` on supported models; fill `requirements` once verified.
