import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt } from 'lucide-react';
import { createPortal } from 'react-dom';

interface TransactionHistoryProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ isOpen, onClose }) => {
    const { transactions } = useStore();

    const content = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '45vh',
                        background: 'linear-gradient(180deg, rgba(8,12,18,0.98) 0%, rgba(5,8,12,0.99) 100%)',
                        borderTop: '2px solid #00f0ff',
                        boxShadow: '0 -10px 50px rgba(0,240,255,0.2)',
                        zIndex: 9998,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    {/* Glow accent */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)',
                        boxShadow: '0 0 20px #00f0ff'
                    }} />

                    {/* Header */}
                    <div style={{
                        padding: '15px 25px',
                        borderBottom: '1px solid rgba(0,240,255,0.2)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(0,240,255,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Receipt size={22} color="#00f0ff" />
                            <h2 style={{
                                fontFamily: 'Orbitron',
                                color: '#00f0ff',
                                fontSize: '1.2rem',
                                letterSpacing: '2px',
                                textShadow: '0 0 10px rgba(0,240,255,0.5)'
                            }}>
                                TRANSACTION LOG
                            </h2>
                            <span style={{
                                fontFamily: 'Orbitron',
                                fontSize: '0.75rem',
                                color: '#666',
                                marginLeft: '10px'
                            }}>
                                [{transactions.length} RECORDS]
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255,0,85,0.1)',
                                border: '1px solid #ff0055',
                                color: '#ff0055',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,0,85,0.2)';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(255,0,85,0.4)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,0,85,0.1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{
                        flex: 1,
                        overflow: 'auto',
                        padding: '20px 25px'
                    }}>
                        {transactions.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                color: '#555',
                                padding: '40px',
                                fontFamily: 'Orbitron',
                                fontSize: '0.9rem',
                                letterSpacing: '2px'
                            }}>
                                NO TRANSACTIONS RECORDED
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '12px'
                            }}>
                                {transactions.map((trans) => (
                                    <div key={trans.id} style={{
                                        background: 'rgba(0, 240, 255, 0.03)',
                                        border: '1px solid rgba(0,240,255,0.2)',
                                        padding: '15px',
                                        position: 'relative',
                                        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '25px',
                                            height: '2px',
                                            background: '#00f0ff'
                                        }} />
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '8px'
                                        }}>
                                            <span style={{
                                                color: '#fcee0a',
                                                fontFamily: 'Orbitron',
                                                fontSize: '0.8rem'
                                            }}>
                                                {new Date(trans.timestamp).toLocaleString()}
                                            </span>
                                            <span style={{
                                                color: '#00f0ff',
                                                fontFamily: 'Orbitron',
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold',
                                                textShadow: '0 0 10px rgba(0,240,255,0.3)'
                                            }}>
                                                ¥ {trans.total.toLocaleString()}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: '#888',
                                            fontFamily: 'Orbitron'
                                        }}>
                                            {trans.items.map(item => item.name).join(', ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(content, document.body);
};
