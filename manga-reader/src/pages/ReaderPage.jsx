import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, X, Settings, Sun, Moon,
  ZoomIn, ZoomOut, RotateCcw, BookOpen, List, Maximize2,
  ChevronDown, Loader, WifiOff
} from 'lucide-react';
import { useChapters, useChapterPages } from '../api/useManga';

// Fallback placeholder page
function PlaceholderPage({ index, total }) {
  const colors = [
    'from-slate-800 to-slate-900',
    'from-violet-900 to-indigo-900',
    'from-indigo-800 to-blue-900',
    'from-blue-900 to-teal-900',
    'from-teal-800 to-emerald-900',
    'from-amber-800 to-orange-900',
    'from-orange-900 to-red-900',
    'from-red-900 to-pink-900',
  ];
  const color = colors[index % colors.length];
  return (
    <div className={`manga-page w-full max-w-3xl mx-auto bg-gradient-to-b ${color} flex flex-col items-center justify-center`}
      style={{ minHeight: '90vh' }}>
      <div className="text-white/20 text-8xl font-black mb-4">{index + 1}</div>
      <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>
      <p className="text-white/40 text-sm">Page {index + 1} of {total}</p>
    </div>
  );
}

export default function ReaderPage({ manga, setPage }) {
  const [currentPage,      setCurrentPage]      = useState(0);
  const [showSettings,     setShowSettings]     = useState(false);
  const [darkMode,         setDarkMode]         = useState(true);
  const [zoom,             setZoom]             = useState(100);
  const [readingMode,      setReadingMode]       = useState('scroll');
  const [showUI,           setShowUI]           = useState(true);
  const [selectedChapter,  setSelectedChapter]  = useState(null);
  const uiTimer  = useRef(null);
  const containerRef = useRef(null);

  // 1. Fetch chapters list
  const {
    data: chapters,
    loading: chaptersLoading,
  } = useChapters(manga?.id, 30);

  // 2. Auto-select chapter 1 (oldest = last in desc list)
  useEffect(() => {
    if (chapters.length > 0 && !selectedChapter) {
      // chapters are ordered asc now, pick first
      setSelectedChapter(chapters[0]);
      setCurrentPage(0);
    }
  }, [chapters]); // eslint-disable-line

  // 3. Fetch pages for selected chapter
  const {
    pages: apiPages,
    loading: pagesLoading,
    error: pagesError,
  } = useChapterPages(selectedChapter?.id);

  const hasRealPages = apiPages && apiPages.length > 0;
  const totalPages   = hasRealPages ? apiPages.length : 8;

  // UI auto-hide
  const resetUI = useCallback(() => {
    setShowUI(true);
    clearTimeout(uiTimer.current);
    uiTimer.current = setTimeout(() => setShowUI(false), 4000);
  }, []);

  useEffect(() => { resetUI(); return () => clearTimeout(uiTimer.current); }, [resetUI]);

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

  const bg      = darkMode ? 'bg-gray-950' : 'bg-stone-100';
  const panelBg = darkMode ? 'bg-gray-900' : 'bg-white';
  const text    = darkMode ? 'text-gray-100' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border  = darkMode ? 'border-gray-800' : 'border-stone-200';
  const btnBg   = darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-stone-100 text-gray-600 hover:bg-stone-200';
  const progress = Math.round(((currentPage + 1) / totalPages) * 100);

  // â”€â”€ Single page image â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const PageImg = ({ page, index }) => {
    const [err, setErr] = useState(false);
    if (hasRealPages && page?.url && !err) {
      return (
        <div className="manga-page w-full max-w-3xl mx-auto bg-black">
          <img
            src={page.url}
            alt={`Page ${index + 1}`}
            className="w-full block"
            loading="lazy"
            onError={() => setErr(true)}
          />
        </div>
      );
    }
    return <PlaceholderPage index={index} total={totalPages} />;
  };

  // â”€â”€ Loading state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const isLoading = chaptersLoading || (selectedChapter && pagesLoading);

  return (
    <div
      className={`fixed inset-0 ${bg} z-50 flex flex-col`}
      onClick={resetUI}
      onMouseMove={resetUI}
    >
      {/* â”€â”€ TOP BAR â”€â”€ */}
      <div className={`flex-shrink-0 flex items-center justify-between px-3 py-2 ${panelBg} border-b ${border} transition-all duration-300 ${showUI ? 'opacity-100' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        
        {/* Left: back + title */}
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => setPage('detail')}
            className={`flex-shrink-0 flex items-center gap-1 ${subtext} hover:${text} transition text-sm`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className={`text-xs font-bold ${text} truncate max-w-[120px] sm:max-w-[200px]`}>{manga?.title}</p>
            <p className={`text-xs ${subtext}`}>
              {chaptersLoading ? 'Loading chapters...' : selectedChapter ? `Ch. ${selectedChapter.num}` : 'No chapters'}
            </p>
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Chapter dropdown */}
          {chapters.length > 0 && (
            <div className="relative">
              <select
                value={selectedChapter?.id || ''}
                onChange={e => {
                  const ch = chapters.find(c => c.id === e.target.value);
                  if (ch) { setSelectedChapter(ch); setCurrentPage(0); }
                }}
                className={`appearance-none pl-2 pr-6 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-stone-100 text-gray-700'} border-0 outline-none cursor-pointer max-w-[100px]`}>
                {chapters.map(ch => (
                  <option key={ch.id} value={ch.id}>Ch. {ch.num}</option>
                ))}
              </select>
              <ChevronDown className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 ${subtext} pointer-events-none`} />
            </div>
          )}

          {/* Scroll/Single toggle */}
          <button onClick={() => setReadingMode(m => m === 'scroll' ? 'single' : 'scroll')}
            className={`px-2 py-1 rounded-full text-xs font-semibold transition ${btnBg}`}>
            {readingMode === 'scroll' ? <List className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
          </button>

          {/* Settings */}
          <button onClick={() => setShowSettings(s => !s)}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition ${btnBg}`}>
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Close */}
          <button onClick={() => setPage('discover')}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition ${btnBg}`}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* â”€â”€ SETTINGS PANEL â”€â”€ */}
      {showSettings && (
        <div className={`flex-shrink-0 px-4 py-2 ${panelBg} border-b ${border} flex items-center gap-4 flex-wrap`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${subtext}`}>Theme</span>
            <button onClick={() => setDarkMode(d => !d)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-indigo-600 text-white' : 'bg-stone-200 text-gray-700'}`}>
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
        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* â”€â”€ MAIN CONTENT â”€â”€ */}

      {/* Loading */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className={`w-10 h-10 animate-spin mx-auto mb-3 text-indigo-400`} />
            <p className={`text-sm font-medium ${subtext}`}>
              {chaptersLoading ? 'Loading chapters...' : 'Loading pages...'}
            </p>
          </div>
        </div>
      )}

      {/* No chapters found */}
      {!chaptersLoading && chapters.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <WifiOff className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className={`text-lg font-bold ${text} mb-2`}>No chapters available</h3>
            <p className={`text-sm ${subtext} mb-4`}>This manga has no English chapters on MangaDex.</p>
            <button onClick={() => setPage('detail')}
              className="bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold">
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Error loading pages */}
      {!pagesLoading && pagesError && !hasRealPages && selectedChapter && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <WifiOff className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className={`text-lg font-bold ${text} mb-2`}>Could not load pages</h3>
            <p className={`text-sm ${subtext} mb-4`}>Try a different chapter.</p>
          </div>
        </div>
      )}

      {/* â”€â”€ SCROLL MODE â”€â”€ */}
      {!isLoading && chapters.length > 0 && readingMode === 'scroll' && (
        <div ref={containerRef} className="flex-1 overflow-y-auto">
          <div style={{ zoom: `${zoom}%` }}>
            {hasRealPages
              ? apiPages.map((pg, i) => <PageImg key={i} page={pg} index={i} />)
              : [...Array(8)].map((_, i) => <PlaceholderPage key={i} index={i} total={8} />)
            }
            {/* End of chapter */}
            <div className={`min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8 ${bg}`}>
              <div className="text-5xl">ðŸŽ‰</div>
              <h3 className={`text-xl font-black ${text}`}>Chapter {selectedChapter?.num} Complete!</h3>
              <p className={`text-sm ${subtext}`}>{hasRealPages ? apiPages.length : 8} pages</p>
              {/* Next chapter button */}
              {chapters.length > 1 && (() => {
                const idx = chapters.findIndex(c => c.id === selectedChapter?.id);
                const next = chapters[idx + 1];
                return next ? (
                  <button onClick={() => { setSelectedChapter(next); setCurrentPage(0); if (containerRef.current) containerRef.current.scrollTo(0, 0); }}
                    className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold px-8 py-3 rounded-full shadow-xl transition">
                    Next: Ch. {next.num} â†’
                  </button>
                ) : null;
              })()}
              <button onClick={() => setPage('detail')}
                className={`text-sm ${subtext} underline`}>Back to Details</button>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ SINGLE PAGE MODE â”€â”€ */}
      {!isLoading && chapters.length > 0 && readingMode === 'single' && (
        <div className="flex-1 flex items-center justify-center relative overflow-hidden select-none">
          {/* Tap left = prev */}
          <div onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10 flex items-center justify-start pl-3 cursor-pointer">
            <div className={`w-9 h-9 flex items-center justify-center rounded-full ${darkMode ? 'bg-black/60' : 'bg-white/80'} opacity-0 hover:opacity-100 transition shadow-lg`}>
              <ChevronLeft className={`w-5 h-5 ${text}`} />
            </div>
          </div>

          {/* Page */}
          <div className="h-full w-full flex items-center justify-center overflow-auto p-2" style={{ zoom: `${zoom}%` }}>
            {hasRealPages && apiPages[currentPage]?.url ? (
              <img
                src={apiPages[currentPage].url}
                alt={`Page ${currentPage + 1}`}
                className="max-h-screen max-w-full object-contain"
                loading="lazy"
              />
            ) : (
              <PlaceholderPage index={currentPage} total={totalPages} />
            )}
          </div>

          {/* Tap right = next */}
          <div onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))}
            className="absolute right-0 top-0 bottom-0 w-1/3 z-10 flex items-center justify-end pr-3 cursor-pointer">
            <div className={`w-9 h-9 flex items-center justify-center rounded-full ${darkMode ? 'bg-black/60' : 'bg-white/80'} opacity-0 hover:opacity-100 transition shadow-lg`}>
              <ChevronRight className={`w-5 h-5 ${text}`} />
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ BOTTOM BAR â”€â”€ */}
      <div className={`flex-shrink-0 ${panelBg} border-t ${border} px-4 py-2 flex items-center gap-3 transition-all duration-300 ${showUI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <span className={`text-xs ${subtext} font-medium min-w-[48px]`}>{currentPage + 1}/{totalPages}</span>
        <input
          type="range" min={0} max={Math.max(0, totalPages - 1)} value={currentPage}
          onChange={e => setCurrentPage(Number(e.target.value))}
          className="flex-1 accent-indigo-500 h-1 cursor-pointer"
        />
        <span className={`text-xs font-bold ${subtext} min-w-[32px] text-right`}>{progress}%</span>
        <button
          onClick={() => document.documentElement.requestFullscreen?.()}
          className={`hidden sm:flex w-7 h-7 items-center justify-center rounded-full ${btnBg} transition`}>
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
