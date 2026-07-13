# Incognito Buster

A beginner-friendly cybersecurity awareness project that explains one important browser privacy idea:

> Private browsing protects data stored inside your browser, but it does not automatically erase data already saved by a website on its server.

This project is designed as a portfolio-ready educational demo for recruiters and non-technical users.

## Live demo flow

1. Open the site in a normal browser tab.
2. Read the consent notice and save a display name.
3. Open a private/incognito window.
4. Visit the same site URL, without using any personalized link.
5. The site checks Cloudflare KV for a short-lived server-side demo record and explains where the name came from.

## What this project does

- Shows the difference between browser-side storage and server-side storage.
- Uses Cloudflare Pages Functions as the backend.
- Stores demo records in Cloudflare KV for 24 hours.
- Uses a temporary hashed recognition key.
- Avoids personalized demo links.
- Avoids raw IP storage.
- Avoids invasive browser fingerprinting.
- Allows users to delete their demo record.
- Provides beginner-friendly instructions directly in the UI.

## What this project does not do

- It does not hack private browsing.
- It does not read browser history.
- It does not access passwords.
- It does not track users across other websites.
- It does not store raw IP addresses.

## Tech stack

- React
- Vite
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare KV
- Vitest
- Vanilla CSS

## Project structure

```text
src/
  App.jsx
  main.jsx
  hooks/
    useDemo.js
  components/
    DemoForm.jsx
    Icons.jsx
    InfoSections.jsx
    ResultCard.jsx
    SmallPieces.jsx
functions/api/
  _constants.js
  _utils.js
  save-demo.js
  whoami.js
  delete-demo.js
public/
  _headers
tests/
  utils.test.js
```

## Security notes

The demo uses several privacy and safety controls:

- User consent is required before saving a demo record.
- Names are trimmed and capped to 60 characters on the server.
- Demo records expire after 24 hours using Cloudflare KV TTL.
- Records can be deleted by the user.
- Security headers are configured in `public/_headers`.
- A small save cooldown is enforced to reduce repeated KV write spam.

For a public deployment, also consider Cloudflare dashboard rate limiting for `/api/save-demo`, for example 5 requests per minute per IP.

## Local commands

```bash
npm install
npm run dev
npm run build
npm test
```

## Note

Built an educational privacy demo using React, Cloudflare Pages Functions, and KV to explain server-side persistence across private browsing sessions with consent-gated, short-lived, hashed demo records.
