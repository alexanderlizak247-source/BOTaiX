# Cinima Private Gallery

A responsive, cinematic moodboard app for a private collection of romantic scene concepts. The artwork is abstract and CSS-generated; it does not depict real people or explicit acts.

## Run locally

```bash
npm start
```

Then open <http://localhost:3000>.

## Features

- Twelve mood-driven scene cards with an immersive detail view
- Category filters, surprise-me scene selection, and favorites saved in local storage
- A private-mode screen toggle and responsive layout
- A local roleplay room with configurable adult character appearance, name, and setting
- A three-person fictional scene with two blonde adult guests, consent-aware scripted replies, and a solo mode
- A local scene-outline generator with randomized cinematic framing and copyable text
- A private local image library for importing and viewing your own saved AI artwork uncropped, with favorites and removal controls
- A one-click ZIP download of all imported gallery images
- Scripted text responses; no AI provider or external personal data is connected
- No runtime dependencies or external image services

## Privacy

This is a standalone personal project, separate from schoolwork. The simulation is scripted locally; it is not a connected AI assistant and does not send prompts to any AI provider. Character settings and favorites stay in this browser's local storage. The server listens only on `127.0.0.1`, and the app does not load remote fonts, images, or other third-party assets.

## Verify

```bash
npm run check
```
