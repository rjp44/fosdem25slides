# FOSDEM 25 Slides

This is a super simple [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) which presents Rob's slides about realtime conversational agents from FOSDEM 25.

If you just want to see the interactive slides, then go to [the hosted slides](https://fosdem25.aplisay.com).

More interested in experimenting with your own realtime agents? then [read more about Aplisay](https://aplisay.com,) or just try some stuff out in the [Aplisay playground](https://playground.aplisay.com).

## Getting Started

If you are still reading then you probably want to know how this works, or maybe fork it to do something similar yourself.

### Prerequisites

You will need to [create an agent on the Aplisay environment](https://aplisay.com/resources/using-the-cli-to-run-persistent-agents), those instructions assume a React app. For this NextJs app, use a `NEXT_PUBLIC` prefix instead of `REACT_APP`. Use the agent file in `agents`, or make a different one.

### Install the deps

```bash
yarn install
```

### Run the app

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Customising the slides

In its original incarnation, this app pulled the presentation dynamically from Google slides.
To release it here without needing API credential files, we transformed this to a static initialisation of the slides from a file in the project.
The slides are stored in `src/slides.ts` and are loaded at build time. You can edit them there, or add new ones.

If you have a Google API account and want to add back in the functionality to pull dynamically from there, we have left the downloader in `lib/dl.js` although it isn't currently used.

## Learn More

To find out a bit more about how we use the [Aplisay Widget](https://widget.aplisay.com/), see the [resources](https://aplisay.com/blog) on the [Aplisay website](https://aplisay.com/).
