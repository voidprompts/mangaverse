import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Settings, Sun, Moon,
  ZoomIn, ZoomOut, RotateCcw, BookOpen, List,
  ChevronDown, Loader
} from 'lucide-react';
import { useChapters, useChapterPages } from '../api/useManga';

function isRealMangaId(id) {
  return typeof id === 'string' && id.includes('-') && id.length > 30;
}

const FALLBACK_PAGES = [
  { color: 'from-slate-800 to-slate-900',   text: 'The story begins...' },
  { color: 'from-violet-900 to-indigo-900', text: 'A hero awakens.' },
  { color: 'from-indigo-800 to-blue-900',   text: 'A distant world glows.' },
  { color: 'from-blue-900 to-teal-900',     text: 'Danger approaches.' },
  { color: 'from-teal-800 to-emerald-900',  text: 'An ally appears.' },
  { color: 'from-emerald-800 to-green-900', text: 'The battle begins.' },
  { color: 'from-amber-800 to-orange-900',  text: 'A shocking truth.' },
  { color: 'from-orange-900 to-red-900',    text: 'To be continued...' },
];

function FallbackPage({ index, title }) {
  const pg = FALLBACK_PAGES[index % FALLBACK_PAGES.length];
  return (
    <div className={`w-full max-w-2xl mx-auto bg-gradient-to-b ${pg.color} flex flex-col items-center justify-center`}
      style={{ minHeight: '94vh' }}>
      <div className="text-center px-8">
        <div className="text-white/10 text-9xl font-black mb-6 select-none">{index + 1}</div>
        <div className="w-24 h-0.5 bg-white/20 mx-auto mb-6 rounded-full"></div>
        <p className="text-white/50 text-lg font-medium mb-2">{pg.text}</p>
        <p className="text-white/25 text-xs">{title} - Page {index + 1}</p>
      </div>
    </div>
  );
}

function RealPage({ url, index, title }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);
  if (error) return <FallbackPage index={index} title={title} />;
  return (
    <div className="w-full max-w-2xl mx-auto bg-black relative" style={{ minHeight: '200px' }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <Loader className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      )}
      <img
        src={url}
        alt={'Page ' + (index + 1)}
        className={'w-full block transition-opacity duration-300 ' + (loaded ? 'opacity-100' : 'opacity-0')}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        crossOrigin="anonymous"
      />
    </div>
  );
}

export default function ReaderPage({ manga, setPage }) {
  const [currentPage,     setCurrentPage]     = useState(0);
  const [showSettings,    setShowSettings]    = useState(false);
  const [darkMode,        setDarkMode]        = useState(true);
  const [readingMode,     setReadingMode]     = useState('scroll');
  const [showUI,          setShowUI]          = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const uiTimer      = useRef(null);
  const containerRef = useRef(null);

  const isReal = isRealMangaId(manga && manga.id);

  const { data: chapters, loading: chaptersLoading } = useChapters(
    isReal ? manga.id : null, 96
  );

  useEffect(() => {
    if (chapters && chapters.length > 0 && !selectedChapter) {
      setSelectedChapter(chapters[0]);
      setCurrentPage(0);
    }
  }, [chapters]); // eslint-disable-line

  const { pages: apiPages, loading: pagesLoading } = useChapterPages(
    selectedChapter ? selectedChapter.id : null
  );

  const hasRealPages = apiPages && apiPages.length > 0;
  const isLoading    = isReal && (chaptersLoading || (selectedChapter && pagesLoading));
  const displayPages = hasRealPages ? apiPages : FALLBACK_PAGES;
  const totalPages   = displayPages.length;
  const mangaTitle   = (manga && manga.title) ? manga.title : 'Manga';

  const resetUI = useCallback(() => {
    setShowUI(true);
    clearTimeout(uiTimer.current);
    uiTimer.current = setTimeout(() => setShowUI(false), 4000);
  }, []);

  useEffect(() => {
    resetUI();
    return () => clearTimeout(uiTimer.current);
  }, [resetUI]);

  useEffect(() => {
    const fn = (e) => {
      resetUI();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrentPage(p => Math.min(p + 1, totalPages - 1));
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   setCurrentPage(p => Math.max(p - 1, 0));
      if (e.key === 'Escape') setPage('discover');
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [totalPages, setPage, resetUI]);

  const bg      = darkMode ? 'bg-gray-950' : 'bg-stone-100';
  const panelBg = darkMode ? 'bg-gray-900' : 'bg-white';
  const text    = darkMode ? 'text-gray-100' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border  = darkMode ? 'border-gray-800' : 'border-stone-200';
  const btnBg   = darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-stone-100 text-gray-600 hover:bg-stone-200';
  const progress = totalPages > 0 ? Math.round(((currentPage + 1) / totalPages) * 100) : 0;

  return (
    <div className={'fixed inset-0 ' + bg + ' z-50 flex flex-col'} onClick={resetUI} onMouseMove={resetUI}>
      <div className={'flex-shrink-0 flex items-center justify-between px-3 py-2 ' + panelBg + ' border-b ' + border + ' transition-all duration-300 ' + (showUI ? 'opacity-100' : 'opacity-0 -translate-y-full pointer-events-none')}>
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => setPage('discover')} className={subtext + ' hover:text-white flex-shrink-0'}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className={'text-xs font-bold truncate max-w-[130px] ' + text}>{mangaTitle}</p>
            <p className={'text-xs ' + subtext}>
              {isLoading ? 'Loading...' : selectedChapter ? 'Chapter ' + selectedChapter.num : isReal ? 'Loading chapters...' : 'Preview Mode'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isReal && chapters && chapters.length > 0 && (
            <div className="relative">
              <select
                value={selectedChapter ? selectedChapter.id : ''}
                onChange={e => {
                  const ch = chapters.find(c => c.id === e.target.value);
                  if (ch) { setSelectedChapter(ch); setCurrentPage(0); if (containerRef.current) containerRef.current.scrollTo(0, 0); }
                }}
                className={'appearance-none pl-2 pr-6 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer max-w-[100px] ' + (darkMode ? 'bg-gray-800 text-gray-200' : 'bg-stone-100 text-gray-700')}>
                {chapters.map(ch => (<option key={ch.id} value={ch.id}>Ch. {ch.num}</option>))}
              </select>
              <ChevronDown className={'absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ' + subtext} />
            </div>
          )}
          <button onClick={() => setReadingMode(m => m === 'scroll' ? 'single' : 'scroll')} className={'p-1.5 rounded-full text-xs transition ' + btnBg}>
            {readingMode === 'scroll' ? <List className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setDarkMode(d => !d)} className={'p-1.5 rounded-full transition ' + btnBg}>
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setPage('discover')} className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex-shrink-0 h-0.5 bg-gray-800">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300" style={{ width: progress + '%' }} />
      </div>
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader className="w-10 h-10 animate-spin text-indigo-400" />
          <p className={'text-sm ' + subtext}>Loading chapter pages...</p>
        </div>
      )}
      {!isLoading && readingMode === 'scroll' && (
        <div ref={containerRef} className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center gap-1 pb-20">
            {displayPages.map((page, i) =>
              hasRealPages
                ? <RealPage key={i} url={page.url} index={i} title={mangaTitle} />
                : <FallbackPage key={i} index={i} title={mangaTitle} />
            )}
          </div>
          <div className={'text-center py-8 ' + subtext}>
            <p className="text-sm font-medium">End of Chapter</p>
            <button onClick={() => setPage('discover')} className="mt-3 px-6 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-full text-sm font-semibold">Back to Discover</button>
          </div>
        </div>
      )}
      {!isLoading && readingMode === 'single' && (
        <div className="flex-1 relative overflow-hidden">
          <div className="w-full h-full flex items-center justify-center overflow-auto">
            {hasRealPages
              ? <RealPage url={displayPages[currentPage].url} index={currentPage} title={mangaTitle} />
              : <FallbackPage index={currentPage} title={mangaTitle} />}
          </div>
          <div className="absolute inset-0 flex pointer-events-none">
            <button className="flex-1 pointer-events-auto opacity-0" onClick={() => setCurrentPage(p => Math.max(p - 1, 0))} />
            <button className="flex-1 pointer-events-auto opacity-0" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))} />
          </div>
          <div className={'absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 transition-all duration-300 ' + (showUI ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 0))} disabled={currentPage === 0} className={'p-3 rounded-full transition ' + btnBg + ' disabled:opacity-30'}><ChevronLeft className="w-5 h-5" /></button>
            <span className={'text-sm font-medium ' + text}>{currentPage + 1} / {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))} disabled={currentPage === totalPages - 1} className={'p-3 rounded-full transition ' + btnBg + ' disabled:opacity-30'}><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
