import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Item, items as initialItems } from '../data/items';
import { soundManager } from '../utils/soundManager';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface User {
    uid: string;
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
    loading: boolean;
    addToCart: (item: Item) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    checkout: () => Promise<{ success: boolean; message: string }>;
    toggleFavorite: (id: number) => void;
    login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
    signup: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
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
    const [user, setUser] = useState<User | null>(null);
    const [cart, setCart] = useState<Item[]>([]);
    const [credits, setCredits] = useState<number>(50000);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name' | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Listen to Firebase auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Load user data from Firestore
                await loadUserData(firebaseUser.uid);
            } else {
                setUser(null);
                setCredits(50000);
                setCart([]);
                setTransactions([]);
                setFavorites([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loadUserData = async (uid: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser({
                    uid,
                    username: userData.username,
                    credits: userData.credits
                });
                setCredits(userData.credits);
                setCart(userData.cart || []);
                setTransactions(userData.transactions || []);
                setFavorites(userData.favorites || []);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const saveUserData = async () => {
        if (!user) return;

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                credits,
                cart,
                transactions,
                favorites
            });
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    // Auto-save user data when it changes
    useEffect(() => {
        if (user && !loading) {
            saveUserData();
        }
    }, [cart, credits, transactions, favorites]);

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

    const checkout = async () => {
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

    const login = async (username: string, password: string) => {
        try {
            // Use username as email (username@cybermarket.local)
            const email = `${username}@cybermarket.local`;
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true, message: 'LOGIN SUCCESSFUL' };
        } catch (error: any) {
            console.error('Login error:', error);
            return { success: false, message: 'ACCESS DENIED: INVALID CREDENTIALS' };
        }
    };

    const signup = async (username: string, password: string) => {
        try {
            // Use username as email (username@cybermarket.local)
            const email = `${username}@cybermarket.local`;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Create user document in Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                username,
                credits: 50000,
                cart: [],
                transactions: [],
                favorites: [],
                createdAt: Date.now()
            });

            return { success: true, message: 'ACCOUNT CREATED SUCCESSFULLY' };
        } catch (error: any) {
            console.error('Signup error:', error);

            // Better error messages
            if (error.code === 'auth/email-already-in-use') {
                return { success: false, message: 'IDENTITY ALREADY REGISTERED' };
            } else if (error.code === 'auth/configuration-not-found') {
                return { success: false, message: 'FIREBASE AUTH NOT ENABLED. ENABLE EMAIL/PASSWORD IN FIREBASE CONSOLE.' };
            } else if (error.code === 'auth/weak-password') {
                return { success: false, message: 'PASSWORD TOO WEAK. USE 6+ CHARACTERS.' };
            } else if (error.code === 'auth/network-request-failed') {
                return { success: false, message: 'NETWORK ERROR. CHECK CONNECTION.' };
            }

            return { success: false, message: error.message || 'REGISTRATION FAILED' };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
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
            loading,
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
