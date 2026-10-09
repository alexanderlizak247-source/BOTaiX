const scenes = [
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

const grid = document.querySelector('#gallery-grid');
const count = document.querySelector('#gallery-count');
const dialog = document.querySelector('#scene-dialog');
const favoriteIds = new Set(readFavorites());
let activeFilter = 'All';
let selectedScene = null;
let toastTimer;
let currentScript = '';
let importedImages = [];
const imageObjectUrls = new Map();
let imageDatabasePromise;
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
  document.querySelector('#message-name').textContent = characterName;
  const sceneMode = document.querySelector('#scene-mode').value;
  document.querySelector('#room-scene').className =
    `room-scene room-theme-${appearanceControls.setting.value} room-mode-${sceneMode}`;
  document.querySelector('#setting-caption').textContent =
    appearanceControls.setting.options[appearanceControls.setting.selectedIndex].text.toUpperCase();
  document.querySelector('.custom-heritage-label').classList.toggle('visible', heritage.value === 'custom');
  custom.classList.toggle('visible', heritage.value === 'custom');

  try {
    localStorage.setItem('cinima-appearance', JSON.stringify(Object.fromEntries(
      Object.entries(appearanceControls).map(([key, control]) => [key, control.value])
    )));
  } catch (error) {
    console.warn('Could not save appearance settings:', error);
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

function getCompanionReply(request) {
  const prompt = request.toLowerCase();
  const setting = appearanceControls.setting.options[appearanceControls.setting.selectedIndex].text.toLowerCase();

  if (document.querySelector('#scene-mode').value === 'trio') {
    if (/stop|pause|not comfortable|uncomfortable|slow down/.test(prompt)) {
      return 'Cinima: Absolutely, Alex. We pause here. Everyone gets a say, and nobody has to continue. What would make you feel comfortable now?';
    }
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

function generateSceneScript() {
  const setting = appearanceControls.setting.options[appearanceControls.setting.selectedIndex].text;
  const companion = appearanceControls.name.value.trim() || 'Cinima';
  const trio = document.querySelector('#scene-mode').value === 'trio';
  const cast = trio
    ? [`Alex (fictional adult)`, `${companion} (fictional adult)`, 'Ava (fictional adult, blonde)', 'Lena (fictional adult, blonde)']
    : [`Alex (fictional adult)`, `${companion} (fictional adult)`];
  const cameraAngles = [
    'Wide establishing shot of the room and its city lights',
    'Slow, graceful push-in as everyone shares a smile',
    'Over-the-shoulder conversation framing',
    'A gentle pan across the room, ending on the group together'
  ];
  const beats = [
    'Everyone arrives, settles in, and agrees on the mood for the evening.',
    'The group chooses music and trades playful, welcoming introductions.',
    'Everyone shares a favorite song over a relaxed toast.',
    'A slow dance begins; anyone can join, change partners, or sit one out.',
    'The scene closes on warm conversation, a shared laugh, and a fade to black.'
  ];
  const camera = cameraAngles[Math.floor(Math.random() * cameraAngles.length)];
  const selectedBeats = [...beats];
  for (let index = selectedBeats.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [selectedBeats[index], selectedBeats[swapIndex]] = [selectedBeats[swapIndex], selectedBeats[index]];
  }
  selectedBeats.length = 3;
  selectedBeats.splice(1, 0, `${companion} checks in: “Everyone still comfortable? We can pause or change the scene any time.”`);
  currentScript = [
    'CINEMATIC SCENE OUTLINE',
    `SETTING: ${setting}`,
    `CAST: ${cast.join('; ')}`,
    `CAMERA: ${camera}`,
    'TONE: Romantic, playful, consensual, non-explicit',
    '',
    ...selectedBeats.map((beat, index) => `${index + 1}. ${beat}`),
    '',
    'All characters are fictional adults (25+). No intimate recording; fade to black.'
  ].join('\n');
  document.querySelector('#script-output').textContent = currentScript;
  document.querySelector('#copy-script').disabled = false;
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

function openImageDatabase() {
  if (imageDatabasePromise) return imageDatabasePromise;
  imageDatabasePromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('This browser does not support a local image library.'));
      return;
    }

    const request = indexedDB.open('cinima-private-gallery', 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('images')) {
        request.result.createObjectStore('images', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open the local image library.'));
    request.onblocked = () => reject(new Error('Close other gallery tabs, then try again.'));
  });
  return imageDatabasePromise;
}

async function runImageTransaction(mode, operation) {
  const database = await openImageDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('images', mode);
    const request = operation(transaction.objectStore('images'));
    let result;

    request.onsuccess = () => {
      result = request.result;
    };
    request.onerror = () => {
      reject(request.error || new Error('The image library request failed.'));
    };
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => reject(transaction.error || new Error('The image library transaction failed.'));
    transaction.onabort = () => reject(transaction.error || new Error('The image library transaction was cancelled.'));
  });
}

function getImageUrl(image) {
  if (!imageObjectUrls.has(image.id)) {
    imageObjectUrls.set(image.id, URL.createObjectURL(image.blob));
  }
  return imageObjectUrls.get(image.id);
}

async function loadImportedImages() {
  try {
    importedImages = await runImageTransaction('readonly', (store) => store.getAll());
    updateExportButton();
    renderGallery();
  } catch (error) {
    console.error('Could not load the local image gallery:', error);
    showToast(error.message || 'Could not load saved images.');
  }
}

function updateExportButton() {
  const button = document.querySelector('#export-images-button');
  button.disabled = importedImages.length === 0;
  button.title = importedImages.length
    ? `Save ${importedImages.length} imported ${importedImages.length === 1 ? 'image' : 'images'} as a ZIP file`
    : 'Add images to enable a ZIP download';
}

function makeImportedCard(image, index) {
  const card = document.createElement('article');
  card.className = `scene-card imported-card ${index === 2 ? 'scene-card-tall' : ''}`;
  const art = document.createElement('button');
  art.type = 'button';
  art.className = 'scene-art imported-art';
  art.setAttribute('aria-label', `View imported image ${image.name}`);
  const thumbnail = document.createElement('img');
  thumbnail.src = getImageUrl(image);
  thumbnail.alt = image.name;
  thumbnail.loading = 'lazy';
  art.append(thumbnail);
  art.addEventListener('click', () => openImportedImage(image));

  const meta = document.createElement('div');
  meta.className = 'scene-meta';
  const text = document.createElement('div');
  const category = document.createElement('span');
  category.className = 'scene-category';
  category.textContent = 'Your image';
  const title = document.createElement('h3');
  title.textContent = image.name;
  text.append(category, title);

  const actions = document.createElement('div');
  actions.className = 'imported-card-actions';
  const favorite = document.createElement('button');
  favorite.type = 'button';
  favorite.className = `favorite-button ${favoriteIds.has(image.id) ? 'is-favorite' : ''}`;
  favorite.setAttribute('aria-label', favoriteIds.has(image.id) ? 'Remove from favorites' : 'Add to favorites');
  favorite.setAttribute('aria-pressed', String(favoriteIds.has(image.id)));
  favorite.textContent = favoriteIds.has(image.id) ? '♥' : '♡';
  favorite.addEventListener('click', () => toggleFavorite(image.id));
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'remove-image-button';
  remove.setAttribute('aria-label', `Remove ${image.name} from this browser`);
  remove.title = 'Remove this local image';
  remove.textContent = '×';
  remove.addEventListener('click', () => removeImportedImage(image));
  actions.append(favorite, remove);
  meta.append(text, actions);
  card.append(art, meta);
  return card;
}

function openImportedImage(image) {
  selectedScene = image;
  const dialogArt = document.querySelector('#dialog-art');
  dialogArt.className = 'dialog-art imported-dialog-art';
  const fullImage = document.createElement('img');
  fullImage.src = getImageUrl(image);
  fullImage.alt = image.name;
  dialogArt.replaceChildren(fullImage);
  document.querySelector('#dialog-category').textContent = 'YOUR PRIVATE LOCAL GALLERY';
  document.querySelector('#dialog-title').textContent = image.name;
  document.querySelector('#dialog-description').textContent = 'Stored only in this browser. This image has not been uploaded.';
  updateDialogFavorite();
  dialog.showModal();
}

async function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeZipEntryHeader(signature, nameBytes, checksum, size, offset = 0) {
  const isLocal = signature === 0x04034b50;
  const buffer = new ArrayBuffer(isLocal ? 30 : 46);
  const view = new DataView(buffer);
  view.setUint32(0, signature, true);
  if (isLocal) {
    view.setUint16(4, 20, true);
    view.setUint16(6, 0x0800, true);
    view.setUint32(14, checksum, true);
    view.setUint32(18, size, true);
    view.setUint32(22, size, true);
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true);
  } else {
    view.setUint16(4, 0x0314, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0x0800, true);
    view.setUint32(16, checksum, true);
    view.setUint32(20, size, true);
    view.setUint32(24, size, true);
    view.setUint16(28, nameBytes.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, offset, true);
  }
  return new Uint8Array(buffer);
}

async function createImageArchive(images) {
  if (images.length > 65535) {
    throw new Error('The archive can contain at most 65,535 images.');
  }

  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  const usedNames = new Map();
  let localOffset = 0;
  let centralSize = 0;

  for (const image of images) {
    const originalName = image.name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').trim() || 'image';
    const nameCount = (usedNames.get(originalName) || 0) + 1;
    usedNames.set(originalName, nameCount);
    const name = nameCount === 1 ? originalName : `${originalName} (${nameCount})`;
    const extension = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/avif': '.avif'
    }[image.type] || '.img';
    const filenameBytes = encoder.encode(`cinima-gallery/${name}${extension}`);
    const imageBytes = new Uint8Array(await image.blob.arrayBuffer());
    const checksum = crc32(imageBytes);
    if (imageBytes.length > 0xffffffff || localOffset > 0xffffffff) {
      throw new Error('The image archive exceeds the ZIP32 size limit.');
    }

    const localHeader = writeZipEntryHeader(0x04034b50, filenameBytes, checksum, imageBytes.length);
    localParts.push(localHeader, filenameBytes, imageBytes);
    const centralHeader = writeZipEntryHeader(0x02014b50, filenameBytes, checksum, imageBytes.length, localOffset);
    centralParts.push(centralHeader, filenameBytes);
    localOffset += localHeader.length + filenameBytes.length + imageBytes.length;
    centralSize += centralHeader.length + filenameBytes.length;
  }

  if (localOffset > 0xffffffff || centralSize > 0xffffffff) {
    throw new Error('The image archive exceeds the ZIP32 size limit.');
  }

  const endBuffer = new ArrayBuffer(22);
  const endView = new DataView(endBuffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, images.length, true);
  endView.setUint16(10, images.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, localOffset, true);
  endView.setUint16(20, 0, true);
  return new Blob([...localParts, ...centralParts, new Uint8Array(endBuffer)], { type: 'application/zip' });
}

async function exportImageArchive() {
  try {
    const images = await runImageTransaction('readonly', (store) => store.getAll());
    if (!images.length) {
      showToast('Add images to your gallery before saving an archive.');
      updateExportButton();
      return;
    }

    const archive = await createImageArchive(images);
    const url = URL.createObjectURL(archive);
    const download = document.createElement('a');
    download.href = url;
    download.download = `cinima-gallery-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.append(download);
    download.click();
    download.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    showToast(`Saved a ZIP archive with ${images.length} ${images.length === 1 ? 'image' : 'images'}.`);
  } catch (error) {
    console.error('Could not create the private image archive:', error);
    showToast(error.message || 'Could not create the image archive.');
  }
}

async function importImageFiles(fileList) {
  const selectedFiles = [...fileList];
  const validFiles = selectedFiles.filter((file) =>
    ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'].includes(file.type)
      && file.size > 0
      && file.size <= 25 * 1024 * 1024
  );
  const batch = [];
  let batchBytes = 0;
  for (const file of validFiles) {
    if (batch.length === 20 || batchBytes + file.size > 100 * 1024 * 1024) break;
    batch.push(file);
    batchBytes += file.size;
  }

  if (validFiles.length !== selectedFiles.length || batch.length !== validFiles.length) {
    showToast('Some files were skipped. Add up to 20 images per batch, 100 MB total; each image must be under 25 MB.');
  }
  if (!batch.length) return;

  try {
    const records = batch.map((file) => ({
      id: `local-${crypto.randomUUID()}`,
      name: file.name.replace(/\.[^.]+$/, '').slice(0, 100) || 'Untitled image',
      type: file.type,
      blob: file,
      addedAt: Date.now()
    }));
    await runImageTransaction('readwrite', (store) => {
      for (const record of records) store.add(record);
      return store.get(records[0].id);
    });
    importedImages = await runImageTransaction('readonly', (store) => store.getAll());
    updateExportButton();
    renderGallery();
    showToast(`${records.length} ${records.length === 1 ? 'image added' : 'images added'} to your private gallery.`);
  } catch (error) {
    console.error('Could not import images into the local gallery:', error);
    showToast(error.message || 'Could not save those images in this browser.');
  }
}

async function removeImportedImage(image) {
  if (!window.confirm(`Remove "${image.name}" from this browser's private gallery?`)) return;
  try {
    await runImageTransaction('readwrite', (store) => store.delete(image.id));
    const objectUrl = imageObjectUrls.get(image.id);
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    imageObjectUrls.delete(image.id);
    favoriteIds.delete(image.id);
    saveFavorites();
    importedImages = importedImages.filter((item) => item.id !== image.id);
    updateExportButton();
    renderGallery();
    showToast('Image removed from this browser.');
  } catch (error) {
    console.error('Could not remove the local image:', error);
    showToast(error.message || 'Could not remove that image.');
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
  art.innerHTML = `<span class="art-orbit"></span><span class="art-sun"></span><span class="art-arch"></span><span class="art-spark">${scene.symbol}</span><span class="art-grain"></span><span class="art-caption">${scene.tag}</span>`;
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
  const visibleScenes = scenes.filter((scene) =>
    activeFilter === 'Favorites'
      ? favoriteIds.has(scene.id)
      : activeFilter !== 'My images' && (activeFilter === 'All' || scene.category === activeFilter)
  );
  const visibleImages = importedImages.filter((image) =>
    activeFilter === 'All'
      || activeFilter === 'My images'
      || (activeFilter === 'Favorites' && favoriteIds.has(image.id))
  );
  grid.replaceChildren(
    ...visibleScenes.map(makeCard),
    ...visibleImages.map(makeImportedCard)
  );
  const totalVisible = visibleScenes.length + visibleImages.length;
  count.textContent = `${totalVisible} ${totalVisible === 1 ? 'item' : 'items'}`;
  if (!totalVisible) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = activeFilter === 'Favorites'
      ? 'No favorites yet. Tap a heart on any scene or image to keep it close.'
      : 'No images yet. Choose “Add images” to import pictures saved on your device.';
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
  dialogArt.className = `dialog-art art-${scene.style}`;
  dialogArt.innerHTML = `<span class="art-orbit"></span><span class="art-sun"></span><span class="art-arch"></span><span class="art-spark">${scene.symbol}</span><span class="art-grain"></span>`;
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

document.querySelector('#import-images-button').addEventListener('click', () => {
  document.querySelector('#image-file-input').click();
});
document.querySelector('#image-file-input').addEventListener('change', (event) => {
  if (event.currentTarget.files?.length) void importImageFiles(event.currentTarget.files);
  event.currentTarget.value = '';
});
document.querySelector('#export-images-button').addEventListener('click', () => void exportImageArchive());

document.querySelector('#private-toggle').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const isPrivate = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(isPrivate));
  document.querySelector('#private-label').textContent = isPrivate ? 'Private mode on' : 'Private mode';
  document.body.classList.toggle('private-mode', isPrivate);
  showToast(isPrivate ? 'Private mode is on for this screen.' : 'Private mode is off.');
});

document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#dialog-favorite').addEventListener('click', () => {
  if (selectedScene) toggleFavorite(selectedScene.id);
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

document.querySelector('#chat-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#scene-prompt');
  const request = input.value.trim();
  if (!request) return;
  addChatMessage(request, 'user');
  input.value = '';
  window.setTimeout(() => addChatMessage(getCompanionReply(request), 'companion'), 350);
});

document.querySelector('#scene-mode').addEventListener('change', updateCompanion);
document.querySelector('#generate-script').addEventListener('click', generateSceneScript);
document.querySelector('#copy-script').addEventListener('click', async () => {
  if (!currentScript) return;
  try {
    await navigator.clipboard.writeText(currentScript);
    showToast('Scene outline copied.');
  } catch (error) {
    console.warn('Clipboard copy failed:', error);
    showToast('Could not copy automatically. Select the outline and copy it.');
  }
});
loadAppearance();
updateCompanion();
renderGallery();
void loadImportedImages();
