// The current goal. Edit, then `bun run deploy`. A new goal needs a new Payment Link,
// or the meter keeps counting the old one's money.
export const pot = {
  // Live site shows only "under construction" and never calls Stripe. `bun run dev` ignores it.
  underConstruction: true,
  title: "Top comment dare",
  goal: 1000,
  promise: "If this hits $1,000, I'll do whatever the top comment on the video says.",
  video: "https://youtube.com/",
  paymentLink: "https://buy.stripe.com/test_placeholder",
  paymentLinkId: "plink_placeholder",
};
