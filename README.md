# Humaiz Malik’s personal website

A small static personal site. Edit one JSON file to add a biography, projects, notes, and public links. The deployed website needs no JavaScript, backend, database, analytics, or paid service.

## Update the site

1. Edit `content.json` in GitHub or a text editor.
2. Commit to `main`. GitHub Actions builds and publishes the website automatically.

The `about` array holds biography paragraphs. Optional `facts` use `label` and `value` fields, for example a role or education. Every `projects` entry uses `name`, `category`, `description`, `url`, optional `source`, and a `tags` array. Add notes with `title`, `summary`, and an optional HTTPS `url`. Empty sections stay hidden. Add public profiles or a `mailto:` contact link to `links`.

Only put information you want publicly visible in `content.json`. Registration addresses, telephone numbers, passwords, and support correspondence do not belong here.

## Build locally

Node.js 22 or later is sufficient. There are no application dependencies.

```sh
npm run build
python -m http.server 8000 --directory site
```

Visit `http://localhost:8000`. All assets are local; the website remains usable with JavaScript disabled.

## Hosting

GitHub Pages publishes from GitHub Actions. The free deployment URL is `https://humaizm.github.io/`. This is a hosting address; ownership of `humaiz.com` is a separate step.

The `site/` output also deploys directly to Cloudflare Pages:

```sh
npx wrangler login
SITE_URL=https://humaiz-portfolio.pages.dev npm run deploy:cloudflare
```

In PowerShell, set `$env:SITE_URL = 'https://humaiz-portfolio.pages.dev'` before the deploy command. The CLI prompts for authentication on your own computer; never commit its credentials. A Pages direct-upload project can use a CI deployment later, but cannot be converted in place to Cloudflare’s native Git integration.

When the custom domain is acquired, set `siteUrl` to `https://humaiz.com`, connect the domain in Cloudflare Pages and DNS, and configure the `www` redirect there. Do not add a CNAME file before the domain and DNS are ready.

## Fonts

Newsreader and IBM Plex Sans are bundled as Latin WOFF2 files from Google Fonts under the SIL Open Font License. Their license files are in `site/assets/`. The font files require no external requests from visitors.
