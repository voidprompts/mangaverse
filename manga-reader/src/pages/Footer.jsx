import React from 'react';
import { BookOpen, Twitter, Github, Mail } from 'lucide-react';

export default function Footer({ setPage }) {
  const links = {
    Explore:  [['Discover', 'discover'], ['Categories', 'categories'], ['Updates', 'updates'], ['My Library', 'library']],
    Legal:    [['Privacy Policy', 'privacy'], ['Terms of Service', 'terms'], ['Cookie Policy', 'cookies'], ['DMCA', 'dmca']],
    Company:  [['About Us', 'about'], ['Contact', 'contact'], ['Advertise', 'advertise'], ['Sitemap', 'sitemap']],
  };

  return (
    <footer className="bg-white border-t border-stone-100 mt-20">
      {/* SEO-rich content band */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Read Manga Online Free — MangaVerse</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto text-sm leading-relaxed mb-6">
            MangaVerse is your ultimate destination for reading manga online. Discover thousands of titles
            across action, romance, fantasy, isekai, sci-fi, and more. New chapters updated daily from all
            major sources — completely free.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Read Manga Online','Free Manga','Latest Chapters','Action Manga','Romance Manga','Fantasy Manga','Isekai Manga','Popular Manga 2025'].map(tag => (
              <span key={tag} className="text-xs bg-white/20 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-800">Manga<span className="text-indigo-500">Verse</span></span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Read the latest manga chapters online. Free, fast, and updated daily across all genres.
            </p>
            <div className="flex gap-2">
              {[Twitter, Github, Mail].map((Icon, i) => (
                <button key={i} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 transition">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="font-bold text-gray-700 text-sm mb-3">{group}</h4>
              <ul className="space-y-2">
                {items.map(([label, id]) => (
                  <li key={id}>
                    <button onClick={() => setPage(id)} className="text-xs text-gray-500 hover:text-indigo-600 transition">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* AdSense placeholder */}
        <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center mb-8 bg-stone-50">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">Advertisement</p>
          <p className="text-xs text-gray-300">Google AdSense — 728×90 Leaderboard</p>
          {/* Insert AdSense code here */}
          {/* <ins className="adsbygoogle" ... /> */}
        </div>

        <div className="border-t border-stone-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© 2025 MangaVerse. All rights reserved. For entertainment purposes only.</p>
          <p className="text-xs text-gray-400">MangaVerse does not store manga files. All content belongs to their respective authors.</p>
        </div>
      </div>
    </footer>
  );
}
