import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, ChevronRight, Bell, BellOff, Zap } from 'lucide-react';
import { getScraperUpdates, CATEGORIES } from '../data/mockData';

function UpdateCard({ manga, onRead }) {
  const [notified, setNotified] = useState(false);
  const genres = manga.genres.map(g => CATEGORIES.find(c => c.id === g)).filter(Boolean);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-stone-100 hover:border-indigo-100 transition-all duration-300 overflow-hidden group">
      <div className="flex items-stretch">
        {/* Color strip */}
        <div className={`w-1.5 flex-shrink-0 bg-gradient-to-b ${manga.cover}`}></div>

        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {genres.slice(0,1).map(g => (
                  <span key={g.id} className={`text-xs px-2 py-0.5 rounded-full font-medium ${g.color}`}>{g.emoji} {g.label}</span>
                ))}
                {manga.isNew && <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-semibold">NEW</span>}
              </div>
              <h3 className="font-bold text-gray-800 text-sm group-hover:text-indigo-600 transition-colors">{manga.title}</h3>
              <p className="text-xs text-gray-400">{manga.author}</p>
            </div>
            <button onClick={() => setNotified(n => !n)}
              className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition ${notified ? 'bg-indigo-100 text-indigo-500' : 'bg-stone-100 text-gray-400 hover:bg-indigo-50 hover:text-indigo-400'}`}>
              {notified ? <Bell className="w-4 h-4 fill-current" /> : <BellOff className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{manga.updated}</span>
              </div>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">Ch. {manga.chapters}</span>
            </div>
            <button onClick={() => onRead(manga)}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition">
              Read <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpdatesPage({ setPage, setActiveManga }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchUpdates = () => {
    setScraping(true);
    setTimeout(() => {
      const data = getScraperUpdates().sort((a, b) => a.updated.localeCompare(b.updated));
      setUpdates(data);
      setLastUpdate(new Date());
      setScraping(false);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => { fetchUpdates(); }, []);

  // Auto-refresh every 2 min
  useEffect(() => {
    const t = setInterval(fetchUpdates, 2 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const onRead = (m) => { setActiveManga(m); setPage('reader'); };

  const filtered = filter === 'all' ? updates
    : filter === 'new' ? updates.filter(m => m.isNew)
    : updates.filter(m => m.isTrending);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Fetching latest updates…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-20 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-800 mb-1">Updates</h1>
            <p className="text-gray-500 text-sm">Latest chapter releases across all sources</p>
          </div>
          <button onClick={fetchUpdates} disabled={scraping}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-full shadow-sm transition disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${scraping ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Live status */}
        <div className="flex items-center gap-3 mb-6 p-3 bg-white rounded-2xl border border-stone-100 shadow-sm">
          <div className={`w-2.5 h-2.5 rounded-full ${scraping ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
          <span className="text-sm font-medium text-gray-600">
            {scraping ? 'Scanning sources for updates…' : `Live — ${updates.length} titles tracked`}
          </span>
          {lastUpdate && !scraping && (
            <span className="ml-auto text-xs text-gray-400">{lastUpdate.toLocaleTimeString()}</span>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'all',      label: 'All Updates', count: updates.length },
            { id: 'new',      label: '✨ New',      count: updates.filter(m=>m.isNew).length },
            { id: 'trending', label: '🔥 Trending', count: updates.filter(m=>m.isTrending).length },
          ].map(tab => (
            <button key={tab.id} onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === tab.id
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-stone-200 hover:border-indigo-200 hover:text-indigo-600'
              }`}>
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.id ? 'bg-white/30' : 'bg-stone-100'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Update feed */}
        <div className="flex flex-col gap-3">
          {filtered.map(m => <UpdateCard key={m.id} manga={m} onRead={onRead} />)}
        </div>

        {/* Load more */}
        <div className="mt-8 text-center">
          <button className="flex items-center gap-2 mx-auto px-6 py-3 bg-white border border-stone-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 font-semibold text-sm rounded-full shadow-sm hover:shadow-md transition">
            <Zap className="w-4 h-4" /> Load More Updates
          </button>
        </div>
      </div>
    </div>
  );
}
