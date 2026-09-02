import React, { useState } from 'react';
import { Grid, ChevronRight } from 'lucide-react';
import { CATEGORIES, getMangaByCategory } from '../data/mockData';
import MangaCard from '../components/MangaCard';

export default function CategoriesPage({ setPage, setActiveManga }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const results = activeCategory ? getMangaByCategory(activeCategory.id) : [];
  const openManga = (m) => { setActiveManga(m); setPage('detail'); };

  return (
    <div className="min-h-screen bg-stone-50 pt-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800 mb-1">Categories</h1>
          <p className="text-gray-500">Browse manga by genre</p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {CATEGORIES.map(cat => {
            const count = getMangaByCategory(cat.id).length;
            const isActive = activeCategory?.id === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(isActive ? null : cat)}
                className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5 border-2 ${
                  isActive ? 'border-indigo-400 bg-indigo-50 shadow-indigo-100' : 'border-stone-100 bg-white hover:border-indigo-200'
                }`}>
                {/* BG decoration */}
                <div className="absolute top-0 right-0 text-5xl opacity-10 -translate-y-1 translate-x-1 pointer-events-none select-none">{cat.emoji}</div>

                <div className="text-3xl mb-3">{cat.emoji}</div>
                <h3 className={`font-bold text-base mb-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-800 group-hover:text-indigo-600'}`}>
                  {cat.label}
                </h3>
                <p className="text-xs text-gray-400">{count} {count === 1 ? 'title' : 'titles'}</p>

                {isActive && (
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Results */}
        {activeCategory && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeCategory.emoji}</span>
                <h2 className="text-xl font-bold text-gray-800">{activeCategory.label} Manga</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${activeCategory.color}`}>
                  {results.length} titles
                </span>
              </div>
              <button onClick={() => setActiveCategory(null)} className="text-sm text-gray-400 hover:text-gray-600 transition">
                Clear filter
              </button>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-stone-100">
                <span className="text-5xl block mb-3">📭</span>
                <p className="font-medium">No manga in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.map(m => <MangaCard key={m.id} manga={m} onClick={openManga} />)}
              </div>
            )}
          </div>
        )}

        {/* All categories overview when none selected */}
        {!activeCategory && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Grid className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-gray-800">Browse All Genres</h2>
            </div>
            <div className="divide-y divide-stone-50">
              {CATEGORIES.map(cat => {
                const items = getMangaByCategory(cat.id);
                return (
                  <button key={cat.id} onClick={() => setActiveCategory(cat)}
                    className="w-full flex items-center justify-between py-3 hover:bg-indigo-50/50 px-3 rounded-xl transition group">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="font-semibold text-gray-700 group-hover:text-indigo-600 transition">{cat.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>{items.length}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
