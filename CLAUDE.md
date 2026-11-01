# Bin night: rules for Claude Code

- Start each session by reading HANDOFF.md, and update it before the session ends.
- Jam doesn't read code. Explain every change in plain English and say where on the page it shows up. Verify by behaviour (what the page shows), not by pointing at code.
- Never commit, push, tag or deploy. Jam does all of that himself, so give him the exact commands to run.
- Don't use str_replace on index.html: its long lines corrupt edits. Write the complete file, or use a targeted sed command.
- Vanilla HTML, CSS and JS in a single index.html. No build step, no frameworks. Hosted on GitHub Pages.
- Write UI copy in Australian English and code in American English.
- Keep the date logic in `<script id="bin-logic">` free of page access, and run `node test/dates.js` after any change to it.
- Once there's a service worker, bump its cache version on every change to index.html, CSS or JS.
