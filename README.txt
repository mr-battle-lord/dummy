WHISPER — FINAL GITHUB + SUPABASE VERSION

IMPORTANT:
Your index.html loads a file named "script.js".
The file you uploaded was named "script.es". That mismatch is why the page could display but ALL buttons could be dead.

Upload these exact files to the ROOT of your GitHub repository:
- index.html
- style.css
- script.js
- supabase.sql

Do NOT rename script.js to script.es.

SUPABASE:
1. Open Supabase SQL Editor.
2. Run supabase.sql once.
3. Your existing Project URL and publishable/anon key are already in script.js.
4. Never put a service_role/secret key in the browser.

GITHUB PAGES:
Settings -> Pages -> Deploy from branch -> main -> / (root).

After uploading:
- Wait a few minutes.
- Open the site in a private/incognito tab or hard refresh.
- The wall should load from Supabase.
- A post made on one phone should appear on another phone.
