# Cinima Private Gallery

A responsive, cinematic moodboard app for a private collection of romantic scene concepts. Most artwork is abstract and CSS-generated; the gallery also includes a locally served crop of an image supplied by the user.

## Run locally

```bash
npm start
```

Then open <http://localhost:3000>.

To enable provider-backed replies, configure an OpenAI-compatible chat completions endpoint in the server environment before starting the app. The defaults target xAI:

```powershell
$env:CHAT_API_KEY = "your-provider-api-key"
$env:CHAT_API_URL = "https://api.x.ai/v1/chat/completions"
$env:CHAT_MODEL = "grok-3-mini"
npm start
```

`CHAT_API_URL` and `CHAT_MODEL` are optional; they default to the xAI endpoint and model shown. Keep the key in an environment variable—never in browser code or a checked-in file. Without `CHAT_API_KEY`, Cinima stays in local demo mode. Provider use is off until you check the opt-in box. When enabled, the current message, up to 11 recent messages from provider-backed chat, and selected character/scene details are sent through this server to the configured provider. Local demo messages are not sent. Provider errors are shown rather than replaced with scripted replies.

## Features

- Thirteen gallery cards, including twelve mood-driven scenes and an immersive detail view
- A user-shared moonlit fantasy portrait, cropped from the supplied screenshot and served locally in the gallery
- A three-step quick-start guide for personalizing the room, finding a scene, and starting a local-first chat
- A TikTok-style, vertical snap-scrolling feed of five original fictional adult companion presets; choosing one updates the room locally and supplies its persona to provider-backed chat after opt-in
- A local scene-prompt studio with image/motion formats, a realistic portrait preset, visual style, pose, expression, framing, filters, gallery references, refinements, exclusions, a live prompt-recipe summary, and copy-to-clipboard
- Category filters, surprise-me scene selection, and favorites saved in local storage
- A private-mode screen toggle and responsive layout
- Page-level fullscreen toggle and fullscreen media viewing where supported
- A local roleplay room with configurable adult character appearance, name, and setting
- A three-person fictional scene with two blonde adult guests, consent-aware scripted replies, and a solo mode
- An enabled-by-default enhanced scene-pacing mode for more atmospheric, proactive non-graphic replies; can be switched off in the chat, including in local demo mode
- An enabled-by-default playful teasing toggle for suggestive, non-graphic flirting; explicit sexual content and pressure are not supported, and consent controls remain immediate
- Local scripted demo replies by default, with an explicit opt-in to a server-side, xAI-compatible AI chat provider
- Provider credentials remain server-side; chat history is held only in memory for the current browser session
- The scene studio only composes prompt text locally; it does not generate media or upload prompt details
- User image and video uploads are stored locally in this browser’s IndexedDB only (JPEG, PNG, WebP, GIF up to 10 MB; MP4, WebM, QuickTime up to 100 MB). Videos play in the library; images and videos can open in a fullscreen media viewer where supported. File labels can be renamed locally without changing the media. Files are not sent to the app server or included in chat/provider requests. The app has no media removal control and requests persistent browser storage to reduce automatic cleanup, but the browser may not grant it and clearing browser site data can still remove files; keep a separate backup. This is local browser storage, not encrypted vault storage.
- No runtime dependencies or external image services

## Verify

```bash
npm run check
```
