# smolchat website (static, Netlify)
Publish dir: project root (see netlify.toml). No build step.

## Structure
- `index.html` – hero + app screenshots, Models section, closing CTA, footer.
- `css/style.css` (base) → `blend.css` (ambient background) → `motion.css` (motion/hero) → `polish.css` (final blending, models, a11y). Load order matters.
- `js/config.js` – all editable content. `js/main.js` – downloads, screenshot tabs, models, footer, sparkles. `js/motion.js` – headline, reveal, tilt/parallax, embers.

## What to add
- `logos/smollabs_mascot.png` – mascot (also used as favicon).
- `downloads/windows/<installer>.exe|.msi`, `downloads/macos/<installer>.dmg`, then set `file` (and optional `version`, `arch`, `size`) in `js/config.js`.
- Models: edit the `models` list in `js/config.js` (name, type, sizes, note).
- Set `siteUrl` and make the `og:image` / `twitter:image` URLs in `index.html` absolute (e.g. `https://your-domain/assets/images/chat-ember.webp`) so link previews work.
- Replace the remaining `#` links in `config.links` (they stay hidden until set).
