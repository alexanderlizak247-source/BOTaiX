const scenes = [
  { id: 'moonlit-guardian', title: 'The moonlit guardian', category: 'Daydream', tag: 'A USER-SHARED REFERENCE', style: 'silver', symbol: '✦', image: '/images/moonlit-guardian.jpg', description: 'A cinematic fantasy portrait shared by you, now part of the local scene gallery.' },
  { id: 'golden-hour', title: 'Golden hour, just us', category: 'Romance', tag: 'THE FIRST SPARK', style: 'golden', symbol: '☼', description: 'A lingering look across a sun-warmed room, where the evening seems to slow down just for us.' },
  { id: 'velvet-hour', title: 'The velvet hour', category: 'After dark', tag: 'AFTER DARK', style: 'velvet', symbol: '✺', description: 'Candlelight, soft velvet, and a conversation that keeps finding reasons not to end.' },
  { id: 'city-lights', title: 'Somewhere above the city', category: 'Daydream', tag: 'CITY DREAMING', style: 'city', symbol: '✧', description: 'A quiet penthouse window, a thousand lights below, and nowhere else we need to be.' },
  { id: 'slow-dance', title: 'One more slow dance', category: 'Romance', tag: 'CLOSE ENOUGH', style: 'dance', symbol: '◌', description: 'Barefoot on the floor, swaying to a song neither of us remembers choosing.' },
  { id: 'red-room', title: 'A room in red', category: 'After dark', tag: 'A LITTLE MYSTERY', style: 'red', symbol: '❋', description: 'Deep color, warm shadows, and the delicious anticipation of a night still unfolding.' },
  { id: 'sunday-morning', title: 'Sunday, unhurried', category: 'Romance', tag: 'SLOW MORNINGS', style: 'morning', symbol: '☾', description: 'Coffee going cold while we trade stories beneath the softest morning light.' },
  { id: 'silver-screen', title: 'The last scene', category: 'Daydream', tag: 'SILVER SCREEN', style: 'silver', symbol: '✦', description: 'A little old-Hollywood glamour, an empty theater, and a favorite scene replaying.' },
  { id: 'afterglow', title: 'After the rain', category: 'After dark', tag: 'CITY AFTER HOURS', style: 'rain', symbol: '⋆', description: 'Rain tracing the window while we linger in the hush after a long night out.' },
  { id: 'secret-garden', title: 'Our secret garden', category: 'Daydream', tag: 'HIDDEN AWAY', style: 'garden', symbol: '❀', description: 'A hidden courtyard, jasmine in the air, and a secret little world of our own.' },
  { id: 'suite-noir', title: 'Suite No. 8', category: 'After dark', tag: 'DO NOT DISTURB', style: 'suite', symbol: '◇', description: 'A midnight hotel suite with room service, city views, and no plans for tomorrow.' },
  { id: 'coastline', title: 'Where the water ends', category: 'Romance', tag: 'THE ESCAPE', style: 'coast', symbol: '≈', description: 'A late walk beside the water, salt in the breeze, and your hand finding mine.' },
  { id: 'blue-hour', title: 'Blue hour, always', category: 'Daydream', tag: 'IN OUR ORBIT', style: 'blue', symbol: '◒', description: 'That fleeting blue light before night, when everything feels possible.' }
];

const companionProfiles = [
  { id: 'cinima', name: 'Cinima', age: '28', tagline: 'The velvet-hour romantic', bio: 'Sharp wit, warm confidence, and a weakness for conversations that outlast the playlist.', heritage: 'golden', hair: 'chestnut', body: 'soft', eyes: 'gray-eyes', setting: 'penthouse', colors: ['#654239', '#b98668', '#d9bc9d'], tone: 'Witty and confident; loves city nights and clever banter.' },
  { id: 'mira', name: 'Mira', age: '27', tagline: 'The midnight daydreamer', bio: 'A thoughtful observer who finds a little magic in rainy windows and late-night stories.', heritage: 'deep', hair: 'blue-hair', body: 'lean', eyes: 'blue-eyes', setting: 'noir', colors: ['#263653', '#7185a4', '#c4d2df'], tone: 'Thoughtful and imaginative; loves rainy nights and curious conversation.' },
  { id: 'sora', name: 'Sora', age: '26', tagline: 'The golden-hour spark', bio: 'Bright energy, easy laughter, and a talent for turning small plans into lovely adventures.', heritage: 'brown', hair: 'honey', body: 'athletic', eyes: 'amber-eyes', setting: 'rooftop', colors: ['#98623b', '#d6a353', '#f1d39c'], tone: 'Upbeat and adventurous; brings warmth and spontaneous ideas.' },
  { id: 'nadia', name: 'Nadia', age: '30', tagline: 'The fireside wit', bio: 'Collected, curious, and always ready with a clever question or a better record to play.', heritage: 'warm-olive', hair: 'espresso', body: 'tall', eyes: 'green-eyes', setting: 'fireplace', colors: ['#4d382a', '#aa7350', '#d3b18b'], tone: 'Grounded and candid; appreciates music, dry humor, and depth.' },
  { id: 'elise', name: 'Elise', age: '29', tagline: 'The seaside romantic', bio: 'Calm presence, a soft spot for ocean air, and an unhurried way of making you feel heard.', heritage: 'fair', hair: 'auburn', body: 'petite', eyes: 'hazel-eyes', setting: 'seaside', colors: ['#385253', '#80a5a0', '#d3c7aa'], tone: 'Calm and attentive; favors seaside moods and unhurried chats.' }
];

const grid = document.querySelector('#gallery-grid');
const count = document.querySelector('#gallery-count');
const dialog = document.querySelector('#scene-dialog');
const privateImageInput = document.querySelector('#private-image-upload');
const privateVideoInput = document.querySelector('#private-video-upload');
const privateImageGrid = document.querySelector('#private-image-grid');
const privateLibraryStatus = document.querySelector('#private-library-status');
const privateImageDialog = document.querySelector('#private-image-dialog');
const privateImagePreview = document.querySelector('#private-image-preview');
const privateVideoPreview = document.querySelector('#private-video-preview');
const privateImageTitle = document.querySelector('#private-image-title');
const privateImageUrls = new Map();
const maxPrivateImageSize = 10 * 1024 * 1024;
const maxPrivateVideoSize = 100 * 1024 * 1024;
let privateImageDatabase;
const favoriteIds = new Set(readFavorites());
let activeFilter = 'All';
let selectedScene = null;
let toastTimer;
let providerAvailable = false;
const providerOptIn = document.querySelector('#provider-opt-in');
const enhancedPacing = document.querySelector('#enhanced-pacing');
const teasingMode = document.querySelector('#teasing-mode');
const providerBadge = document.querySelector('#provider-badge');
const providerStatus = document.querySelector('#provider-status');
const providerConversation = [];
let activeCompanionProfile = companionProfiles[0];
const appearanceControls = {
  heritage: document.querySelector('#heritage-select'),
  hair: document.querySelector('#hair-select'),
  body: document.querySelector('#body-select'),
  eyes: document.querySelector('#eyes-select'),
  setting: document.querySelector('#setting-select'),
  name: document.querySelector('#character-name'),
  custom: document.querySelector('#custom-heritage')
};

function loadAppearance() {
  try {
    const saved = JSON.parse(localStorage.getItem('cinima-appearance') || '{}');
    for (const [key, control] of Object.entries(appearanceControls)) {
      if (typeof saved[key] === 'string') control.value = saved[key];
    }
    activeCompanionProfile = companionProfiles.find((profile) => profile.id === saved.profileId) || activeCompanionProfile;
  } catch (error) {
    console.warn('Saved appearance settings are unavailable:', error);
  }
}

function updateCompanion() {
  const { heritage, hair, body, eyes, name, custom } = appearanceControls;
  const characterName = name.value.trim() || 'Cinima';
  const heritageName = heritage.value === 'custom'
    ? custom.value.trim() || 'Custom look'
    : heritage.options[heritage.selectedIndex].text;
  const bodyName = body.options[body.selectedIndex].text;
  const hairName = hair.options[hair.selectedIndex].text;
  const classNames = [
    `skin-${heritage.value}`,
    `hair-${hair.value}`,
    `build-${body.value}`,
    `eyes-${eyes.value}`
  ];

  for (const id of ['companion-preview', 'room-character']) {
    const element = document.getElementById(id);
    element.className = `${id} ${classNames.join(' ')}`;
  }
  document.querySelector('#preview-label').textContent = characterName;
  document.querySelector('#character-caption-name').textContent = characterName;
  document.querySelector('#character-caption-look').textContent = `${heritageName} · ${hairName} · ${bodyName}`;
  const initialMessageName = document.querySelector('#message-name');
  if (initialMessageName) initialMessageName.textContent = characterName;
  const sceneMode = document.querySelector('#scene-mode').value;
  document.querySelector('#room-scene').className =
    `room-scene room-theme-${appearanceControls.setting.value} room-mode-${sceneMode}`;
  document.querySelector('#setting-caption').textContent =
    appearanceControls.setting.options[appearanceControls.setting.selectedIndex].text.toUpperCase();
  document.querySelector('.custom-heritage-label').classList.toggle('visible', heritage.value === 'custom');
  custom.classList.toggle('visible', heritage.value === 'custom');

  try {
    localStorage.setItem('cinima-appearance', JSON.stringify({
      ...Object.fromEntries(Object.entries(appearanceControls).map(([key, control]) => [key, control.value])),
      profileId: activeCompanionProfile.id
    }));
  } catch (error) {
    console.warn('Could not save appearance settings:', error);
  }
}

function renderCompanionFeed() {
  const feed = document.querySelector('#companion-feed');
  for (const [index, profile] of companionProfiles.entries()) {
    const card = document.createElement('article');
    card.className = `companion-feed-card companion-vibe-${profile.id}`;
    card.style.setProperty('--feed-color-one', profile.colors[0]);
    card.style.setProperty('--feed-color-two', profile.colors[1]);
    card.style.setProperty('--feed-color-three', profile.colors[2]);
    card.setAttribute('aria-label', `${profile.name}, fictional adult age ${profile.age}`);

    const art = document.createElement('div');
    art.className = 'companion-feed-art';
    art.setAttribute('aria-hidden', 'true');
    for (const shape of ['feed-orbit', 'feed-avatar-halo', 'feed-avatar-hair', 'feed-avatar-head', 'feed-avatar-body', 'feed-art-grain']) {
      const element = document.createElement('span');
      element.className = shape;
      art.append(element);
    }
    const count = document.createElement('span');
    count.className = 'feed-counter';
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(companionProfiles.length).padStart(2, '0')}`;
    art.append(count);

    const content = document.createElement('div');
    content.className = 'companion-feed-content';
    const label = document.createElement('span');
    label.className = 'feed-adult-label';
    label.textContent = `AI COMPANION · WOMAN · ${profile.age}+`;
    const title = document.createElement('h3');
    title.textContent = profile.name;
    const tagline = document.createElement('p');
    tagline.className = 'feed-tagline';
    tagline.textContent = profile.tagline;
    const bio = document.createElement('p');
    bio.className = 'feed-bio';
    bio.textContent = profile.bio;
    const button = document.createElement('button');
    button.className = 'feed-chat-button';
    button.type = 'button';
    button.textContent = `Chat with ${profile.name} ↗`;
    button.addEventListener('click', () => {
      activeCompanionProfile = profile;
      appearanceControls.name.value = profile.name;
      appearanceControls.heritage.value = profile.heritage;
      appearanceControls.hair.value = profile.hair;
      appearanceControls.body.value = profile.body;
      appearanceControls.eyes.value = profile.eyes;
      appearanceControls.setting.value = profile.setting;
      appearanceControls.custom.value = '';
      document.querySelector('#scene-mode').value = 'solo';
      providerConversation.length = 0;
      updateCompanion();
      const messages = document.querySelector('#chat-messages');
      messages.replaceChildren();
      addChatMessage(`${profile.bio} I’m here for a fictional, easygoing conversation, and you can steer or pause whenever you like.`, 'companion');
      document.querySelector('#room').scrollIntoView({ behavior: 'smooth' });
      document.querySelector('#scene-prompt').focus({ preventScroll: true });
      showToast(`${profile.name} is ready in your room.`);
    });
    content.append(label, title, tagline, bio, button);
    card.append(art, content);
    feed.append(card);
  }
}

function addChatMessage(text, speaker) {
  const message = document.createElement('div');
  message.className = `chat-message ${speaker}-message`;
  const label = document.createElement('span');
  label.className = 'message-name';
  label.textContent = speaker === 'user' ? 'You' : (
    speaker === 'companion' ? (appearanceControls.name.value.trim() || 'Cinima') : speaker
  );
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  message.append(label, paragraph);
  document.querySelector('#chat-messages').append(message);
  message.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function getDemoReply(request) {
  const prompt = request.toLowerCase();
  const setting = appearanceControls.setting.options[appearanceControls.setting.selectedIndex].text.toLowerCase();

  if (/\bstop\b|\bpause\b|\bno\b|not comfortable|uncomfortable|slow down/.test(prompt)) {
    return 'Absolutely. We stop here—no pressure to continue. Would you like to change the scene, take a pause, or end it?';
  }

  if (teasingMode.checked) {
    if (/cum|orgasm|finish|dirty.?talk|turn me on/.test(prompt)) {
      return 'Mmm, you do like a little anticipation. I can keep the banter deliciously teasing and the scene non-graphic—but you set the pace. Want me to keep flirting, soften the mood, or change direction?';
    }
    if (/flirt|tease|compliment|blush/.test(prompt)) {
      return 'Careful, Alex—you keep looking at me like that and I might start enjoying the attention. I’ll keep you guessing, one charming little moment at a time. Shall I keep teasing, or should we change the mood?';
    }
    if (enhancedPacing.checked) {
      return `The ${setting} glows softly as I give you a knowing smile. “You’re fun to tease, Alex—but you’re in charge of the pace. Want a little more playful banter, a slow dance, or a change of scene?”`;
    }
    return 'That look suits you, Alex. I can keep things playful and teasing, or switch to something softer—your call.';
  }

  if (enhancedPacing.checked) {
    if (document.querySelector('#scene-mode').value === 'trio') {
      if (/music|song|dance|playlist/.test(prompt)) {
        return `The first notes warm the ${setting}. Ava offers you her hand; Lena smiles and saves the next song. Cinima: “Your choice, Alex—dance, talk, or surprise us.”`;
      }
      if (/cozy|quiet|candle|fire|soft|relax|slow/.test(prompt)) {
        return `The ${setting} settles into candlelight and an easy hush. Lena takes care of the music while Ava checks in with a warm smile. Cinima: “Comfy for everyone? We can linger here or change the mood.”`;
      }
      if (/surprise|choose|anything|you decide/.test(prompt)) {
        return `Ava picks a mellow track; Lena brings over drinks, and the ${setting} glows with city light. Cinima: “A charming start. What sounds best next: a dance, a story, or a little playful banter?”`;
      }
      return `The ${setting} comes alive with soft light and an inviting soundtrack. Ava and Lena trade a conspiratorial grin, then leave the next move to you. Cinima: “Shall we make this a dance, a conversation, or something else?”`;
    }
    if (/music|song|dance|playlist/.test(prompt)) {
      return `A low, velvet-smooth track fills the ${setting}, and the city lights keep time beyond the window. Cinima: “One song, one unhurried dance—unless you’d rather choose the next scene.”`;
    }
    if (/cozy|quiet|candle|fire|soft|relax|slow/.test(prompt)) {
      return `The ${setting} softens into warm light and a comfortable quiet. Cinima: “No rush. We can stay with this moment, or I can set up a new little surprise.”`;
    }
    if (/city|roof|penthouse|rain|night|view/.test(prompt)) {
      return `Rain and neon blur beyond the ${setting}; inside, the music turns low and the conversation gets its own spotlight. Cinima: “What shall we focus on: the view, the music, or a story?”`;
    }
    if (/surprise|choose|anything|you decide/.test(prompt)) {
      return `I pick the ${setting}, a favorite song, and a view worth pausing for. Cinima: “There—our opening scene. Want a playful challenge, a slow dance, or a change of direction?”`;
    }
    if (/romance|date|sweet|tender|affection/.test(prompt)) {
      return `The ${setting} glows softly as I make room for an unhurried, affectionate moment. Cinima: “Tell me what feels right, and I’ll follow your lead.”`;
    }
    return `The ${setting} settles around us: warm light, a little music, and a moment with room to unfold. Cinima: “I’m listening, Alex. Pick a detail and I’ll carry the scene forward.”`;
  }

  if (document.querySelector('#scene-mode').value === 'trio') {
    if (/music|song|dance|playlist/.test(prompt)) {
      return 'Ava: I’ll pick something with a good beat. Lena: And I’m claiming the first dance. Cinima: A bold opening negotiation; I’m keeping score.';
    }
    if (/cozy|quiet|candle|fire|soft|relax|slow/.test(prompt)) {
      return 'Lena: Let’s make it cozy and take our time. Ava: I’ll sort the candles. Cinima: Look at that, Alex—you’ve got a whole excellent planning committee.';
    }
    if (/surprise|choose|anything|you decide/.test(prompt)) {
      return 'Ava: Drinks and a little music? Lena: Then we see where the conversation goes. Cinima: Sensible, charming, and no one has to follow a script. Your call, Alex.';
    }
    return `Ava: I’m listening. Lena: Me too—let’s keep everyone comfortable and let Alex steer. Cinima: The ${setting} is all yours to direct. What happens next?`;
  }

  if (/music|song|dance|playlist/.test(prompt)) {
    return `Consider it done, Alex. The ${setting} gets its own soundtrack; I promise not to pick anything with a saxophone solo unless you ask. What should the first song feel like?`;
  }
  if (/cozy|quiet|candle|fire|soft|relax|slow/.test(prompt)) {
    return `A softer pace, then. I’ll let the ${setting} settle into warm light and an easy quiet. No rush, Alex—what little detail should I add?`;
  }
  if (/city|roof|penthouse|rain|night|view/.test(prompt)) {
    return `City lights, late hours, and just enough mystery to keep the plot moving. The ${setting} is ready, Alex. What do you want to happen next?`;
  }
  if (/surprise|choose|anything|you decide/.test(prompt)) {
    return `I’ve got a scene in mind: the ${setting}, a little music, and a view worth pretending we came for. Your call on the next detail, Alex.`;
  }
  if (/romance|date|sweet|tender|affection/.test(prompt)) {
    return `Romance it is. I’ll make the ${setting} feel intimate and unhurried—with impeccable taste, naturally. What kind of moment are you imagining?`;
  }
  return `I’m listening, Alex. I’ll keep the ${setting} in mind and shape this fictional scene around your direction. What would you like to add next?`;
}

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem('cinima-favorites') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn('Saved favorites are unavailable:', error);
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem('cinima-favorites', JSON.stringify([...favoriteIds]));
  } catch (error) {
    console.warn('Could not save favorites:', error);
    showToast('Favorites could not be saved on this device.');
  }
}

function makeCard(scene, index) {
  const card = document.createElement('article');
  card.className = `scene-card ${index === 2 || index === 9 ? 'scene-card-tall' : ''}`;
  card.dataset.scene = scene.id;
  const art = document.createElement('button');
  art.type = 'button';
  art.className = `scene-art art-${scene.style}`;
  art.setAttribute('aria-label', `Open ${scene.title}`);
  if (scene.image) {
    art.classList.add('image-art');
    const image = document.createElement('img');
    image.className = 'scene-image';
    image.src = scene.image;
    image.alt = `User-shared fantasy portrait: ${scene.title}`;
    art.append(image);
  } else {
    art.innerHTML = `<span class="art-orbit"></span><span class="art-sun"></span><span class="art-arch"></span><span class="art-spark">${scene.symbol}</span><span class="art-grain"></span>`;
  }
  const caption = document.createElement('span');
  caption.className = 'art-caption';
  caption.textContent = scene.tag;
  art.append(caption);
  art.addEventListener('click', () => openScene(scene));

  const meta = document.createElement('div');
  meta.className = 'scene-meta';
  const text = document.createElement('div');
  text.innerHTML = `<span class="scene-category">${scene.category}</span><h3>${scene.title}</h3>`;
  const favorite = document.createElement('button');
  favorite.type = 'button';
  favorite.className = `favorite-button ${favoriteIds.has(scene.id) ? 'is-favorite' : ''}`;
  favorite.setAttribute('aria-label', favoriteIds.has(scene.id) ? 'Remove from favorites' : 'Add to favorites');
  favorite.setAttribute('aria-pressed', String(favoriteIds.has(scene.id)));
  favorite.innerHTML = favoriteIds.has(scene.id) ? '♥' : '♡';
  favorite.addEventListener('click', () => toggleFavorite(scene.id));
  meta.append(text, favorite);
  card.append(art, meta);
  return card;
}

function renderGallery() {
  const visibleScenes = scenes.filter((scene) => {
    if (activeFilter === 'Favorites') return favoriteIds.has(scene.id);
    return activeFilter === 'All' || scene.category === activeFilter;
  });
  grid.replaceChildren(...visibleScenes.map(makeCard));
  count.textContent = `${visibleScenes.length} ${visibleScenes.length === 1 ? 'scene' : 'scenes'}`;
  if (!visibleScenes.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No favorites yet. Tap a heart on any scene to keep it close.';
    grid.append(empty);
  }
}

function toggleFavorite(id) {
  if (favoriteIds.has(id)) {
    favoriteIds.delete(id);
  } else {
    favoriteIds.add(id);
  }
  saveFavorites();
  renderGallery();
  if (selectedScene?.id === id) updateDialogFavorite();
}

function updateDialogFavorite() {
  const isFavorite = favoriteIds.has(selectedScene.id);
  document.querySelector('#dialog-favorite').textContent = isFavorite ? '♥ Saved to favorites' : '♡ Save this scene';
}

function openScene(scene) {
  selectedScene = scene;
  const dialogArt = document.querySelector('#dialog-art');
  dialogArt.className = `dialog-art art-${scene.style}${scene.image ? ' image-art' : ''}`;
  if (scene.image) {
    const image = document.createElement('img');
    image.className = 'dialog-image';
    image.src = scene.image;
    image.alt = `User-shared fantasy portrait: ${scene.title}`;
    dialogArt.replaceChildren(image);
  } else {
    dialogArt.innerHTML = `<span class="art-orbit"></span><span class="art-sun"></span><span class="art-arch"></span><span class="art-spark">${scene.symbol}</span><span class="art-grain"></span>`;
  }
  document.querySelector('#dialog-category').textContent = `${scene.category}  ·  ${scene.tag}`;
  document.querySelector('#dialog-title').textContent = scene.title;
  document.querySelector('#dialog-description').textContent = scene.description;
  updateDialogFavorite();
  dialog.showModal();
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
}

function openPrivateImageDatabase() {
  if (privateImageDatabase) return privateImageDatabase;
  privateImageDatabase = new Promise((resolve, reject) => {
    const request = indexedDB.open('cinima-private-image-library', 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('images')) {
        request.result.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open the local image library.'));
    request.onblocked = () => reject(new Error('The local image library is blocked by another browser tab.'));
  });
  return privateImageDatabase;
}

async function readPrivateImages() {
  const database = await openPrivateImageDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction('images', 'readonly').objectStore('images').getAll();
    request.onsuccess = () => resolve(request.result.sort((a, b) => b.addedAt - a.addedAt));
    request.onerror = () => reject(request.error || new Error('Could not read saved images.'));
  });
}

async function storePrivateImage(file) {
  const database = await openPrivateImageDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('images', 'readwrite');
    const request = transaction.objectStore('images').add({
      name: file.name.replace(/\.[^.]+$/, '').slice(0, 100) || 'Private image',
      type: file.type,
      blob: file,
      size: file.size,
      addedAt: Date.now()
    });
    let storedId;
    request.onsuccess = () => { storedId = request.result; };
    transaction.onerror = () => reject(transaction.error || new Error('Could not save this image locally.'));
    transaction.onabort = () => reject(transaction.error || new Error('Could not save this image locally.'));
    transaction.oncomplete = () => resolve(storedId);
  });
}

async function requestPersistentPrivateStorage() {
  if (!navigator.storage?.persist) return false;
  try {
    return await navigator.storage.persist();
  } catch (error) {
    console.warn('Could not request persistent browser storage:', error);
    return false;
  }
}

async function renamePrivateImage(id, name) {
  const database = await openPrivateImageDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('images', 'readwrite');
    const store = transaction.objectStore('images');
    const request = store.get(id);
    request.onsuccess = () => {
      if (!request.result) {
        transaction.abort();
        return;
      }
      store.put({ ...request.result, name });
    };
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error('Could not rename this file.'));
    transaction.onabort = () => reject(transaction.error || new Error('Could not rename this file.'));
  });
}

function formatFileSize(size) {
  return size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

async function renderPrivateImages() {
  const images = await readPrivateImages();
  for (const url of privateImageUrls.values()) URL.revokeObjectURL(url);
  privateImageUrls.clear();
  privateImageGrid.replaceChildren();
  if (!images.length) {
    const empty = document.createElement('p');
    empty.className = 'private-image-empty';
    empty.textContent = 'Your private library is empty. Add images or videos to keep local references here.';
    privateImageGrid.append(empty);
    return;
  }

  for (const record of images) {
    const url = URL.createObjectURL(record.blob);
    privateImageUrls.set(record.id, url);
    const card = document.createElement('article');
    const isVideo = record.type.startsWith('video/');
    card.className = `private-image-card ${isVideo ? 'private-video-card' : ''}`;
    let preview;
    if (isVideo) {
      preview = document.createElement('video');
      preview.className = 'private-video-inline';
      preview.src = url;
      preview.controls = true;
      preview.preload = 'metadata';
      preview.playsInline = true;
      preview.setAttribute('aria-label', record.name);
      const expandButton = document.createElement('button');
      expandButton.type = 'button';
      expandButton.className = 'private-video-expand';
      expandButton.textContent = 'View full screen';
      expandButton.addEventListener('click', () => {
        privateImagePreview.hidden = true;
        privateVideoPreview.hidden = false;
        privateVideoPreview.src = url;
        privateVideoPreview.controls = true;
        privateVideoPreview.playsInline = true;
        privateImageTitle.textContent = record.name;
        document.querySelector('#private-media-fullscreen').hidden = false;
        privateImageDialog.showModal();
        privateVideoPreview.play().catch(() => {});
      });
      const videoFrame = document.createElement('div');
      videoFrame.className = 'private-video-frame';
      videoFrame.append(preview, expandButton);
      preview = videoFrame;
    } else {
      const previewButton = document.createElement('button');
      previewButton.type = 'button';
      previewButton.className = 'private-image-preview-button';
      previewButton.setAttribute('aria-label', `Preview ${record.name}`);
      const image = document.createElement('img');
      image.src = url;
      image.alt = record.name;
      previewButton.append(image);
      previewButton.addEventListener('click', () => {
        privateImagePreview.hidden = false;
        privateVideoPreview.hidden = true;
        privateImagePreview.src = url;
        privateImagePreview.alt = record.name;
        privateImageTitle.textContent = record.name;
        document.querySelector('#private-media-fullscreen').hidden = false;
        privateImageDialog.showModal();
      });
      preview = previewButton;
    }

    const name = document.createElement('div');
    name.className = 'private-image-name';
    name.textContent = record.name;
    const renameButton = document.createElement('button');
    renameButton.type = 'button';
    renameButton.className = 'private-image-rename';
    renameButton.textContent = 'Rename';
    renameButton.setAttribute('aria-label', `Rename ${record.name}`);
    renameButton.addEventListener('click', () => {
      const editor = document.createElement('form');
      editor.className = 'private-image-rename-form';
      const input = document.createElement('input');
      input.type = 'text';
      input.value = record.name;
      input.maxLength = 80;
      input.required = true;
      input.setAttribute('aria-label', 'New private file name');
      const saveButton = document.createElement('button');
      saveButton.type = 'submit';
      saveButton.textContent = 'Save name';
      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.textContent = 'Cancel';
      cancelButton.addEventListener('click', () => editor.remove());
      editor.append(input, saveButton, cancelButton);
      renameButton.replaceWith(editor);
      input.focus();
      input.select();
      editor.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nextName = input.value.trim();
        if (!nextName) {
          input.focus();
          return;
        }
        saveButton.disabled = true;
        try {
          await renamePrivateImage(record.id, nextName);
          record.name = nextName;
          name.textContent = nextName;
          renameButton.setAttribute('aria-label', `Rename ${nextName}`);
          renameButton.textContent = 'Rename';
          editor.replaceWith(renameButton);
          privateLibraryStatus.textContent = 'Private file name updated on this device.';
          if (privateImageDialog.open &&
              (privateImagePreview.src === url || privateVideoPreview.src === url)) {
            privateImageTitle.textContent = nextName;
          }
        } catch (error) {
          saveButton.disabled = false;
          privateLibraryStatus.textContent = error.message;
        }
      });
    });
    const size = document.createElement('div');
    size.className = 'private-image-size';
    size.textContent = formatFileSize(record.size);
    card.append(preview, name, renameButton, size);
    privateImageGrid.append(card);
  }
}

async function addPrivateMedia(input, kind) {
  const files = [...input.files];
  if (!files.length) return;
  input.disabled = true;
  let savedCount = 0;
  const failures = [];
  const allowedTypes = kind === 'image'
    ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    : ['video/mp4', 'video/webm', 'video/quicktime'];
  const maxSize = kind === 'image' ? maxPrivateImageSize : maxPrivateVideoSize;
  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      failures.push(`${file.name}: choose a supported ${kind} file (${allowedTypes.map((type) => type.split('/')[1]).join(', ')}).`);
    } else if (file.size > maxSize) {
      failures.push(`${file.name}: maximum size is ${kind === 'image' ? '10 MB' : '100 MB'}.`);
    } else {
      try {
        await storePrivateImage(file);
        savedCount += 1;
      } catch (error) {
        failures.push(`${file.name}: ${error.message}`);
      }
    }
  }
  input.disabled = false;
  input.value = '';
  try {
    await renderPrivateImages();
  } catch (error) {
    failures.push(error.message);
  }
  privateLibraryStatus.textContent = [
    savedCount ? `${savedCount} ${kind}${savedCount === 1 ? '' : 's'} saved in this browser.` : '',
    ...failures
  ].filter(Boolean).join(' ') || `No ${kind} files were added.`;
}

privateImageInput.addEventListener('change', () => addPrivateMedia(privateImageInput, 'image'));
privateVideoInput.addEventListener('change', () => addPrivateMedia(privateVideoInput, 'video'));

document.querySelector('#private-image-close').addEventListener('click', () => {
  privateImageDialog.close();
});
document.querySelector('#private-media-fullscreen').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    const media = privateVideoPreview.hidden ? privateImagePreview : privateVideoPreview;
    if (!media.requestFullscreen) {
      privateLibraryStatus.textContent = 'Fullscreen is not supported by this browser. Use the preview window or your browser’s zoom controls.';
      return;
    }
    await media.requestFullscreen();
  } catch (error) {
    privateLibraryStatus.textContent = `Could not open fullscreen: ${error.message}`;
  }
});
privateImageDialog.addEventListener('close', () => {
  privateImagePreview.removeAttribute('src');
  privateVideoPreview.pause();
  privateVideoPreview.removeAttribute('src');
  privateVideoPreview.load();
  privateVideoPreview.hidden = true;
});

document.querySelectorAll('.filter-chip').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.classList.toggle('selected', chip === button);
    });
    renderGallery();
  });
});

document.querySelector('#shuffle-button').addEventListener('click', () => {
  const options = scenes.filter((scene) => scene.id !== selectedScene?.id);
  openScene(options[Math.floor(Math.random() * options.length)]);
});

document.querySelector('#private-toggle').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const isPrivate = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(isPrivate));
  document.querySelector('#private-label').textContent = isPrivate ? 'Private mode on' : 'Private mode';
  document.body.classList.toggle('private-mode', isPrivate);
  showToast(isPrivate ? 'Private mode is on for this screen.' : 'Private mode is off.');
});

const fullscreenToggle = document.querySelector('#fullscreen-toggle');
fullscreenToggle.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else {
      showToast('Full screen is not supported by this browser.');
    }
  } catch (error) {
    showToast(`Could not enter full screen: ${error.message}`);
  }
});
document.addEventListener('fullscreenchange', () => {
  const isFullscreen = Boolean(document.fullscreenElement);
  fullscreenToggle.setAttribute('aria-pressed', String(isFullscreen));
  fullscreenToggle.querySelector('span').textContent = isFullscreen ? 'Exit full screen' : 'Full screen';
});

document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#dialog-favorite').addEventListener('click', () => {
  if (selectedScene) toggleFavorite(selectedScene.id);
});
document.querySelector('#dialog-create-prompt').addEventListener('click', () => {
  if (!selectedScene) return;
  studioReference.value = selectedScene.id;
  document.querySelector('#studio-detail').value = selectedScene.description;
  dialog.close();
  document.querySelector('#scene-studio').scrollIntoView({ behavior: 'smooth' });
  document.querySelector('#studio-detail').focus({ preventScroll: true });
});
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

for (const control of Object.values(appearanceControls)) {
  control.addEventListener('input', updateCompanion);
  control.addEventListener('change', updateCompanion);
}

document.querySelector('#randomize-button').addEventListener('click', () => {
  const randomOption = (control) => {
    const choices = [...control.options].filter((option) => option.value !== 'custom');
    control.value = choices[Math.floor(Math.random() * choices.length)].value;
  };
  randomOption(appearanceControls.heritage);
  randomOption(appearanceControls.hair);
  randomOption(appearanceControls.body);
  randomOption(appearanceControls.eyes);
  randomOption(appearanceControls.setting);
  updateCompanion();
  showToast('A fresh character look is ready.');
});

function updateProviderModeIndicator() {
  providerBadge.textContent = providerOptIn.checked && providerAvailable
    ? 'EXTERNAL AI · OPTED IN'
    : 'LOCAL DEMO';
}

async function loadProviderStatus() {
  try {
    const response = await fetch('/api/config', { cache: 'no-store' });
    if (!response.ok) throw new Error('Provider status is unavailable.');
    const config = await response.json();
    providerAvailable = config.providerConfigured === true;
    providerOptIn.disabled = !providerAvailable;
    providerStatus.textContent = providerAvailable
      ? 'Available when enabled. Your message, recent AI-chat messages, and selected scene details will be sent to the server-configured provider.'
      : 'No provider configured. Replies stay in local demo mode.';
  } catch (error) {
    providerOptIn.disabled = true;
    providerStatus.textContent = 'Provider status could not be checked. Local demo remains available; external AI is disabled.';
    console.warn('Could not check AI provider status:', error);
  }
  updateProviderModeIndicator();
}

providerOptIn.addEventListener('change', updateProviderModeIndicator);

let studioFormat = 'image';
const studioModeNote = document.querySelector('#studio-mode-note');
const studioOutput = document.querySelector('#studio-result');
const studioCopyButton = document.querySelector('#studio-copy');
const studioReference = document.querySelector('#studio-reference');

function updateStudioRecipe() {
  const selectLabels = [
    ['#studio-style', '#recipe-style'],
    ['#studio-framing', '#recipe-framing'],
    ['#studio-pose', '#recipe-pose'],
    ['#studio-expression', '#recipe-expression'],
    ['#studio-filter', '#recipe-filter']
  ];
  for (const [selectSelector, outputSelector] of selectLabels) {
    const select = document.querySelector(selectSelector);
    document.querySelector(outputSelector).textContent =
      select.options[select.selectedIndex].text;
  }
  document.querySelector('#recipe-format').textContent =
    studioFormat === 'motion' ? 'Motion concept' : 'Still image';
  const referenceScene = scenes.find((scene) => scene.id === studioReference.value);
  document.querySelector('#recipe-reference').textContent = referenceScene?.title || 'None';
}

for (const scene of scenes) {
  const option = document.createElement('option');
  option.value = scene.id;
  option.textContent = scene.title;
  studioReference.append(option);
}

document.querySelectorAll('.studio-mode-button').forEach((button) => {
  button.addEventListener('click', () => {
    studioFormat = button.dataset.format;
    document.querySelectorAll('.studio-mode-button').forEach((modeButton) => {
      const selected = modeButton === button;
      modeButton.classList.toggle('selected', selected);
      modeButton.setAttribute('aria-pressed', String(selected));
    });
    studioModeNote.textContent = studioFormat === 'motion'
      ? 'A short, cinematic movement concept. This creates prompt text only; it does not generate a video.'
      : 'A single-frame visual concept. This creates prompt text only; it does not generate an image.';
    updateStudioRecipe();
  });
});

document.querySelectorAll('#studio-style, #studio-framing, #studio-pose, #studio-expression, #studio-filter, #studio-reference')
  .forEach((control) => control.addEventListener('change', updateStudioRecipe));

document.querySelector('#realistic-preset').addEventListener('click', () => {
  document.querySelector('#studio-style').value = 'Photorealistic editorial portrait';
  document.querySelector('#studio-framing').value = 'Close portrait with soft background';
  document.querySelector('#studio-filter').value = 'Natural, unfiltered lighting';
  updateStudioRecipe();
  document.querySelector('#studio-result-status').textContent =
    'Realistic portrait look selected. Adjust the fictional character and scene, then compose.';
});

document.querySelector('#studio-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const selectedText = (id) => {
    const control = document.querySelector(id);
    return control.options[control.selectedIndex].text;
  };
  const characterName = appearanceControls.name.value.trim() || 'Cinima';
  const heritage = appearanceControls.heritage.value === 'custom'
    ? appearanceControls.custom.value.trim() || 'user-designed'
    : appearanceControls.heritage.options[appearanceControls.heritage.selectedIndex].text;
  const appearance = [
    heritage,
    appearanceControls.hair.options[appearanceControls.hair.selectedIndex].text,
    appearanceControls.body.options[appearanceControls.body.selectedIndex].text,
    appearanceControls.eyes.options[appearanceControls.eyes.selectedIndex].text
  ].join(', ');
  const referenceScene = scenes.find((scene) => scene.id === studioReference.value);
  const photorealistic = selectedText('#studio-style').toLowerCase().includes('photorealistic');
  const scene = [
    `${selectedText('#studio-style')}; ${selectedText('#studio-framing')}.`,
    photorealistic
      ? 'Natural skin texture, plausible anatomy, lifelike editorial lighting; an original fictional character, not a copy of a real person.'
      : '',
    document.querySelector('#studio-use-companion').checked
      ? `Depict ${characterName}, a fictional adult character aged 25 or older, with a consistent look (${appearance}).`
      : 'Depict a fictional adult character aged 25 or older, with an original, consistent appearance.',
    `${selectedText('#studio-pose')}. The mood is ${selectedText('#studio-mood').toLowerCase()}.`,
    `Expression: ${selectedText('#studio-expression').toLowerCase()}. Finish: ${selectedText('#studio-filter').toLowerCase()}.`,
    `Setting: ${appearanceControls.setting.options[appearanceControls.setting.selectedIndex].text}.`,
    referenceScene
      ? `Use the gallery concept "${referenceScene.title}" as a mood reference: ${referenceScene.description}`
      : '',
    document.querySelector('#studio-detail').value.trim()
      ? `Scene detail: ${document.querySelector('#studio-detail').value.trim()}.`
      : '',
    document.querySelector('#studio-tweak').value.trim()
      ? `Refinement: ${document.querySelector('#studio-tweak').value.trim()}.`
      : '',
    studioFormat === 'motion'
      ? 'Motion concept: a gentle five-second camera drift, natural movement, stable character appearance, soft ambient light; no dialogue or abrupt cuts.'
      : 'Still-image concept: one composed frame, cinematic lighting, natural anatomy, elegant styling.',
    document.querySelector('#scene-mode').value === 'trio'
      ? 'Any additional people are distinct fictional adults aged 25 or older; everyone is comfortable and consenting.'
      : '',
    'Keep the scene non-graphic and fully clothed. Do not depict nudity, sexual activity, minors, or a real person’s likeness.'
  ].filter(Boolean);
  const avoid = document.querySelector('#studio-avoid').value.trim();
  if (avoid) scene.push(`Avoid: ${avoid}.`);
  studioOutput.value = scene.join(' ');
  updateStudioRecipe();
  studioCopyButton.disabled = false;
  document.querySelector('#studio-result-status').textContent =
    'Composed locally. Copy it to use elsewhere; no service is connected.';
});

studioCopyButton.addEventListener('click', async () => {
  if (!studioOutput.value) return;
  try {
    await navigator.clipboard.writeText(studioOutput.value);
    document.querySelector('#studio-result-status').textContent = 'Copied to your clipboard.';
  } catch (error) {
    studioOutput.focus();
    studioOutput.select();
    document.querySelector('#studio-result-status').textContent =
      'Clipboard access was blocked. The prompt is selected so you can copy it manually.';
    console.warn('Could not copy the composed prompt:', error);
  }
});

document.querySelector('#chat-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.querySelector('#scene-prompt');
  const sendButton = event.currentTarget.querySelector('button[type="submit"]');
  const request = input.value.trim();
  if (!request) return;
  addChatMessage(request, 'user');
  input.value = '';
  if (!providerOptIn.checked) {
    window.setTimeout(() => addChatMessage(getDemoReply(request), 'companion'), 350);
    return;
  }

  sendButton.disabled = true;
  input.disabled = true;
  const userMessage = { role: 'user', content: request };
  const messages = [
    ...providerConversation.slice(-11),
    userMessage
  ];
  providerConversation.push(userMessage);
  if (providerConversation.length > 11) providerConversation.shift();
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        context: {
          characterName: appearanceControls.name.value.trim() || 'Cinima',
          characterPersona: activeCompanionProfile.tone,
          sceneMode: document.querySelector('#scene-mode').value,
          setting: appearanceControls.setting.options[appearanceControls.setting.selectedIndex].text,
          pacing: enhancedPacing.checked ? 'enhanced' : 'standard',
          flirtMode: teasingMode.checked ? 'teasing' : 'playful'
        }
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'The AI provider could not reply.');
    if (typeof result.reply !== 'string' || !result.reply.trim()) {
      throw new Error('The AI provider returned no text reply.');
    }
    providerConversation.push({ role: 'assistant', content: result.reply });
    if (providerConversation.length > 11) providerConversation.shift();
    addChatMessage(result.reply, 'companion');
  } catch (error) {
    if (providerConversation.at(-1) === userMessage) providerConversation.pop();
    addChatMessage(error.message || 'The AI provider could not reply. Please try again.', 'error');
  } finally {
    sendButton.disabled = false;
    input.disabled = false;
    input.focus();
  }
});

document.querySelector('#scene-mode').addEventListener('change', updateCompanion);
loadAppearance();
updateCompanion();
renderGallery();
renderCompanionFeed();
loadProviderStatus();
updateStudioRecipe();
renderPrivateImages().catch((error) => {
  privateLibraryStatus.textContent = `Could not load this browser’s private library: ${error.message}`;
});
requestPersistentPrivateStorage().then((persistent) => {
  const storageStatus = document.querySelector('#private-storage-status');
  storageStatus.textContent = persistent
    ? 'This browser marked Cinima storage as persistent; it should not automatically clear it under storage pressure.'
    : 'This browser could not guarantee persistent storage. Keep a separate backup; clearing browser data can still erase this library.';
});
