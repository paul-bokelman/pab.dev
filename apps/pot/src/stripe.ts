type Session = { id: string; payment_status: string; amount_total: number | null };

// Cents paid through one Payment Link, straight from Stripe.
export async function raised(key: string, paymentLink: string, fetcher: typeof fetch = fetch) {
  let cents = 0;
  let after: string | undefined;
  do {
    const query = new URLSearchParams({ payment_link: paymentLink, status: "complete", limit: "100" });
    if (after) query.set("starting_after", after);
    const res = await fetcher(`https://api.stripe.com/v1/checkout/sessions?${query}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`Stripe ${res.status}: ${await res.text()}`);
    const page = (await res.json()) as { data: Session[]; has_more: boolean };
    for (const s of page.data) if (s.payment_status === "paid") cents += s.amount_total ?? 0;
    after = page.has_more ? page.data.at(-1)?.id : undefined;
  } while (after);
  return cents;
}
