import { useEffect, useState, useCallback } from 'react';
import { loadCSVData } from './components/dataProcessor';
import Header from './components/Header';
import EVDataTable from './components/EVDataTable';

function App() {
  const [evData, setEvData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [visibleData, setVisibleData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const BATCH_SIZE = 150; // Load 150 rows per batch

  // Load and process CSV data on mount
  useEffect(() => {
    loadCSVData()
      .then((data) => {
        console.log('Loaded EV Data:', data);
        setEvData(data);
        setVisibleData(data.slice(0, BATCH_SIZE)); 
        setLoading(false);
        setHasMore(data.length > BATCH_SIZE); 
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  // Load more data in chunks
  const fetchMoreData = useCallback(() => {
    if (scrollLoading || !hasMore) return;

    setScrollLoading(true);
    setTimeout(() => {
      const nextBatch = evData.slice(visibleData.length, visibleData.length + BATCH_SIZE);

      setVisibleData((prevData) => [...prevData, ...nextBatch]);
      setScrollLoading(false);

      if (visibleData.length + BATCH_SIZE >= evData.length) {
        setHasMore(false); // No more data to load
      }
    }, 500); // Reduced delay for smoother UX
  }, [scrollLoading, hasMore, evData, visibleData]);


  const handleScroll = useCallback((event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchMoreData(); 
    }
  }, [fetchMoreData]);

  // Show loading state during initial data load
  if (loading && visibleData.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div
        className="p-4 overflow-y-auto"
        style={{ maxHeight: '80vh' }}
        onScroll={handleScroll}
      >
        <EVDataTable
          evData={visibleData}
          loading={scrollLoading}
          fetchMoreData={fetchMoreData}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}

export default App;
