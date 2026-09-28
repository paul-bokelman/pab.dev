// One class flip, not two cross-faded layers: layers can both be half-hidden on the frame they swap.
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  Promise.all(["Primary", "Secondary"].map((face) => document.fonts.load(`28px "Woolbound ${face}"`))).then(() =>
    setInterval(() => document.documentElement.classList.toggle("boil"), 200),
  );
}
