import { expect, test } from "bun:test";
import { raised } from "./stripe";

test("sums paid sessions across pages", async () => {
  const urls: string[] = [];
  const pages = [
    { data: [{ id: "cs_1", payment_status: "paid", amount_total: 500 }, { id: "cs_2", payment_status: "unpaid", amount_total: 900 }], has_more: true },
    { data: [{ id: "cs_3", payment_status: "paid", amount_total: 2500 }], has_more: false },
  ];
  const fetcher = (async (url: string) => {
    urls.push(url);
    return Response.json(pages[urls.length - 1]);
  }) as unknown as typeof fetch;

  expect(await raised("rk", "plink_1", fetcher)).toBe(3000);
  expect(urls[0]).toContain("payment_link=plink_1");
  expect(urls[0]).toContain("status=complete");
  expect(urls[1]).toContain("starting_after=cs_2");
});

test("throws when Stripe refuses", async () => {
  const fetcher = (async () => new Response("nope", { status: 401 })) as unknown as typeof fetch;
  await expect(raised("rk", "plink_1", fetcher)).rejects.toThrow("Stripe 401");
});
