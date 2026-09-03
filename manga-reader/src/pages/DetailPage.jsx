import React, { useState } from 'react';
import { Star, Eye, BookOpen, Heart, Share2, ChevronLeft, Play, Clock, Users, BookMarked, ChevronDown } from 'lucide-react';

const MOCK_REVIEWS = [
  { user: 'SakuraFan99', rating: 5, text: 'Absolutely incredible! The art style and story are both top-notch.', date: '2 days ago' },
  { user: 'MangaKing_X', rating: 4, text: 'Really solid series. The pacing is great and characters are well-developed.', date: '5 days ago' },
  { user: 'OtakuLord',   rating: 5, text: 'One of the best manga I\'ve read in years. The world-building is extraordinary.', date: '1 week ago' },
];

export default function DetailPage({ manga, setPage, setActiveManga }) {
  const [saved, setSaved] = useState(false);

  if (!manga) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 mb-4">No manga selected</p>
        <button onClick={() => setPage('discover')} className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-full font-semibold">Back to Discover</button>
      </div>
    </div>
  );

  const tags = manga.tags || manga.genres || [];
  const openReader = () => { setActiveManga(manga); setPage('reader'); };

  return (
    <div className="min-h-screen bg-stone-50 animate-fade-in">
      <div className={'relative h-72 sm:h-96 overflow-hidden ' + (manga.cover ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-400 to-violet-600')}>
        {manga.cover && (<img src={manga.cover} alt={manga.title} className="absolute inset-0 w-full h-full object-cover opacity-40" onError={e => { e.target.style.display='none'; }} />)}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-black/20 to-transparent" />
        <button onClick={() => setPage('discover')} className="absolute top-20 left-4 sm:left-8 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm hover:bg-black/50 transition">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 pb-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden mb-6">
          <div className="p-6 sm:p-8">
            <div className="flex gap-4 mb-6">
              {manga.cover && (<img src={manga.cover} alt={manga.title} className="w-24 h-36 object-cover rounded-xl shadow-md flex-shrink-0" onError={e => { e.target.style.display='none'; }} />)}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  {manga.isTrending && <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full">🔥 Trending</span>}
                  {manga.isNew && <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">✨ New</span>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-800 leading-tight mb-1">{manga.title}</h1>
                <p className="text-gray-500 font-medium mb-2">by {manga.author}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
                  <span className="capitalize">{manga.status || 'ongoing'}</span>
                  <span>·</span><span>{manga.chapters || '?'} ch</span>
                  <span>·</span><span>{manga.updated || 'Recently'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setSaved(s => !s)} className={'w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ' + (saved ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-stone-200 text-gray-400 hover:border-rose-200')}>
                  <Heart className={'w-5 h-5 ' + (saved ? 'fill-current' : '')} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-stone-200 text-gray-400 hover:border-indigo-200 transition">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 py-4 border-y border-stone-100 mb-5">
              {[
                { icon: Star,     value: manga.rating || 'N/A', label: 'Rating',    color: 'text-amber-500' },
                { icon: Eye,      value: manga.views  || 'N/A', label: 'Views',     color: 'text-blue-500' },
                { icon: BookOpen, value: manga.chapters || '?', label: 'Chapters',  color: 'text-indigo-500' },
                { icon: Users,    value: '—',                   label: 'Followers', color: 'text-emerald-500' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="text-center">
                  <Icon className={'w-5 h-5 mx-auto mb-1 ' + color} />
                  <div className="font-bold text-gray-800 text-sm">{value}</div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {tags.slice(0, 8).map(tag => (
                  <span key={tag} className="text-sm px-3 py-1.5 rounded-full font-medium bg-indigo-50 text-indigo-600">{tag}</span>
                ))}
              </div>
            )}

            <p className="text-gray-600 leading-relaxed mb-6 line-clamp-4">{manga.desc || 'No description available.'}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={openReader} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-4 rounded-full shadow-lg transition-all duration-200 text-base">
                <Play className="w-5 h-5 fill-current" /> Start Reading
              </button>
              <button onClick={openReader} className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-gray-700 font-bold py-4 rounded-full transition text-base">
                <BookMarked className="w-5 h-5" /> Continue Chapter
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100"><h2 className="font-bold text-gray-800 text-lg">Reader Reviews</h2></div>
          <div className="divide-y divide-stone-50">
            {MOCK_REVIEWS.map((r, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">{r.user[0]}</div>
                    <span className="font-semibold text-gray-700 text-sm">{r.user}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(r.rating)].map((_, j) => (<Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-current" />))}
                    <span className="text-xs text-gray-400 ml-1">{r.date}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
