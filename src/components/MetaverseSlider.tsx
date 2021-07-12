import { Transition } from '@headlessui/react'
import classNames from 'classnames';
import Image from 'next/image'
import React, { Fragment, ReactElement } from 'react';
import { useCallback } from 'react';
import { useCounter } from 'react-use';

// Load metaverse slide images
import slide0 from '../assets/metaverse-slides/0.jpg';
import slide1 from '../assets/metaverse-slides/1.jpg';
import slide2 from '../assets/metaverse-slides/2.jpg';
import slide3 from '../assets/metaverse-slides/3.jpg';
import slide4 from '../assets/metaverse-slides/4.jpg';
import slide5 from '../assets/metaverse-slides/5.jpg';
import slide6 from '../assets/metaverse-slides/6.jpg';
import slide7 from '../assets/metaverse-slides/7.jpg';

interface MetaverseSliderProps {
  onEndReached: () => void;
}

export default function MetaverseSlider({
  onEndReached,
}: MetaverseSliderProps): ReactElement {
  const [currentSlide, currentSlideCounterActions] = useCounter(0, 7);
  const onClickButton = useCallback(() => currentSlideCounterActions.inc(), [currentSlideCounterActions]);

  return (
    <button className="relative block w-screen h-screen bg-black cursor-pointer" onClick={onClickButton}>
      {/* Slides */}
      {/* Slide 7 */}
      <Transition
        as="div"
        className="w-screen h-screen"
        show={currentSlide === 7}
        enter="transition-all ease-in-out duration-800 transform"
        enterFrom="opacity-0 scale-125 -translate-x-96"
        enterTo="opacity-100 scale-100 translate-x-0"
        leave="transition-all duration-600 ease-out transform"
        leaveFrom="scale-100 opacity-100"
        leaveTo="translate-x-96 opacity-0"
        afterEnter={onEndReached}
      >
        <Image priority className="w-full h-full" layout="fill" objectFit="cover" src={slide7} />
      </Transition>
      {/* Slide 6 */}
      <Transition
        as="div"
        className="w-screen h-screen"
        show={currentSlide === 6}
        enter="transition-all ease-in-out duration-800 transform"
        enterFrom="opacity-0 scale-125 -translate-x-96"
        enterTo="opacity-100 scale-100 translate-x-0"
        leave="transition-all duration-600 ease-out transform"
        leaveFrom="scale-100 opacity-100"
        leaveTo="translate-x-96 opacity-0"
      >
        <Image priority className="w-full h-full" layout="fill" objectFit="cover" src={slide6} />
      </Transition>
      {/* Slide 5 */}
      <Transition
        as="div"
        className="w-screen h-screen"
        show={currentSlide === 5}
        enter="transition-all ease-in-out duration-800 transform"
        enterFrom="opacity-0 scale-125 -translate-x-96"
        enterTo="opacity-100 scale-100 translate-x-0"
        leave="transition-all duration-600 ease-out transform"
        leaveFrom="scale-100 opacity-100"
        leaveTo="translate-x-96 opacity-0"
      >
        <Image priority className="w-full h-full" layout="fill" objectFit="cover" src={slide5} />
      </Transition>
      {/* Slide 4 */}
      <Transition
        as="div"
        className="w-screen h-screen"
        show={currentSlide === 4}
        enter="transition-all ease-in-out duration-800 transform"
        enterFrom="opacity-0 scale-125 translate-x-96"
        enterTo="opacity-100 scale-100 translate-x-0"
        leave="transition-all duration-600 ease-out transform"
        leaveFrom="scale-100 opacity-100"
        leaveTo="translate-x-96 opacity-0"
      >
        <Image priority className="w-full h-full" layout="fill" objectFit="cover" src={slide4} />
      </Transition>
      {/* Slide 3 */}
      <Transition
        as="div"
        className="w-screen h-screen"
        show={currentSlide === 3}
        enter="transition-all ease-in-out duration-800 transform"
        enterFrom="opacity-0 scale-125 -translate-x-96"
        enterTo="opacity-100 scale-100 translate-x-0"
        leave="transition-all duration-600 ease-out transform"
        leaveFrom="scale-100 opacity-100"
        leaveTo="-translate-x-96 opacity-0"
      >
        <Image priority className="w-full h-full" layout="fill" objectFit="cover" src={slide3} />
      </Transition>
      {/* Slide 2 */}
      <Transition
        as="div"
        className="w-screen h-screen"
        show={currentSlide === 2}
        enter="transition-all ease-in-out duration-800 transform"
        enterFrom="opacity-0 scale-125 -translate-x-96"
        enterTo="opacity-100 scale-100 translate-x-0"
        leave="transition-all duration-600 ease-out transform"
        leaveFrom="scale-100 opacity-100"
        leaveTo="translate-x-96 opacity-0"
      >
        <Image priority className="w-full h-full" layout="fill" objectFit="cover" src={slide2} />
      </Transition>
      {/* Slide 1 */}
      <Transition
        as="div"
        className="w-screen h-screen"
        show={currentSlide === 1}
        enter="transition-all ease-in-out duration-800 transform"
        enterFrom="opacity-0 scale-125 -translate-x-96"
        enterTo="opacity-100 scale-100 translate-x-0"
        leave="transition-all duration-600 ease-out transform"
        leaveFrom="scale-100 opacity-100"
        leaveTo="translate-x-96 opacity-0"
      >
        <Image priority className="w-full h-full" layout="fill" objectFit="cover" src={slide1} />
      </Transition>
      {/* Slide 0 */}
      <Transition
        as="div"
        className="w-screen h-screen"
        show={currentSlide === 0}
        enter="transition-all ease-in-out duration-600 transform"
        enterFrom="-translate-y-96"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-600 transform"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Image priority className="w-full h-full" layout="fill" objectFit="cover" src={slide0} />
      </Transition>

      {/* Progress Indicator */}
      <Transition
        as="div"
        show={currentSlide < 7}
        enter="transition-all ease-out duration-800 transform"
        enterFrom="opacity-0 translate-y-24"
        enterTo="translate-y-0 opacity-100"
        leave="transition ease-in-out duration-400 transform"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-24"
      >
        <div className="fixed h-4 border-2 border-green-100 border-opacity-80 rounded-3xl inset-x-40 bottom-40">
          <div className={classNames("absolute inset-y-0 transition-all duration-700 delay-100 ease-out rounded-3xl", {
            'bg-green-100 bg-opacity-70': currentSlide <= 5,
            'w-0': currentSlide === 0,
            'w-1/6': currentSlide === 1,
            'w-2/6': currentSlide === 2,
            'w-3/6': currentSlide === 3,
            'w-4/6': currentSlide === 4,
            'w-5/6': currentSlide === 5,
            'w-full bg-green-800 bg-opacity-100 animate-pulse': currentSlide === 6,
          })} />
        </div>
      </Transition>
    </button>
  );
}