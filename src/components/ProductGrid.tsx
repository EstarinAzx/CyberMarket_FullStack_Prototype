import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ItemModal } from './ItemModal';
import type { Item } from '../data/items';
import { AnimatePresence, motion } from 'framer-motion';

export const ProductGrid: React.FC = () => {
    const { filteredItems } = useStore();
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    return (
        <>
            <motion.main
                className="product-grid"
                id="product-grid"
                layout
            >
                <AnimatePresence>
                    {filteredItems.map(item => (
                        <ProductCard
                            key={item.id}
                            item={item}
                            onSelect={setSelectedItem}
                        />
                    ))}
                </AnimatePresence>
            </motion.main>

            {selectedItem && (
                <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </>
    );
};
