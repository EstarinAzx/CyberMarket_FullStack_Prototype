import React, { useState } from 'react';
import { CustomSelect } from './CustomSelect';
import { useStore } from '../context/StoreContext';
import { ProductGrid } from './ProductGrid';
import { CartSidebar } from './CartSidebar';
import { TransactionHistory } from './TransactionHistory';
import { Inventory } from './Inventory';
import { AdminDashboard } from './AdminDashboard';
import { UserProfile } from './UserProfile';
import { Search, Receipt, Package, ShoppingCart, Shield, User } from 'lucide-react';
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
    const [showCart, setShowCart] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const categories = ['all', 'weapon', 'implant', 'gear'];

    return (
        <div className="flex flex-col h-screen overflow-hidden relative z-10 scale-[1.55] origin-top w-[64%] h-[64vh] mx-auto">
            <div className="crt-overlay"></div>
            <div className="scanline"></div>

            <header className="flex justify-between items-center py-3 px-6 bg-gradient-to-b from-[#12141a]/98 to-[#0c0e12]/95 border-b border-cyber-cyan mb-0 relative [clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)] before:content-[''] before:absolute before:left-0 before:top-0 before:w-[200px] before:h-full before:bg-gradient-to-r before:from-cyber-red/10 before:to-transparent before:pointer-events-none after:content-[''] after:absolute after:right-0 after:top-0 after:w-[200px] after:h-full after:bg-gradient-to-l after:from-cyber-cyan/10 after:to-transparent after:pointer-events-none">
                <div className="flex flex-col relative tracking-[4px] font-bold font-orbitron text-2xl text-cyber-cyan [text-shadow:0_0_10px_rgba(0,240,255,0.5)]">
                    <span className="glitch" data-text="CYBER_MARKET">CYBER_MARKET</span>
                    <span className="text-[0.65rem] text-cyber-yellow tracking-wide opacity-90 font-normal [text-shadow:none]">v1.0.0</span>
                </div>

                <div className="flex-1 mx-4 relative max-w-md">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyber-cyan" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-cyber-cyan/5 border border-cyber-cyan/30 pl-9 pr-2.5 py-2 text-cyber-cyan font-orbitron text-xs tracking-wide"
                    />
                </div>

                {/* Mobile Cart Toggle */}
                <button
                    className="mobile-cart-toggle hidden bg-transparent border border-cyber-red text-cyber-red p-2 cursor-pointer relative"
                    onClick={() => setShowCart(true)}
                >
                    <ShoppingCart size={20} />
                    {useStore().cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-cyber-red text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-[0.7rem] font-orbitron">
                            {useStore().cart.length}
                        </span>
                    )}
                </button>

                <div className="flex gap-4 items-center">
                    {user?.isAdmin && (
                        <button
                            onClick={() => setShowAdmin(true)}
                            className="bg-cyber-yellow/10 border border-cyber-yellow text-cyber-yellow py-1.5 px-3 font-orbitron text-[0.7rem] cursor-pointer flex items-center gap-1.5 tracking-wide"
                        >
                            <Shield size={14} />
                            ADMIN
                        </button>
                    )}
                    <button
                        onClick={() => setShowInventory(true)}
                        className="bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan py-1.5 px-3 font-orbitron text-[0.7rem] cursor-pointer flex items-center gap-1.5 tracking-wide"
                    >
                        <Package size={14} />
                        INVENTORY
                    </button>
                    <button
                        onClick={() => setShowHistory(true)}
                        className="bg-cyber-yellow/10 border border-cyber-yellow text-cyber-yellow py-1.5 px-3 font-orbitron text-[0.7rem] cursor-pointer flex items-center gap-1.5 tracking-wide"
                    >
                        <Receipt size={14} />
                        HISTORY
                    </button>
                    <button
                        onClick={() => setShowProfile(true)}
                        className="cursor-pointer bg-transparent border-none py-1.5 px-2.5 flex flex-col items-start border-l-2 border-l-cyber-cyan"
                    >
                        <span className="flex items-center gap-1.5 text-[0.6rem] text-text-dim uppercase tracking-wide">
                            <User size={10} />
                            OPERATOR
                        </span>
                        <span className="text-cyber-cyan text-base font-orbitron font-bold [text-shadow:0_0_5px_rgba(0,240,255,0.3)]">{user?.username.toUpperCase()}</span>
                    </button>
                    <div className="flex flex-col items-end py-1.5 px-2.5 bg-cyber-cyan/5 border-l-2 border-l-cyber-cyan">
                        <span className="text-[0.65rem] text-text-dim uppercase tracking-wide">CREDITS</span>
                        <span className="font-orbitron text-xl font-bold text-cyber-cyan [text-shadow:0_0_5px_rgba(0,240,255,0.3)]" id="credits-display">¥ {credits.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-cyber-red/10 border border-cyber-red text-cyber-red py-1.5 px-3 font-orbitron text-[0.7rem] cursor-pointer tracking-wide"
                    >
                        DISCONNECT
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-[180px_1fr_320px] gap-0 flex-1 overflow-hidden bg-black/30">
                <nav className="bg-gradient-to-b from-[#12141a]/95 to-[#0c0e12]/90 py-4 px-2.5 border-r border-cyber-cyan/20 flex flex-col justify-between relative before:content-[''] before:absolute before:top-0 before:right-0 before:w-px before:h-[30%] before:bg-gradient-to-b before:from-cyber-cyan before:to-transparent">
                    <ul id="category-list">
                        {categories.map(cat => (
                            <li
                                key={cat}
                                className={`list-none py-2.5 px-3 mb-1 font-orbitron text-xs tracking-[2px] uppercase transition-all duration-200 border-l-2 relative ${selectedCategory === cat
                                        ? 'text-cyber-cyan bg-gradient-to-r from-cyber-cyan/10 to-transparent border-l-cyber-cyan [text-shadow:0_0_8px_rgba(0,240,255,0.5)]'
                                        : 'text-text-dim border-l-transparent hover:text-cyber-cyan hover:bg-gradient-to-r hover:from-cyber-cyan/10 from-transparent hover:border-l-cyber-cyan hover:[text-shadow:0_0_8px_rgba(0,240,255,0.5)]'
                                    }`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat.toUpperCase()}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-5">
                        <div className="text-text-dim mb-2.5 text-[0.65rem] tracking-[2px]">SORT BY</div>
                        <CustomSelect
                            options={[
                                { value: '', label: 'DEFAULT' },
                                { value: 'price-asc', label: 'PRICE: LOW TO HIGH' },
                                { value: 'price-desc', label: 'PRICE: HIGH TO LOW' },
                                { value: 'name', label: 'NAME' }
                            ]}
                            value={useStore().sortBy || ''}
                            onChange={(value) => setSortBy(value as any)}
                        />
                    </div>

                    <div className="nav-decoration">
                        <div className="deco-line"></div>
                        <div className="deco-box"></div>
                    </div>
                </nav>

                <ProductGrid />
                <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
            </div>

            <TransactionHistory isOpen={showHistory} onClose={() => setShowHistory(false)} />
            <AnimatePresence>
                {showInventory && <Inventory onClose={() => setShowInventory(false)} />}
                {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
                {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
            </AnimatePresence>
        </div>
    );
};
