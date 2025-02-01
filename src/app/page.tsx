'use client'
import AplisayWidget from '@aplisay/react-widget';
import '@aplisay/react-widget/dist/styles.css';
import { useState, useEffect, useCallback } from 'react';
import getSlides from '../lib/dl.js';

const url = process.env.NEXT_PUBLIC_APLISAY_URL;
const roomKey = process.env.NEXT_PUBLIC_APLISAY_KEY;
const listenerId = process.env.NEXT_PUBLIC_APLISAY_AGENT;

const ImageSlider: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [numSlides, setNumSlides] = useState(0)



  useEffect(() => {
    function keyDown(event) {
      console.log(event.key, 'key');
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === 'Enter') {
        nextSlide();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        lastSlide();
      }
    }

    document.addEventListener('keydown', keyDown);
    return () =>
      document.removeEventListener('keydown', keyDown);
  }, [numSlides]);


  useEffect(() => {
    getSlides().then((s) => {
      setSlides(s);
      setNumSlides(s?.length);
      console.log('num slides', s?.length);
    });

  }, []);

  useEffect(() => {
    console.log({ slides, currentSlideIndex }, 'slides');
  }, [slides, currentSlideIndex, numSlides]);

  let current_slide;
  
  const get_current_slide = () => {
    current_slide = currentSlideIndex;
    return JSON.stringify(slides[currentSlideIndex]);
  };



  const lastSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max((prevIndex - 1), 0));
  };


  function nextSlide() {
    setCurrentSlideIndex((prevIndex) => {
      const newIndex = Math.min((prevIndex + 1), numSlides - 1)
      console.log({ prevIndex, newIndex, length: numSlides });
      return newIndex;
    });
    return Math.min((currentSlideIndex + 1), numSlides - 1)
  };

  const get_next_slide = useCallback(() => {
    current_slide = Math.min((current_slide + 1), numSlides - 1);
    setCurrentSlideIndex(current_slide);
    console.log({ current_slide, numSlides }, 'next slide');
    return JSON.stringify(slides[current_slide]);
  }, [currentSlideIndex, numSlides, slides, nextSlide]);

  return (
    <>

      <img src={slides[currentSlideIndex]?.Iimage} alt="Slider image"
        style={{
          width: '100%',
          height: '100vh',
          objectFit: 'cover'
        }}
      />
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
          clientFunctions={{
            get_current_slide,
            get_next_slide
          }}
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
        bottom: '10px',
        left: '10px',
        backgroundColor: 'transparent'
      }}>
        {currentSlideIndex +1}/{numSlides}
        <button onClick={() => setOpen(true)}>Hand over to Emily</button>
      </div>
    </>
  );
};

export default ImageSlider;
