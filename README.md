# Bright Futures Foundation — 2-page NGO website

A responsive static website concept for a child-education NGO. The organisation name is a temporary placeholder because the final name has not been chosen.

## Pages
- `index.html` — Home page
- `about.html` — About, mission, focus areas, get involved and contact

## Run locally
Open `index.html` in a browser, or from this folder run:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Before publishing
1. Replace **Bright Futures Foundation** with the approved NGO name in both HTML files.
2. Replace `hello@example.org` with the organisation's real email address in `about.html` and `script.js`.
3. Add the real city/address, phone number, registration details (if applicable), leadership/team details and social links.
4. The impact figures have intentionally been omitted rather than inventing results. Add only verified programme statistics.
5. The contact form currently opens the visitor's email app using `mailto:`. Connect Formspree, Netlify Forms or a backend to receive submissions directly.
6. Photos and Google Fonts are loaded from external services, so an internet connection is needed for those assets.

## Deploy free
You can publish this folder with Netlify (drag and drop) or GitHub Pages. No build step is required.
