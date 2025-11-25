import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Item, items as initialItems } from '../data/items';
import { soundManager } from '../utils/soundManager';

interface User {
    username: string;
    credits: number;
}

interface Transaction {
    id: string;
    items: Item[];
    total: number;
    timestamp: number;
}

interface StoreContextType {
    items: Item[];
    cart: Item[];
    credits: number;
    user: User | null;
    transactions: Transaction[];
    favorites: number[];
    addToCart: (item: Item) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    checkout: () => { success: boolean; message: string };
    toggleFavorite: (id: number) => void;
    login: (username: string) => boolean;
    signup: (username: string) => boolean;
    logout: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: 'price-asc' | 'price-desc' | 'name' | null;
    setSortBy: (sort: 'price-asc' | 'price-desc' | 'name' | null) => void;
    filteredItems: Item[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('cyber_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [cart, setCart] = useState<Item[]>(() => {
        const saved = localStorage.getItem('cyber_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [credits, setCredits] = useState<number>(user ? user.credits : 50000);

    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('cyber_transactions');
        return saved ? JSON.parse(saved) : [];
    });

    const [favorites, setFavorites] = useState<number[]>(() => {
        const saved = localStorage.getItem('cyber_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name' | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        localStorage.setItem('cyber_cart', JSON.stringify(cart));
        localStorage.setItem('cyber_transactions', JSON.stringify(transactions));
        localStorage.setItem('cyber_favorites', JSON.stringify(favorites));
        if (user) {
            localStorage.setItem('cyber_user', JSON.stringify({ ...user, credits }));
            const users = JSON.parse(localStorage.getItem('cyber_users_db') || '{}');
            users[user.username] = { ...user, credits };
            localStorage.setItem('cyber_users_db', JSON.stringify(users));
        }
    }, [cart, credits, user, transactions, favorites]);

    const addToCart = (item: Item) => {
        setCart([...cart, item]);
        soundManager.playClick();
    };

    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const clearCart = () => {
        setCart([]);
    };

    const checkout = () => {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        if (credits >= total) {
            const newTransaction: Transaction = {
                id: Date.now().toString(),
                items: [...cart],
                total,
                timestamp: Date.now()
            };
            setTransactions(prev => [newTransaction, ...prev]);
            setCredits(prev => prev - total);
            setCart([]);
            soundManager.playPurchase();
            return { success: true, message: 'TRANSACTION COMPLETE. ITEMS TRANSFERRED.' };
        } else {
            soundManager.playError();
            return { success: false, message: 'INSUFFICIENT FUNDS. TRANSACTION DENIED.' };
        }
    };

    const toggleFavorite = (id: number) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
        );
        soundManager.playClick();
    };

    const login = (username: string) => {
        const users = JSON.parse(localStorage.getItem('cyber_users_db') || '{}');
        if (users[username]) {
            const loggedInUser = users[username];
            setUser(loggedInUser);
            setCredits(loggedInUser.credits);
            return true;
        }
        return false;
    };

    const signup = (username: string) => {
        const users = JSON.parse(localStorage.getItem('cyber_users_db') || '{}');
        if (users[username]) {
            return false;
        }
        const newUser = { username, credits: 50000 };
        users[username] = newUser;
        localStorage.setItem('cyber_users_db', JSON.stringify(users));
        setUser(newUser);
        setCredits(newUser.credits);
        return true;
    };

    const logout = () => {
        setUser(null);
        setCart([]);
        setTransactions([]);
        setFavorites([]);
        localStorage.removeItem('cyber_user');
        localStorage.removeItem('cyber_cart');
        localStorage.removeItem('cyber_transactions');
        localStorage.removeItem('cyber_favorites');
    };

    const filteredItems = initialItems
        .filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            return 0;
        });

    return (
        <StoreContext.Provider value={{
            items: initialItems,
            cart,
            credits,
            user,
            transactions,
            favorites,
            addToCart,
            removeFromCart,
            clearCart,
            checkout,
            toggleFavorite,
            login,
            signup,
            logout,
            searchQuery,
            setSearchQuery,
            sortBy,
            setSortBy,
            filteredItems,
            selectedCategory,
            setSelectedCategory
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within a StoreProvider');
    return context;
};
