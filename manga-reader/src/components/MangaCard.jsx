import React, { useState } from 'react';
import { Star, Eye, BookOpen } from 'lucide-react';

const FALLBACK_GRADIENTS = [
  'from-violet-400 to-indigo-600',
  'from-pink-400 to-rose-600',
  'from-amber-400 to-orange-600',
  'from-teal-400 to-cyan-600',
  'from-lime-400 to-green-600',
  'from-sky-400 to-blue-600',
  'from-fuchsia-400 to-purple-600',
  'from-red-400 to-pink-600',
];

function hashTitle(title = '') {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) & 0xfffffff;
  return h % FALLBACK_GRADIENTS.length;
}

export default function MangaCard({ manga, onClick, size = 'md' }) {
  const [imgError, setImgError] = useState(false);
  const small = size === 'sm';
  const fallbackGrad = FALLBACK_GRADIENTS[hashTitle(manga.title)];
  const showImage = manga.cover && !imgError;

  return (
    <div
      onClick={() => onClick(manga)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 card-shimmer"
    >
      <div className={`relative ${small ? 'h-44' : 'h-64'} overflow-hidden bg-gray-200`}>
        {showImage ? (
          <img
            src={manga.cover}
            alt={manga.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${fallbackGrad} flex items-center justify-center`}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-4 border-white"></div>
              <div className="absolute bottom-8 left-6 w-10 h-10 rounded-xl border-2 border-white rotate-12"></div>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white font-bold text-xs leading-tight line-clamp-2">{manga.title}</p>
        </div>

        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {manga.isNew && (
            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">NEW</span>
          )}
          {manga.isTrending && (
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full shadow">🔥</span>
          )}
        </div>

        {manga.rating && manga.rating !== '0.0' && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{manga.rating}</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors mb-0.5">
          {manga.title}
        </h3>
        <p className="text-xs text-gray-400 mb-2 line-clamp-1">{manga.author}</p>

        {manga.tags && manga.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {manga.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{manga.chapters} ch</span>
          </div>
          {manga.views && manga.views !== 'N/A' && (
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{manga.views}</span>
            </div>
          )}
          <span className="text-indigo-400 truncate max-w-[60px]">{manga.updated}</span>
        </div>

        <button className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold py-2 rounded-full shadow-sm hover:shadow-indigo-200 hover:shadow-md transition-all duration-200">
          Start Reading
        </button>
      </div>
    </div>
  );
}
