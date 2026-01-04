import { useState } from 'react';
import { Clipboard, Check, Users } from 'lucide-react';
import type { GroupedRelic, Relic } from '../lib/api';
import { DropTable } from './DropTable';
import { cn } from '../lib/utils';

interface RelicCardProps {
    relicGroup: GroupedRelic;
    className?: string;
}

const RELIC_STATES: Relic['state'][] = ['Intact', 'Exceptional', 'Flawless', 'Radiant'];

export function RelicCard({ relicGroup, className }: RelicCardProps) {
    const [selectedState, setSelectedState] = useState<Relic['state']>('Radiant');
    const [copyStatus, setCopyStatus] = useState<'idle' | 'host' | 'lf'>('idle');
    const [hostCount, setHostCount] = useState(1);

    // Fallback to Intact if Radiant doesn't exist (unlikely but safe)
    const currentRelic = relicGroup.variants[selectedState] ||
        relicGroup.variants['Intact'] ||
        Object.values(relicGroup.variants)[0];

    if (!currentRelic) return null;

    const handleCopy = async (type: 'host' | 'lf') => {
        const shareNames = {
            Intact: 'Intshare',
            Exceptional: 'Expshare',
            Flawless: 'Flawshare',
            Radiant: 'Radshare'
        };

        const shareType = shareNames[currentRelic.state];
        let text = '';
        const relicDisplayName = `${currentRelic.tier} ${currentRelic.relicName} Relic`;

        if (type === 'host') {
            text = `H [${relicDisplayName}] ${shareType} ${hostCount}/4`;

            // Delay increment to give user visual feedback of what was copied
            setTimeout(() => {
                setHostCount(prev => prev < 3 ? prev + 1 : 1);
            }, 3000);
        } else {
            text = `LF [${relicDisplayName}] ${shareType}`;
        }

        try {
            if (window.electronAPI) {
                await window.electronAPI.copyToClipboard(text);
            } else {
                console.warn('Electron API missing, using fallback...');
                await navigator.clipboard.writeText(text);
            }
            setCopyStatus(type);
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    return (
        <div className={cn('bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col', className)}>
            <div className="p-6 border-b border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-900/50">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                            {relicGroup.tier} {relicGroup.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border",
                                currentRelic.state === 'Radiant' ? "bg-purple-500/10 text-purple-400 border-purple-500/30" : "bg-zinc-800 text-zinc-400 border-zinc-700"
                            )}>
                                {currentRelic.state}
                            </span>
                            {copyStatus !== 'idle' && (
                                <span className="text-[10px] font-bold text-green-500 animate-pulse">
                                    COPIED!
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleCopy('lf')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium border",
                                copyStatus === 'lf'
                                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                            )}
                            title="Copy LF message"
                        >
                            {copyStatus === 'lf' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4 text-zinc-400" />}
                            LF
                        </button>
                        <button
                            onClick={() => handleCopy('host')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium shadow-lg shadow-purple-900/20",
                                copyStatus === 'host'
                                    ? "bg-green-600 border border-green-400 text-white"
                                    : "bg-purple-600 hover:bg-purple-500 text-white"
                            )}
                            title="Copy Host message and increment counter"
                        >
                            {copyStatus === 'host' ? <Check className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                            Host {hostCount}/4
                        </button>
                    </div>
                </div>

                {/* State Selector */}
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 w-fit">
                    {RELIC_STATES.map((state) => {
                        const exists = !!relicGroup.variants[state];
                        return (
                            <button
                                key={state}
                                onClick={() => exists && setSelectedState(state)}
                                disabled={!exists}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all uppercase tracking-tight",
                                    !exists && "opacity-20 cursor-not-allowed",
                                    selectedState === state
                                        ? "bg-zinc-700 text-white shadow-inner"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {state.charAt(0)}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-6 flex-1 overflow-auto max-h-[400px]">
                <DropTable rewards={currentRelic.rewards} />
            </div>
        </div>
    );
}
