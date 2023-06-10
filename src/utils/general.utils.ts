import convert from "color-convert";

export const random = (min: number, max: number, whole?: boolean) => {
  const n = Math.random() * (max - min) + min;
  return whole ? Math.floor(n) : n;
};

export const hexToRGBA = (hex: string) => {
  return `rgba(${[...convert.hex.rgb(hex), 1].join(", ")})`;
};

export const adjustAlpha = (rgbaString: string, newAlpha: number | ((currentAlpha: number) => number)) => {
  const [r, g, b, a] = rgbaString.split("(")[1].split(")")[0].split(", ").map(Number);
  const alpha = typeof newAlpha === "function" ? (newAlpha(a) >= 1 ? 1 : newAlpha(a) <= 0 ? 0 : newAlpha(a)) : newAlpha;
  return `rgba(${[r, g, b, alpha].join(", ")})`;
};
