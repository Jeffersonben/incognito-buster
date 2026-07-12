# Incognito Reality Check

A consent-based Cloudflare Pages project that demonstrates a simple idea:

> Private browsing mainly protects local browser history and storage. It does not automatically erase server-side memory.

## What changed in this version

This version does **not** create a separate personalized link for each user.

Instead, the flow is:

1. User opens the public site URL.
2. User reads the consent notice and saves a demo name.
3. Cloudflare Pages Function creates a short-lived one-way hash from the visitor network IP and the current date.
4. The name is stored in Cloudflare KV for 24 hours.
5. User opens the **same site URL** in a private/incognito tab.
6. The server checks whether the same temporary hash exists.
7. If matched, the site shows the saved name and visit details.

## Privacy design

This project is designed for education and portfolio use.

It does not:

- Store raw IP addresses
- Use hidden browser fingerprinting
- Use canvas, audio, GPU, font, or WebGL fingerprinting
- Track users across other websites
- Sell or share data
- Store records permanently

It does:

- Require user consent before saving a demo identity
- Store a chosen display name
- Store browser/device labels for display only
- Store timestamps
- Use a short-lived IP-based hash without storing the raw IP
- Expire KV records after 24 hours
- Provide a delete button

## Important limitation

The no-link recognition method may fail if the user changes:

- Network
- VPN
- ISP-provided IP address

That is expected. This project demonstrates that server-side recognition can be possible, not that it is perfect.

## Cloudflare setup

Create a Cloudflare KV namespace and bind it to your Pages project.

Binding name must be exactly:

```txt
PRIVACY_DEMO_KV
```

Build settings:

```txt
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

## Project structure

```txt
functions/api/save-demo.js    Saves the demo identity
functions/api/whoami.js       Checks whether the server recognizes the visit
functions/api/delete-demo.js  Deletes the demo identity
src/main.jsx                  React app
src/styles.css                UI styles
```

## Recruiter-friendly explanation

I intentionally avoided invasive fingerprinting and raw IP storage. The project uses a consent-based, short-lived network hash to explain the difference between local browser privacy and server-side persistence.
