# Rakam Lama Tamang, PE — Portfolio + Private Studio

A responsive public portfolio and private app-management studio. The public `index.html` is now self-contained: its CSS, JavaScript, portrait, and engineering illustration are embedded so single-file previews show the complete design and publications even when companion assets are not served. The site includes a public engineering portfolio, searchable publications, professional profile links, and a separate administrator dashboard for managing hosted app links, uploading small **single-file HTML demos**, publishing selected apps in a public gallery, keeping private notes, and exporting/restoring JSON backups.

## What's in this download

- `index.html`, `public.js`, `styles.css`: public portfolio, projects, expertise, research, searchable publications, and published app gallery.
- `assets/rakam-portrait.jpg`: portrait used on the public website.
- `admin.html`, `admin.js`: administrator-only interface (auth and access enforced in Supabase RLS once configured).
- `tool.html`: isolated HTML app demo viewer, for explicitly published apps only.
- `app-config.js`: public Supabase connection configuration. **Never place a service-role/secret API key here.**
- `supabase-setup.sql`: database tables and row-level security policies.

## Fast public publishing (Netlify)

1. Extract the ZIP folder.
2. For an initial public portfolio, drag the folder into https://app.netlify.com/drop . The public pages work without any credentials; the private dashboard will show a setup-required message.
3. Netlify gives you a `netlify.app` site address. You may add a custom domain later.
4. Re-upload the changed site folder for future updates, or link a GitHub repository to auto-deploy changes on push.

## Enable a real private cloud dashboard

1. Create a project at https://supabase.com/ and open **Authentication > Providers > Email**; enable Email OTP / magic link. Set **Authentication > URL Configuration > Site URL** to `https://YOUR-SITE.netlify.app/admin.html`, and add that URL under **Redirect URLs**. If the provider uses OTP codes instead of magic links, adjust the Email template to include the `{{ .ConfirmationURL }}` magic-link action. Don't attempt login with a `file://` URL.
2. Use **Authentication > Users > Invite user** to invite your administrator email. Finish activation using the invite email. The dashboard uses `shouldCreateUser: false`, so random email addresses cannot create accounts via the dashboard.
3. In `supabase-setup.sql`, replace **every** occurrence of `admin@example.com` with your administrator email in lowercase. Run that SQL in **SQL Editor**. The email check is enforced server-side through RLS, not by hiding the admin page. For other users, write operations are forbidden.
4. In `app-config.js`, fill `SUPABASE_URL`, `SUPABASE_ANON_KEY` (Supabase publishable/anon browser key), `ADMIN_EMAIL`, and `PUBLIC_OWNER_ID`. Find the last value in **Authentication > Users**: the user's UUID. The URL and browser key are meant to be public, but **never** include database passwords, personal tokens, or service-role secrets.
5. Redeploy the website folder to Netlify. Visit `/admin.html`, request a magic link, click it from your inbox, and sign in. Upload your app URLs / HTML. Turn on **Published** for anything you want visible on the public site.
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

Edit `index.html` (intro and section copy), `public.js` (project cards and publications), and `styles.css` (colors/layout). To change the portrait replace `assets/rakam-portrait.jpg`. To enable email contact, replace `YOUR_EMAIL_HERE` and the contact button label in `index.html` once you choose the address you want publicly shown. Check all project descriptions for confidentiality, current licensing/affiliations, and employer/client approval before publishing. No direct phone or email is exposed publicly by default.

## Publications and research profiles

The public homepage includes a searchable publications section and profile links:
- Google Scholar: https://scholar.google.com/citations?user=_V0FqM0AAAAJ&hl=en
- ResearchGate: https://www.researchgate.net/profile/Rakam-Lama-Tamang
- LinkedIn: https://www.linkedin.com/in/rakam-tamang-phd-pe-m-asce-0939a941

To add or change publications, edit the `publications` array inside `public.js`.

## Local preview

For a local preview of the public portfolio, run `python -m http.server 8080` from inside this folder, then visit http://localhost:8080 . The CDN fonts and Supabase libraries require an internet connection. Authentication/magic-link redirects should be tested using the actual HTTPS deployed domain.

## Tab-based navigation

The public site now shows one section at a time: Home, Expertise, Projects, Research, Publications, About, Tools, or Contact. Tabs use URL fragments (for example `#publications`) so individual sections can be shared directly. The published apps gallery and publication search still function within their respective tabs. On phones, the navigation row scrolls horizontally.

## AI expertise updates

The Expertise tab includes dedicated entries for LLM Evaluation, Retrieval-Augmented Generation (RAG), and Agentic AI. These describe technical focus areas; they are not presented as separate completed client projects.
