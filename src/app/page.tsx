'use client'
import { useSwipeable } from 'react-swipeable';
import AplisayWidget from '@aplisay/react-widget';
import '@aplisay/react-widget/dist/styles.css';
import { useState, useEffect, useRef } from 'react';
import { SlideType } from '../types';
import staticSlides from '../slides';

const url = process.env.NEXT_PUBLIC_APLISAY_URL;
const roomKey = process.env.NEXT_PUBLIC_APLISAY_KEY;
const listenerId = process.env.NEXT_PUBLIC_APLISAY_AGENT;

interface CallbacksType {
  [key: string]: () => string | null
};

function useSlides() {
  const [slides, setSlides] = useState<SlideType[] | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [numSlides, setNumSlides] = useState(0);

  // We need to set and use Refs for current slide and number of slides
  //  as the get_current_slide and get_next_slide callbacks that get passed as
  //  dynamic client tools to the LLM Widget are frozen at the time the widget is first
  //  rendered `open`. By dereferencing the current values of the Ref, we get the current
  //  state of the visual component to give to the LLM callback. There are probably other
  //  ways to do this. None of them seem to be clean.
  const currentSlideRef = useRef(0);
  const numSlidesRef = useRef(0);
  currentSlideRef.current = currentSlideIndex;
  numSlidesRef.current = numSlides;
 
  useEffect(() => {
    setSlides(staticSlides);
    setNumSlides(staticSlides?.length || 0)
  }, []);

  const get_current_slide = (): string | null => {
    // Use the ref.
    const index = currentSlideRef?.current || 0;
    console.log({ currentSlideRef, slide: slides?.[index] });
    return slides && JSON.stringify(slides?.[currentSlideIndex]);
  };

  const get_next_slide = (): string | null => {
    const index = currentSlideRef?.current || 0;
    const max = numSlidesRef?.current || 0;
    const nextSlide = Math.min((index + 1), max - 1);
    console.log({ nextSlide, slide: slides?.[nextSlide] });
    setCurrentSlideIndex(nextSlide);
    return slides && JSON.stringify(slides?.[nextSlide]);
  };


  const callbacks: CallbacksType = {
    get_current_slide,
    get_next_slide
  };



  const advanceSlide = () =>
    setCurrentSlideIndex((prevIndex) => Math.min((prevIndex + 1), numSlides - 1));

  const retardSlide = () =>
    setCurrentSlideIndex((prevIndex) => Math.max((prevIndex - 1), 0));

  return { slides, currentSlideIndex, numSlides, callbacks, advanceSlide, retardSlide };
}

const ImageSlider: React.FC = () => {
  const { slides,
    currentSlideIndex,
    numSlides,
    advanceSlide,
    retardSlide,
    callbacks
  } = useSlides();
  const [open, setOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: advanceSlide,
    onSwipedRight: retardSlide,
    onTap: () => {
      console.log('tap');
      advanceSlide();
    },
    trackMouse: true,
  });

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      console.log(event.key, 'key');
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === 'Enter') {
        advanceSlide();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        retardSlide();
      }
    }
    document.addEventListener('keydown', keyDown);
    return () =>
      document.removeEventListener('keydown', keyDown);
  }, [advanceSlide, retardSlide]);



  useEffect(() => {
    console.log({ slides, currentSlideIndex }, 'slides');
  }, [slides, currentSlideIndex]);


  useEffect(() => {
    if (fullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.fullscreenElement !== null)
        document?.exitFullscreen();
    }
  }, [fullScreen]);

  console.log({ slide: slides && slides[currentSlideIndex] }, 'slide render');

  return (
    <>
      <div {...handlers}>
        <img
          src={`/images/image${currentSlideIndex + 1}.png`}
          alt="Slider image"
          style={{
            width: '100vw',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      <div style={{
        width: '20vw',
        position: 'absolute',
        top: '10px',
        right: '10px',
        height: '100vh',
        backgroundColor: 'transparent'
      }}>
        <AplisayWidget
          url={url}
          listenerId={listenerId}
          roomKey={roomKey}
          clientFunctions={callbacks}
          debug={false}
          showStatus={true}
          open={open}
          theme={{
            palette: {
              mode: "light",
              primary: { main: "#4a90e2" },
              background: { default: "transparent" },
              text: { primary: "#1a1a1a" }
            }
          }}
        />
      </div>

      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        backgroundColor: 'transparent'
      }}>
        {currentSlideIndex + 1}/{numSlides}
      </div>
      {!open && <button
        onClick={() => setOpen(true)}
        style={{
          padding: '10px',
          fontSize: '16px',
          color: '#fff',
          backgroundColor: '#4a90e2',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          position: 'absolute',
          bottom: '10px',
          right: '10px',
        }}
      >
        Start Presenting Please Emily!
      </button>}
      <button
        onClick={() => setFullScreen((oldState) => !oldState)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {!fullScreen
          ? <svg width="25px" height="25px" viewBox="0 0 24 24" fill="#dddddd" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18 4.654v.291a10 10 0 0 0-1.763 1.404l-2.944 2.944a1 1 0 0 0 1.414 1.414l2.933-2.932A9.995 9.995 0 0 0 19.05 6h.296l-.09.39A9.998 9.998 0 0 0 19 8.64v.857a1 1 0 1 0 2 0V4.503a1.5 1.5 0 0 0-1.5-1.5L14.5 3a1 1 0 1 0 0 2h.861a10 10 0 0 0 2.249-.256l.39-.09zM4.95 18a10 10 0 0 1 1.41-1.775l2.933-2.932a1 1 0 0 1 1.414 1.414l-2.944 2.944A9.998 9.998 0 0 1 6 19.055v.291l.39-.09A9.998 9.998 0 0 1 8.64 19H9.5a1 1 0 1 1 0 2l-5-.003a1.5 1.5 0 0 1-1.5-1.5V14.5a1 1 0 1 1 2 0v.861a10 10 0 0 1-.256 2.249l-.09.39h.295z" />
          </svg>
          : <svg width="25px" height="25px" viewBox="0 0 24 24" fill="#dddddd" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.7071 3.70711L16.4142 9H20C20.5523 9 21 9.44772 21 10C21 10.5523 20.5523 11 20 11H14.0007L13.997 11C13.743 10.9992 13.4892 10.9023 13.295 10.7092L13.2908 10.705C13.196 10.6096 13.1243 10.4999 13.0759 10.3828C13.0273 10.2657 13.0004 10.1375 13 10.003L13 10V4C13 3.44772 13.4477 3 14 3C14.5523 3 15 3.44772 15 4V7.58579L20.2929 2.29289C20.6834 1.90237 21.3166 1.90237 21.7071 2.29289C22.0976 2.68342 22.0976 3.31658 21.7071 3.70711Z"
            />
            <path d="M9 20C9 20.5523 9.44772 21 10 21C10.5523 21 11 20.5523 11 20V14.0007C11 13.9997 11 13.998 11 13.997C10.9992 13.7231 10.8883 13.4752 10.7092 13.295C10.7078 13.2936 10.7064 13.2922 10.705 13.2908C10.6096 13.196 10.4999 13.1243 10.3828 13.0759C10.2657 13.0273 10.1375 13.0004 10.003 13C10.002 13 10.001 13 10 13H4C3.44772 13 3 13.4477 3 14C3 14.5523 3.44772 15 4 15H7.58579L2.29289 20.2929C1.90237 20.6834 1.90237 21.3166 2.29289 21.7071C2.68342 22.0976 3.31658 22.0976 3.70711 21.7071L9 16.4142V20Z"
            />
          </svg>
        }

      </button>


    </>
  );
};

export default ImageSlider;
