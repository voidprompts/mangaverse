import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Zap, Clock, ChevronRight, RefreshCw, Flame } from 'lucide-react';
import MangaCard from '../components/MangaCard';
import { getScraperUpdates, CATEGORIES } from '../data/mockData';

export default function DiscoverPage({ setPage, setActiveManga }) {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastScrape, setLastScrape] = useState(null);
  const [scraping, setScraping] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimer = useRef(null);

  const scrape = () => {
    setScraping(true);
    setTimeout(() => {
      const data = getScraperUpdates();
      setManga(data);
      setLastScrape(new Date());
      setScraping(false);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => { scrape(); }, []);

  // Auto-rotate hero
  useEffect(() => {
    heroTimer.current = setInterval(() => setHeroIndex(i => (i + 1) % 4), 5000);
    return () => clearInterval(heroTimer.current);
  }, []);

  // Auto-scrape every 5 min
  useEffect(() => {
    const t = setInterval(scrape, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const trending = manga.filter(m => m.isTrending);
  const newReleases = manga.filter(m => m.isNew);
  const featured = trending.slice(0, 4);
  const hero = featured[heroIndex] || trending[0];

  const openManga = (m) => { setActiveManga(m); setPage('detail'); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-2xl mx-auto mb-4 animate-pulse"></div>
        <p className="text-gray-500 font-medium">Fetching latest manga…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 animate-fade-in">
      {/* Hero Banner */}
      {hero && (
        <div className={`relative bg-gradient-to-br ${hero.cover} min-h-[420px] flex items-end overflow-hidden`}>
          {/* Decorative bg elements */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute rounded-full border-2 border-white"
                style={{ width: `${80 + i*40}px`, height: `${80 + i*40}px`, top: `${10 + i*8}%`, left: `${5 + i*12}%`, opacity: 0.6 - i*0.08 }} />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 pt-24 w-full">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">🔥 #1 TRENDING</span>
                {hero.genres.map(g => {
                  const info = CATEGORIES.find(c => c.id === g);
                  return <span key={g} className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">{info?.emoji} {info?.label}</span>;
                })}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">{hero.title}</h1>
              <p className="text-white/80 text-base mb-2">by {hero.author} · {hero.chapters} chapters</p>
              <p className="text-white/70 text-sm mb-6 max-w-md leading-relaxed">{hero.desc}</p>
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

            {/* Hero dots */}
            <div className="absolute bottom-4 right-6 flex gap-2">
              {featured.map((_, i) => (
                <button key={i} onClick={() => setHeroIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === heroIndex ? 'bg-white w-6' : 'bg-white/40'}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Scraper status bar */}
        <div className="flex items-center justify-between mb-8 p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${scraping ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {scraping ? 'Fetching updates from sources…' : 'All sources synced'}
            </span>
            {lastScrape && !scraping && (
              <span className="text-xs text-gray-400">Last updated: {lastScrape.toLocaleTimeString()}</span>
            )}
          </div>
          <button onClick={scrape} disabled={scraping}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-full transition">
            <RefreshCw className={`w-3.5 h-3.5 ${scraping ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Quick category pills */}
        <div className="flex gap-2 flex-wrap mb-10">
          {CATEGORIES.slice(0, 8).map(cat => (
            <button key={cat.id} onClick={() => setPage('categories')}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md">
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Trending Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Trending Now</h2>
              <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-semibold">{trending.length} titles</span>
            </div>
            <button onClick={() => setPage('categories')}
              className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700 font-medium transition">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {trending.map(m => <MangaCard key={m.id} manga={m} onClick={openManga} />)}
          </div>
        </section>

        {/* New Releases */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">New Releases</h2>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{newReleases.length} new</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {newReleases.map(m => <MangaCard key={m.id} manga={m} onClick={openManga} />)}
          </div>
        </section>

        {/* Recently Updated – horizontal scroll */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Recently Updated</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory -mx-2 px-2">
            {manga.sort((a,b) => a.updated.localeCompare(b.updated)).slice(0, 10).map(m => (
              <div key={m.id} className="snap-start flex-shrink-0 w-40">
                <MangaCard manga={m} onClick={openManga} size="sm" />
              </div>
            ))}
          </div>
        </section>

        {/* All Manga Grid */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">All Titles</h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{manga.length} series</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {manga.map(m => <MangaCard key={m.id} manga={m} onClick={openManga} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
