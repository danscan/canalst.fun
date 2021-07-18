import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import Image from 'next/image';
import React, { ReactElement, useCallback, useEffect } from 'react';
import { useBoolean, useCounter, useTimeoutFn } from 'react-use';
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

  const [helpTipShow, helpTipShowSet] = useBoolean(false);
  const [, helpTipTimoutCancel, helpTipTimoutReset] = useTimeoutFn(() => {
    if (currentSlide < 7) {
      helpTipShowSet(true);
    }
  }, 10000);

  const onClickSlideButton = useCallback(() => {
    helpTipShowSet(false);
    helpTipTimoutReset();
    currentSlideCounterActions.inc();
  }, [currentSlideCounterActions]);

  const [loadedImages, loadedImagesActions] = useCounter(0, 7);
  const onImageLoad = useCallback(() => loadedImagesActions.inc(), [loadedImagesActions]);
  const allImagesLoaded = loadedImages === 7;

  useEffect(() => {
    if (allImagesLoaded) {
      helpTipShowSet(false);
      helpTipTimoutReset();
    }

    if (currentSlide >= 7) {
      helpTipTimoutCancel();
    }
  }, [allImagesLoaded, currentSlide, helpTipTimoutReset, helpTipTimoutReset]);

  return (
    <button className="relative block w-screen h-screen bg-black cursor-pointer" onClick={onClickSlideButton}>
      {/* Slides */}
      {/* Slide 7 */}
      <SlideImage
        afterEnter={onEndReached}
        active={currentSlide === 7}
        animation="zoom"
        onLoad={onImageLoad}
        src={slide7}
      />
      {/* Slide 6 */}
      <SlideImage
        active={currentSlide === 6}
        animation="from-left"
        onLoad={onImageLoad}
        src={slide6}
      />
      {/* Slide 5 */}
      <SlideImage
        active={currentSlide === 5}
        animation="from-left"
        onLoad={onImageLoad}
        src={slide5}
      />
      {/* Slide 4 */}
      <SlideImage
        active={currentSlide === 4}
        animation="from-right"
        onLoad={onImageLoad}
        src={slide4}
      />
      {/* Slide 3 */}
      <SlideImage
        active={currentSlide === 3}
        animation="from-left"
        onLoad={onImageLoad}
        src={slide3}
      />
      {/* Slide 2 */}
      <SlideImage
        active={currentSlide === 2}
        animation="from-left"
        onLoad={onImageLoad}
        src={slide2}
      />
      {/* Slide 1 */}
      <SlideImage
        active={currentSlide === 1}
        animation="from-left"
        onLoad={onImageLoad}
        src={slide1}
      />
      {/* Slide 0 */}
      <SlideImage
        active={currentSlide === 0}
        animation="from-top"
        onLoad={onImageLoad}
        src={slide0}
      />

      {/* Help Tip */}
      <Transition
        as="div"
        className="fixed inset-0 flex items-center justify-center text-xl font-medium text-center text-green-400 bg-black bg-opacity-40 hover:text-green-100 font-style-ipm"
        show={helpTipShow}
        enter="transition-all ease-in-out duration-1000"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-all ease-in-out duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
          {currentSlide === 0 && 'Click to advance towards The Vendor...'}
          {currentSlide >= 1 && currentSlide < 5 && 'Keep advancing...'}
          {currentSlide === 5 && 'Almost there...'}
          {currentSlide === 6 && 'One more...'}
        </div>
      </Transition>

      {/* Metaverse Slides Progress Indicator */}
      <Transition
        as="div"
        unmount={false}
        show={currentSlide < 7}
        enter="transition-all ease-out duration-800 transform"
        enterFrom="opacity-0 translate-y-24"
        enterTo="translate-y-0 opacity-100"
        leave="transition-all ease-in-out duration-500 transform"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-24"
      >
        <ProgressBar
          className="fixed h-4 border-2 border-green-200 border-opacity-90 rounded-3xl inset-x-8 bottom-40 bg-blend-screen mix-blend-screen"
          classNameValueComplete="bg-green-800 bg-opacity-100 animate-pulse rounded-3xl"
          classNameValueIncomplete="bg-green-200 bg-opacity-90 rounded-3xl"
          progress={currentSlide / 7}
        />
      </Transition>

      {/* Images Loading Overlay */}
      <Transition
        as="div"
        className="fixed inset-0 bg-green-900"
        show={!allImagesLoaded}
        leave="transition-all ease-in-out delay-1000 duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ProgressBar
          className="fixed inset-0 border-black border-opacity-80"
          classNameValueComplete="bg-black bg-opacity-100"
          classNameValueIncomplete="bg-black bg-opacity-70"
          progress={loadedImages / 7}
        />
        <div className="fixed inset-0 flex flex-col items-center justify-center space-y-1">
          <p className="text-center text-green-700 font-style-ipm">
            loading metaverse:
          </p>
          <p className="text-4xl text-center text-green-700 font-style-ipm">
            canal_st.fun
          </p>
        </div>
      </Transition>
    </button>
  );
}

interface SlideImageProps {
  active: boolean;
  afterEnter?: () => void;
  animation: 'from-left' | 'from-right' | 'from-top' | 'zoom';
  onLoad: () => void;
  src: StaticImageData;
}

function SlideImage({
  active,
  afterEnter,
  animation,
  onLoad,
  src,
}: SlideImageProps): ReactElement {
  return (
    <Transition
      afterEnter={afterEnter}
      appear
      as="div"
      className="w-screen h-screen"
      enter={classNames('transition-all transform ease-in-out', {
        'duration-800': animation !== 'zoom',
        'duration-1000': animation === 'zoom',
      })}
      enterFrom={classNames('opacity-0', {
        '-translate-y-96': animation==='from-top',
        'scale-125 -translate-x-96': animation==='from-left',
        'scale-125 translate-x-96': animation==='from-right',
        'scale-75': animation==='zoom',
      })}
      enterTo="opacity-100 translate-x-0 scale-100"
      leave="transition-all transform duration-800 ease-out"
      leaveFrom="opacity-100 scale-100"
      leaveTo={classNames('opacity-0', {
        'translate-x-96': animation==='from-left',
        '-translate-x-96': animation==='from-right',
        'scale-74': animation==='zoom',
      })}
      show={active}
      unmount={false}
    >
      <Image priority className="w-full h-full" layout="fill" objectFit="cover" src={src} onLoadingComplete={onLoad} />
    </Transition>
  );
}

interface ProgressBarProps {
  className: string;
  classNameValueIncomplete: string;
  classNameValueComplete: string;
  /** number between 0 and 1 */
  progress: number;
}

function ProgressBar({
  className,
  classNameValueIncomplete,
  classNameValueComplete,
  progress,
}: ProgressBarProps): ReactElement {
  return (
    <div className={className}>
      <div className={classNames("absolute inset-y-0 transition-all duration-700 delay-100 ease-out", {
        [classNameValueIncomplete]: progress < 1,
        [classNameValueComplete]: progress === 1,
      })} style={{ width: `${Math.ceil(100 * progress)}%`}} />
    </div>
  );
}
