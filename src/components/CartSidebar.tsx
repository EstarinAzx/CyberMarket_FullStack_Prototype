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
        <aside style={{
            background: 'linear-gradient(180deg, rgba(18,20,26,0.98) 0%, rgba(12,14,18,0.95) 100%)',
            borderLeft: '1px solid rgba(255,0,60,0.3)',
            display: 'flex',
            flexDirection: 'column',
            padding: '15px',
            position: 'relative',
            height: '100%',
            minHeight: 0,
            overflow: 'hidden'
        }}>
            {/* Red accent line */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '1px',
                height: '40%',
                background: 'linear-gradient(180deg, #ff003c, transparent)'
            }} />

            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        display: 'none',
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'transparent',
                        border: '1px solid #ff003c',
                        color: '#ff003c',
                        padding: '8px',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    <X size={20} />
                </button>
            )}

            {/* Header */}
            <div style={{
                borderBottom: '1px solid #ff003c',
                paddingBottom: '10px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative'
            }}>
                <h3 style={{
                    fontFamily: 'Orbitron, sans-serif',
                    color: '#ff003c',
                    fontSize: '0.9rem',
                    letterSpacing: '2px',
                    textShadow: '0 0 10px rgba(255,0,60,0.5)'
                }}>LOADOUT</h3>
                <div style={{
                    fontFamily: 'Orbitron, sans-serif',
                    color: '#00f0ff',
                    fontSize: '1rem'
                }}>{cart.length} / 10</div>
                {/* Glow accent */}
                <div style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    width: '50px',
                    height: '1px',
                    background: '#ff003c',
                    boxShadow: '0 0 10px #ff003c'
                }} />
            </div>

            {/* Cart Items */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '15px'
            }}>
                <AnimatePresence>
                    {cart.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            color: '#5a5a6a',
                            marginTop: '50px',
                            fontFamily: 'Orbitron, sans-serif',
                            fontSize: '0.9rem',
                            letterSpacing: '2px'
                        }}>NO ITEMS EQUIPPED</div>
                    ) : (
                        cart.map((item, index) => (
                            <motion.div
                                key={`${item.id}-${index}`}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(255,0,60,0.05)',
                                    padding: '10px',
                                    marginBottom: '8px',
                                    borderLeft: '2px solid #ff003c',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        color: '#e8e8e8'
                                    }}>{item.name}</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: '#fcee0a'
                                    }}>¥ {item.price.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => removeFromCart(index)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#5a5a6a',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.color = '#ff003c';
                                        e.currentTarget.style.textShadow = '0 0 5px #ff003c';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.color = '#5a5a6a';
                                        e.currentTarget.style.textShadow = 'none';
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div style={{
                borderTop: '1px solid rgba(255,0,60,0.3)',
                paddingTop: '15px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '1.1rem',
                    marginBottom: '15px',
                    color: '#e8e8e8',
                    padding: '10px',
                    background: 'rgba(255,0,60,0.05)',
                    border: '1px solid rgba(255,0,60,0.2)'
                }}>
                    <span>TOTAL</span>
                    <span style={{
                        color: '#fcee0a',
                        textShadow: '0 0 5px rgba(252,238,10,0.3)'
                    }}>¥ {total.toLocaleString()}</span>
                </div>

                <button
                    onClick={handleCheckout}
                    style={{
                        width: '100%',
                        padding: '12px 15px',
                        background: 'linear-gradient(180deg, #fcee0a 0%, #d4c800 100%)',
                        border: 'none',
                        color: '#000',
                        fontFamily: 'Orbitron, sans-serif',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        letterSpacing: '3px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                        transition: 'all 0.3s',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(252,238,10,0.5)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    INITIATE_TRANSACTION
                </button>
            </div>
        </aside>
    );
};
