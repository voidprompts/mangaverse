import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, X, Settings, Sun, Moon,
  ZoomIn, ZoomOut, RotateCcw, BookOpen, List, Maximize2,
  ChevronDown
} from 'lucide-react';
import { CHAPTER_PAGES } from '../data/mockData';

export default function ReaderPage({ manga, setPage }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [settings, setSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [readingMode, setReadingMode] = useState('scroll'); // 'scroll' | 'single'
  const [showUI, setShowUI] = useState(true);
  const [chapter, setChapter] = useState(1);
  const uiTimer = useRef(null);
  const containerRef = useRef(null);

  const pages = CHAPTER_PAGES;
  const totalPages = pages.length;

  const resetUITimer = useCallback(() => {
    setShowUI(true);
    clearTimeout(uiTimer.current);
    uiTimer.current = setInterval(() => setShowUI(false), 4000);
  }, []);

  useEffect(() => {
    resetUITimer();
    return () => clearTimeout(uiTimer.current);
  }, [resetUITimer]);

  useEffect(() => {
    const onKey = (e) => {
      resetUITimer();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrentPage(p => Math.min(p + 1, totalPages - 1));
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   setCurrentPage(p => Math.max(p - 1, 0));
      if (e.key === 'Escape') setPage('detail');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [totalPages, setPage, resetUITimer]);

  // scroll mode: sync page tracker
  useEffect(() => {
    if (readingMode !== 'scroll') return;
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const children = el.querySelectorAll('.manga-page');
      let closest = 0;
      children.forEach((child, i) => {
        const rect = child.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) closest = i;
      });
      setCurrentPage(closest);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [readingMode]);

  const bg = darkMode ? 'bg-gray-950' : 'bg-stone-100';
  const panelBg = darkMode ? 'bg-gray-900' : 'bg-white';
  const text = darkMode ? 'text-gray-100' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';

  const progress = Math.round(((currentPage + 1) / totalPages) * 100);

  return (
    <div className={`fixed inset-0 ${bg} z-50 flex flex-col transition-colors duration-300`}
      onClick={resetUITimer} onMouseMove={resetUITimer}>

      {/* Top bar */}
      <div className={`flex-shrink-0 flex items-center justify-between px-4 py-3 ${panelBg} border-b ${darkMode ? 'border-gray-800' : 'border-stone-200'} transition-all duration-300 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setPage('detail')}
            className={`flex items-center gap-1.5 ${subtext} hover:${text} transition text-sm`}>
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:block">Back</span>
          </button>
          <div className={`h-5 w-px ${darkMode ? 'bg-gray-700' : 'bg-stone-200'}`} />
          <div>
            <p className={`text-sm font-semibold ${text} line-clamp-1`}>{manga?.title}</p>
            <p className={`text-xs ${subtext}`}>Chapter {chapter}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Chapter selector */}
          <div className="relative">
            <select value={chapter} onChange={e => setChapter(Number(e.target.value))}
              className={`appearance-none pl-3 pr-7 py-1.5 rounded-full text-xs font-semibold ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-stone-100 text-gray-700 border-stone-200'} border outline-none cursor-pointer`}>
              {[...Array(Math.min(manga?.chapters || 10, 30))].map((_, i) => (
                <option key={i+1} value={i+1}>Chapter {i+1}</option>
              ))}
            </select>
            <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 ${subtext} pointer-events-none`} />
          </div>

          {/* Reading mode */}
          <button onClick={() => setReadingMode(m => m === 'scroll' ? 'single' : 'scroll')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'}`}>
            {readingMode === 'scroll' ? <List className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
            <span className="hidden sm:block">{readingMode === 'scroll' ? 'Scroll' : 'Single'}</span>
          </button>

          <button onClick={() => setSettings(s => !s)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'}`}>
            <Settings className="w-4 h-4" />
          </button>

          <button onClick={() => setPage('discover')}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {settings && (
        <div className={`flex-shrink-0 px-4 py-3 ${panelBg} border-b ${darkMode ? 'border-gray-800' : 'border-stone-200'} flex items-center gap-6 flex-wrap`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${subtext}`}>Theme</span>
            <button onClick={() => setDarkMode(d => !d)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition ${darkMode ? 'bg-indigo-600 text-white' : 'bg-stone-200 text-gray-700'}`}>
              {darkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              {darkMode ? 'Dark' : 'Light'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${subtext}`}>Zoom</span>
            <button onClick={() => setZoom(z => Math.max(z - 10, 50))}
              className={`w-7 h-7 flex items-center justify-center rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-stone-100 text-gray-600'} transition hover:opacity-80`}>
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className={`text-sm font-bold ${text} w-10 text-center`}>{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(z + 10, 200))}
              className={`w-7 h-7 flex items-center justify-center rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-stone-100 text-gray-600'} transition hover:opacity-80`}>
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setZoom(100)}
              className={`w-7 h-7 flex items-center justify-center rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-stone-100 text-gray-600'} transition hover:opacity-80`}>
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className={`flex-shrink-0 h-0.5 ${darkMode ? 'bg-gray-800' : 'bg-stone-200'}`}>
        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
          style={{ width: `${progress}%` }} />
      </div>

      {/* ── Content ── */}
      {readingMode === 'scroll' ? (
        /* SCROLL MODE */
        <div ref={containerRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto" style={{ zoom: `${zoom}%` }}>
            {pages.map((pg, i) => (
              <div key={i} className={`manga-page relative w-full flex flex-col items-center justify-center ${darkMode ? 'bg-gradient-to-b' : ''} ${pg.panelColor} min-h-screen`}
                style={{ minHeight: '90vh' }}>
                {/* Simulated manga panel with decorative elements */}
                <div className="absolute inset-0 opacity-10">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="absolute rounded-full border border-white"
                      style={{ width: `${40+j*30}px`, height: `${40+j*30}px`, top:`${20+j*18}%`, left:`${10+j*20}%` }} />
                  ))}
                </div>
                <div className="relative z-10 text-center p-8">
                  <div className="text-white/20 text-8xl font-black mb-4">{i+1}</div>
                  <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-4"></div>
                  <p className="text-white/60 text-lg font-medium">{pg.caption}</p>
                  <p className="text-white/30 text-sm mt-2">Page {i+1} of {totalPages}</p>
                </div>
                {/* Bottom separator */}
                <div className={`absolute bottom-0 left-0 right-0 h-2 ${darkMode ? 'bg-gray-950' : 'bg-stone-100'}`}></div>
              </div>
            ))}
            {/* End of chapter */}
            <div className={`min-h-[40vh] flex flex-col items-center justify-center gap-4 p-8 ${bg}`}>
              <div className="text-4xl mb-2">🎉</div>
              <h3 className={`text-xl font-black ${text}`}>Chapter {chapter} Complete!</h3>
              <p className={`text-sm ${subtext}`}>You've finished this chapter.</p>
              <button onClick={() => setChapter(c => c + 1)}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold px-8 py-3 rounded-full shadow-xl hover:shadow-indigo-400/40 transition">
                Next Chapter →
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* SINGLE PAGE MODE */
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Prev zone */}
          <button onClick={() => setCurrentPage(p => Math.max(p-1,0))}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10 group flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm shadow-lg`}>
              <ChevronLeft className={`w-5 h-5 ${text}`} />
            </div>
          </button>

          {/* Page */}
          <div className="max-h-full max-w-full flex items-center justify-center p-4"
            style={{ zoom: `${zoom}%` }}>
            <div className={`w-full max-w-xl bg-gradient-to-b ${pages[currentPage]?.panelColor} rounded-xl overflow-hidden shadow-2xl`}
              style={{ minHeight: '70vh', maxHeight: '80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', position:'relative' }}>
              <div className="absolute inset-0 opacity-10">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="absolute rounded-full border border-white"
                    style={{ width:`${50+j*40}px`, height:`${50+j*40}px`, top:`${15+j*20}%`, left:`${10+j*25}%` }} />
                ))}
              </div>
              <div className="relative z-10 text-center p-8">
                <div className="text-white/20 text-9xl font-black mb-4">{currentPage+1}</div>
                <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mb-4"></div>
                <p className="text-white/60 text-lg font-medium">{pages[currentPage]?.caption}</p>
              </div>
            </div>
          </div>

          {/* Next zone */}
          <button onClick={() => setCurrentPage(p => Math.min(p+1,totalPages-1))}
            className="absolute right-0 top-0 bottom-0 w-1/3 z-10 group flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm shadow-lg`}>
              <ChevronRight className={`w-5 h-5 ${text}`} />
            </div>
          </button>
        </div>
      )}

      {/* Bottom bar */}
      <div className={`flex-shrink-0 ${panelBg} border-t ${darkMode ? 'border-gray-800' : 'border-stone-200'} px-4 py-3 flex items-center gap-4 transition-all duration-300 ${showUI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <span className={`text-xs ${subtext} font-medium min-w-[60px]`}>
          {currentPage + 1} / {totalPages}
        </span>
        {/* Scrubber */}
        <input type="range" min={0} max={totalPages - 1} value={currentPage}
          onChange={e => setCurrentPage(Number(e.target.value))}
          className="flex-1 accent-indigo-500 h-1 cursor-pointer" />
        <span className={`text-xs ${subtext} font-bold min-w-[36px] text-right`}>{progress}%</span>

        {/* Fullscreen hint */}
        <button className={`hidden sm:flex w-8 h-8 items-center justify-center rounded-full ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-stone-100 text-gray-500'} transition hover:opacity-80`}
          onClick={() => document.documentElement.requestFullscreen?.()}>
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
