# Whisper + Supabase

## 1. Supabase
Create a Supabase project.

Open SQL Editor and run `supabase.sql`.

## 2. Get your keys
Supabase Dashboard -> Project Settings -> API.

Copy:
- Project URL
- Publishable key (or legacy anon key)

Put them into `script.js`:
SUPABASE_URL = "..."
SUPABASE_ANON_KEY = "..."

Do NOT use the `service_role` or secret key in the browser.

## 3. GitHub Pages
Upload:
- index.html
- style.css
- script.js
- supabase.sql

Rename the old `index-1.html` to `index.html`.

GitHub repository -> Settings -> Pages -> Deploy from branch -> main -> /root.

Supabase stores the messages; GitHub Pages only hosts the website.

## Important
This is an anonymous public wall. Do not promise users that posts are private.
The database intentionally has no public DELETE policy.
