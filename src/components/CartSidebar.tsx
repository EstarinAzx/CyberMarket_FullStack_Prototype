// ============================================
// IMPORTS
// ============================================
import React from 'react';
import { useStore } from '../context/StoreContext';
import { useNotification } from '../context/NotificationContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen = false, onClose }) => {
    const { cart, removeFromCart, checkout } = useStore();
    const { showNotification } = useNotification();
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        const result = await checkout();
        showNotification(result.message, result.success ? 'success' : 'error');
        if (result.success && onClose) {
            onClose();
        }
    };

    return (
        <aside className={`bg-gradient-to-b from-[#12141a]/98 to-[#0c0e12]/95 border-l border-cyber-red/30 flex flex-col p-4 relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-px before:h-[40%] before:bg-gradient-to-b before:from-cyber-red before:to-transparent ${isOpen ? 'open' : ''}`}>
            {onClose && (
                <button
                    onClick={onClose}
                    className="mobile-close-btn hidden absolute top-4 right-4 bg-transparent border border-cyber-red text-cyber-red p-2 cursor-pointer z-10"
                >
                    <X size={20} />
                </button>
            )}

            <div className="border-b border-cyber-red pb-2.5 mb-4 flex justify-between items-center relative after:content-[''] after:absolute after:-bottom-px after:left-0 after:w-[50px] after:h-px after:bg-cyber-red after:shadow-[0_0_10px_var(--cyber-red)]">
                <h3 className="font-orbitron text-cyber-red text-sm tracking-[2px] [text-shadow:0_0_10px_rgba(255,0,60,0.5)]">LOADOUT</h3>
                <div className="capacity">{cart.length} / 10</div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyber-red" id="cart-items">
                <AnimatePresence>
                    {cart.length === 0 ? (
                        <div className="text-center text-text-dim mt-12 font-orbitron text-sm tracking-[2px]">NO ITEMS EQUIPPED</div>
                    ) : (
                        cart.map((item, index) => (
                            <motion.div
                                key={`${item.id}-${index}`}
                                className="flex justify-between items-center bg-cyber-red/5 p-2.5 mb-2 border-l-2 border-cyber-red transition-all duration-200 hover:bg-cyber-red/10"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                            >
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm text-text-main">{item.name}</span>
                                    <span className="text-xs text-cyber-yellow">¥ {item.price.toLocaleString()}</span>
                                </div>
                                <button className="bg-none border-none text-text-dim text-base transition-all duration-200 cursor-pointer hover:text-cyber-red hover:[text-shadow:0_0_5px_var(--cyber-red)]" onClick={() => removeFromCart(index)}>
                                    <X size={16} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="border-t border-cyber-red/30 pt-4 mt-4">
                <div className="flex justify-between font-orbitron text-lg mb-4 text-text-main p-2.5 bg-cyber-red/5 border border-cyber-red/20">
                    <span>TOTAL</span>
                    <span className="text-cyber-yellow [text-shadow:0_0_5px_rgba(252,238,10,0.3)]" id="cart-total">¥ {total.toLocaleString()}</span>
                </div>

                <button
                    className="w-full px-4 py-3 bg-gradient-to-b from-cyber-yellow to-cyber-yellow-dim border-none text-black font-orbitron text-sm font-bold tracking-[3px] [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)] transition-all duration-300 relative cursor-pointer uppercase overflow-hidden hover:bg-gradient-to-b hover:from-yellow-300 hover:to-cyber-yellow hover:shadow-[0_0_25px_rgba(252,238,10,0.5)] hover:-translate-y-0.5 before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-[left] before:duration-500 hover:before:left-full"
                    id="checkout-btn"
                    onClick={handleCheckout}
                >
                    INITIATE_TRANSACTION
                </button>
            </div>
        </aside>
    );
};
