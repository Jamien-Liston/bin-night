# Bin night: handoff

v1.1.0 · 1 November 2026

## What it is

A one-page web app for our house in Merri-bek. Open it and it says which bins go out on the next bin night, then shows the next eight weeks. Built as a lo-fi prototype in a claude.ai chat (published there first as an artifact), now moving to GitHub Pages.

## How it works

There's no council API. Merri-bek's four-bin service runs on a fixed cycle, so two known dates pin down every future week:

- Food and garden (lime green lid): every week
- Recycling (yellow lid): every second week
- Glass (purple lid): every four weeks
- Rubbish (red lid): every week, or every second week in trial streets, alternating with recycling

Our household's settings are the `HOUSEHOLD` defaults near the top of the second script in `index.html`: Tuesday collection, fortnightly rubbish (we're in the trial), recycling on 2026-11-03, glass on 2026-11-10. These match the council calendar for our address.

Anyone else can set their own day and dates under "Your bin weeks". That saves to their browser only (localStorage key `merribek-bin-night.v2`).

Other rules the page follows:

- Dates are worked out in Melbourne time. From noon on collection day it moves on to the next week.
- No collections on Christmas Day, New Year's Day, Good Friday or Anzac Day (from the council calendar's legend). In those weeks, collections from the holiday on move a day later. The council published that rule for Christmas and New Year 2024–25. Good Friday and Anzac Day are assumed to work the same way, and the page tells people to check the council calendar those weeks.
- Other public holidays, like Cup Day, are normal collection days. The page notes them.

All the date logic lives in `<script id="bin-logic">`, which doesn't touch the page, so it can be tested in Node.

## Checks

`node test/dates.js` checks the date logic against the council calendar for our address (every Tuesday from 3 November to 29 December 2026), the council's Christmas 2024–25 notice and the holiday rules, and syntax-checks the page script. All passing at v1.1.0.

The page was also checked at phone width in light and dark mode.

## Hosting

GitHub Pages, served from `main` at the repo root. The empty `.nojekyll` file stops GitHub's Jekyll step touching the files; the page itself is plain HTML with no build.

Everything the page links out to is an absolute URL (Google Fonts, and the council's bins page in the footer), so it works from the `/bin-night/` subpath that a project site is served on.

## Icon

The home-screen icon is the app's own bin with a yellow lid (Jam's pick from the four lid colours) and a b in Overpass ExtraBold, standing on the kerb. The files are in `icons/`: `icon.svg` is the master and the browser-tab icon, `apple-touch-icon.png` (180px) is what iPhones use, `icon-192.png` and `icon-512.png` are for Android and desktop, and `icon-maskable-512.png` has a smaller bin that survives Android's round mask. `favicon-32.png` is a fallback for browsers without SVG favicons.

`manifest.webmanifest` names the app "Bin night" and opens it full screen from the home screen. iPhones keep the icon from when the app was added, so remove it from the home screen and add it again to pick up a new one.

## Next

1. v1.0.0 is live at https://jamien-liston.github.io/bin-night/. v1.1.0 adds the icon and manifest and is waiting for Jam to commit, tag and push.
2. Add a service worker so it opens offline, with the usual cache-version rule.

## Backlog

- Look up the council's service alerts (like the ASU industrial-action notice about bin collections, November 2026) and show them in the app. The browser can't read the council site directly, so this needs a small proxy, probably a Cloudflare Worker.
- Rubbish goes fortnightly across Merri-bek from mid-2027, with trial streets staying as they are. Update the default setting and the page copy then.
