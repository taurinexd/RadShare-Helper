export interface RelicReward {
    _id: string;
    itemName: string;
    rarity: 'Common' | 'Uncommon' | 'Rare';
    chance: number;
}

export interface Relic {
    _id: string;
    tier: 'Lith' | 'Meso' | 'Neo' | 'Axi';
    relicName: string;
    state: 'Intact' | 'Exceptional' | 'Flawless' | 'Radiant';
    rewards: RelicReward[];
}

export interface GroupedRelic {
    key: string; // "Tier Name"
    tier: 'Lith' | 'Meso' | 'Neo' | 'Axi';
    name: string;
    variants: Partial<Record<'Intact' | 'Exceptional' | 'Flawless' | 'Radiant', Relic>>;
}

const API_URL = 'https://drops.warframestat.us/data/relics.json';

export async function fetchRelics(): Promise<Relic[]> {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch relics: ${response.statusText}`);
        }
        const data = await response.json();
        return data.relics || [];
    } catch (error) {
        console.error('Error fetching relics:', error);
        return [];
    }
}

export function groupRelics(relics: Relic[]): GroupedRelic[] {
    const groups: Record<string, GroupedRelic> = {};

    relics.forEach((relic) => {
        // Handle cases where relicName might be missing (e.g. Requiem relics in some API versions)
        const name = relic.relicName || 'Relic';
        const tier = relic.tier || 'Unknown';

        const key = `${tier} ${name}`;
        if (!groups[key]) {
            groups[key] = {
                key,
                tier: tier as any,
                name: name,
                variants: {},
            };
        }
        groups[key].variants[relic.state] = relic;
    });

    // Remove any groups that are invalid (though shouldn't happen)
    const validGroups = Object.values(groups).filter(g => g.tier && g.name);

    // Normalize rarities based on the Intact state (standard for Warframe)
    validGroups.forEach((group) => {
        const intact = group.variants['Intact'];
        if (!intact) return;

        // Create a map of rarity based on Intact chances
        const rarityMap: Record<string, 'Rare' | 'Uncommon' | 'Common'> = {};
        intact.rewards.forEach((r) => {
            let rarity: 'Rare' | 'Uncommon' | 'Common' = 'Common';
            if (r.chance <= 2) rarity = 'Rare';
            else if (r.chance <= 11) rarity = 'Uncommon';
            rarityMap[r.itemName] = rarity;
        });

        // Apply this rarity to all variants
        Object.values(group.variants).forEach((variant) => {
            if (!variant) return;
            variant.rewards.forEach((reward) => {
                if (rarityMap[reward.itemName]) {
                    reward.rarity = rarityMap[reward.itemName];
                }
            });
        });
    });

    return validGroups;
}

export function filterGroupedRelics(groups: GroupedRelic[], query: string): GroupedRelic[] {
    const lowerQuery = query.toLowerCase();
    return groups.filter((group) => {
        const nameMatch = group.key.toLowerCase().includes(lowerQuery);
        const rewardMatch = Object.values(group.variants).some((v) =>
            v?.rewards.some((r) => r.itemName.toLowerCase().includes(lowerQuery))
        );
        return nameMatch || rewardMatch;
    });
}
