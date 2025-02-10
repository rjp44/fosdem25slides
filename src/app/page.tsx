'use client'
import { useSwipeable } from 'react-swipeable';
import AplisayWidget from '@aplisay/react-widget';
import GithubIcon from '../assets/github';
import MaximiseIcon from '../assets/maximise';
import MinimiseIcon from '../assets/minimise';
import '@aplisay/react-widget/dist/styles.css';
import { useState, useEffect, useRef } from 'react';
import { SlideType } from '../types';
import staticSlides from '../slides';

const url = process.env.NEXT_PUBLIC_APLISAY_URL;
const roomKey = process.env.NEXT_PUBLIC_APLISAY_KEY;
const listenerId = process.env.NEXT_PUBLIC_APLISAY_AGENT;

const repoUrl = 'https://github.com/rjp44/fosdem25slides';

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
    return slides && JSON.stringify({ ...slides?.[currentSlideIndex], image: undefined });
  };

  const get_next_slide = (): string | null => {
    const index = currentSlideRef?.current || 0;
    const max = numSlidesRef?.current || 0;
    const nextSlide = Math.min((index + 1), max - 1);
    console.log({ nextSlide, slide: slides?.[nextSlide] });
    setCurrentSlideIndex(nextSlide);
    return slides && JSON.stringify({ ...slides?.[nextSlide], image: undefined });
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
          debug={true}
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
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        color: '#fff',
        padding: '10px',
        fontSize: '16px',
        bottom: '10px',
        left: '10px',
        width: '33%',
        backgroundColor: 'transparent'
      }}>
          <div>
        <a href={repoUrl} target="_blank" rel="noreferrer">
          <GithubIcon color="#fff" style={{ width: '30px', height: '30px', color: '#fff', marginRight: '10px' }} /> source
            </a>
          </div>
        <div>
          <span>{currentSlideIndex + 1}/{numSlides}</span>
        </div>
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
          ? <MaximiseIcon />
          : <MinimiseIcon />
        }

      </button>


    </>
  );
};

export default ImageSlider;
