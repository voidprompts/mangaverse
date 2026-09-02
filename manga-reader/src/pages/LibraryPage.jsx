import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Bookmark, TrendingUp, BarChart2, ChevronRight } from 'lucide-react';
import { LIBRARY_DATA, getMangaById, CATEGORIES } from '../data/mockData';

const STATUS_CONFIG = {
  reading:   { label: 'Reading',    icon: BookOpen,    color: 'bg-indigo-100 text-indigo-700',   dot: 'bg-indigo-500' },
  completed: { label: 'Completed',  icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  plan:      { label: 'Plan to Read',icon: Bookmark,   color: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-500' },
};

function LibraryCard({ entry, onRead }) {
  const manga = getMangaById(entry.mangaId);
  if (!manga) return null;
  const cfg = STATUS_CONFIG[entry.status];
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-stone-100 hover:border-indigo-100">
      <div className="flex">
        {/* Cover strip */}
        <div className={`w-20 sm:w-24 flex-shrink-0 bg-gradient-to-b ${manga.cover} relative`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-white"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">{manga.title}</h3>
            <span className={`flex-shrink-0 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-2">{manga.author}</p>

          {/* Genres */}
          <div className="flex gap-1 mb-3">
            {manga.genres.slice(0,2).map(g => {
              const info = CATEGORIES.find(c => c.id === g);
              return <span key={g} className={`text-xs px-2 py-0.5 rounded-full ${info?.color || ''}`}>{info?.emoji} {info?.label}</span>;
            })}
          </div>

          {/* Progress */}
          {entry.status !== 'plan' && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Ch. {entry.currentChapter} / {manga.chapters}</span>
                <span className="font-semibold text-indigo-500">{entry.progress}%</span>
              </div>
              <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="progress-bar h-full" style={{ width: `${entry.progress}%` }}></div>
              </div>
            </div>
          )}

          {/* Action */}
          <button onClick={() => onRead(manga)}
            className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:shadow-indigo-200 hover:shadow-md transition-all duration-200">
            {entry.status === 'plan' ? 'Start Reading' : entry.status === 'completed' ? 'Read Again' : 'Continue Chapter'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage({ setPage, setActiveManga }) {
  const [activeTab, setActiveTab] = useState('all');

  const entries = LIBRARY_DATA.map(e => ({ ...e, manga: getMangaById(e.mangaId) })).filter(e => e.manga);
  const filtered = activeTab === 'all' ? entries : entries.filter(e => e.status === activeTab);

  const stats = {
    total: entries.length,
    reading: entries.filter(e => e.status === 'reading').length,
    completed: entries.filter(e => e.status === 'completed').length,
    plan: entries.filter(e => e.status === 'plan').length,
    chaptersRead: entries.reduce((sum, e) => sum + e.currentChapter, 0),
  };

  const onRead = (m) => { setActiveManga(m); setPage('reader'); };

  const tabs = [
    { id: 'all',       label: 'All',         count: stats.total },
    { id: 'reading',   label: 'Reading',     count: stats.reading },
    { id: 'completed', label: 'Completed',   count: stats.completed },
    { id: 'plan',      label: 'Plan to Read',count: stats.plan },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-20 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800 mb-1">My Library</h1>
          <p className="text-gray-500">Your personal manga collection</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Series',     value: stats.total,        icon: BookOpen,    grad: 'from-indigo-400 to-violet-600' },
            { label: 'Currently Reading',value: stats.reading,      icon: TrendingUp,  grad: 'from-teal-400 to-cyan-600' },
            { label: 'Completed',        value: stats.completed,    icon: CheckCircle, grad: 'from-emerald-400 to-green-600' },
            { label: 'Chapters Read',    value: stats.chaptersRead, icon: BarChart2,   grad: 'from-amber-400 to-orange-600' },
          ].map(({ label, value, icon: Icon, grad }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
              <div className={`w-10 h-10 bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black text-gray-800">{value}</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Tab filter */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-stone-100 w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-stone-50'
              }`}>
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/30' : 'bg-stone-100'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Library list */}
        <div className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nothing here yet.</p>
              <button onClick={() => setPage('discover')} className="mt-4 text-indigo-500 font-semibold hover:underline">Browse Discover →</button>
            </div>
          ) : (
            filtered.map(e => <LibraryCard key={e.mangaId} entry={e} onRead={onRead} />)
          )}
        </div>

        {/* Recommendation prompt */}
        <div className="mt-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-6 text-white shadow-xl">
          <h3 className="text-lg font-bold mb-1">Discover More</h3>
          <p className="text-white/75 text-sm mb-4">Explore new titles based on what you love.</p>
          <button onClick={() => setPage('discover')}
            className="flex items-center gap-2 bg-white text-indigo-600 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-indigo-50 transition shadow-md">
            Browse All Manga <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
