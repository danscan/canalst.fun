import { Transition } from '@headlessui/react';
import Head from 'next/head';
import React, { useCallback, useMemo, useState } from 'react';
import { useBoolean, useCounter } from 'react-use';
import useNft from '../hooks/useNFT';
import MetaverseSlider from '../components/MetaverseSlider';
import { NFTInputUrlOrAddress } from '../components/NFTInputs';
import VendorConversation from '../components/VendorConversation';
import ProgressBar from '../components/ProgressBar';
import classNames from 'classnames';

export default function Home() {
  const [journeyToVendorComlpete, setJourneyToVendorComplete] = useBoolean(false);
  const metaverseSliderOnEndReached = useCallback(() => setJourneyToVendorComplete(true), [setJourneyToVendorComplete]);

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
            keyDelay={10}
            message={`<p>We sell ... ahem ... <i>"authentic"<i> NFTs for cheap.</p>`}
            speaker="TheVendor"
          />
          <VendorConversation.SpokenSpeechMessage
            keyDelay={10}
            message="<p>Let me know if there is any NFT in particular you have your eye on.</p>"
            pause={100}
            speaker="TheVendor"
          />
          <VendorConversation.SpokenSpeechMessage
            keyDelay={10}
            message="<p>I can check if we have it in stock...</p>"
            pause={100}
            speaker="TheVendor"
          />
          <VendorConversation.SpokenSpeechMessage
            message="<p>Funny you should ask...... I'm glad I happened by you today.</p>"
            speaker="You"
          />
          <VendorConversation.SpokenSpeechMessage
            keyDelay={10}
            message="<p>There actually are some NFTs I've been thinking I'd love to see in my wallet.</p>"
            speaker="You"
          />
          <VendorConversation.SpokenSpeechMessage
            message="<p>Great, then please paste the NFT url or token address...</p>"
            pause={100}
            speaker="TheVendor"
          />
          <VendorConversation.SpokenItem speaker="You">
            <NFTInputUrlOrAddress onChangeValue={onNftUrlOrAddress} />
            <div className="pt-2 space-y-2">
              <div className="text-xs font-style-ipm">
                Paste a url to the token you want, for example, a url from Rarible, OpenSea, or Etherscan.
              </div>
              <div className="text-xs font-style-ipm">
                This field accepts urls that contain a token contract address (beginning with 0x) and a token ID (number).
              </div>
            </div>
          </VendorConversation.SpokenItem>
          <VendorConversation.SpokenSpeechMessage
            message={`<p>Thanks. So the contract address is ${nftUrlOrAddress.address}...... Now just paste the token ID.</p>`}
            pause={100}
            speaker="TheVendor"
          />
          <VendorConversation.SpokenItem speaker="You">
            <input
              className="w-full p-4 bg-transparent bg-white bg-opacity-25 rounded-lg rounded-bl-none outline-none placeholder-green-50 focus:outline-white place holder-opacity-80"
              onChange={onChangeTokenIdInputValue}
              placeholder="Enter Token ID and press next"
              value={tokenIdInputValue}
            />
          </VendorConversation.SpokenItem>
          <VendorConversation.SpokenItem speaker="TheVendor">
            {(nftAddress && nftTokenId) && <NFTResult nftAddress={nftAddress} nftTokenId={nftTokenId} />}
          </VendorConversation.SpokenItem>
        </VendorConversation>
        {/* Conversation Controls */}
        <div className="fixed inset-x-0 bottom-0 p-4">
          <div className="flex justify-center space-x-4">
            {conversationCurrentSpokenItem > 0 && conversationCurrentSpokenItem <= 8 && (
              <button className="px-4 py-2 text-lg bg-green-800 rounded-lg lg:px-8 lg:py-4 lg:text-4xl lg:rounded-2xl font-style-ipm hover:bg-green-900 text-green-50 opacity-40 hover:opacity-90" onClick={onClickPrev}>
                Prev
              </button>
            )}
            {conversationCurrentSpokenItem > 8 && (
              <button className="px-4 py-2 text-lg bg-gray-600 rounded-lg lg:px-8 lg:py-4 lg:text-4xl lg:rounded-2xl font-style-ipm hover:bg-gray-700 text-green-50" onClick={onClickSwitchNFT}>
                Switch NFT
              </button>
            )}
            {(![8, 11].includes(conversationCurrentSpokenItem)) && (
              <button
                className={classNames("px-4 py-2 lg:px-8 lg:py-4 text-lg lg:text-4xl bg-green-800 rounded-lg lg:rounded-2xl font-style-ipm hover:bg-green-900 text-green-50 transition-all", {
                  'animate-bounce': conversationCurrentSpokenItem === 0,
                  'animate-pulse-slow': conversationCurrentSpokenItem !== 0,
                  'animate-none cursor-not-allowed opacity-50': conversationCurrentSpokenItem === 10 && !tokenIdInputValue,
                })}
                onClick={onClickNext}
                disabled={conversationCurrentSpokenItem === 10 && !tokenIdInputValue}
              >
                Next
              </button>
            )}
          </div>
          {/* Conversation Progress Bar */}
          <ProgressBar
            className="relative h-4 max-w-3xl mx-auto my-4 border-2 border-green-200 border-opacity-90 rounded-3xl bg-blend-screen mix-blend-screen"
            classNameValueComplete="bg-white bg-opacity-100 animate-pulse rounded-3xl"
            classNameValueIncomplete="bg-green-200 bg-opacity-90 rounded-3xl"
            progress={conversationCurrentSpokenItem / 11}
          />
        </div>
      </Transition>
    </div>
  )
}

function NFTResult({
  nftAddress,
  nftTokenId,
}) {
  const nftState = useNft(nftAddress, nftTokenId);
  const ownerQuery = nftState.status === 'ready' && (nftState.ownerENSName || nftState.ownerAddress);

  return (
    <div className="flex flex-col py-4 space-y-4">
      {nftState.status === 'loading' && (
        <div>Checking...</div>
      )}
      {nftState.status === 'ready' && (
        <>
          {nftState.mediaElement}
          <div className="space-y-2">
            <div className="text-2xl">{nftState.name}</div>
          </div>
          <button className="px-4 py-2 text-lg font-medium text-white bg-blue-500 rounded-lg shadow-xl lg:px-8 lg:py-4 lg:text-4xl lg:rounded-2xl hover:bg-blue-600 font-body">
            Get Replica for $20
          </button>
          {nftState.ownerAddress && !nftState.ownerIsContract && (
            <div className="text-xs lg:text-sm">
              50% of payment will be sent to the NFT's current owner, <a href={`https://etherscan.io/enslookup-search?search=${encodeURIComponent(ownerQuery)}`} className="underline" target="_blank">{ownerQuery}</a>
            </div>
          )}
        </>
      )}
      {nftState.status === 'error' && (
        <div>
          <div className="text-xl">We couldn't find that NFT.</div>
          <div>We can replicate any ERC721 or ERC1155 NFT. Try hitting "Switch NFT" below and pasting a url from Rarible, OpenSea, or Etherscan.</div>
        </div>
      )}
    </div>
  );
}