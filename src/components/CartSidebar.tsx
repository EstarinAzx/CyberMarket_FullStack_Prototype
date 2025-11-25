import { useStore } from '../context/StoreContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartSidebar: React.FC = () => {
    const { cart, removeFromCart, checkout } = useStore();

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;

        const result = checkout();
        alert(result.message);
    };

    return (
        <aside className="cyber-sidebar">
            <div className="sidebar-header">
                <h3>LOADOUT</h3>
                <div className="capacity">{cart.length} / 10</div>
            </div>

            <div className="cart-items" id="cart-items">
                <AnimatePresence>
                    {cart.length === 0 ? (
                        <div className="empty-msg">NO ITEMS EQUIPPED</div>
                    ) : (
                        cart.map((item, index) => (
                            <motion.div
                                key={`${item.id}-${index}`}
                                className="cart-item"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                            >
                                <div className="cart-item-info">
                                    <span className="cart-item-name">{item.name}</span>
                                    <span className="cart-item-price">¥ {item.price.toLocaleString()}</span>
                                </div>
                                <button className="btn-remove" onClick={() => removeFromCart(index)}>
                                    <X size={16} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="sidebar-footer">
                <div className="total-row">
                    <span>TOTAL</span>
                    <span id="cart-total">¥ {total.toLocaleString()}</span>
                </div>
                <button className="cyber-btn primary" id="checkout-btn" onClick={handleCheckout}>
                    <span className="btn-content">INITIATE_TRANSACTION</span>
                    <span className="btn-glitch"></span>
                </button>
            </div>
        </aside>
    );
};
