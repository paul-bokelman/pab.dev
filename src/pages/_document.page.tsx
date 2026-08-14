import { Html, Head, Main, NextScript } from "next/document";

const Document: React.FC = () => {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/static/seo/favicon@0.5x.png" sizes="16x16" />
        <link rel="icon" type="image/png" href="/static/seo/favicon@1x.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/static/seo/favicon@2x.png" sizes="64x64" />
        <link rel="icon" type="image/png" href="/static/seo/favicon@3x.png" sizes="96x96" />
        <link rel="icon" type="image/png" href="/static/seo/favicon@4x.png" sizes="128x128" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="PAB" key="title" />
        <meta property="og:description" content="Paul A. Bokelman's Personal Site" key="description" />
        <meta property="og:type" content="website" key="type" />
        <meta property="og:image" content="/static/seo/og-image.png" key="image" />
        <meta property="og:image:width" content="1200" key="image-width" />
        <meta property="og:image:height" content="630" key="image-height" />
        <meta property="og:image:alt" content="PAB Banner" key="image-alt" />
        <meta property="og:locale" content="en_US" key="locale" />
        <meta property="og:site_name" content="PAB" key="site-name" />
        <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
        <meta name="twitter:site" content="@paul_bokelman" key="twitter-site" />
        <meta name="twitter:creator" content="@paul_bokelman" key="twitter-creator" />
        <meta name="twitter:title" content="PAB" key="twitter-title" />
        <meta name="twitter:description" content="Paul A. Bokelman's Personal Site" key="twitter-description" />
        <meta name="twitter:image" content="/static/seo/og-image.png" key="twitter-image" />
        <meta name="twitter:image:alt" content="PAB Banner" key="twitter-image-alt" />
        <meta name="theme-color" content="#13110f" />
        <link rel="apple-touch-icon" sizes="180x180" href="/static/seo/apple-touch-icon.png"></link>
        <noscript>
          {/* entrance animations start from opacity 0 — without js, show everything */}
          <style
            dangerouslySetInnerHTML={{
              __html: "[data-motion]{opacity:1!important;transform:none!important}",
            }}
          />
        </noscript>
      </Head>
      <body className="min-h-[100dvh] max-w-[100dvw] overflow-x-clip bg-gray-950 text-gray-250 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
