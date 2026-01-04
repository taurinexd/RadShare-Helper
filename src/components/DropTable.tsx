import type { RelicReward } from '../lib/api';
import { cn } from '../lib/utils';

interface DropTableProps {
    rewards: RelicReward[];
    className?: string;
}

export function DropTable({ rewards, className }: DropTableProps) {
    const rarityOrder = { Rare: 1, Uncommon: 2, Common: 3 };

    const sortedRewards = [...rewards].sort((a, b) => {
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });

    return (
        <div className={cn('w-full space-y-2', className)}>
            {sortedRewards.map((reward, idx) => (
                <div
                    key={`${reward._id}-${idx}`}
                    className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-lg group hover:border-zinc-700 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <span
                            className={cn(
                                'w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold',
                                reward.rarity === 'Rare' && 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50',
                                reward.rarity === 'Uncommon' && 'bg-zinc-300/20 text-zinc-300 border border-zinc-300/50',
                                reward.rarity === 'Common' && 'bg-orange-800/20 text-orange-400 border border-orange-800/50'
                            )}
                        >
                            {reward.rarity === 'Rare' ? '🥇' : reward.rarity === 'Uncommon' ? '🥈' : '⚪'}
                        </span>
                        <span className="text-zinc-200 group-hover:text-white transition-colors">{reward.itemName}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-zinc-400">{reward.chance}%</span>
                        <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">
                            {reward.rarity}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
