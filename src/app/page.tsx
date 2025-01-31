'use client'
import AplisayWidget from '@aplisay/react-widget';
import '@aplisay/react-widget/dist/styles.css';
import { useState, useEffect } from 'react';
import  getSlides from '../lib/dl.js';
import { useDynamicRouteParams } from 'next/dist/server/app-render/dynamic-rendering.js';
const url = process.env.NEXT_PUBLIC_APLISAY_URL;
const roomKey = process.env.NEXT_PUBLIC_APLISAY_KEY;
const listenerId = process.env.NEXT_PUBLIC_APLISAY_AGENT;




const ImageSlider: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    getSlides().then(setSlides);
  }, []);

  useEffect( () => {
    console.log({ slides, currentSlideIndex }, 'slides');
  }, [slides, currentSlideIndex]);


  const get_current_slide = (params) => {
    console.log({ params }, 'currentSlide');
    return JSON.stringify(slides[currentSlideIndex]);
  };

  const get_next_slide = (params) => {
    const nextSlide = (currentSlideIndex + 1) % slides.length;
    console.log({ params }, 'nextSlide');
    nextImage();
    return JSON.stringify(slides[nextSlide]);
  };

  const lastImage = () => {
    setCurrentSlideIndex((prevIndex) => Math.max((prevIndex - 1), 0));
  };


  const nextImage = () => {
    setCurrentSlideIndex((prevIndex) => Math.min((prevIndex + 1), slides.length - 1));
  };

  return (
    <>

      <img src={slides[currentSlideIndex]?.image} alt="Slider image"
        style={{
          width: '100%',
          height: '90vh',
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
        display: 'flex',
        justifyContent: 'center'
      }}>
      <button disabled={currentSlideIndex === 0} onClick={lastImage}>Last</button>
      <button disabled={currentSlideIndex === slides.length - 1} onClick={nextImage}>Next</button>
        <button onClick={() => setOpen(true)}>Agent</button>
      </div>
    </>
  );
};

export default ImageSlider;
