import Head from 'next/head';
import Image from 'next/image';
import React, { ReactElement } from 'react';
import storeImage from '../assets/metaverse-store.jpg';

export default function PageReplicas(): ReactElement {
  return (
    <div>
      <Head>
        <title>CanalSt.Fun | The Canal Street of NFTs</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      {/* Fixed Background Image */}
      <Image className="fixed inset-0" layout="fill" objectFit="cover" placeholder="blur" src={storeImage} />
      {/* Foreground Content */}
      <div className="min-h-screen p-8 bg-green-900 bg-opacity-50 backdrop-blur-md">
      </div>
    </div>
  );
}