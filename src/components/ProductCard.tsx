import type { Item } from '../data/items';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/soundManager';
import { Heart } from 'lucide-react';

interface ProductCardProps {
    item: Item;
    onSelect: (item: Item) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onSelect }) => {
    const { addToCart, favorites, toggleFavorite } = useStore();

    const handleBuy = (e: React.MouseEvent) => {
        e.stopPropagation();
        soundManager.playClick();
        addToCart(item);
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(item.id);
    };

    const isFavorite = favorites.includes(item.id);

    // Rarity color mapping
    const rarityColors: Record<string, string> = {
        legendary: '#fbbf24',
        epic: '#a855f7',
        rare: '#06b6d4',
        common: '#00f0ff'
    };

    const rarityColor = rarityColors[item.rarity] || '#00f0ff';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => onSelect(item)}
            onMouseEnter={() => soundManager.playHover()}
            className="relative cursor-pointer transition-all duration-200 flex flex-col h-full bg-gradient-to-br from-[#141923]/95 to-[#0f1219]/90 border border-cyber-cyan/40 hover:border-[var(--rarity-color)] hover:shadow-[0_0_15px_rgba(var(--rarity-rgb),0.3)]"
            style={{
                '--rarity-color': rarityColor,
                '--rarity-rgb': rarityColor === '#fbbf24' ? '251,191,36' :
                    rarityColor === '#a855f7' ? '168,85,247' :
                        rarityColor === '#06b6d4' ? '6,182,212' : '0,240,255'
            } as React.CSSProperties}
            whileHover={{
                borderColor: rarityColor,
                boxShadow: `0 0 15px ${rarityColor}30`
            }}
        >
            {/* Corner Brackets */}
            <div className="absolute top-1 left-1 w-[15px] h-[15px] border-t-2 border-l-2 border-cyber-cyan" />
            <div className="absolute top-1 right-1 w-[15px] h-[15px] border-t-2 border-r-2 border-cyber-cyan" />
            <div className="absolute bottom-1 left-1 w-[15px] h-[15px] border-b-2 border-l-2 border-cyber-cyan" />
            <div className="absolute bottom-1 right-1 w-[15px] h-[15px] border-b-2 border-r-2 border-cyber-cyan" />

            {/* Rarity Badge */}
            <div
                className="absolute top-3 right-3 text-black px-2.5 py-0.5 font-orbitron text-[0.65rem] font-bold tracking-wider z-10"
                style={{ background: rarityColor }}
            >
                {item.rarity.toUpperCase()}
            </div>

            {/* Favorite Button */}
            <button
                onClick={handleFavorite}
                className="absolute top-3 left-3 bg-black/70 border px-1.5 py-1.5 cursor-pointer z-10 transition-colors"
                style={{ borderColor: isFavorite ? '#f59e0b' : 'rgba(0, 240, 255, 0.4)' }}
            >
                <Heart
                    size={16}
                    fill={isFavorite ? '#f59e0b' : 'none'}
                    color={isFavorite ? '#f59e0b' : '#00f0ff'}
                />
            </button>

            {/* Image Section */}
            <div className="h-[180px] overflow-hidden border-b border-cyber-cyan/30 relative">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-85 transition-all duration-300 saturate-[0.8] hover:opacity-90 hover:saturate-100 hover:scale-105"
                />
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col gap-3">
                {/* Title */}
                <div className="font-orbitron text-base text-cyber-cyan tracking-wide uppercase leading-tight">
                    {item.name}
                </div>

                {/* Type */}
                <div className="font-orbitron text-[0.85rem] text-text-dim uppercase tracking-wide">
                    [ {item.type} ]
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 flex-1">
                    {Object.entries(item.stats).map(([key, val]) => (
                        <div
                            key={key}
                            className="bg-black/40 border border-cyber-cyan/30 px-2 py-1.5 flex flex-col gap-0.5"
                        >
                            <div className="font-mono text-[0.65rem] text-text-dim uppercase">
                                {key}
                            </div>
                            <div className="font-orbitron text-sm text-cyber-cyan font-bold">
                                {val}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Price */}
                <div className="font-orbitron text-xl text-cyber-yellow text-right tracking-wide mt-2">
                    ¥ {item.price.toLocaleString()}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleBuy}
                    className="bg-transparent border border-cyber-cyan text-cyber-cyan px-2.5 py-2.5 font-orbitron text-[0.85rem] tracking-wide cursor-pointer transition-all duration-200 uppercase hover:bg-cyber-cyan/10 hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                >
                    ADD TO LOADOUT
                </button>
            </div>
        </motion.div>
    );
};
