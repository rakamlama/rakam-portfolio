# Rakam Lama Tamang, PE — Portfolio + Private Studio

A responsive public portfolio and private app-management studio. The homepage uses shared CSS, JavaScript, and local image assets for smaller downloads and browser caching. Serve the complete directory. The site includes a public engineering portfolio, searchable publications, professional profile links, and a separate administrator dashboard for managing hosted app links, uploading small **single-file HTML demos**, publishing selected apps in a public gallery, keeping private notes, and exporting/restoring JSON backups.

## Development

Run `npm run dev` from this directory or the parent workspace, then open http://localhost:8080. Node.js 18+ is required; there are no dependencies to install. `PORT=8081 npm run dev` selects a different port. Stop with Ctrl+C.

`npm run build` generates the public pages and sitemap from `content/` and `templates/page.html`. The dev command builds once at startup. After editing content or templates, rerun the build and refresh; CSS and JavaScript edits only need a refresh. `npm test` checks routes, links, assets, metadata, dashboard bindings, and search/filter behavior.

## Structure

- `content/*.html` and `content/*.json`: page body content and page-specific titles/descriptions.
- `content/portfolio-data.json`: the single source for all project and publication records.
- `templates/page.html`: shared header, navigation, footer, and metadata.
- `scripts/build-pages.cjs`: dependency-free static page generation.
- `styles.css`: shared design tokens, controls, cards, and dashboard layouts.
- `pages.css`: responsive page compositions, hero, and page-specific visual treatments.
- `public.js`, generated `public-data.js`: project/publication interactions and the Supabase gallery.
- `navigation.js`: mobile navigation, year display, and redirects for old section links.
- `dashboard/index.html`, `admin.js`: private workspace and its existing Supabase authentication/data operations.
- `tool/index.html`, `tool.js`: isolated viewer for published HTML tools; `tool.html` preserves old links.
- `app-config.js`, `supabase-setup.sql`: existing Supabase configuration and row-level security setup.

Generated route files are committed for static hosting. Edit their source content/templates and run `npm run build`, rather than editing generated HTML directly. No client-side framework or routing fallback is required.

## Fast public publishing (Netlify)

1. Run `npm run build` in `rakam-portfolio`. Use the current source folder; the older ZIP archive does not contain these updates.
2. For an initial public portfolio, drag the `rakam-portfolio` folder into https://app.netlify.com/drop . The public pages work without any credentials; the private dashboard will show a setup-required message.
3. Netlify gives you a `netlify.app` site address. You may add a custom domain later.
4. Re-upload the changed site folder for future updates, or link a GitHub repository to auto-deploy changes on push.

## Enable a real private cloud dashboard

1. Create a project at https://supabase.com/ and open **Authentication > Providers > Email**; enable Email OTP / magic link. Set **Authentication > URL Configuration > Site URL** to `https://YOUR-SITE.netlify.app/dashboard/`, and add that URL under **Redirect URLs**. If the provider uses OTP codes instead of magic links, adjust the Email template to include the `{{ .ConfirmationURL }}` magic-link action. Don't attempt login with a `file://` URL.
2. Use **Authentication > Users > Invite user** to invite your administrator email. Finish activation using the invite email. The dashboard uses `shouldCreateUser: false`, so random email addresses cannot create accounts via the dashboard.
3. In `supabase-setup.sql`, replace **every** occurrence of `admin@example.com` with your administrator email in lowercase. Run that SQL in **SQL Editor**. The email check is enforced server-side through RLS, not by hiding the admin page. For other users, write operations are forbidden.
4. In `app-config.js`, fill `SUPABASE_URL`, `SUPABASE_ANON_KEY` (Supabase publishable/anon browser key), `ADMIN_EMAIL`, and `PUBLIC_OWNER_ID`. Find the last value in **Authentication > Users**: the user's UUID. The URL and browser key are meant to be public, but **never** include database passwords, personal tokens, or service-role secrets.
5. Redeploy the website folder to Netlify. Visit `/dashboard/`, request a magic link, click it from your inbox, and sign in. Upload your app URLs / HTML. Turn on **Published** for anything you want visible on the public site.
6. Test logged out, and from a fresh private/incognito window, to make sure **only** published apps are visible. Notes live in a separate database table and have no public read permission.

## Add your tools

- **Hosted apps**: Paste a public HTTPS URL, such as an app hosted on Streamlit Community Cloud, Hugging Face Spaces, Vercel, Render, or another host. The dashboard launches that URL; it does not host the app backend.
- **HTML/JavaScript**: Upload or paste a self-contained HTML file (200 KB max). The full HTML is saved in your Supabase Postgres row and previewed using a sandboxed iframe. The `allow-scripts` capability is enabled, but `allow-same-origin` is intentionally excluded. Apps should not rely on local filesystem access, shared cookies, or sensitive data.
- **Python**: Python code cannot execute on this static website; deploy it as a separate Streamlit/FastAPI/etc. service and register its HTTPS URL.
- **AI tools**: Host their backend separately; do not embed secret API credentials in HTML or JavaScript. Apps you publish are visible to site visitors and their code can be inspected.

## Backup strategy

- **Website source**: Keep this folder in your own private GitHub repo (or other versioned backup) plus a copy on your computer. Netlify hosting alone is not a replacement for version control.
- **Apps and private notes**: In Dashboard > Backup & Restore choose **Export JSON backup**. Store it securely, since notes and HTML contents are included. The restore action merges records by ID and does not remove other apps.
- **Cloud data**: Supabase is the active app database once configured, but make regular independent exports. Separate managed database backups depend on your Supabase plan.
- **Browser**: Supabase uses local browser session state. App records are in the cloud rather than relying only on that browser.

## Customize the portfolio

Edit `content/<page>.html` for copy and layouts, the corresponding JSON file for SEO title/description, and `styles.css` / `pages.css` for styling. Run `npm run build` after changing content. Replace `assets/rakam-portrait.jpg` to update the portrait. Contact links use the existing LinkedIn profile; no unpublished email address or unconnected contact form is added.

## Publications and research profiles

The `/publications/` page includes search, category filters, sorting, and profile links:
- Google Scholar: https://scholar.google.com/citations?user=_V0FqM0AAAAJ&hl=en
- ResearchGate: https://www.researchgate.net/profile/Rakam-Lama-Tamang
- LinkedIn: https://www.linkedin.com/in/rakam-tamang-phd-pe-m-asce-0939a941

To add or change publications and projects, edit `content/portfolio-data.json`, then run `npm run build`. Listings are generated as HTML for visitors and search engines, and enhanced with JavaScript filtering.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page and curated previews |
| `/services/` | Engineering focus areas and approach |
| `/expertise/` | Detailed technical capabilities |
| `/projects/` | Featured engagement and filterable project portfolio |
| `/research/` | Research themes and applied workflows |
| `/publications/` | Searchable publication library |
| `/about/` | Background, education, licensure, and toolkit |
| `/tools/` | Published applications gallery |
| `/contact/` | Professional and research contact channels |
| `/dashboard/` | Private app management, publishing, and backups |
| `/tool/?id=…` | Sandboxed published HTML application |

Directory routes support direct navigation and refresh. Paths without a trailing slash redirect to their directory index. Old homepage fragments such as `/#work` redirect to their corresponding page. Legacy `admin.html` and `tool.html` links retain query strings and authentication fragments through browser redirects. `404.html`, `sitemap.xml`, and `robots.txt` support static deployment. Canonical URLs currently use the domain in `CNAME`, `rakamtamang.com`; update the generator, template, and robots sitemap URL if the production domain changes.

The development server is for local preview; use static hosting for production. The only external runtime script is the existing Supabase SDK on pages that need it. Public pages use system fonts and local images. Authentication/magic-link redirects should be tested on the actual HTTPS deployed domain.

Add `https://YOUR-DOMAIN/dashboard/` to Supabase Auth redirect URLs before using the moved dashboard. Keep the old admin redirect URL allowed while previously issued magic links remain in use. No database or row-level security changes are needed.

The existing `app-config.js` has empty connection values. Populate it with your existing public Supabase configuration to verify authentication, app management, and the published gallery. Never include a service-role key.

## AI expertise updates

The Expertise page includes dedicated entries for LLM Evaluation, Retrieval-Augmented Generation (RAG), and Agentic AI. These describe technical focus areas; they are not presented as separate completed client projects.

## Verification limits

The automated suite covers generated routes, local link targets, asset responses, unique page headings, metadata, pre-rendered data, project/publication filters, and preservation of dashboard DOM bindings. Real sign-in, cloud writes, backup restore, and published tool loading require a configured Supabase project and must be verified against that project before release.

Firefox checks also passed across all 11 public/workspace/viewer routes at 320, 390, 768, 1024, and 1440 pixels, with no horizontal overflow or broken images. Mobile menu opening/closing, Escape, project filters, and publication search were exercised in the browser.
