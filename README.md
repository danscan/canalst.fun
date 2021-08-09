# CanalSt.fun

🚔👀 what if there was a place in the metaverse where you could go to buy bootleg NFTs from shady vendors?

🆕🤫 There is now: http://CanalSt.fun. Just, keep it on the DL

---

This repo is the source for https://canalst.fun, a mini game-style art project I built that explores the concept of (in)authenticity in the budding space of digitally-owned assets by allowing anyone to create a replica of any NFT on Ethereum (or Polygon).

Built over four weekends, this is my quick first pass at a site that is stylistically in its own lane, so please excuse the somewhat strange setup. I may do a few tutorials on the internals of the crypto-related aspects, as well as how I used [Tailwind](https://github.com/tailwindlabs/tailwindcss) and [Headless UI](https://github.com/tailwindlabs/headlessui) to build the game-style UIs for the intro street view and vendor conversation user experiences. If you'd be interested in this, please [DM me on Twitter](https://twitter.com/danscan) to let me know.

## Selective Codebase Overview

- `contracts/`: Solidity contracts for the application and its tests
  - `CanalStFun.sol`: The CanalStFun ERC721 contract that implements logic for minting replica tokens
- `public/`: The public assets directory for the Next.js site
- `src/`: The Next.js application that serves the frontend of CanalSt.fun
  - `abis/`: ABIs for contracts called by the application
  - `assets/`: Image assets loaded by the application
  - `components/`: React components, organized into two groups...
    - `features/`: Components whose interfaces and effects are bound to application feature models, known elsewhere as "containers" or "smart components"
      - `IntroJourneyToVendor.tsx`: The street view-style UX that you see when you first load the site
      - `NFTResult.tsx`: The contents of The Vendor's speech bubble after you enter an NFT url or address and ID
    - `views/`: Components whose interfaces and effects are bound only to their own view models, known elsewhere as "dumb components"
      - `NFTInputURLOrAddress.tsx`: An input and a hook that parses a contract address and token ID from a string
      - `ProgressBar.tsx`: The progress bar seen in multiple places in the app
      - `RemoteMediaPreview.tsx`: A component that opaquely tries multiple strategies to preview an NFT's media, handling `image/*`, `video/*`, and `document/*` content types, using a custom streaming proxy in the event of CORS errors, `iframes` if the proxy fails, and an `a` tag if all else fails
      - `VendorConversation.tsx`: The component that powers the conversation UI/UX. (This one is pretty interesting – check out how it selectively renders only the current spoken item from its children.)
  - `constants/`: The only constants are the configured ethers Infura providers for ethereum and polygon
  - `hooks/`: Application feature hooks
    - `useMakeReplica.ts`: A hook that provides the function that's called when users create an NFT replica
    - `useMakeReplicaPrice.ts`: A hook that determines the price for making a replica by consulting the CanalStFun contract and ChainLink price feeds (for both Polygon and Ethereum).
  - `pages/`: The Next.js application pages
    - `api/`: RPC-style API functions for remote (NFT) media previewing
      - `getRemoteAsset.ts`: HEADs a media file and responds with its content type
      - `getMediaContentType.ts`: GETs a media file and streams its body through the response (used to circumvent CORS by making a cross-origin request possible through the same origin)
    - `_app.tsx`: A custom Next.js app override that adds styles (Tailwind and styles/app.css)
    - `_document.tsx`: A custom Next.js document override that adds Google Fonts and Analytics
    - `index.tsx`: The single page of the app, which includes the actual configuration of the UX of your conversation with The Vendor
  - `styles/`: The stylesheet that defines body styles and custom animation classes
  - `utils/`: Simple utility functions
- `test/`: Tests of the CanalStFun contract
