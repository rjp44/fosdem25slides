import { SlideType } from './types';

const slides: SlideType[] = [
  {
    "notes": "Welcome to the presentation\n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d6kekRzKFLia_S89j3ejDt7M7wXKQDl6MDs5xffo484KwizBtuiUc-B8Exj6LDrJ6GBgE4XE4zqY0YAN5R60yxV03ANKtt4-16tcYIpWVX1kJfxrKXtv0zqhMRQLD9IqTAl0Cuv2PSjGf8qZ2wTZMxVC9Vk4LIz4QKSh92bG2MJB-4=s1600"
  },
  {
    "notes": "Voice AI is super cool right now, and the great thing is that there are multiple Open Source projects creating some momentum in the space. In this talk, we are going to go through them and look at the results that are possible.\n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d5oUGfXFHOfh2h5tR6WzR35azcfodolWWc5JkOW2g3pEgHpXih1zu1JDv8nUp-K4WaN-wW08gCJEtbt2T1r5GtXThGuteW6nyGrV5sVooSD2BcUORb_IuIG1V-UKPoZAlfol-ulaNXRwpiE-mTvCiec7rCnWhJPyt5fH8QtZumw9sc=s1600"
  },
  {
    "notes": "We first started working in the space in 2020, with NLU/NLP systems, bounced off it a bit due to the limitations of those systems, then came back to it with LLMs in the early 2023 timeframe. At that time we were just plugging proprietary Speech to Text like Google, Amazon etc into the front end of telephony only systems using Jambonz as a ready made framework to do that. None of the backend LLMs were open source, but it worked.\n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d5mWG9wEHELqSQYWyBVUBtF0gYoBtuNaoOs7katqPA6HAzWvqG0mqeqQpbMVFulgM9SiY-XeF7Bc4NI3A9Jo2oHBEhfomU9yp8DJJcg-bjhJZMr-SHYafO9W5YmhamXq6qghmVIvs7_5QWT9_RFLsoTYlTbmgz5VbyLSjNJGzmr=s1600"
  },
  {
    "notes": "We developed an orchestration framework for LLMs that was agostic about the speech to text, LLM provider, and text to speech engine. It worked well and allowed us to experiment and plug in/out different LLMs and voice interfaces. Latency and poor interruption handling inherent in the pipeline approach and first gen speech to text and text to speech and the like made it a very poor, walkie talkie like experience. Still useful for some applications where it was creating lots of value, but nowhere near human level voice.\n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d6WBTIy5EwCFY_MRypdRJWhgckNcjNHgbGW-6yBCMdb8BQel18erVqwZ5usH4H7igLwEu_xHUcORAc05fakIPry6etxtFBaJReB6TvJ0_tO9s09GxLoPaRIztZ-SchaEs_tUkTl4do3YplH5abmANOYTluWpukNZ1L_73RJWGzx9T8=s1600"
  },
  {
    "notes": "So that was our first pass, building pipelined audio conversational AI based on proprietary large language models, but gluing them together using the Jambonz open source see-pass.\n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d7N_3akMBHV-9ACyHIuzPC-6PPQMrh7Lvjag8qwmqnFETpqoaRmvYFCU9uSqxEt3UDVm_ILE4gGfzr0UCFmWLuExUW_krJY6do7xxLpt0978jIqhr9rA1rUh0hzudH2wIg4OcMJGEOeiH8xSB5CiN-pRensHhA89J-d-i-aFqSp=s1600"
  },
  {
    "notes": "Then around about the middle of last year, people started working on multimedia tokenisers on foundation models. OpenAI announced first with a convincing demo of “advanced voice”, but didn’t actually ship anything at that time. “What has this got to do with Open Source” I can hear my FOSDEM audience angrily say, well…\n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d4Te51hNMiElswhTlqvD_oQCRHf-uoN9nLxvBkuupiu8AK75COiXScQLS_La2yNLRj4L6RNNq9H1jpMac8J5upd4RSxdP2PhY5Zg0VGI_5T0lNeTm9n54DE4E4c1zo0cce5bAq8yQmUsbPYWzsGH_oz9QHam_JbGhCb7860jw6tNQM=s1600"
  },
  {
    "notes": "Lets talk through our Ultravox integration. Ultravox is a multimedia tokeniser. It’s an open source project and the useable API version was released in August 2024. Notably before OpenAI made their API available.\n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d5sHmjVjpWpLBUOCECbcJhhjwymdi75m0G3xoelpKofzWq7sZKH6PaNzVTv3nNE9BCfHwrrP7FVa1rK_C4E71JBAOSSU-bltW2tTdDtF12MMY8GT2VaRmJnUoEXVJ1y9pd4TBG3-QLBeAM3eWuDcBOaAKQ0_gPBNYBP90uo7gh5=s1600"
  },
  {
    "notes": "We quickly re-oriented our architecture around consuming real time models, and sadly that meant that Jambonz went from being the primary orchestration pipeline, to just one of the available pipelines, but that did mean we could start presenting WebRTC, as well as telephony interfaces, and also do some quite interesting client side browser interactions.\n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d7kq2yK1OZdwrpb-CS5RfKtyRRMF2iykrtfw6KDWe2VgzBGymgtaJwZYyIhr_2aj8kDGB6L8Y-1n_JHzCFg8LPhKyu050hmt7n-yB6xH6Z5JApOAJzkAU-oKMb8YrjPP_JO2I7EyFpv4Y6-sIDuSB2oiE7V8OVuhoTePF7mrNRN9GE=s1600"
  },
  {
    "notes": "The thing that makes LLMs really useful in conversation is to leverage techniques like function calling, which we can use to lookup information in databases, or even do real time transactions. \n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d62ARhSjVWDhivkYTe9zExPFKGLOw88sBwNPgDklPIWj-0CAISCOj96LBXxp4rWMHmOh4dposGSwQWF9VMpVcy8FgqkGJNCXkaf7ng6woVnYDSo2SUQrRiazqg4osWCmTmHpmiF8JXp-ciz0FN5_4V1brhriNTpNDbDVLXuDlutgVI=s1600"
  },
  {
    "notes": "This then gets represented in the JSON definition to our runtime, and the LLM is instructed to make REST calls out to internet services to get data to guide the conversation.\n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d46VgIk4gMrMH7K7GgQkqnXkwEesblLegDGA36n34YqRBr-1KyeOilCBhtWUlAvbkuknkolO4gE2Q4cS5VHZ0J6evJaJ36u45loxnBnRfL36QOXPp5LtwMRgeatq0H2KV5XXdic7z6juuosF1En-goB8UeyFwMyFm1KQpNt975sehE=s1600"
  },
  {
    "notes": "Obviously in the context of a phone call, making REST calls to, for example look up information in a rag database, or make an appointment is quite useful.\u000bSomething even more interesting happens in the WebRTC world though.\u000bBecause we have a datachannel, we can actually make function calls to the client room implementation.\u000bUltravox implement their SDK through Live Kit, as do Open AI at the moment, and very similar mechanisms exist, which we can exploit in our agent definitions. You will see the implementation type for the get_current_slide function and get_next_slide function have type client.\n\n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d5RpNCLStjzn20q-pj2TUYkFa6buP9-onGnoLmLJBzdmazsrWJNbWdKKaNamFc6GKxWZCvpTBTaJ_dMCjWoqWMFf-tbml3wJCWQCY4qLYt-xOwLBFibGFpEgP4VMJGN3kbGPMUMM-mCT8eHtM6V0kJMLvM_KQfrteDJRnuX89xhLt0=s1600"
  },
  {
    "notes": "These are just passed up through the live kit room to make function calls on the parent application. In this example, we define client functions that look up notes and advance slides, and than make them available to the LLM by passing them as parameters to the Aplisay React Widget that implements the Livekit room that I am running in!\n",
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d6VlB1pKQCtTlq7EoeUy626OOjH90wgAnS9x8JA62vNj21Wob4qIdf6VRpeNs2F5SOLwmnkm41KBZKVnBwhZrQcvJVfpuGZwZ5QLEQodaCDColGDRwNxnKMovCL0ir6Vr4i6TlUtOUA1AH-zRv6KA0cf4EmlBFAH3bZoYY1ECKYF_c=s1600"
  },
  {
    "notes": "Anyway, that is the end of our very short presentation. You can find more information at aplisay.com, or on our Aplisay github where you will find the source to this presentation and everything we have talked about today. If you need to know more talk to rob on matrix or rob@pickering.org.\n",
    "last_slide": true,
    "image": "https://lh7-us.googleusercontent.com/docsdf/AFQj2d6zbHCemnMYskuDdRR6ByOSY10QgCPrGCXZKf8goJw2rD0pho0CpKa6FPtoJCuFV8jAWjOGfe5CMuZ2KilWg-d4H0EjUQ51ee6paz20GSD3xuU0Rlo7l4GkQgUKl_lLPL4cdJ9a2LjmghW3X_vqBcbMb6Sg7Ms4DNGtaQAFU1rluow=s1600"
  }
];
export default slides;