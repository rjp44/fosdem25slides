'use client'
import AplisayWidget from '@aplisay/react-widget';
import '@aplisay/react-widget/dist/styles.css';
import { useState } from 'react';

const url = process.env.NEXT_PUBLIC_APLISAY_URL;
const roomKey = process.env.NEXT_PUBLIC_APLISAY_KEY;
const listenerId = process.env.NEXT_PUBLIC_APLISAY_AGENT;



const slides = [
  {
    image: '/images/aardvark.jpg',
    notes: `Voice AI is super cool right now. We first started working in the space in in 2020 kind of time, with NLU/NLP systems, bounced off it a bit, then came back to it with LLMs in the 2023 timeframe. At that time we were just plugging proprietary Speech to Text like Google, Amazon etc into the front end of telephony only systems using Jambonz as a ready made framework to do that. It worked, but latency, interruptions and the like made it a very poor, walkie talkie like experience.`,
    background: `Jambonz, Livekit, and Pipecat are open source projects`
  },
  {
    image: '/images/anteater.jpg',
    last_slide: true,
    notes: `Anteaters are the four extant mammal species in the suborder Vermilingua (meaning "worm tongue"), commonly known for eating ants and termites. The individual species have other names in English and other languages. Together with sloths, they are within the order Pilosa. The name "anteater" is also commonly applied to the aardvark, numbat, echidnas, and pangolins, although they are not closely related to them.
Extant species are the giant anteater Myrmecophaga tridactyla, about 1.8 m (5 ft 11 in) long including the tail; the silky anteater Cyclopes didactylus, about 35 cm (14 in) long; the southern tamandua or collared anteater Tamandua tetradactyla, about 1.2 m (3 ft 11 in) long; and the northern tamandua Tamandua mexicana of similar dimensions.`,
    background: `Anteaters are part of the Xenarthra superorder, a once diverse group of mammals that occupied South America while it was geographically isolated from the invasion of animals from North America, with the other two remaining animals in the family being the sloths and the armadillos.

At one time, anteaters were assumed to be related to aardvarks and pangolins because of their physical similarities to those animals, but these similarities have since been determined to be not a sign of a common ancestor, but of convergent evolution. All have evolved powerful digging forearms, long tongues, and toothless, tube-like snouts to subsist by raiding termite mounds.`
  }
]

const ImageSlider: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [open, setOpen] = useState(false);

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
    setCurrentSlideIndex((prevIndex) => Math.min((prevIndex - 1), 0));
  };


  const nextImage = () => {
    setCurrentSlideIndex((prevIndex) => Math.max((prevIndex + 1), slides.length - 1));
  };

  return (
    <>

      <img src={slides[currentSlideIndex].image} alt="Slider image"
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
