import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,400;0,700;1,400;1,700&family=IBM+Plex+Mono:wght@500&family=Inter:wght@400;500;700;900&family=Tenor+Sans&display=swap" rel="stylesheet" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-W0DL6V8L3W" />
          <script dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-W0DL6V8L3W');
          `}} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
