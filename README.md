# Humaiz Malik’s personal website

A small static personal site. Edit one JSON file to add a biography, projects, notes, and public links. The deployed website needs no JavaScript, backend, database, analytics, or paid service.

## Update the site

1. Edit `content.json` in GitHub or a text editor.
2. Commit to `main`. Cloudflare Pages builds and publishes the website automatically. GitHub Actions also updates the GitHub Pages copy.

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

The primary free hosting address is [humaiz-portfolio.pages.dev](https://humaiz-portfolio.pages.dev/). Cloudflare Pages project `humaiz-portfolio` is connected to this repository's `main` branch through its native Git integration. Its build command is `npm run build`, its output directory is `site`, and its `SITE_URL` environment variable is `https://humaiz-portfolio.pages.dev`.

The free GitHub Pages copy remains at [humaizm.github.io](https://humaizm.github.io/). Its canonical URL points to the primary Cloudflare site. Ownership of `humaiz.com` is a separate step; the custom domain is not connected yet.

To publish a manually built version to the existing Cloudflare project:

```sh
npx wrangler login
SITE_URL=https://humaiz-portfolio.pages.dev npm run deploy:cloudflare
```

In PowerShell, set `$env:SITE_URL = 'https://humaiz-portfolio.pages.dev'` before the deploy command. The CLI prompts for authentication on your own computer; never commit its credentials. Routine content updates only need a commit to `main`.

After acquiring the custom domain, connect it in Cloudflare Pages and DNS, configure the `www` redirect there, set Cloudflare's production `SITE_URL` environment variable and `content.json`'s `siteUrl` to `https://humaiz.com`, and deploy again. Cloudflare's environment variable overrides the JSON value during its build.

## Fonts

Newsreader and IBM Plex Sans are bundled as Latin WOFF2 files from Google Fonts under the SIL Open Font License. Their license files are in `site/assets/`. The font files require no external requests from visitors.
