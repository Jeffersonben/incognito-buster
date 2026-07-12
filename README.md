# Incognito Buster: Beginner-Friendly Privacy Demo

A Cloudflare Pages project that explains, in plain language, why private/incognito browsing does not make a visitor invisible to websites.

## What this version does

- No personalized demo link
- User saves a name in a normal tab
- User opens the same site URL in a private/incognito tab
- The site checks whether the server has a temporary demo record
- Uses a temporary hashed network key
- Does not store raw IP addresses
- Does not use invasive browser fingerprinting
- Demo records expire after 24 hours
- Includes beginner-friendly step-by-step instructions
- Quiz section removed

## What this project teaches

Private browsing mainly reduces what is saved on the local device, such as browser history and private-session cookies. It does not automatically delete information that a website already saved on its own server.

## Cloudflare setup

### Build settings

Use these Cloudflare Pages build settings:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: leave empty

### KV binding

Create a Cloudflare KV namespace and bind it to the Pages project.

Binding variable name must be exactly:

```text
PRIVACY_DEMO_KV
```

Add the binding for both Production and Preview environments if Cloudflare shows both.

## Local development

```bash
npm install
npm run dev
```

Cloudflare KV will only work correctly in the Cloudflare Pages runtime unless you configure local Cloudflare development tooling.

## Privacy notes

This project is for education only. It does not store raw IP addresses, passwords, emails, or browsing history. It stores only the user's chosen display name, browser type, device type, timestamp, and a temporary server-side record that expires after 24 hours.
