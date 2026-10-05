import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const profile = JSON.parse(await readFile(resolve(root, 'content.json'), 'utf8'));
const siteUrl = new URL(process.env.SITE_URL || profile.siteUrl);
if (siteUrl.protocol !== 'https:') throw new Error('SITE_URL must use HTTPS.');
const base = siteUrl.href.replace(/\/$/, '');
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const safeUrl = value => {
  const url = new URL(value);
  if (!['https:', 'mailto:'].includes(url.protocol)) throw new Error(`Unsupported link protocol: ${url.protocol}`);
  return escape(url.href);
};
const external = (url, label, className = 'action') => `<a class="${className}" href="${safeUrl(url)}">${escape(label)} <span aria-hidden="true">↗</span></a>`;
for (const key of ['name', 'description', 'intro']) {
  if (typeof profile[key] !== 'string' || !profile[key].trim()) throw new Error(`Missing profile field: ${key}`);
}
if (!profile.links?.length) throw new Error('Add at least one public link.');

const projects = profile.projects.map(project => `
    <article class="project">
      <div class="project-title"><h3>${escape(project.name)}</h3><p class="category">${escape(project.category)}</p></div>
      <div class="project-body">
        <p>${escape(project.description)}</p>
        ${(project.tags || []).length ? `<ul class="tags" aria-label="Project features">${project.tags.map(tag => `<li>${escape(tag)}</li>`).join('')}</ul>` : ''}
        <div class="actions">${external(project.url, 'Open project')}${project.source ? external(project.source, 'Source code') : ''}</div>
      </div>
    </article>`).join('');
const facts = profile.facts?.length ? `<dl class="facts">${profile.facts.map(fact => `<div><dt>${escape(fact.label)}</dt><dd>${escape(fact.value)}</dd></div>`).join('')}</dl>` : '';
const notes = profile.notes?.length ? `<section class="index-section" id="notes" aria-labelledby="notes-heading"><h2 id="notes-heading">Notes</h2>${profile.notes.map(note => `<article class="note"><h3>${escape(note.title)}</h3><p>${escape(note.summary)}</p>${note.url ? external(note.url, 'Read note') : ''}</article>`).join('')}</section>` : '';
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escape(profile.name)} — Personal website</title>
  <meta name="description" content="${escape(profile.description)}">
  <link rel="canonical" href="${escape(base)}/">
  <meta name="theme-color" content="#f9f5ed">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(profile.name)}">
  <meta property="og:description" content="${escape(profile.description)}">
  <meta property="og:url" content="${escape(base)}/">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="./assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="./assets/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="./assets/plex-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <div class="shell">
    <header class="masthead">
      <a class="wordmark" href="./" aria-label="${escape(profile.name)} home">${escape(profile.initials)}</a>
      <nav aria-label="Primary">${external(profile.links[0].url, profile.links[0].label, 'nav-link')}</nav>
    </header>
    <main id="main" tabindex="-1">
      <div class="intro">
        <h1>${escape(profile.name)}</h1>
        <p class="intro-copy">${escape(profile.intro)}</p>
        <nav class="jump-links" aria-label="On this page"><a href="#about">About</a>${projects ? '<a href="#projects">Projects</a>' : ''}${notes ? '<a href="#notes">Notes</a>' : ''}<a href="#elsewhere">Elsewhere</a></nav>
      </div>
      <section class="index-section" id="about" aria-labelledby="about-heading">
        <h2 id="about-heading">A little about me</h2>
        <div class="about-copy">${profile.about.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</div>
        ${facts}
      </section>
      ${projects ? `<section class="index-section" id="projects" aria-labelledby="projects-heading"><h2 id="projects-heading">Projects</h2>${projects}</section>` : ''}
      ${notes}
      <section class="index-section" id="elsewhere" aria-labelledby="elsewhere-heading">
        <h2 id="elsewhere-heading">Find me elsewhere</h2>
        <ul class="elsewhere">${profile.links.map(link => `<li>${external(link.url, link.label)}${link.detail ? `<span class="detail">${escape(link.detail)}</span>` : ''}</li>`).join('')}</ul>
      </section>
    </main>
    <footer class="footer"><div><p class="footer-name">${escape(profile.name)}</p><p class="footer-copy">A personal home, with room to grow.</p></div><a class="foot-link" href="#main">Back to top ↑</a></footer>
  </div>
</body>
</html>
`;
const out = resolve(root, 'site');
await mkdir(out, { recursive: true });
await writeFile(resolve(out, 'index.html'), html.replace(/^[ \t]+$/gm, ''));
await writeFile(resolve(out, '404.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — ${escape(profile.name)}</title><link rel="stylesheet" href="${escape(base)}/styles.css"></head><body><main class="shell intro"><h1>Page not found</h1><div class="about-copy"><p>This link doesn’t lead to a page on my website.</p><a class="action" href="${escape(base)}/">Return home →</a></div></main></body></html>`);
await copyFile(resolve(root, 'tokens.css'), resolve(out, 'tokens.css'));
await writeFile(resolve(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
await writeFile(resolve(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(base)}/</loc></url></urlset>\n`);
await writeFile(resolve(out, '.nojekyll'), '');
console.log(`Built ${profile.name}: ${profile.projects.length} project(s), ${profile.notes.length} note(s). Canonical: ${base}/`);
