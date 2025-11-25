import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductGrid } from './ProductGrid';
import { CartSidebar } from './CartSidebar';
import { TransactionHistory } from './TransactionHistory';
import { Inventory } from './Inventory';
import { Search, Receipt, Package } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const Layout: React.FC = () => {
    const {
        credits,
        user,
        logout,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        setSortBy
    } = useStore();

    const [showHistory, setShowHistory] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const categories = ['all', 'weapon', 'implant', 'gear'];

    return (
        <div className="app-container">
            <div className="crt-overlay"></div>
            <div className="scanline"></div>

            <header className="cyber-header">
                <div className="brand">
                    <span className="glitch" data-text="CYBER_MARKET">CYBER_MARKET</span>
                    <span className="version">SYS.VER.3.0.REACT</span>
                </div>

                <div className="search-bar" style={{ flex: 1, margin: '0 40px', position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#00f3ff' }} />
                    <input
                        type="text"
                        placeholder="SEARCH DATABASE..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(0, 243, 255, 0.1)',
                            border: '1px solid #00f3ff',
                            padding: '10px 10px 10px 40px',
                            color: '#fff',
                            fontFamily: 'Orbitron',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                <div className="user-stats">
                    <button
                        onClick={() => setShowInventory(true)}
                        style={{
                            background: 'transparent',
                            border: '1px solid #00f3ff',
                            color: '#00f3ff',
                            padding: '8px 15px',
                            fontFamily: 'Orbitron',
                            cursor: 'pointer',
                            marginRight: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Package size={16} />
                        INVENTORY
                    </button>
                    <button
                        onClick={() => setShowHistory(true)}
                        style={{
                            background: 'transparent',
                            border: '1px solid #ffe600',
                            color: '#ffe600',
                            padding: '8px 15px',
                            fontFamily: 'Orbitron',
                            cursor: 'pointer',
                            marginRight: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Receipt size={16} />
                        HISTORY
                    </button>
                    <div className="stat-item" style={{ marginRight: '20px' }}>
                        <span className="label">OPERATOR</span>
                        <span className="value" style={{ color: '#00f3ff' }}>{user?.username.toUpperCase()}</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">CREDITS</span>
                        <span className="value" id="credits-display">¥ {credits.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            background: 'transparent',
                            border: '1px solid #ff0055',
                            color: '#ff0055',
                            padding: '5px 15px',
                            fontFamily: 'Orbitron',
                            cursor: 'pointer',
                            marginLeft: '20px'
                        }}
                    >
                        DISCONNECT
                    </button>
                </div>
            </header>

            <div className="main-layout">
                <nav className="cyber-nav">
                    <ul id="category-list">
                        {categories.map(cat => (
                            <li
                                key={cat}
                                className={`nav-item ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat.toUpperCase()}
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: '20px' }}>
                        <div style={{ color: '#666', marginBottom: '10px', fontSize: '0.8rem' }}>SORT BY</div>
                        <select
                            onChange={(e) => setSortBy(e.target.value as any)}
                            style={{
                                width: '100%',
                                background: '#0a0a0a',
                                color: '#00f3ff',
                                border: '1px solid #333',
                                padding: '5px'
                            }}
                        >
                            <option value="">DEFAULT</option>
                            <option value="price-asc">PRICE: LOW TO HIGH</option>
                            <option value="price-desc">PRICE: HIGH TO LOW</option>
                            <option value="name">NAME</option>
                        </select>
                    </div>

                    <div className="nav-decoration">
                        <div className="deco-line"></div>
                        <div className="deco-box"></div>
                    </div>
                </nav>

                <ProductGrid />
                <CartSidebar />
            </div>

            <TransactionHistory isOpen={showHistory} onClose={() => setShowHistory(false)} />
            <AnimatePresence>
                {showInventory && <Inventory onClose={() => setShowInventory(false)} />}
            </AnimatePresence>
        </div>
    );
};
