import type { AppProps } from "next/app";
import Head from "next/head";
import "styles/global.css";
import "styles/syntax/kimber.css";
import { Layout } from "components/layout";

function PaulBokelman({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>Paul A. Bokelman</title>
        <meta name="description" content="PAB personal website" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default PaulBokelman;
