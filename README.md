# Incognito Myth Buster

A consent-first Cloudflare Pages project that explains what private browsing protects and what it does not protect.

## What the project demonstrates

This app shows that private/incognito browsing is mainly local-device privacy. It can help avoid saving browsing history, temporary cookies, and form data in the normal browser profile, but it does not erase data that a website already saved on its own server.

The demo uses a safe method:

1. The user gives consent.
2. The user enters a chosen display name.
3. A Cloudflare Pages Function stores the record in Cloudflare KV.
4. The app creates a random demo ID link.
5. The user opens that link in a private window.
6. The server returns the saved name and visit details.

## Safe design choices

This project intentionally avoids invasive recognition methods.

It does not collect:

- Passwords
- Raw IP addresses
- Precise location
- Browsing history
- Cross-site tracking data
- Browser fingerprints

Demo records expire after 24 hours.

## Features

- Consent-first demo flow
- Cloudflare KV server-side storage
- Private-tab test link
- Logged visit details
- Storage inspector for cookies, local storage, session storage, and server storage
- Explanation section: how websites can sometimes recognize returning visitors
- Privacy meter
- Quiz section
- Delete demo record button
- LinkedIn-friendly project explanation

## Tech stack

- React
- Vite
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare KV
- lucide-react icons

## Cloudflare setup

Create a KV namespace in Cloudflare, then add a KV binding to your Pages project.

Binding variable name must be exactly:

```text
PRIVACY_DEMO_KV
```

Add the binding to both Production and Preview environments.

## Build settings

Cloudflare Pages settings:

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

## Local development

```bash
npm install
npm run dev
```

For full Cloudflare Function + KV testing, use Cloudflare's Pages development tooling or deploy to Cloudflare Pages.

## Recruiter-friendly explanation

I built this project to explain the difference between browser-side privacy and server-side persistence. I intentionally avoided browser fingerprinting and raw IP storage, using a consent-based demo token instead. This demonstrates both technical understanding and privacy-aware engineering.
