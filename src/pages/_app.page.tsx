import type { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import { Reenie_Beanie } from "next/font/google";
import { MotionConfig } from "motion/react";
import "styles/global.css";
import "styles/syntax/kimber.css";
import { Layout } from "components/layout";
import { SoundProvider } from "components/sound";

const sans = localFont({
  src: "../../public/fonts/Geist-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist-sans",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const mono = localFont({
  src: "../../public/fonts/GeistMono-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist-mono",
  fallback: ["ui-monospace", "monospace"],
});

// Zodiak — a didone revival from ITF, drawn for editorial setting
const serif = localFont({
  src: [
    { path: "../../public/fonts/Zodiak-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/Zodiak-VariableItalic.woff2", weight: "100 900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-serif",
  fallback: ["ui-serif", "Georgia", "serif"],
});

// Departure Mono — the bitmap face, used as a texture rather than for reading
const fancy = localFont({
  src: "../../public/fonts/DepartureMono-Regular.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-fancy",
  fallback: ["ui-monospace", "monospace"],
});

const handwritten = Reenie_Beanie({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-handwritten",
  adjustFontFallback: false,
  fallback: ["cursive"],
});

function PaulBokelman({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${sans.variable} ${mono.variable} ${serif.variable} ${fancy.variable} ${handwritten.variable} font-sans`}
    >
      {/* the font variables are declared on a wrapper, so lift them to :root as well */}
      <style jsx global>{`
        html {
          --font-geist-sans: ${sans.style.fontFamily};
          --font-geist-mono: ${mono.style.fontFamily};
          --font-serif: ${serif.style.fontFamily};
          --font-fancy: ${fancy.style.fontFamily};
          --font-handwritten: ${handwritten.style.fontFamily};
        }
      `}</style>
      <Head>
        <title>Paul A. Bokelman</title>
        <meta name="description" content="paul a. bokelman — computer scientist" />
      </Head>
      <MotionConfig reducedMotion="user">
        <SoundProvider>
          <Layout>
            <Analytics />
            <Component {...pageProps} />
          </Layout>
        </SoundProvider>
      </MotionConfig>
    </div>
  );
}

export default PaulBokelman;
