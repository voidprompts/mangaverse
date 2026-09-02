// Mock data & scraper simulation
export const CATEGORIES = [
  { id: 'action',     label: 'Action',       emoji: '\u2694\uFE0F',  color: 'bg-red-100 text-red-700' },
  { id: 'romance',    label: 'Romance',      emoji: '\uD83D\uDC95',  color: 'bg-pink-100 text-pink-700' },
  { id: 'fantasy',    label: 'Fantasy',      emoji: '\uD83D\uDD2E',  color: 'bg-violet-100 text-violet-700' },
  { id: 'horror',     label: 'Horror',       emoji: '\uD83D\uDC7B',  color: 'bg-gray-200 text-gray-800' },
  { id: 'comedy',     label: 'Comedy',       emoji: '\uD83D\uDE02',  color: 'bg-yellow-100 text-yellow-700' },
  { id: 'scifi',      label: 'Sci-Fi',       emoji: '\uD83D\uDE80',  color: 'bg-blue-100 text-blue-700' },
  { id: 'slice',      label: 'Slice of Life',emoji: '\uD83C\uDF38',  color: 'bg-rose-100 text-rose-700' },
  { id: 'sports',     label: 'Sports',       emoji: '\u26BD',        color: 'bg-green-100 text-green-700' },
  { id: 'mecha',      label: 'Mecha',        emoji: '\uD83E\uDD16',  color: 'bg-cyan-100 text-cyan-700' },
  { id: 'isekai',     label: 'Isekai',       emoji: '\uD83C\uDF00',  color: 'bg-indigo-100 text-indigo-700' },
  { id: 'mystery',    label: 'Mystery',      emoji: '\uD83D\uDD0D',  color: 'bg-amber-100 text-amber-700' },
  { id: 'historical', label: 'Historical',   emoji: '\uD83D\uDCDC',  color: 'bg-orange-100 text-orange-700' },
];

const COVER_PALETTES = [
  'from-violet-400 to-indigo-600',
  'from-pink-400 to-rose-600',
  'from-amber-400 to-orange-600',
  'from-teal-400 to-cyan-600',
  'from-lime-400 to-green-600',
  'from-sky-400 to-blue-600',
  'from-fuchsia-400 to-purple-600',
  'from-red-400 to-pink-600',
  'from-emerald-400 to-teal-600',
  'from-orange-400 to-red-600',
  'from-indigo-400 to-violet-600',
  'from-rose-400 to-fuchsia-600',
];

export const MANGA_DB = [
  { id:1,  title:'Celestial Blade Chronicles', author:'Yuki Tanaka',    chapters:247, rating:4.9, views:'12.4M', genres:['action','fantasy'],    updated:'2h ago',  isNew:false, isTrending:true,  palette:0,  desc:'A warrior forged in starlight battles ancient gods threatening to unmake reality itself.' },
  { id:2,  title:'Moonlight Cafe',             author:'Hana Mori',      chapters:88,  rating:4.8, views:'8.1M',  genres:['romance','slice'],     updated:'4h ago',  isNew:false, isTrending:true,  palette:1,  desc:'Late nights, warm coffee, and an unexpected love story between two strangers.' },
  { id:3,  title:'Void Protocol',              author:'Ken Sato',       chapters:134, rating:4.7, views:'9.3M',  genres:['scifi','action'],      updated:'6h ago',  isNew:false, isTrending:true,  palette:2,  desc:'Humanity\'s last AI guardian must decide: save the species or transcend it.' },
  { id:4,  title:'Petal Storm',                author:'Rin Nakamura',   chapters:312, rating:4.9, views:'15.2M', genres:['action','fantasy'],    updated:'1h ago',  isNew:false, isTrending:true,  palette:3,  desc:'A prodigy swordsman awakens powers sealed for a thousand years to protect the realm.' },
  { id:5,  title:'Ghost Kitchen',              author:'Taro Yamamoto',  chapters:56,  rating:4.6, views:'5.7M',  genres:['comedy','slice'],      updated:'8h ago',  isNew:true,  isTrending:false, palette:4,  desc:'A top chef discovers his restaurant is haunted and his ghostly sous-chef is actually better than him.' },
  { id:6,  title:'Iron Saints',                author:'Miku Fujiwara',  chapters:198, rating:4.8, views:'11.0M', genres:['mecha','action'],      updated:'3h ago',  isNew:false, isTrending:true,  palette:5,  desc:'Giant mechs, teenage pilots, and the impossible cost of saving the world.' },
  { id:7,  title:'Whisper Network',            author:'Sora Ishida',    chapters:73,  rating:4.5, views:'4.2M',  genres:['mystery','horror'],    updated:'12h ago', isNew:true,  isTrending:false, palette:6,  desc:'A journalist receives cryptic messages from someone who died five years ago.' },
  { id:8,  title:'Dragon\'s Debt',             author:'Hiro Watanabe',  chapters:421, rating:5.0, views:'22.8M', genres:['fantasy','action'],    updated:'30m ago', isNew:false, isTrending:true,  palette:7,  desc:'The most indebted man in the kingdom must repay his loan to an ancient dragon.' },
  { id:9,  title:'Ultraviolet Dreams',         author:'Nana Shimizu',   chapters:167, rating:4.7, views:'7.6M',  genres:['scifi','romance'],     updated:'5h ago',  isNew:false, isTrending:false, palette:8,  desc:'In a city where memories can be bought, two strangers share the same stolen dream.' },
  { id:10, title:'The Last Empress',           author:'Aya Suzuki',     chapters:289, rating:4.8, views:'13.1M', genres:['historical','romance'], updated:'2h ago',  isNew:false, isTrending:true,  palette:9,  desc:'A commoner girl secretly takes the throne and falls for the empire\'s greatest general.' },
  { id:11, title:'Pitch Perfect Rivals',       author:'Dai Kimura',     chapters:112, rating:4.6, views:'6.8M',  genres:['sports','comedy'],     updated:'7h ago',  isNew:true,  isTrending:false, palette:10, desc:'Rivals on the pitch, housemates at home. Soccer was never this complicated.' },
  { id:12, title:'Shadow Merchant',            author:'Rei Ogawa',      chapters:203, rating:4.9, views:'10.4M', genres:['fantasy','mystery'],   updated:'1h ago',  isNew:false, isTrending:true,  palette:11, desc:'A merchant who trades in secrets navigates the criminal underworld of a magical empire.' },
  { id:13, title:'Sakura Isekai',              author:'Yui Kato',       chapters:344, rating:4.7, views:'18.9M', genres:['isekai','fantasy'],    updated:'45m ago', isNew:false, isTrending:true,  palette:2,  desc:'Transported to a world of cherry blossoms and sword magic, she must find her way home.' },
  { id:14, title:'Neon Requiem',               author:'Kei Matsuda',    chapters:91,  rating:4.6, views:'5.1M',  genres:['scifi','horror'],      updated:'10h ago', isNew:true,  isTrending:false, palette:5,  desc:'Cyberpunk Tokyo. A detective who can see through walls hunts a killer who leaves no trace.' },
  { id:15, title:'Eternal Spring',             author:'Mio Hashimoto',  chapters:178, rating:4.8, views:'9.7M',  genres:['romance','slice'],     updated:'3h ago',  isNew:false, isTrending:false, palette:0,  desc:'She planted a garden; he built a wall around it. Neighbors, seasons, feelings.' },
  { id:16, title:'Crash Protocol',             author:'Jun Inoue',      chapters:267, rating:4.7, views:'8.4M',  genres:['action','scifi'],      updated:'90m ago', isNew:false, isTrending:true,  palette:3,  desc:'An elite hacker team must stop a rogue AI from triggering a global financial collapse.' },
];

export function getScraperUpdates() {
  const now = Date.now();
  return MANGA_DB.map(m => ({
    ...m,
    cover: COVER_PALETTES[m.palette],
    lastFetched: now,
  }));
}

export function getMangaById(id) {
  const m = MANGA_DB.find(x => x.id === id);
  if (!m) return null;
  return { ...m, cover: COVER_PALETTES[m.palette] };
}

export function getMangaByCategory(cat) {
  return MANGA_DB
    .filter(m => m.genres.includes(cat))
    .map(m => ({ ...m, cover: COVER_PALETTES[m.palette] }));
}

export const CHAPTER_PAGES = [
  { page: 1, panelColor: 'from-slate-800 to-slate-900',   caption: 'Chapter opens in darkness...' },
  { page: 2, panelColor: 'from-violet-900 to-indigo-900', caption: 'The hero awakens.' },
  { page: 3, panelColor: 'from-indigo-800 to-blue-900',   caption: 'A distant city glows on the horizon.' },
  { page: 4, panelColor: 'from-blue-900 to-teal-900',     caption: 'First signs of conflict.' },
  { page: 5, panelColor: 'from-teal-800 to-emerald-900',  caption: 'An unexpected ally appears.' },
  { page: 6, panelColor: 'from-emerald-900 to-green-900', caption: 'The battle begins.' },
  { page: 7, panelColor: 'from-amber-800 to-orange-900',  caption: 'A shocking revelation.' },
  { page: 8, panelColor: 'from-orange-900 to-red-900',    caption: 'The climax approaches...' },
];

export const LIBRARY_DATA = [
  { mangaId: 1,  currentChapter: 204, progress: 82,  status: 'reading' },
  { mangaId: 3,  currentChapter: 67,  progress: 50,  status: 'reading' },
  { mangaId: 8,  currentChapter: 421, progress: 100, status: 'completed' },
  { mangaId: 10, currentChapter: 12,  progress: 4,   status: 'reading' },
  { mangaId: 4,  currentChapter: 1,   progress: 0,   status: 'plan' },
  { mangaId: 12, currentChapter: 188, progress: 93,  status: 'reading' },
];
