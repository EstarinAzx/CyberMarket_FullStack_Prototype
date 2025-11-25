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

    return (
        <motion.div
            className={`product-card rarity-${item.rarity}`}
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelect(item)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onMouseEnter={() => soundManager.playHover()}
        >
            <div className="card-image">
                <div className={`rarity-badge ${item.rarity}`}>{item.rarity}</div>
                <button
                    onClick={handleFavorite}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(0,0,0,0.7)',
                        border: '1px solid ' + (isFavorite ? '#ff0055' : '#666'),
                        padding: '5px',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    <Heart size={18} fill={isFavorite ? '#ff0055' : 'none'} color={isFavorite ? '#ff0055' : '#fff'} />
                </button>
                <img src={item.image} alt={item.name} />
            </div>
            <div className="card-info">
                <div className="card-title">{item.name}</div>
                <div className="card-type">{item.type}</div>
                <div className="card-stats">
                    {Object.entries(item.stats).map(([key, val]) => (
                        <div className="stat-row" key={key}>
                            <span>{key.toUpperCase()}</span>
                            <span style={{ color: '#fff' }}>{val}</span>
                        </div>
                    ))}
                </div>
                <div className="card-price">¥ {item.price.toLocaleString()}</div>
                <button className="btn-buy" onClick={handleBuy}>
                    ADD TO LOADOUT
                </button>
            </div>
        </motion.div>
    );
};
