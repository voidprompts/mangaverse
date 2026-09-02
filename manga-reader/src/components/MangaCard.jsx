import React from 'react';
import { Star, Eye, BookOpen } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function MangaCard({ manga, onClick, size = 'md' }) {
  const small = size === 'sm';

  const genreInfo = (g) => CATEGORIES.find(c => c.id === g);

  return (
    <div
      onClick={() => onClick(manga)}
      className={`group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 card-shimmer ${small ? '' : ''}`}
    >
      {/* Cover */}
      <div className={`relative bg-gradient-to-br ${manga.cover} ${small ? 'h-44' : 'h-64'} overflow-hidden`}>
        {/* Decorative shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-4 border-white"></div>
          <div className="absolute bottom-8 left-6 w-10 h-10 rounded-xl border-2 border-white rotate-12"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/20"></div>
        </div>

        {/* Title on cover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-bold text-sm leading-tight line-clamp-2">{manga.title}</p>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {manga.isNew && (
            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">NEW</span>
          )}
          {manga.isTrending && (
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full shadow">🔥 HOT</span>
          )}
        </div>

        {/* Rating overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{manga.rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {manga.title}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 mb-2">{manga.author}</p>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {manga.genres.slice(0, 2).map(g => {
            const info = genreInfo(g);
            return (
              <span key={g} className={`text-xs px-2 py-0.5 rounded-full font-medium ${info?.color || 'bg-gray-100 text-gray-600'}`}>
                {info?.emoji} {info?.label}
              </span>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{manga.chapters} ch</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{manga.views}</span>
          </div>
          <span className="text-indigo-400">{manga.updated}</span>
        </div>

        {/* CTA */}
        <button className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold py-2 rounded-full shadow-sm hover:shadow-indigo-200 hover:shadow-md transition-all duration-200">
          Start Reading
        </button>
      </div>
    </div>
  );
}
