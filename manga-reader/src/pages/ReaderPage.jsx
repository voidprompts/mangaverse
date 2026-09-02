import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, X, Settings, Sun, Moon,
  ZoomIn, ZoomOut, RotateCcw, BookOpen, List, Maximize2,
  ChevronDown, Loader
} from 'lucide-react';
import { useChapters, useChapterPages } from '../api/useManga';

// Check if an ID is a real MangaDex UUID
function isRealMangaId(id) {
  if (!id) return false;
  return typeof id === 'string' && id.includes('-') && id.length > 30;
}

// Fallback gradient pages (always shown when no real pages)
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

function FallbackPage({ index, manga }) {
  const pg = FALLBACK_PAGES[index % FALLBACK_PAGES.length];
  return (
    <div className={`w-full max-w-2xl mx-auto bg-gradient-to-b ${pg.color} flex flex-col items-center justify-center`}
      style={{ minHeight: '94vh' }}>
      <div className="text-center px-8">
        <div className="text-white/10 text-9xl font-black mb-6 select-none">{index + 1}</div>
        <div className="w-24 h-0.5 bg-white/20 mx-auto mb-6 rounded-full"></div>
        <p className="text-white/50 text-lg font-medium mb-2">{pg.text}</p>
        <p className="text-white/25 text-xs">{manga?.title} Â· Page {index + 1}</p>
      </div>
    </div>
  );
}

function RealPage({ url, index, onError }) {
  const [loaded, setLoaded]   = useState(false);
  const [error,  setError]    = useState(false);

  const handleError = () => { setError(true); onError && onError(index); };

  if (error) return <FallbackPage index={index} manga={{}} />;

  return (
    <div className="w-full max-w-2xl mx-auto bg-black relative" style={{ minHeight: '200px' }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <Loader className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      )}
      <img
        src={url}
        alt={`Page ${index + 1}`}
        className={`w-full block transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
    </div>
  );
}

export default function ReaderPage({ manga, setPage }) {
  const [currentPage,     setCurrentPage]     = useState(0);
  const [showSettings,    setShowSettings]    = useState(false);
  const [darkMode,        setDarkMode]        = useState(true);
  const [zoom,            setZoom]            = useState(100);
  const [readingMode,     setReadingMode]     = useState('scroll');
  const [showUI,          setShowUI]          = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const uiTimer      = useRef(null);
  const containerRef = useRef(null);

  const isReal = isRealMangaId(manga?.id);

  // Only fetch chapters for real MangaDex manga
  const { data: chapters, loading: chaptersLoading } = useChapters(
    isReal ? manga?.id : null, 96
  );

  // Auto-select first chapter
  useEffect(() => {
    if (chapters.length > 0 && !selectedChapter) {
      setSelectedChapter(chapters[0]);
      setCurrentPage(0);
    }
  }, [chapters]); // eslint-disable-line

  // Fetch pages for selected chapter
  const {
    pages: apiPages,
    loading: pagesLoading,
  } = useChapterPages(selectedChapter?.id || null);

  // Decide what to show
  const hasRealPages = apiPages && apiPages.length > 0;
  const isLoading    = isReal && (chaptersLoading || (selectedChapter && pagesLoading));
  const showFallback = !isReal || (!isLoading && !hasRealPages);
  const displayPages = hasRealPages ? apiPages : FALLBACK_PAGES;
  const totalPages   = displayPages.length;

  // UI auto-hide
  const resetUI = useCallback(() => {
    setShowUI(true);
    clearTimeout(uiTimer.current);
    uiTimer.current = setTimeout(() => setShowUI(false), 4000);
  }, []);

  useEffect(() => {
    resetUI();
    return () => clearTimeout(uiTimer.current);
  }, [resetUI]);

  // Keyboard nav
  useEffect(() => {
    const fn = (e) => {
      resetUI();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrentPage(p => Math.min(p + 1, totalPages - 1));
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   setCurrentPage(p => Math.max(p - 1, 0));
      if (e.key === 'Escape') setPage('detail');
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [totalPages, setPage, resetUI]);

  // Styles
  const bg      = darkMode ? 'bg-gray-950' : 'bg-stone-100';
  const panelBg = darkMode ? 'bg-gray-900' : 'bg-white';
  const text    = darkMode ? 'text-gray-100' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border  = darkMode ? 'border-gray-800' : 'border-stone-200';
  const btnBg   = darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-stone-100 text-gray-600 hover:bg-stone-200';
  const progress = Math.round(((currentPage + 1) / totalPages) * 100);

  return (
    <div className={`fixed inset-0 ${bg} z-50 flex flex-col`} onClick={resetUI} onMouseMove={resetUI}>

      {/* â”€â”€ TOP BAR â”€â”€ */}
      <div className={`flex-shrink-0 flex items-center justify-between px-3 py-2 ${panelBg} border-b ${border} transition-all duration-300 ${showUI ? 'opacity-100' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => setPage('detail')} className={`flex-shrink-0 ${subtext} hover:text-white`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className={`text-xs font-bold ${text} truncate max-w-[130px] sm:max-w-xs`}>{manga?.title}</p>
            <p className={`text-xs ${subtext}`}>
              {isLoading ? 'Loading...'
                : selectedChapter ? `Chapter ${selectedChapter.num}`
                : isReal ? 'Loading chapters...'
                : 'Preview Mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Chapter selector â€” only for real manga with chapters */}
          {isReal && chapters.length > 0 && (
            <div className="relative">
              <select
                value={selectedChapter?.id || ''}
                onChange={e => {
                  const ch = chapters.find(c => c.id === e.target.value);
                  if (ch) { setSelectedChapter(ch); setCurrentPage(0); if (containerRef.current) containerRef.current.scrollTo(0, 0); }
                }}
                className={`appearance-none pl-2 pr-6 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-stone-100 text-gray-700'} border-0 outline-none cursor-pointer max-w-[100px]`}>
                {chapters.map(ch => (
                  <option key={ch.id} value={ch.id}>Ch. {ch.num}</option>
                ))}
              </select>
              <ChevronDown className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 ${subtext} pointer-events-none`} />
            </div>
          )}

          <button onClick={() => setReadingMode(m => m === 'scroll' ? 'single' : 'scroll')}
            className={`p-1.5 rounded-full text-xs transition ${btnBg}`}>
            {readingMode === 'scroll' ? <List className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
          </button>

          <button onClick={() => setShowSettings(s => !s)}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition ${btnBg}`}>
            <Settings className="w-3.5 h-3.5" />
          </button>

          <button onClick={() => setPage('discover')}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition ${btnBg}`}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* â”€â”€ SETTINGS â”€â”€ */}
      {showSettings && (
        <div className={`flex-shrink-0 px-4 py-2 ${panelBg} border-b ${border} flex items-center gap-4 flex-wrap`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${subtext}`}>Theme</span>
            <button onClick={() => setDarkMode(d => !d)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-indigo-600 text-white' : 'bg-stone-200 text-gray-700'}`}>
              {darkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              {darkMode ? 'Dark' : 'Light'}
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs ${subtext}`}>Zoom</span>
            <button onClick={() => setZoom(z => Math.max(z - 10, 50))} className={`w-6 h-6 flex items-center justify-center rounded-full ${btnBg}`}><ZoomOut className="w-3 h-3" /></button>
            <span className={`text-xs font-bold ${text} w-8 text-center`}>{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(z + 10, 200))} className={`w-6 h-6 flex items-center justify-center rounded-full ${btnBg}`}><ZoomIn className="w-3 h-3" /></button>
            <button onClick={() => setZoom(100)} className={`w-6 h-6 flex items-center justify-center rounded-full ${btnBg}`}><RotateCcw className="w-3 h-3" /></button>
          </div>
        </div>
      )}

      {/* â”€â”€ PROGRESS BAR â”€â”€ */}
      <div className={`flex-shrink-0 h-0.5 ${darkMode ? 'bg-gray-800' : 'bg-stone-200'}`}>
        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
          style={{ width: `${progress}%` }} />
      </div>

      {/* â”€â”€ LOADING â”€â”€ */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-10 h-10 animate-spin text-indigo-400 mx-auto mb-3" />
            <p className={`text-sm font-medium ${subtext}`}>
              {chaptersLoading ? 'Loading chapters...' : 'Loading pages...'}
            </p>
          </div>
        </div>
      )}

      {/* â”€â”€ SCROLL MODE â”€â”€ */}
      {!isLoading && readingMode === 'scroll' && (
        <div ref={containerRef} className="flex-1 overflow-y-auto">
          <div className={`${darkMode ? 'bg-gray-950' : 'bg-stone-200'}`} style={{ zoom: `${zoom}%` }}>
            {hasRealPages
              ? apiPages.map((pg, i) => <RealPage key={i} url={pg.url} index={i} />)
              : FALLBACK_PAGES.map((_, i) => <FallbackPage key={i} index={i} manga={manga} />)
            }
            {/* End of chapter */}
            <div className={`min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8 ${bg}`}>
              <div className="text-5xl">ðŸŽ‰</div>
              <h3 className={`text-xl font-black ${text}`}>
                {selectedChapter ? `Chapter ${selectedChapter.num} Complete!` : 'End of Preview!'}
              </h3>
              <p className={`text-sm ${subtext}`}>{totalPages} pages</p>
              {/* Next chapter */}
              {isReal && chapters.length > 1 && (() => {
                const idx  = chapters.findIndex(c => c.id === selectedChapter?.id);
                const next = chapters[idx + 1];
                return next ? (
                  <button onClick={() => {
                    setSelectedChapter(next);
                    setCurrentPage(0);
                    if (containerRef.current) containerRef.current.scrollTo(0, 0);
                  }} className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold px-8 py-3 rounded-full shadow-xl">
                    Next: Ch. {next.num} â†’
                  </button>
                ) : null;
              })()}
              <button onClick={() => setPage('detail')} className={`text-sm ${subtext} underline`}>
                Back to Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ SINGLE PAGE MODE â”€â”€ */}
      {!isLoading && readingMode === 'single' && (
        <div className="flex-1 flex items-center justify-center relative overflow-hidden select-none">
          {/* Tap left = prev */}
          <div onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10 flex items-center justify-start pl-3 cursor-pointer group">
            <div className={`w-9 h-9 flex items-center justify-center rounded-full ${darkMode ? 'bg-black/60' : 'bg-white/80'} opacity-0 group-hover:opacity-100 transition shadow-lg`}>
              <ChevronLeft className={`w-5 h-5 ${text}`} />
            </div>
          </div>

          {/* Page content */}
          <div className="h-full w-full flex items-center justify-center overflow-auto" style={{ zoom: `${zoom}%` }}>
            {hasRealPages && apiPages[currentPage]?.url
              ? <RealPage url={apiPages[currentPage].url} index={currentPage} />
              : <FallbackPage index={currentPage} manga={manga} />
            }
          </div>

          {/* Tap right = next */}
          <div onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))}
            className="absolute right-0 top-0 bottom-0 w-1/3 z-10 flex items-center justify-end pr-3 cursor-pointer group">
            <div className={`w-9 h-9 flex items-center justify-center rounded-full ${darkMode ? 'bg-black/60' : 'bg-white/80'} opacity-0 group-hover:opacity-100 transition shadow-lg`}>
              <ChevronRight className={`w-5 h-5 ${text}`} />
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ BOTTOM BAR â”€â”€ */}
      <div className={`flex-shrink-0 ${panelBg} border-t ${border} px-4 py-2 flex items-center gap-3 transition-all duration-300 ${showUI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <span className={`text-xs ${subtext} font-medium min-w-[48px]`}>{currentPage + 1}/{totalPages}</span>
        <input type="range" min={0} max={Math.max(0, totalPages - 1)} value={currentPage}
          onChange={e => setCurrentPage(Number(e.target.value))}
          className="flex-1 accent-indigo-500 h-1 cursor-pointer" />
        <span className={`text-xs font-bold ${subtext} min-w-[32px] text-right`}>{progress}%</span>
        <button onClick={() => document.documentElement.requestFullscreen?.()}
          className={`hidden sm:flex w-7 h-7 items-center justify-center rounded-full ${btnBg} transition`}>
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
