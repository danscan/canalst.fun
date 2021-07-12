import { Transition } from '@headlessui/react';
import Head from 'next/head';
import React, {useCallback}  from 'react';
import { useBoolean } from 'react-use';
import MetaverseSlider from '../components/MetaverseSlider';
import GreetingForm from '../components/GreetingForm';

export default function Home() {
  const [endReached, setEndReached] = useBoolean(false);
  const onEndReached = useCallback(() => setEndReached(true), [setEndReached]);

  return (
    <div className="cursor-pointer">
      <Head>
        <title>Canal St</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MetaverseSlider onEndReached={onEndReached} />
      {/* Form */}
      <Transition
        as="div"
        show={endReached}
        enter="transition-all ease-in-out duration-600"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-80">
          <GreetingForm />
        </div>
      </Transition>
    </div>
  )
}
