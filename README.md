# Cubelated Portfolio

The source for [cubelated.com](https://cubelated.com), the personal portfolio of
Hanssen Budisantoso Wijaya — a software engineer building purposeful mobile
products and distributed systems under the mission **Building to Impact Lives**.

Visitors can choose between the playable pixel journey and a conventional quick
view with selected case studies, evidence-backed expertise, professional impact,
engineering decision notes, and current work.

## Stack

- [Vinext](https://github.com/cloudflare/vinext) and React
- Vite
- Cloudflare Workers
- TypeScript
- Plain CSS with Lucide icons

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

The development server is available at `http://localhost:5173`.

## Validation

```bash
npm test
```

## Deploying to Cloudflare

The production Worker is configured for `cubelated.com` and
`www.cubelated.com`. The `www` hostname permanently redirects to the apex
domain.

```bash
npm run deploy:cloudflare
```

Cloudflare authentication and an active `cubelated.com` zone are required.

## License

The website source is shared for portfolio and learning purposes. Personal
content, branding, photographs, and project media remain the property of their
respective owners.
