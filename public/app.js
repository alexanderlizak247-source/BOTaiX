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
  document.querySelector('#room-scene').className = `room-scene room-theme-${appearanceControls.setting.value}`;
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
  label.textContent = speaker === 'user' ? 'You' : (appearanceControls.name.value.trim() || 'Cinima');
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  message.append(label, paragraph);
  document.querySelector('#chat-messages').append(message);
  message.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function getCompanionReply(request) {
  const prompt = request.toLowerCase();
  const setting = appearanceControls.setting.options[appearanceControls.setting.selectedIndex].text.toLowerCase();

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

loadAppearance();
updateCompanion();
renderGallery();
