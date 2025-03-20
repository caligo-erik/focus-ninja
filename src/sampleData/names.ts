export const getName = (): string => {
  const randomColor = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = extinctCreatures[Math.floor(Math.random() * extinctCreatures.length)];
  const randomNumber = Math.floor(Math.random() * 900) + 100; // Random number between 100 and 1000
  return `${randomColor}-${randomAnimal}-${randomNumber}`.replaceAll(' ', '-');
};

const adjectives = [
  'Stalwart',
  'Burly',
  'Fearless',
  'Ferocious',
  'Mighty',
  'Berserk',
  'Cunning',
  'Shadowy',
  'Nimble',
  'Sly',
  'Stealthy',
  'Trickster',
  'Arcane',
  'Mystic',
  'Enigmatic',
  'Eldritch',
  'Runic',
  'Sorcerous',
  'Righteous',
  'Noble',
  'Valiant',
  'Honorable',
  'Savage',
  'Wild',
  'Viking',
  'Rampaging',
  'Brutish',
  'Primal',
  'Verdant',
  'Ancient',
  'Whispering',
  'Nature-bound',
];

const extinctCreatures = [
  // 🦖 Dinosaurs
  'Tyrannosaurus Rex',
  'Velociraptor',
  'Stegosaurus',
  'Triceratops',
  'Spinosaurus',
  'Therizinosaurus',
  'Pteranodon',
  'Allosaurus',
  'Ankylosaurus',
  'Brachiosaurus',
  'Carnotaurus',
  'Diplodocus',
  'Irritator',
  'Utahraptor',
  'Pachycephalosaurus',

  // 🦣 Ice Age Mammals
  'Mammoth',
  'Mastodon',
  'Saber-toothed Tiger',
  'Giant Sloth',
  'Glyptodon',
  'Andrewsarchus',
  'Thylacine',
  'Hyaenodon',
  'Titanoboa',
  'Megacerops',
  'Elasmotherium',

  // 🦜 Extinct Birds & Others
  'Dodo',
  'Terror Bird',
  'Moa',
  'Great Auk',
  'Quagga',

  // 🐍 Prehistoric Oddities
  'Arthropleura',
  'Opabinia',
  'Hallucigenia',
];
