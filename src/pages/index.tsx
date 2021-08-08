import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { useBoolean, useCounter } from 'react-use';
import IntroJourneyToVendorSlider from '../components/features/IntroJourneyToVendorSlider';
import NFTResult from '../components/features/NFTResult';
import NFTInputUrlOrAddress from '../components/views/NFTInputURLOrAddress';
import ProgressBar from '../components/views/ProgressBar';
import VendorConversationRenderer from '../components/views/VendorConversationRenderer';

export default function CanalStFun(): ReactElement {
  const [journeyToVendorComlpete, setJourneyToVendorComplete] = useBoolean(false);
  const onJourneyToVendorComplete = useCallback(() => setJourneyToVendorComplete(true), [setJourneyToVendorComplete]);

  const [conversationCurrentSpokenItem, conversationCurrentSpokenItemActions] = useCounter(0);
  const onClickSwitchNFT = useCallback(() => conversationCurrentSpokenItemActions.set(8), [conversationCurrentSpokenItemActions]);
  const onClickPrev = useCallback(() => conversationCurrentSpokenItemActions.dec(), [conversationCurrentSpokenItemActions]);
  const onClickNext = useCallback(() => conversationCurrentSpokenItemActions.inc(), [conversationCurrentSpokenItemActions]);

  const [nftUrlOrAddress, setNftUrlOrAddress] = useState<{ address?: string; tokenId?: string }>({});
  const onNftUrlOrAddress = useCallback((value) => {
    setNftUrlOrAddress(value);
    conversationCurrentSpokenItemActions.inc(value.tokenId ? 3 : 1);
  }, [onClickNext, setNftUrlOrAddress]);

  const [tokenIdInputValue, setTokenIdInputValue] = useState<string>();
  const onChangeTokenIdInputValue = useCallback((e) => setTokenIdInputValue(e.target.value), [setTokenIdInputValue]);


  const nftAddress = nftUrlOrAddress.address;
  const nftTokenId = useMemo(() => nftUrlOrAddress.tokenId ?? (conversationCurrentSpokenItem > 9 && tokenIdInputValue), [conversationCurrentSpokenItem, tokenIdInputValue]);

  return (
    <div>
      <DefaultSeo
        canonical='https://canalst.fun'
        defaultTitle="CanalSt.Fun | The Canal Street of NFTs"
        description="If the metaverse had a place where you could buy bootleg NFTs, this would be it."
        openGraph={{
          type: 'website',
          title: 'The Canal Street of NFTs',
          description: 'If the metaverse had a place where you could buy bootleg NFTs, this would be it.',
          defaultImageHeight: 627,
          defaultImageWidth: 1200,
          images: [
            { url: 'https://canalst.fun/og-canal-st.jpg', alt: 'Canal Street', height: 627, width: 1200 },
          ],
          locale: 'en_US',
          url: 'https://canalst.fun',
          site_name: 'CanalSt.fun',
        }}
        twitter={{
          handle: '@danscan',
          site: '@danscan',
          cardType: 'summary_large_image',
        }}
      />
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      {/* Intro: Journey to Vendor Slider */}
      <IntroJourneyToVendorSlider onEndReached={onJourneyToVendorComplete} />
      {/* Vendor Conversation */}
      <Transition
        as="div"
        className="fixed inset-0 flex flex-col items-stretch overflow-hidden bg-green-800 bg-opacity-90"
        show={journeyToVendorComlpete}
        enter="transition-all ease-in-out duration-600"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <VendorConversationRenderer currentSpokenItem={conversationCurrentSpokenItem}>
          <VendorConversationRenderer.SpokenSpeechMessage
            message="<p>Hey there.</p>"
            keyDelay={1}
            speaker="TheVendor"
          />
          <VendorConversationRenderer.SpokenSpeechMessage
            message="<p>Thanks for stopping by.</p>"
            speaker="TheVendor"
          />
          <VendorConversationRenderer.SpokenSpeechMessage
            keyDelay={10}
            message={`<p>We sell ... ahem ... <i>"authentic"<i> NFTs for cheap.</p>`}
            speaker="TheVendor"
          />
          <VendorConversationRenderer.SpokenSpeechMessage
            keyDelay={10}
            message="<p>Let me know if there is any NFT in particular you have your eye on.</p>"
            pause={100}
            speaker="TheVendor"
          />
          <VendorConversationRenderer.SpokenSpeechMessage
            keyDelay={10}
            message="<p>I can check if we have it in stock...</p>"
            pause={100}
            speaker="TheVendor"
          />
          <VendorConversationRenderer.SpokenSpeechMessage
            message="<p>Funny you should ask...... I'm glad I happened by you today.</p>"
            speaker="You"
          />
          <VendorConversationRenderer.SpokenSpeechMessage
            keyDelay={10}
            message="<p>There actually are some NFTs I'd love to see in my wallet.</p>"
            speaker="You"
          />
          <VendorConversationRenderer.SpokenSpeechMessage
            message="<p>Great, then please paste the NFT url or token address...</p>"
            pause={100}
            speaker="TheVendor"
          />
          <VendorConversationRenderer.SpokenItem speaker="You">
            <NFTInputUrlOrAddress
              className="w-full p-2 bg-transparent bg-white bg-opacity-25 rounded-lg rounded-bl-none outline-none lg:p-4 placeholder-green-50 focus:outline-white place holder-opacity-80"
              onChangeValue={onNftUrlOrAddress}
            />
            <div className="pt-2 space-y-2">
              <div className="text-xs font-style-ipm">
                Paste a url to the token you want, for example, a url from Rarible, OpenSea, or Etherscan.
              </div>
              <div className="text-xs font-style-ipm">
                This field accepts urls that contain a token contract address (beginning with 0x) and a token ID (number).
              </div>
            </div>
          </VendorConversationRenderer.SpokenItem>
          <VendorConversationRenderer.SpokenSpeechMessage
            message={`<p>Thanks. So the contract address is ${nftUrlOrAddress.address}...... Now just paste the token ID.</p>`}
            pause={100}
            speaker="TheVendor"
          />
          <VendorConversationRenderer.SpokenItem speaker="You">
            <input
              className="w-full p-4 bg-transparent bg-white bg-opacity-25 rounded-lg rounded-bl-none outline-none placeholder-green-50 focus:outline-white place holder-opacity-80"
              onChange={onChangeTokenIdInputValue}
              placeholder="Enter Token ID and press next"
              value={tokenIdInputValue}
            />
          </VendorConversationRenderer.SpokenItem>
          <VendorConversationRenderer.SpokenItem speaker="TheVendor">
            {(nftAddress && nftTokenId) && <NFTResult nftAddress={nftAddress} nftTokenId={nftTokenId} />}
          </VendorConversationRenderer.SpokenItem>
        </VendorConversationRenderer>
        {/* Conversation Controls */}
        <VendorConversationControls
          currentItem={conversationCurrentSpokenItem}
          disableNext={conversationCurrentSpokenItem === 10 && !tokenIdInputValue}
          onClickNext={![8, 11].includes(conversationCurrentSpokenItem) ? onClickNext : undefined}
          onClickPrev={conversationCurrentSpokenItem > 0 && conversationCurrentSpokenItem <= 8 ? onClickPrev : undefined}
          onClickSwitchNFT={conversationCurrentSpokenItem > 8 ? onClickSwitchNFT : undefined}
        />
      </Transition>
    </div>
  )
}

type VendorConversationControlsProps = {
  currentItem: number;
  disableNext: boolean;
  onClickNext?: () => void;
  onClickPrev?: () => void;
  onClickSwitchNFT?: () => void;
};

function VendorConversationControls({
  currentItem,
  disableNext,
  onClickNext,
  onClickPrev,
  onClickSwitchNFT,
}: VendorConversationControlsProps): ReactElement {
  return (
    <div className="flex-shrink-0 p-4">
      <div className="flex justify-center space-x-4">
        {onClickPrev && (
          <button className="px-4 py-2 text-lg bg-green-800 rounded-lg lg:px-8 lg:py-4 lg:text-4xl lg:rounded-2xl font-style-ipm hover:bg-green-900 text-green-50 opacity-40 hover:opacity-90" onClick={onClickPrev}>
            Prev
          </button>
        )}
        {onClickSwitchNFT && (
          <button className="px-4 py-2 text-lg bg-gray-600 rounded-lg lg:px-8 lg:py-4 lg:text-4xl lg:rounded-2xl font-style-ipm hover:bg-gray-700 text-green-50" onClick={onClickSwitchNFT}>
            Switch NFT
          </button>
        )}
        {onClickNext && (
          <button
            className={classNames("px-4 py-2 lg:px-8 lg:py-4 text-lg lg:text-4xl bg-green-800 rounded-lg lg:rounded-2xl font-style-ipm hover:bg-green-900 text-green-50 transition-all", {
              'animate-bounce': currentItem === 0,
              'animate-pulse-slow': currentItem !== 0,
              'animate-none cursor-not-allowed opacity-50': disableNext,
            })}
            onClick={onClickNext}
            disabled={disableNext}
          >
            Next
          </button>
        )}
      </div>
      {/* Conversation Progress Bar */}
      <Transition
        as="div"
        className="transition-all ease-in-out transform duration-400"
        show={currentItem < 11}
        enterFrom="translate-y-96 opacity-0"
        enterTo="translate-y-0 opacity-100"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="translate-y-96 opacity-0"
      >
        <ProgressBar
          className="relative h-4 max-w-3xl mx-auto my-4 border-2 border-green-200 border-opacity-90 rounded-3xl bg-blend-screen mix-blend-screen"
          classNameValueComplete="bg-white bg-opacity-100 animate-pulse rounded-3xl"
          classNameValueIncomplete="bg-green-200 bg-opacity-90 rounded-3xl"
          progress={currentItem / 10}
        />
      </Transition>
    </div>
  );
}