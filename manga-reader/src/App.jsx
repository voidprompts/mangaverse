import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DiscoverPage from './pages/DiscoverPage';
import LibraryPage from './pages/LibraryPage';
import DetailPage from './pages/DetailPage';
import ReaderPage from './pages/ReaderPage';
import CategoriesPage from './pages/CategoriesPage';
import UpdatesPage from './pages/UpdatesPage';
import SearchPage from './pages/SearchPage';
import Footer from './pages/Footer';
import {
  AboutPage, PrivacyPage, TermsPage, DMCAPage,
  ContactPage, AdvertisePage, SitemapPage
} from './pages/StaticPages';

// ── AdSense Banner (placeholder — replace with real code) ───────────────────
function AdBanner({ slot = 'top' }) {
  return (
    <div className={`w-full flex items-center justify-center py-2 px-4 ${slot === 'top' ? 'bg-stone-100 border-b border-stone-200' : 'bg-stone-50'}`}>
      <div className="border-2 border-dashed border-stone-300 rounded-xl px-8 py-3 text-center w-full max-w-4xl">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
          Advertisement · {slot === 'top' ? '728×90' : '336×280'}
        </p>
        {/* Uncomment & configure for real AdSense:
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true" />
        */}
      </div>
    </div>
  );
}

// Pages that show the standard layout (navbar + footer + top ad)
const MAIN_PAGES = ['discover','library','categories','updates','detail','search',
  'about','privacy','terms','dmca','contact','advertise','sitemap'];

export default function App() {
  const [page, setPage] = useState('discover');
  const [activeManga, setActiveManga] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const inReader = page === 'reader';

  const renderPage = () => {
    switch (page) {
      case 'discover':   return <DiscoverPage  setPage={setPage} setActiveManga={setActiveManga} />;
      case 'library':    return <LibraryPage   setPage={setPage} setActiveManga={setActiveManga} />;
      case 'categories': return <CategoriesPage setPage={setPage} setActiveManga={setActiveManga} />;
      case 'updates':    return <UpdatesPage   setPage={setPage} setActiveManga={setActiveManga} />;
      case 'detail':     return <DetailPage    manga={activeManga} setPage={setPage} setActiveManga={setActiveManga} />;
      case 'reader':     return <ReaderPage    manga={activeManga} setPage={setPage} />;
      case 'search':     return <SearchPage    query={searchQuery} setPage={setPage} setActiveManga={setActiveManga} />;
      case 'about':      return <AboutPage     setPage={setPage} />;
      case 'privacy':    return <PrivacyPage   setPage={setPage} />;
      case 'terms':      return <TermsPage     setPage={setPage} />;
      case 'dmca':       return <DMCAPage      setPage={setPage} />;
      case 'contact':    return <ContactPage   setPage={setPage} />;
      case 'advertise':  return <AdvertisePage setPage={setPage} />;
      case 'sitemap':    return <SitemapPage   setPage={setPage} />;
      default:           return <DiscoverPage  setPage={setPage} setActiveManga={setActiveManga} />;
    }
  };

  if (inReader) {
    return <ReaderPage manga={activeManga} setPage={setPage} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Navbar */}
      <Navbar
        page={page}
        setPage={setPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Top ad banner */}
      <div className="pt-16">
        <AdBanner slot="top" />
      </div>

      {/* Page content */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Mid-page ad (between content and footer) */}
      {MAIN_PAGES.includes(page) && (
        <div className="px-4 py-6">
          <AdBanner slot="mid" />
        </div>
      )}

      {/* Footer */}
      <Footer setPage={setPage} />
    </div>
  );
}
