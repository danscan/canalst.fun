import { Transition } from '@headlessui/react';
import Head from 'next/head';
import React, { useCallback } from 'react';
import { useBoolean, useCounter } from 'react-use';
import MetaverseSlider from '../components/MetaverseSlider';
import NFTForm from '../components/NFTInput';
import VendorConversation from '../components/VendorConversation';

export default function Home() {
  const [journeyToVendorComlpete, setJourneyToVendorComplete] = useBoolean(false);
  const metaverseSliderOnEndReached = useCallback(() => setJourneyToVendorComplete(true), [setJourneyToVendorComplete]);

  const [conversationCurrentSpokenItem, conversationCurrentSpokenItemActions] = useCounter(0);
  const onClickPrev = useCallback(() => conversationCurrentSpokenItemActions.dec(), [conversationCurrentSpokenItemActions]);
  const onClickNext = useCallback(() => conversationCurrentSpokenItemActions.inc(), [conversationCurrentSpokenItemActions]);

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
        <VendorConversation currentSpokenItem={conversationCurrentSpokenItem}>
          <VendorConversation.SpokenSpeechMessage
            message="<p>Hey there.</p>"
            keyDelay={1}
            speaker="TheVendor"
          />
          <VendorConversation.SpokenSpeechMessage
            message="<p>Thanks for stopping by.</p>"
            speaker="TheVendor"
          />
          <VendorConversation.SpokenSpeechMessage
            keyDelay={45}
            message={`<p>We sell ... ahem ... <i>"authentic"<i> NFTs for cheap.</p>`}
            speaker="TheVendor"
          />
          <VendorConversation.SpokenSpeechMessage
            keyDelay={45}
            message="<p>Let me know if there is any NFT in particular you have your eye on.</p>"
            pause={100}
            speaker="TheVendor"
          />
          <VendorConversation.SpokenSpeechMessage
            keyDelay={45}
            message="<p>I can check if we have it in stock...</p>"
            pause={100}
            speaker="TheVendor"
          />
          <VendorConversation.SpokenSpeechMessage
            message="<p>Funny you should ask...... I'm glad I happened by you today.</p>"
            speaker="You"
          />
          <VendorConversation.SpokenSpeechMessage
            keyDelay={45}
            message="<p>There actually are some NFTs I've been thinking I'd love to see in my wallet.</p>"
            speaker="You"
          />
          <VendorConversation.SpokenSpeechMessage
            message="<p>Great, then please paste the NFT url or token address...</p>"
            pause={100}
            speaker="TheVendor"
          />
          <VendorConversation.SpokenItem speaker="You">
            <NFTForm onAskForNFT={() => null} />
          </VendorConversation.SpokenItem>
        </VendorConversation>
        {/* Conversation Controls */}
        <div className="fixed inset-x-0 bottom-0 flex justify-center p-4 space-x-4">
          <button className="px-4 py-2 bg-green-800 rounded-lg font-style-ipm hover:bg-green-900 text-green-50 opacity-40 hover:opacity-90" onClick={onClickPrev}>Prev</button>
          <button className="px-4 py-2 bg-green-800 rounded-lg font-style-ipm hover:bg-green-900 text-green-50" onClick={onClickNext}>Next</button>
        </div>
      </Transition>
    </div>
  )
}
