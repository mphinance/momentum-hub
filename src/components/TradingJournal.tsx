import React, { useState, useEffect, useCallback } from 'react';
import { Trade } from '../types/Trade';
import TradeRow from './TradeRow';
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import AddTradeModal from './AddTradeModal';
import TagFilter from './TagFilter';
import { debounce } from 'lodash';

// Declare Firebase and Auth globals
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

const TradingJournal: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isAddTradeModalOpen, setIsAddTradeModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [db, setDb] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTradeIds, setSelectedTradeIds] = useState<string[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Initialize Firebase and Auth
  useEffect(() => {
    try {
      const firebaseConfig = JSON.parse(__firebase_config);
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);
      setDb(firestoreDb);
      setAuth(firebaseAuth);

      // Sign in with custom token or anonymously
      const signIn = async () => {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(firebaseAuth, __initial_auth_token);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        } catch (e: any) {
          console.error('Firebase authentication error:', e);
          setError(`Authentication failed: ${e.message}`);
        } finally {
          setIsAuthReady(true);
        }
      };
      signIn();

      // Listen for auth state changes
      const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(crypto.randomUUID()); // Use a random ID if not authenticated
        }
      });

      return () => unsubscribeAuth();
    } catch (e: any) {
      console.error('Firebase initialization error:', e);
      setError(`Firebase initialization failed: ${e.message}`);
      setLoading(false);
    }
  }, []);

  // Fetch trades from Firestore
  useEffect(() => {
    if (!db || !userId || !isAuthReady) {
      return;
    }

    setLoading(true);
    setError(null);

    const tradesCollectionRef = collection(
      db,
      `artifacts/${__app_id}/users/${userId}/trades`
    );
    const q = query(tradesCollectionRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedTrades: Trade[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Trade[];
        setTrades(fetchedTrades);
        setLoading(false);
      },
      (e) => {
        console.error('Error fetching trades:', e);
        setError(`Failed to load trades: ${e.message}`);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, userId, isAuthReady]);

  // Debounced search term update
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = trade.symbol
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      trade.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => trade.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = Array.from(new Set(trades.flatMap((trade) => trade.tags || [])));

  const handleDeleteTrade = async (id: string) => {
    if (!db || !userId) return;
    try {
      await deleteDoc(doc(db, `artifacts/${__app_id}/users/${userId}/trades`, id));
      setSelectedTradeIds(prev => prev.filter(tradeId => tradeId !== id)); // Deselect if deleted individually
    } catch (e: any) {
      console.error('Error deleting trade:', e);
      setError(`Failed to delete trade: ${e.message}`);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTradeIds(filteredTrades.map(trade => trade.id));
    } else {
      setSelectedTradeIds([]);
    }
  };

  const handleRowSelect = (id: string, isSelected: boolean) => {
    setSelectedTradeIds(prev =>
      isSelected ? [...p
