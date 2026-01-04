import { useState, useEffect } from 'react';
import { fetchRelics, groupRelics, filterGroupedRelics } from './lib/api';
import type { GroupedRelic } from './lib/api';
import { SearchBar } from './components/SearchBar';
import { RelicCard } from './components/RelicCard';
import { AboutModal } from './components/AboutModal';
import { Loader2, Zap, ExternalLink } from 'lucide-react';
import { cn } from './lib/utils';

const TIER_ORDER: { [key: string]: number } = { Lith: 1, Meso: 2, Neo: 3, Axi: 4, Requiem: 5, Vanguard: 6 };

function App() {
  const [groupedRelics, setGroupedRelics] = useState<GroupedRelic[]>([]);
  const [filteredRelics, setFilteredRelics] = useState<GroupedRelic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    if (window.electronAPI?.onOpenAbout) {
      window.electronAPI.onOpenAbout(() => setIsAboutOpen(true));
    }

    async function init() {
      try {
        const rawData = await fetchRelics();
        const grouped = groupRelics(rawData);

        // Sort by Tier then by Name (defensive)
        const sorted = grouped.sort((a, b) => {
          const tierA = a.tier || '';
          const tierB = b.tier || '';
          if (tierA !== tierB) {
            return (TIER_ORDER[tierA] || 99) - (TIER_ORDER[tierB] || 99);
          }
          return (a.name || '').localeCompare(b.name || '');
        });

        setGroupedRelics(sorted);
        setLoading(false);
      } catch (err) {
        console.error('Failed to init relics:', err);
        setError('Failed to load relic data. Check your connection.');
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    let filtered = filterGroupedRelics(groupedRelics, searchQuery);

    if (selectedEra) {
      filtered = filtered.filter(g => (g.tier as string) === selectedEra);
    }

    setFilteredRelics(filtered.slice(0, 100)); // Increased limit
  }, [searchQuery, groupedRelics, selectedEra]);

  const eras = ['Lith', 'Meso', 'Neo', 'Axi', 'Requiem', 'Vanguard'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-purple-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-900/40">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">RadShare Helper</h1>
                <p className="text-[10px] text-zinc-500 font-mono text-center">v1.0.0</p>
              </div>
            </div>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              className="flex-1 max-w-xl mx-8"
            />
          </div>

          {/* Era Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedEra(null)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border whitespace-nowrap",
                selectedEra === null
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              )}
            >
              All
            </button>
            {eras.map(era => (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border whitespace-nowrap",
                  selectedEra === era
                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                )}
              >
                {era}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
            <p className="text-lg font-medium">Scanning Void Fissures...</p>
          </div>
        ) : error ? (
          <div className="w-full p-8 border border-red-900/50 bg-red-950/20 rounded-2xl text-red-400 text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredRelics.length > 0 ? (
              filteredRelics.map((group) => (
                <RelicCard key={group.key} relicGroup={group} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <p className="text-zinc-500 text-lg">No relics matched your search terms.</p>
                <p className="text-zinc-700 text-sm mt-2">Try searching for a relic name (e.g. "Axi A1") or a prime part.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-900 p-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <p className="text-zinc-500 text-sm flex items-center gap-2">
            Data provided by Warframe Community Developers •
            <span>Created by <a href="https://github.com/taurinexd" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 decoration-purple-900 transition-colors inline-flex items-center gap-1">taurinexd <ExternalLink className="w-3 h-3" /></a></span>
          </p>
          <div className="text-[10px] text-zinc-700 max-w-2xl text-center leading-relaxed">
            RadShare Helper is a fan-made tool. NOT affiliated with Digital Extremes or Warframe.
            All trademarks belong to their respective owners.
          </div>
        </div>
      </footer>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

export default App;
