import React, { useState, useEffect, useCallback } from 'react';
import { Stock } from '../types/Stock';
import WatchlistRow from './WatchlistRow';
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
import AddStockModal from './AddStockModal';
import ShareModal from './ShareModal';
import TagFilter from './TagFilter';
import { debounce } from 'lodash';
import { formatCurrency } from '../utils/formatters';

// Declare Firebase and Auth globals
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

const Watchlist: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [db, setDb] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStockIds, setSelectedStockIds] = useState<string[]>([]);
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

  // Fetch stocks from Firestore
  useEffect(() => {
    if (!db || !userId || !isAuthReady) {
      return;
    }

    setLoading(true);
    setError(null);

    const stocksCollectionRef = collection(
      db,
      `artifacts/${__app_id}/users/${userId}/watchlist`
    );
    const q = query(stocksCollectionRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedStocks: Stock[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Stock[];
        setStocks(fetchedStocks);
        setLoading(false);
      },
      (e) => {
        console.error('Error fetching stocks:', e);
        setError(`Failed to load stocks: ${e.message}`);
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

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch = stock.symbol
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      stock.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => stock.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = Array.from(new Set(stocks.flatMap((stock) => stock.tags || [])));

  const handleDeleteStock = async (id: string) => {
    if (!db || !userId) return;
    try {
      await deleteDoc(doc(db, `artifacts/${__app_id}/users/${userId}/watchlist`, id));
      setSelectedStockIds(prev => prev.filter(stockId => stockId !== id)); // Deselect if deleted individually
    } catch (e: any) {
      console.error('Error deleting stock:', e);
      setError(`Failed to delete stock: ${e.message}`);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStockIds(filteredStocks.map(stock => stock.id));
    } else {
      setSelectedStockIds([]);
    }
  };

  const handleRowSelect = (id: string, isSelected: boolean) => {
    setSelectedStockIds(prev =>
      isSelected ? [...prev, id] : prev.filter(stockId => stockId !== id)
    );
  };

  const handleMassDelete = async () => {
    if (!db || !userId || selectedStockIds.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedStockIds.length} selected stocks?`)) {
      try {
        const batch = writeBatch(db);
        selectedStockIds.forEach(id => {
          const docRef = doc(db, `artifacts/${__app_id}/users/${userId}/watchlist`, id);
          batch.delete(docRef);
        });
        await batch.commit();
        setSelectedStockIds([]); // Clear selection after deletion
      } catch (e: any) {
        console.error('Error mass deleting stocks:', e);
        setError(`Failed to mass delete stocks: ${e.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-700">Loading Watchlist...</div>
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
      <h2 className="text-3xl font-bold mb-6 text-purple-400">My Watchlist</h2>

      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search stocks..."
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex-grow max-w-xs"
          onChange={handleSearchChange}
        />
        <TagFilter allTags={allTags} selectedTags={selectedTags} onTagChange={handleTagChange} />
        <div className="flex gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add Stock
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Share Watchlist
          </button>
          {selectedStockIds.length > 0 && (
            <button
              onClick={handleMassDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Delete Selected ({selectedStockIds.length})
            </button>
          )}
        </div>
      </div>

      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        db={db}
        userId={userId}
        appId={__app_id}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userId={userId}
        appId={__app_id}
        db={db}
      />

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-lg">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedStockIds.length === filteredStocks.length && filteredStocks.length > 0}
                  className="form-checkbox h-4 w-4 text-purple-600 rounded"
                />
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Daily Change
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Daily Change %
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
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <WatchlistRow
                  key={stock.id}
                  stock={stock}
                  onDelete={handleDeleteStock}
                  onSelect={handleRowSelect}
                  isSelected={selectedStockIds.includes(stock.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-400">
                  No stocks found. Add some to your watchlist!
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

export default Watchlist;

// Helper function to initialize Firebase app (moved outside component for clarity)
const initializeApp = (config: any) => {
  // Check if Firebase app is already initialized to prevent re-initialization errors
  if (firebase.apps.length === 0) {
    return firebase.initializeApp(config);
  } else {
    return firebase.app();
  }
};
