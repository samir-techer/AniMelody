# Ani-Melody

A static anime tracking website — HTML, CSS, and vanilla JavaScript only, built for GitHub Pages.

## Phase 2 — Premium Homepage (this phase)

Built on top of Phase 1 without touching its navbar, footer, theme system,
or SEO files. Adds 11 homepage sections to `index.html`, all placeholder
content (invented anime titles, no real IP, no API calls yet):

Hero &middot; Trending Anime &middot; Popular This Season &middot; Featured
Characters &middot; Latest Trailers &middot; Continue Watching &middot;
Ani-Calendar &middot; Melody Score &middot; Browse by Genre &middot; Latest
News &middot; Call to Action.

**Poster placeholder system:** every "artwork" surface (hero banner, anime
posters, character avatars, trailer thumbs, news images) uses a `.poster`
component — a brand-spectrum gradient plus a large monogram letter — instead
of real images. This keeps the whole site self-contained (no broken image
links, no copyright concerns) while looking intentional rather than empty.
Swap these for real poster art/API data in a later phase without touching
the surrounding layout.

New JS in `js/script.js`: hero particle field, trending carousel controls,
hero scroll-cue — all additive, nothing from Phase 1 was changed.

## Phase 1 — Foundation

- Design system (`css/style.css`) — CSS variables for color, type, spacing, shadows, glass.
- Sticky glass navbar with desktop links, icon actions, profile pill, and mobile drawer.
- Reusable footer with brand, link columns, and legal row.
- Logo-driven loading screen with an equalizer animation.
- Dark/light theme toggle (persisted in `localStorage`).
- SEO basics: meta description, Open Graph, Twitter card, `manifest.json`, `robots.txt`, `sitemap.xml`.

## Project structure

```
ani-melody/
├── index.html          # Homepage shell (sections added in later phases)
├── manifest.json        # PWA manifest
├── robots.txt
├── sitemap.xml
├── css/
│   └── style.css        # Design tokens + foundation styles
├── js/
│   └── script.js         # Loader, navbar, theme toggle, mobile menu
└── assets/
    ├── images/
    │   └── logo.png
    └── icons/            # Reserved for future favicon sizes, social icons
```

## Design tokens

All colors, spacing, type, radii, shadows, and glow effects live as CSS
custom properties at the top of `css/style.css`. The brand gradient
(`--brand-gradient`, `--brand-gradient-full`) is derived from the logo's
own red → green → purple → orange → pink → blue spectrum, and is the one
place color "spends its boldness" — used on accents, not everywhere.

## Adding pages

Future pages (`anime.html`, `search.html`, `settings.html`, `login.html`,
`signup.html`) should reuse the same `<header class="navbar">` and
`<footer class="footer">` markup blocks from `index.html` so the nav/footer
stay visually and behaviorally consistent. `script.js` already handles
active-link highlighting by matching `location.pathname`, so no per-page
JS changes are needed for nav state.

## Not yet built (later phases)

- Homepage sections: Hero, Trending Anime, Characters, etc.
- Anime detail pages, search results, settings/profile pages.
- Backend/API integration for real anime data.
