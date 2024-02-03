# SD-JWT Tool

Tool for analyzing and decoding SD-JWTs and SD-JWT VCs similar to https://jwt.io or https://sdjwt.info.

## TBD

- Create [Monarch](https://microsoft.github.io/monaco-editor/monarch.html) Language syntax definitions for
  - encoded SD-JWT-VCs
  - decoded SD-JWT-VCs
- Decode SD-JWTs
- Handle disclosures
- Handle key binding and signatures
- Verify signatures
- Create SD-JWT VC examples to use

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
