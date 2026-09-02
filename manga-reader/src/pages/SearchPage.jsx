import React from 'react';
import { Search, Loader } from 'lucide-react';
import { useSearch } from '../api/useManga';
import MangaCard from '../components/MangaCard';

export default function SearchPage({ query, setPage, setActiveManga }) {
  const { results, loading, error } = useSearch(query);

  const openManga = (m) => { setActiveManga(m); setPage('detail'); };

  return (
    <div className="min-h-screen bg-stone-50 pt-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Search className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-black text-gray-800">
              Search: <span className="text-indigo-500">"{query}"</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-9">
            {loading ? 'Searching MangaDex...' : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="text-center py-24 text-gray-400">
            <Search className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-sm">Try a different search term.</p>
            <button onClick={() => setPage('discover')}
              className="mt-5 text-indigo-500 font-semibold hover:underline">
              Back to Discover
            </button>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map(m => (
              <MangaCard key={m.id} manga={m} onClick={openManga} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
