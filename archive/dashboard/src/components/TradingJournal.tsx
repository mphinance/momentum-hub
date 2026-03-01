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
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app'; // Ensure this is imported
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
      // Use the imported initializeApp directly
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
      isSelected ? [...prev, id] : prev.filter(tradeId => tradeId !== id)
    );
  };

  const handleMassDelete = async () => {
    if (!db || !userId || selectedTradeIds.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedTradeIds.length} selected trades?`)) {
      try {
        const batch = writeBatch(db);
        selectedTradeIds.forEach(id => {
          const docRef = doc(db, `artifacts/${__app_id}/users/${userId}/trades`, id);
          batch.delete(docRef);
        });
        await batch.commit();
        setSelectedTradeIds([]); // Clear selection after deletion
      } catch (e: any) {
        console.error('Error mass deleting trades:', e);
        setError(`Failed to mass delete trades: ${e.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-700">Loading Trading Journal...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white font-inter rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-purple-400">Trading Journal</h2>

      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search trades..."
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex-grow max-w-xs"
          onChange={handleSearchChange}
        />
        <TagFilter allTags={allTags} selectedTags={selectedTags} onTagChange={handleTagChange} />
        <div className="flex gap-4">
          <button
            onClick={() => setIsAddTradeModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add Trade
          </button>
          {selectedTradeIds.length > 0 && (
            <button
              onClick={handleMassDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Delete Selected ({selectedTradeIds.length})
            </button>
          )}
        </div>
      </div>

      <AddTradeModal
        isOpen={isAddTradeModalOpen}
        onClose={() => setIsAddTradeModalOpen(false)}
        db={db}
        userId={userId}
        appId={__app_id}
      />

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-lg">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedTradeIds.length === filteredTrades.length && filteredTrades.length > 0}
                  className="form-checkbox h-4 w-4 text-purple-600 rounded"
                />
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.length > 0 ? (
              filteredTrades.map((trade) => (
                <TradeRow
                  key={trade.id}
                  trade={trade}
                  onDelete={handleDeleteTrade}
                  onSelect={handleRowSelect}
                  isSelected={selectedTradeIds.includes(trade.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-400">
                  No trades found. Add some to your journal!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-gray-400 text-sm">
        User ID: {userId}
      </div>
    </div>
  );
};

export default TradingJournal;
