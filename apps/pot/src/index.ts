import { page, underConstruction } from "./page";
import { pot } from "./pot";
import { raised } from "./stripe";

interface Env {
  STRIPE_KEY: string;
  // Set only by `bun run dev`: the meter reads a fake in-memory pot instead of Stripe.
  DEV_TOOLS: string;
}

let fakeCents = 0;

const html = (body: string) => new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8" } });

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (env.DEV_TOOLS) {
      const dollars = Number(url.searchParams.get("dollars"));
      if (url.pathname === "/dev/add") fakeCents += Math.round(dollars * 100) || 0;
      if (url.pathname === "/dev/set") fakeCents = Math.max(0, Math.round(dollars * 100) || 0);
      if (url.pathname === "/dev/construction") return html(underConstruction());
      if (url.pathname.startsWith("/dev/")) return Response.redirect(new URL("/", url).href, 303);
      if (url.pathname === "/") return html(page(fakeCents, true));
    }

    if (url.pathname !== "/") return new Response("Not found", { status: 404 });
    if (pot.underConstruction) return html(underConstruction());

    // One Stripe read a minute, however many people are watching.
    const key = new Request(new URL(`/raised/${pot.paymentLinkId}`, url));
    const cached = await caches.default.match(key);
    let cents: number;
    if (cached) {
      cents = Number(await cached.text());
    } else {
      try {
        cents = await raised(env.STRIPE_KEY, pot.paymentLinkId);
      } catch (error) {
        console.error(error);
        return new Response("Couldn't reach Stripe. Try again in a minute.", { status: 502 });
      }
      ctx.waitUntil(caches.default.put(key, new Response(String(cents), { headers: { "Cache-Control": "max-age=60" } })));
    }

    return html(page(cents));
  },
} satisfies ExportedHandler<Env>;
