# pab.dev

Two Cloudflare Workers in a Bun workspace.

| App | Domain | What |
| --- | --- | --- |
| `apps/web` | pab.dev | Static landing page (`public/`) and the shared wordmark (`public/wordmark/`) |
| `apps/pot` | pot.pab.dev | One funding goal with a meter, paid through a Stripe Payment Link |

```sh
bun install
bun run dev          # pab.dev on :8787, pot on :8788 with a fake pot and a dev bar
bun run test && bun run typecheck
bun run deploy       # both Workers
```

## pot

The goal lives in `apps/pot/src/pot.ts`. While `underConstruction` is on, the live page
says only that and never calls Stripe. The meter is the sum of paid Checkout Sessions
on that Payment Link, read from Stripe and cached for a minute. There is no database.

To start a goal:

1. Stripe → Payment Links → new link, product "Pot", **customer chooses price**.
   Optionally set its after-payment redirect to `https://pot.pab.dev`.
2. Put its URL and `plink_…` id in `pot.ts`, along with the title, goal and promise.
3. Once per account: create a restricted key with **Checkout Sessions: Read** only, then
   `cd apps/pot && bunx wrangler secret put STRIPE_KEY`.
4. `bun run deploy`.

`bun run dev` never touches Stripe: the dev bar and the "Add to the pot" button move a
fake in-memory total, and it links to the under-construction page. To try the real path, put a test-mode key in `apps/pot/.dev.vars`
and a test Payment Link in `pot.ts`, then `cd apps/pot && bun run dev:stripe`.

Refunds are not subtracted from the meter.
