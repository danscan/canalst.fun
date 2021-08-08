import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import Image from 'next/image';
import React, { Children, cloneElement, PropsWithChildren, ReactElement, useCallback, useMemo } from 'react';
import { useBoolean } from 'react-use';
import Typewriter from 'typewriter-effect';
import theVendorImage from '../../assets/the-vendor.png';

type VendorConversationProps = {
  children: ReactElement[];
  currentSpokenItem: number;
};

export default function VendorConversationRenderer({
  children,
  currentSpokenItem,
}: VendorConversationProps): ReactElement {
  const {
    theVendorSpeaking,
    theVendorSpokenItems,
    youSpeaking,
    youSpokenItems,
  } = useSpokenItems({
    children,
    currentSpokenItem,
  })

  return (
    <div className="flex-1">
      {/* Top Half */}
      <div className={classNames("flex items-start p-4 space-x-4 transition-all", {
        'h-1/2 lg:h-1/2': theVendorSpeaking,
        'h-1/4 lg:h-1/2': youSpeaking,
      })}>
        {/* Vendor Speech Bubble Wrapper */}
        <div className="flex-1">
          <Transition
            appear
            as="div"
            show={theVendorSpeaking}
            enter="transition-opacity ease-in-out duration-500 delay-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            {/* The Vendor's Speech */}
            <div className="w-full max-h-full p-6 pb-4 text-lg text-white transition-all duration-300 ease-in-out bg-black border-2 border-white rounded-br-none shadow-md lg:p-8 lg:text-2xl bg-opacity-30 bg-blend-multiply rounded-xl font-style-ipm">
              <div className="text-sm font-medium tracking-wider text-white uppercase font-style-ipm opacity-70">The Vendor:</div>
              {/* The Vendor's Spoken Items */}
              {theVendorSpokenItems}
            </div>
          </Transition>
        </div>
        {/* The Vendor */}
        <div className="self-end flex-shrink lg:flex-shrink-0 animate-float">
          <Image className="w-full h-full" objectFit="contain" src={theVendorImage} />
        </div>
      </div>
      {/* Bottom Half */}
      <Transition
        as="div"
        show={youSpeaking}
        className={classNames("relative flex items-start p-8 transition-all", {
          'h-3/4 lg:h-1/2': youSpeaking,
          'h-1/2 lg:h-1/2': theVendorSpeaking,
        })}
        enter="transition-opacity ease-in-out duration-500 delay-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in-out duration-500 delay-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="w-full max-h-full p-6 pb-4 text-lg italic font-semibold text-white transition-all duration-300 ease-in-out bg-gray-400 bg-opacity-50 border-2 border-green-100 rounded-bl-none shadow-xl lg:p-8 lg:text-2xl bg-blend-multiply rounded-xl font-style-ipm">
          <div className="text-sm font-medium tracking-wider text-white uppercase font-style-ipm opacity-70">You:</div>
          {/* Your Spoken Items */}
          {youSpokenItems}
        </div>
      </Transition>
    </div>
  );
}

/** Hook that maps children to spoken item elements for you and the vendor */
type UseSpokenItemsProps = {
  children: ReactElement[];
  currentSpokenItem: number;
}

type UseSpokenItemsReturnType = {
  theVendorSpeaking: boolean;
  theVendorSpokenItems: JSX.Element[];
  youSpeaking: boolean;
  youSpokenItems: JSX.Element[];
}

function useSpokenItems({
  children,
  currentSpokenItem,
}: UseSpokenItemsProps): UseSpokenItemsReturnType {
  const spokenItemElements = useMemo(() => {
    return Children
      .map<ReturnType<typeof VendorConversationRenderer.SpokenItem>, ReturnType<typeof VendorConversationRenderer.SpokenItem>>(children, (child, index) => {
        if (![VendorConversationRenderer.SpokenItem, VendorConversationRenderer.SpokenSpeechMessage].includes(child.type)) {
          console.warn('Ignoring VendorConversation child of type', child.type);
          return null;
        }

        return cloneElement<SpokenItemProps | SpokenSpeechMessageProps>(child, {
          active: currentSpokenItem === index,
        });
      });
    }, [children, currentSpokenItem]);
  const theVendorSpokenItems = useMemo(() => spokenItemElements.filter((el) => el.props.speaker === 'TheVendor'), [spokenItemElements]);
  const youSpokenItems = useMemo(() => spokenItemElements.filter((el) => el.props.speaker === 'You'), [spokenItemElements]);

  const theVendorSpeaking = useMemo(() => !!theVendorSpokenItems.filter((el) => el.props.active).length, [theVendorSpokenItems]);
  const youSpeaking = useMemo(() => !!youSpokenItems.filter((el) => el.props.active).length, [youSpokenItems]);

  return {
    theVendorSpeaking,
    theVendorSpokenItems,
    youSpeaking,
    youSpokenItems,
  };
}

/** An element to be displayed in a speech bubble when it becomes active */
type SpokenSpeechMessageProps = SpokenItemProps & Omit<SpeechMessageProps, 'onFinishedTyping'>;
VendorConversationRenderer.SpokenSpeechMessage = function SpokenSpeechMessage({
  active,
  keyDelay,
  message,
  onFinished,
  pause,
  speaker,
}: SpokenSpeechMessageProps): ReactElement {
  const [finishedTyping, setFinishedTyping] = useBoolean(false);
  const onFinishedTyping = useCallback(() => setFinishedTyping(true), [setFinishedTyping]);

  return (
    <VendorConversationRenderer.SpokenItem active={active} onFinished={onFinished} speaker={speaker}>
      <SpeechMessage
        keyDelay={keyDelay}
        message={message}
        onFinishedTyping={onFinishedTyping}
        pause={pause}
      />
    </VendorConversationRenderer.SpokenItem>
  );
}

/** An element to be displayed in a speech bubble when it becomes active */
type SpokenItemProps = PropsWithChildren<{
  active?: boolean;
  onFinished?: () => void;
  speaker: 'TheVendor' | 'You';
}>;

VendorConversationRenderer.SpokenItem = function SpokenItem({ active, children, onFinished }: SpokenItemProps) {
  return (
    <Transition
      show={active}
      enter="transition-opacity duration-500 ease-in-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      afterLeave={onFinished}
    >
      {children}
    </Transition>
  );
}

/** A message to be written out typewriter-style in a SpokenItem */
interface SpeechMessageProps {
  keyDelay?: number;
  message: string;
  onFinishedTyping: () => void;
  pause?: number;
}

function SpeechMessage({
  keyDelay = 5,
  message,
  onFinishedTyping,
  pause = 400,
}: SpeechMessageProps): ReactElement {
  return (
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
  );
}
