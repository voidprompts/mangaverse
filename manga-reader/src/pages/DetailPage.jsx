import React, { useState } from 'react';
import { Star, Eye, BookOpen, Heart, Share2, ChevronLeft, Play, Clock, Users, BookMarked, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

const MOCK_CHAPTERS = (total) =>
  Array.from({ length: Math.min(total, 20) }, (_, i) => ({
    num: total - i,
    title: `Chapter ${total - i}: ${['The Beginning','Dark Horizon','New Alliance','Shattered Hope','The Return','Storm Rising','Final Stand','Rising Dawn'][i % 8]}`,
    pages: Math.floor(Math.random() * 20) + 18,
    date: `${Math.floor(Math.random() * 6) + 1}d ago`,
  }));

const MOCK_REVIEWS = [
  { user: 'SakuraFan99', rating: 5, text: 'Absolutely incredible! The art style and story are both top-notch. Can\'t wait for the next chapter!', date: '2 days ago' },
  { user: 'MangaKing_X', rating: 4, text: 'Really solid series. The pacing is great and the characters are well-developed. Highly recommend.', date: '5 days ago' },
  { user: 'OtakuLord',   rating: 5, text: 'One of the best manga I\'ve read in years. The world-building is extraordinary.', date: '1 week ago' },
];

export default function DetailPage({ manga, setPage, setActiveManga }) {
  const [saved, setSaved] = useState(false);
  const [chaptersExpanded, setChaptersExpanded] = useState(false);

  if (!manga) return null;

  const chapters = MOCK_CHAPTERS(manga.chapters);
  const displayChapters = chaptersExpanded ? chapters : chapters.slice(0, 5);

  const openReader = () => { setActiveManga(manga); setPage('reader'); };

  return (
    <div className="min-h-screen bg-stone-50 animate-fade-in">
      {/* Hero banner */}
      <div className={`relative bg-gradient-to-br ${manga.cover} h-72 sm:h-96 overflow-hidden`}>
        <div className="absolute inset-0 opacity-15">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full border-2 border-white"
              style={{ width: `${60+i*50}px`, height: `${60+i*50}px`, top: `${5+i*10}%`, right: `${5+i*8}%` }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-black/20 to-transparent" />
        <button onClick={() => setPage('discover')}
          className="absolute top-20 left-4 sm:left-8 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm hover:bg-black/50 transition">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 pb-20 relative z-10">
        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden mb-6">
          <div className="p-6 sm:p-8">
            {/* Title & actions */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {manga.isTrending && <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full">🔥 Trending</span>}
                  {manga.isNew && <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">✨ New</span>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-800 leading-tight mb-1">{manga.title}</h1>
                <p className="text-gray-500 font-medium">by {manga.author}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSaved(s => !s)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${saved ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-stone-200 text-gray-400 hover:border-rose-200 hover:text-rose-400'}`}>
                  <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-stone-200 text-gray-400 hover:border-indigo-200 hover:text-indigo-400 transition">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 py-4 border-y border-stone-100 mb-5">
              {[
                { icon: Star,     value: manga.rating, label: 'Rating',   color: 'text-amber-500' },
                { icon: Eye,      value: manga.views,  label: 'Views',    color: 'text-blue-500' },
                { icon: BookOpen, value: manga.chapters,label:'Chapters', color: 'text-indigo-500' },
                { icon: Users,    value: '482K',       label: 'Followers',color: 'text-emerald-500' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="text-center">
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                  <div className="font-bold text-gray-800 text-sm">{value}</div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {manga.genres.map(g => {
                const info = CATEGORIES.find(c => c.id === g);
                return (
                  <span key={g} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium ${info?.color || 'bg-gray-100 text-gray-600'}`}>
                    {info?.emoji} {info?.label}
                  </span>
                );
              })}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">{manga.desc} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={openReader}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-indigo-300 hover:shadow-xl transition-all duration-200 text-base tracking-wide">
                <Play className="w-5 h-5 fill-current" /> Start Reading
              </button>
              <button onClick={openReader}
                className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-gray-700 font-bold py-4 rounded-full transition text-base">
                <BookMarked className="w-5 h-5" /> Continue Chapter
              </button>
            </div>
          </div>
        </div>

        {/* Chapters list */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" /> Chapters
            </h2>
            <span className="text-xs text-gray-400 bg-stone-100 px-2 py-1 rounded-full">{manga.chapters} total</span>
          </div>
          <div className="divide-y divide-stone-50">
            {displayChapters.map((ch) => (
              <button key={ch.num} onClick={openReader}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-indigo-50/50 transition group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs group-hover:bg-indigo-100 transition">
                    {ch.num}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition">{ch.title}</p>
                    <p className="text-xs text-gray-400">{ch.pages} pages</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" /> {ch.date}
                  </div>
                  <Play className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </button>
            ))}
          </div>
          {!chaptersExpanded && chapters.length > 5 && (
            <div className="px-6 py-4 border-t border-stone-100">
              <button onClick={() => setChaptersExpanded(true)}
                className="w-full flex items-center justify-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition">
                Show all {manga.chapters} chapters <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Reviews
            </h2>
          </div>
          <div className="divide-y divide-stone-50">
            {MOCK_REVIEWS.map((r, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                      {r.user[0]}
                    </div>
                    <span className="font-semibold text-sm text-gray-800">{r.user}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-3.5 h-3.5 ${j < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                <p className="text-xs text-gray-400 mt-1">{r.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
