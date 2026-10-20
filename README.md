# Cinima Private Gallery

A responsive, cinematic moodboard app for a private collection of romantic scene concepts. Most artwork is abstract and CSS-generated; the gallery also includes a locally served crop of an image supplied by the user.

## Run locally

```bash
npm start
```

Then open <http://localhost:3000>.

To enable replies from ChatGPT, Claude, or Grok, set the relevant provider API key in the server environment. For example, configure any combination before starting the app:

```powershell
$env:OPENAI_API_KEY = "your-openai-api-key"
$env:ANTHROPIC_API_KEY = "your-anthropic-api-key"
$env:XAI_API_KEY = "your-xai-api-key"
$env:CHAT_PROVIDER = "xai"
npm start
```

Only keys for providers you want to enable are needed. The default models are `gpt-6-luna`, `claude-haiku-5-5`, and `grok-4.7`. `OPENAI_API_URL` / `OPENAI_MODEL`, `ANTHROPIC_API_URL` / `ANTHROPIC_MODEL`, and `XAI_API_URL` / `XAI_MODEL` optionally override each provider’s endpoint and model. `CHAT_PROVIDER` sets the initially selected provider (`openai`, `anthropic`, or `xai`); if it is unset, xAI is preferred when configured, otherwise the first configured provider is selected. The existing `CHAT_API_KEY`, `CHAT_API_URL`, and `CHAT_MODEL` settings remain supported as legacy xAI settings. Keep keys in environment variables—never in browser code or a checked-in file. Without a configured provider, Cinima stays in local demo mode. External use remains off until the user checks the opt-in box. When enabled, the current message, up to 11 recent messages for the selected provider, and selected character/scene details are sent through this server to that provider. Local demo messages are not sent. Provider errors are shown rather than replaced with scripted replies.

## Features

- Thirteen gallery cards, including twelve mood-driven scenes and an immersive detail view
- A user-shared moonlit fantasy portrait, cropped from the supplied screenshot and served locally in the gallery
- A three-step quick-start guide for personalizing the room, finding a scene, and starting a local-first chat
- A TikTok-style, vertical snap-scrolling feed of five named fictional adult women (Cinima, Mira, Sora, Nadia, and Elise); choosing one updates the room locally and supplies her persona to provider-backed chat after opt-in
- A local scene-prompt studio with image/motion formats, a realistic portrait preset, visual style, pose, expression, framing, filters, gallery references, refinements, exclusions, a live prompt-recipe summary, and copy-to-clipboard
- Category filters, surprise-me scene selection, and favorites saved in local storage
- A private-mode screen toggle and responsive layout
- Page-level fullscreen toggle and fullscreen media viewing where supported
- A local roleplay room with configurable adult character appearance, name, and setting
- A three-person fictional scene with two blonde adult guests, consent-aware scripted replies, and a solo mode
- An enabled-by-default enhanced scene-pacing mode for more atmospheric, proactive non-graphic replies; can be switched off in the chat, including in local demo mode
- An enabled-by-default playful teasing toggle for suggestive, non-graphic flirting; explicit sexual content and pressure are not supported, and consent controls remain immediate
- A freeform chat prompt that accepts natural messages without requiring scene-studio or companion-feed setup; replies follow the prompt with open-ended, consent-aware playful banter (provider-backed replies require explicit opt-in)
- One-click conversation starters that prefill the chat composer, plus an accessible in-progress status while waiting on provider replies
- Local scripted demo replies by default, with an explicit opt-in and server-side provider selection for OpenAI/ChatGPT, Anthropic/Claude, or xAI/Grok
- Provider credentials remain server-side; chat history is held only in memory for the current browser session
- The scene studio only composes prompt text locally; it does not generate media or upload prompt details
- User image and video uploads are stored locally in this browser’s IndexedDB only (JPEG, PNG, WebP, GIF up to 10 MB; MP4, WebM, QuickTime up to 100 MB). Add images individually or select a folder of images for a user-triggered bulk import; supported desktop browsers let you choose a directory, and only supported image files are added. Videos play in the library; images and videos can open in a fullscreen media viewer where supported. File labels can be renamed locally without changing the media. Files are not sent to the app server or included in chat/provider requests. The library offers a user-triggered backup to a folder selected on the device (recent desktop Chrome or Edge); this copies every media file without deleting or uploading the browser copy. The app has no media removal control and requests persistent browser storage to reduce automatic cleanup, but the browser may not grant it and clearing browser site data can still remove files. This is local browser storage, not encrypted vault storage.
- No runtime npm dependencies or external image-generation services. Google Fonts are loaded from Google Fonts when the browser has network access.

## Chat API

The Node server serves the static app and provides two same-origin endpoints:

- `GET /api/config` returns the configured provider IDs and labels plus the default provider. API keys and endpoint URLs are never returned.
- `POST /api/chat` accepts JSON with an optional `provider` (`openai`, `anthropic`, or `xai`), a `messages` array (1–12 `user` or `assistant` messages, each 1–2,000 non-whitespace characters), and optional `context` object whose values must be strings of at most 80 characters. The combined message text is limited to 8,000 characters and the request body to 16 KiB. The latest message must be from the user. On success, the server returns `{ "reply": "..." }`; validation, configuration, and provider failures return an `error` message.

The server adapts requests and responses for OpenAI and xAI chat completions and Anthropic Messages, with a 25-second timeout. The browser sends at most 11 recent messages for the selected provider plus the current message. Local demo messages are not included. Provider conversation history exists only in page memory and is reset when a companion or provider is selected, or the page is reloaded. The provider opt-in is off by default and unavailable unless the server reports at least one configured provider.

Appearance and favorites use this browser’s `localStorage`; uploaded media uses this browser’s IndexedDB. The private-mode control only changes the current screen’s styling—it does not hide content, secure data, or replace the browser’s storage protections. The app does not define a JavaScript module API; its scripts run as browser page scripts and the server’s helpers are module-private.

## Verify

```bash
npm run check
```
