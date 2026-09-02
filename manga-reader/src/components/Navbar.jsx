import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Bell, User, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ page, setPage, searchQuery, setSearchQuery }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { id: 'discover',   label: 'Discover' },
    { id: 'library',    label: 'My Library' },
    { id: 'categories', label: 'Categories' },
    { id: 'updates',    label: 'Updates' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-stone-50/95 backdrop-blur-md shadow-sm border-b border-stone-200' : 'bg-stone-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => setPage('discover')}
            className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-indigo-200 transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800 tracking-tight">
              Manga<span className="text-indigo-500">Verse</span>
            </span>
            <span className="hidden sm:flex items-center gap-1 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
              <Sparkles className="w-3 h-3" /> LIVE
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button key={link.id} onClick={() => setPage(link.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  page === link.id
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-stone-100'
                }`}>
                {link.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={`flex items-center transition-all duration-300 ${searchOpen ? 'w-48 sm:w-64' : 'w-9'}`}>
              {searchOpen && (
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search manga…"
                  className="flex-1 bg-stone-100 rounded-full px-4 py-1.5 text-sm text-gray-800 placeholder-gray-400 outline-none border border-stone-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition"
                  onKeyDown={e => { if (e.key === 'Enter' && searchQuery) setPage('search'); if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); } }}
                />
              )}
              <button onClick={() => { setSearchOpen(o => !o); if (searchOpen) setSearchQuery(''); }}
                className="ml-1 w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 text-gray-500 hover:text-gray-800 transition">
                <Search className="w-4.5 h-4.5 w-5 h-5" />
              </button>
            </div>

            <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 text-gray-500 hover:text-gray-800 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full bg-rose-500"></span>
            </button>

            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-sm hover:shadow-md transition">
              <User className="w-4.5 h-4.5 w-5 h-5" />
            </button>

            {/* Mobile hamburger */}
            <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 text-gray-500"
              onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-100 py-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <button key={link.id} onClick={() => { setPage(link.id); setMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  page === link.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-stone-100'
                }`}>
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
