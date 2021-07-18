import { Transition } from '@headlessui/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { useBoolean } from 'react-use';
import MetaverseSlider from '../components/MetaverseSlider';
import VendorConversation from '../components/VendorConversation';

export default function Home() {
  const [journeyToVendorComlpete, setJourneyToVendorComplete] = useBoolean(false);
  const metaverseSliderOnEndReached = useCallback(() => setJourneyToVendorComplete(true), [setJourneyToVendorComplete]);

  const [conversationComplete, setConversationComplete] = useBoolean(false);
  const vendorConversationOnComplete = useCallback(() => setConversationComplete(true), [setConversationComplete]);

  return (
    <div className="cursor-pointer">
      <Head>
        <title>CanalSt.Fun | The Canal Street of NFTs</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      {/* Journey to Vendor Metaverse Slider */}
      <MetaverseSlider onEndReached={metaverseSliderOnEndReached} />
      {/* Vendor Conversation */}
      <Transition
        as="div"
        show={journeyToVendorComlpete}
        enter="transition-all ease-in-out duration-600"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <VendorConversation onConversationComplete={vendorConversationOnComplete} />
      </Transition>
      {/* Enter Store Link */}
      <Transition
        as="div"
        show={conversationComplete}
        enter="transition-all ease-in-out duration-1000"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-all ease-in-out duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Link href="/replicas">
          <a className="fixed inset-0 flex items-center justify-center text-xl font-medium text-center text-green-400 bg-black bg-opacity-50 backdrop-blur-lg hover:text-green-100 font-style-ipm" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
            Click to step inside store...
          </a>
        </Link>
      </Transition>
    </div>
  )
}
