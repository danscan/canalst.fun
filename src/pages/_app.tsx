import { getDefaultProvider, Contract } from 'ethers';
import { NftProvider } from 'use-nft';
import 'tailwindcss/tailwind.css'
import '../styles/app.css';

const nftFetcher = ['ethers', { ethers: { Contract }, provider: getDefaultProvider() }];

export default function CustomApp({ Component, pageProps }) {
  if (!process.browser) {
    return <Component {...pageProps} />;
  }

  return (
    <NftProvider fetcher={nftFetcher}>
      <Component {...pageProps} />
    </NftProvider>
  );
}
