import React, { ReactElement, useCallback } from 'react';
import Image from 'next/image';
import Typewriter from 'typewriter-effect';
import vendorMetaverseMan from '../assets/metaverse-man.png';
import { useBoolean, useCounter, useVibrate } from 'react-use';
import { Transition } from '@headlessui/react';

interface VendorConversationProps {
  onConversationComplete: () => void;
}

export default function VendorConversation({
  onConversationComplete,
}: VendorConversationProps): ReactElement {
  const [currentMessageIndex, currentMessageIndexActions] = useCounter(0);
  const onMessageFinishedTyping = useCallback(() => currentMessageIndexActions.inc(), [currentMessageIndexActions]);
  const onMessageDisappeared = useCallback(() => currentMessageIndexActions.inc(), [currentMessageIndexActions]);

  return (
    <div className="fixed inset-0 bg-green-900 bg-opacity-75 backdrop-blur-md backdrop-brightness-200">
      {/* Top Half */}
      <Transition
        appear
        as="div"
        className="flex items-start p-4 space-x-4 h-1/2"
        enter="transition-opacity ease-in-out duration-500 delay-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        {/* Vendor Speech */}
        <div className="w-full max-h-full p-6 pb-4 text-lg text-white transition-all duration-300 ease-in-out bg-black border-2 border-white rounded-br-none shadow-md lg:p-8 lg:text-2xl backdrop-blur bg-opacity-10 bg-blend-multiply rounded-xl font-style-ipm">
          <div className="text-sm font-medium tracking-wider text-white uppercase font-style-ipm opacity-70">The Vendor:</div>
          {/* SpeechMessage currentMessageIndex increments by 2 to account for starting and ending each message's animation */}
          <SpeechMessage
            active={currentMessageIndex === 0}
            keyDelay={1}
            message="<p>Hey there!</p>"
            onFinishedTyping={onMessageFinishedTyping}
            onDisappeared={onMessageDisappeared}
          />
          <SpeechMessage
            active={currentMessageIndex === 2}
            message="<p>Thanks for stopping by.</p>"
            onFinishedTyping={onMessageFinishedTyping}
            onDisappeared={onMessageDisappeared}
          />
          <SpeechMessage
            active={currentMessageIndex === 4}
            keyDelay={45}
            message={`<p>We sell ... ahem ... <i>"authentic"<i> NFTs.</p>`}
            onFinishedTyping={onMessageFinishedTyping}
            onDisappeared={onMessageDisappeared}
          />
          <SpeechMessage
            active={currentMessageIndex === 6}
            message="<p>Let me know if there is any NFT in particular you have your eye on.</p>"
            pause={100}
            onFinishedTyping={onMessageFinishedTyping}
            onDisappeared={onMessageDisappeared}
          />
          <SpeechMessage
            active={currentMessageIndex >= 8 && currentMessageIndex <= 15}
            message="<p>I can check if we have it in stock...</p>"
            pause={100}
            onFinishedTyping={onMessageFinishedTyping}
            onDisappeared={onMessageDisappeared}
          />
          <SpeechMessage
            active={currentMessageIndex >= 16}
            message="<p>Great, then please paste in the NFT URL or token contract address and token ID...</p>"
            pause={100}
            onFinishedTyping={onMessageFinishedTyping}
            onDisappeared={onMessageDisappeared}
          />
        </div>
        {/* Vendor */}
        <div className="self-end lg:flex-shrink-0 animate-float">
          <Image className="w-full h-full" objectFit="contain" src={vendorMetaverseMan} />
        </div>
      </Transition>
      {/* Bottom Half */}
      <Transition
        show={currentMessageIndex >= 9}
        as="div"
        className="flex items-start p-8 h-1/2"
        enter="transition-opacity ease-in-out duration-500 delay-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        afterEnter={onMessageFinishedTyping}
      >
        <div className="w-full max-h-full p-6 pb-4 text-lg italic font-semibold text-white transition-all duration-300 ease-in-out bg-gray-400 bg-opacity-50 border-2 border-green-100 rounded-br-none shadow-xl lg:p-8 lg:text-2xl backdrop-blur bg-blend-multiply rounded-xl font-body">
          <div className="text-sm font-medium tracking-wider text-white uppercase font-style-ipm opacity-70">You:</div>
          <SpeechMessage
            active={currentMessageIndex === 10}
            message="<p>Funny you should ask...</p>"
            onFinishedTyping={onMessageFinishedTyping}
            onDisappeared={onMessageDisappeared}
          />
          <SpeechMessage
            active={currentMessageIndex === 12}
            message="<p>Wow... I'm glad I happened by you today.</p>"
            onFinishedTyping={onMessageFinishedTyping}
            onDisappeared={onMessageDisappeared}
          />
          <SpeechMessage
            active={currentMessageIndex === 14}
            keyDelay={45}
            message="<p>There actually are some NFTs I've been thinking I'd love to see in my wallet.</p>"
            onFinishedTyping={onMessageFinishedTyping}
            onDisappeared={onMessageDisappeared}
          />
        </div>
      </Transition>
    </div>
  );
}

interface SpeechMessage {
  active: boolean;
  keyDelay?: number;
  message: string;
  onDisappeared?: () => void;
  onFinishedTyping?: () => void;
  pause?: number;
}

function SpeechMessage({
  active,
  keyDelay = 40,
  message,
  onDisappeared,
  onFinishedTyping = () => {},
  pause = 400,
}: SpeechMessage): ReactElement {
  return (
    <Transition
      show={active}
      enter="transition-opacity duration-500 ease-in-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-500 ease-in-out"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={onDisappeared}
    >
      <Typewriter
        options={{ cursor: '' }}
        onInit={(typewriter) => {
          typewriter
            .changeDelay(keyDelay)
            .typeString(message)
            .pauseFor(pause)
            .callFunction(() => {
              onFinishedTyping();
            })
            .start();
        }}
      />
    </Transition>
  );
}
