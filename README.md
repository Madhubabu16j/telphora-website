# Telphora Website

Official marketing site for **Telphora** (telphora.com) — AI-native cybersecurity company.

## Project structure

```
telphora-website/
├── index.html          # All page content & structure
├── css/
│   └── styles.css      # Full design system (dark theme, responsive)
├── js/
│   └── main.js         # Scroll animations, sticky nav, mobile menu
├── assets/
│   └── favicon.svg     # "T" mark in brand gradient
└── README.md
```

## Deploy: GitHub → Cloudflare Pages

1. **Push to GitHub** — create a repo (e.g. `telphora-website`) and push this folder's contents.
2. **Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.**
3. Select the repo. Build settings: **no build command, no build output** — or set output directory to `/` (it's plain static files).
4. **Custom domain:** Pages project → Custom domains → add `telphora.com` (and `www.telphora.com` if wanted). Cloudflare adds the DNS records automatically since the domain is on Cloudflare Registrar.
5. Every `git push` to the connected branch redeploys automatically.

## Notes

- Contact is email-only: every CTA links to `mailto:founder@telphora.com`.
- No fake claims anywhere on the site — no invented logos, testimonials, stats, certifications, or partnerships.
- Fully responsive; respects `prefers-reduced-motion`.
