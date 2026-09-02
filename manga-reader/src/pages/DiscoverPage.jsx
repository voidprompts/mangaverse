import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Zap, Clock, ChevronRight, RefreshCw, Flame, WifiOff } from 'lucide-react';
import MangaCard from '../components/MangaCard';
import { useTrending, useLatest } from '../api/useManga';
import { CATEGORIES } from '../data/mockData';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-64 bg-gradient-to-br from-stone-200 to-stone-300"></div>
      <div className="p-4">
        <div className="h-4 bg-stone-200 rounded-full mb-2 w-3/4"></div>
        <div className="h-3 bg-stone-100 rounded-full mb-3 w-1/2"></div>
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-16 bg-stone-100 rounded-full"></div>
          <div className="h-5 w-16 bg-stone-100 rounded-full"></div>
        </div>
        <div className="h-8 bg-stone-100 rounded-full"></div>
      </div>
    </div>
  );
}

export default function DiscoverPage({ setPage, setActiveManga }) {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimer = useRef(null);

  const {
    data: trending, loading: trendingLoading,
    error: trendingError, reload: reloadTrending, lastFetch
  } = useTrending(20);

  const {
    data: latest, loading: latestLoading,
    reload: reloadLatest
  } = useLatest(10);

  const loading = trendingLoading && trending.length === 0;
  const scraping = trendingLoading || latestLoading;

  useEffect(() => {
    if (trending.length === 0) return;
    heroTimer.current = setInterval(() => setHeroIndex(i => (i + 1) % Math.min(4, trending.length)), 5000);
    return () => clearInterval(heroTimer.current);
  }, [trending.length]);

  const hero = trending[heroIndex];
  const openManga = (m) => { setActiveManga(m); setPage('detail'); };
  const handleRefresh = () => { reloadTrending(); reloadLatest(); };

  if (loading) return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <div className="h-96 bg-gradient-to-br from-indigo-400 to-violet-600 animate-pulse"></div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );

  if (trendingError && trending.length === 0) return (
    <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center">
      <div className="text-center p-8">
        <WifiOff className="w-14 h-14 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Could not reach MangaDex</h2>
        <p className="text-gray-400 text-sm mb-5">Check your internet connection and try again.</p>
        <button onClick={handleRefresh}
          className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold px-6 py-3 rounded-full shadow-md hover:shadow-indigo-300 transition">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 animate-fade-in">

      {hero && (
        <div className="relative bg-gray-900 min-h-[420px] flex items-end overflow-hidden">
          {hero.cover && (
            <img src={hero.cover} alt={hero.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              onError={e => e.target.style.display = 'none'} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 pt-24 w-full">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  🔥 #{heroIndex + 1} TRENDING
                </span>
                {hero.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">
                {hero.title}
              </h1>
              <p className="text-white/80 text-base mb-1">
                by {hero.author} · {hero.chapters} chapters
              </p>
              <p className="text-white/60 text-sm mb-6 max-w-md leading-relaxed line-clamp-2">
                {hero.desc}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => openManga(hero)}
                  className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold px-8 py-3.5 rounded-full shadow-xl hover:shadow-indigo-400/40 transition-all duration-200 text-sm tracking-wide">
                  Start Reading →
                </button>
                <button onClick={() => openManga(hero)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-6 py-3.5 rounded-full transition text-sm">
                  View Details
                </button>
              </div>
            </div>
            <div className="absolute bottom-4 right-6 flex gap-2">
              {trending.slice(0, 4).map((_, i) => (
                <button key={i} onClick={() => setHeroIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === heroIndex ? 'bg-white w-6' : 'bg-white/40 w-2'}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex items-center justify-between mb-8 p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${scraping ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {scraping ? 'Fetching from MangaDex…' : 'Live from MangaDex API'}
            </span>
            {lastFetch && !scraping && (
              <span className="text-xs text-gray-400 hidden sm:block">
                Updated: {lastFetch.toLocaleTimeString()}
              </span>
            )}
          </div>
          <button onClick={handleRefresh} disabled={scraping}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-full transition">
            <RefreshCw className={`w-3.5 h-3.5 ${scraping ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mb-10">
          {CATEGORIES.slice(0, 8).map(cat => (
            <button key={cat.id} onClick={() => setPage('categories')}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md">
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Trending Now</h2>
              {!trendingLoading && (
                <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-semibold">
                  {trending.length} titles
                </span>
              )}
            </div>
            <button onClick={() => setPage('categories')}
              className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700 font-medium transition">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {trendingLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {trending.map(m => <MangaCard key={m.id} manga={m} onClick={openManga} />)}
            </div>
          )}
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">New Releases</h2>
            {!latestLoading && (
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                {latest.length} new
              </span>
            )}
          </div>
          {latestLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {latest.map(m => <MangaCard key={m.id} manga={m} onClick={openManga} />)}
            </div>
          )}
        </section>

        {trending.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Recently Updated</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory -mx-2 px-2">
              {trending.slice(0, 10).map(m => (
                <div key={m.id} className="snap-start flex-shrink-0 w-40">
                  <MangaCard manga={m} onClick={openManga} size="sm" />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">All Titles</h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
              {trending.length + latest.length} series
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...trending, ...latest]
              .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)
              .map(m => <MangaCard key={m.id} manga={m} onClick={openManga} />)}
          </div>
        </section>

      </div>
    </div>
  );
}
