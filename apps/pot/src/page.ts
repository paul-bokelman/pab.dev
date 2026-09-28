import { pot } from "./pot";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const escape = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function page(cents: number, dev = false) {
  const dollars = Math.floor(cents / 100);
  const percent = Math.floor((dollars / pot.goal) * 100);
  const title = escape(pot.title);
  const promise = escape(pot.promise);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${promise}" />
    <style>
      :root { color-scheme: light; }
      html, body { margin: 0; background: #fff; color: #000; }
      body { min-height: 100svh; display: grid; place-items: center; font: 15px/1.5 ui-sans-serif, system-ui, sans-serif; }
      main { width: min(560px, 100% - 32px); }
      .title { color: #888; font-size: 13px; }
      .percent { font-size: clamp(72px, 22vw, 128px); font-weight: 600; line-height: 1; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; margin: 8px 0 20px; }
      .meter { height: 20px; background: #eee; border-radius: 10px; overflow: hidden; }
      .fill { height: 100%; background: #000; }
      .amount { margin: 10px 0 32px; font-variant-numeric: tabular-nums; }
      .amount span { color: #888; }
      .promise { font-size: 18px; margin: 0 0 32px; }
      .actions { display: flex; align-items: center; gap: 20px; }
      .give { background: #000; color: #fff; padding: 12px 22px; border-radius: 999px; text-decoration: none; }
      .watch { color: #888; }
      .dev { position: fixed; left: 0; right: 0; bottom: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; padding: 10px 16px; background: #f6f6f6; border-top: 1px solid #e5e5e5; font: 12px/1.4 ui-monospace, monospace; }
      .dev a { color: #000; }
      .dev input { width: 72px; font: inherit; }
    </style>
  </head>
  <body>
    <main>
      <div class="title">${title}</div>
      <div class="percent">${percent}%</div>
      <div class="meter"><div class="fill" style="width: ${Math.min(percent, 100)}%"></div></div>
      <div class="amount">${usd.format(dollars)} <span>of ${usd.format(pot.goal)}</span></div>
      <p class="promise">${promise}</p>
      <div class="actions">
        <a class="give" href="${dev ? "/dev/add?dollars=25" : escape(pot.paymentLink)}">Add to the pot</a>
        <a class="watch" href="${escape(pot.video)}">Watch the video</a>
      </div>
    </main>${dev ? devBar() : ""}
  </body>
</html>`;
}

// Local only. "Add to the pot" above also adds $25 instead of opening Stripe.
const devBar = () => `
    <form class="dev" action="/dev/set">
      <strong>dev</strong>
      <a href="/dev/add?dollars=10">+$10</a>
      <a href="/dev/add?dollars=100">+$100</a>
      <a href="/dev/add?dollars=${pot.goal}">+goal</a>
      <a href="/dev/set?dollars=${pot.goal - 1}">$1 short</a>
      <a href="/dev/set?dollars=0">reset</a>
      <a href="/dev/construction">under construction</a>
      <label>set $<input name="dollars" type="number" min="0" /></label>
    </form>`;

export const underConstruction = () => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>pot</title>
    <link rel="stylesheet" href="/wordmark/wordmark.css" />
    <style>
      :root { color-scheme: light; }
      html, body { height: 100%; margin: 0; background: #fff; color: #000; }
      body { display: grid; place-items: center; }
    </style>
  </head>
  <body>
    <h1 class="wordmark"><span>under construction</span><span aria-hidden="true">under construction</span></h1>
  </body>
</html>`;
