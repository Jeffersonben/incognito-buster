# Incognito Myth Buster

A small Cloudflare Pages project that demonstrates a common privacy misconception:

> Private browsing protects local browser traces. It does not make you invisible to websites or erase information stored on a server.

## Features

- Normal-tab name saving demo
- Private/incognito test link
- Cloudflare Pages Functions API
- Cloudflare KV server-side storage
- Browser storage inspector
- Privacy meter
- Interactive quiz
- LinkedIn-ready educational UI

## How the demo works

1. User types a name in the normal tab.
2. `/api/save-demo` stores that name in Cloudflare KV.
3. The app creates a demo link with a random ID.
4. User opens the link in a private/incognito window.
5. `/api/get-demo` loads the name from the server.
6. The page explains that the data came from the server, not normal-tab browser storage.

## Deploy to Cloudflare Pages

### 1. Upload to GitHub

Create a GitHub repository and push this folder.

### 2. Create a Cloudflare Pages project

- Go to Cloudflare Dashboard
- Workers & Pages
- Create application
- Pages
- Connect your GitHub repository

### 3. Build settings

Use:

```txt
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

### 4. Add KV storage

Create a KV namespace in Cloudflare:

```txt
Name: privacy-demo-kv
```

Then bind it to your Pages project:

```txt
Variable name: PRIVACY_DEMO_KV
KV namespace: privacy-demo-kv
```

Add the binding for both Production and Preview if you want preview deployments to work too.

### 5. Deploy

Cloudflare will build and deploy the site.

## Local development note

The frontend can run locally with:

```bash
npm install
npm run dev
```

The API needs Cloudflare Pages Functions and KV. For full local API testing, use Wrangler with a KV binding.

## Ethical note

This project deliberately avoids hidden fingerprinting. It uses a visible demo ID link so users understand exactly how the server remembers the name.
