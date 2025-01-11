import { useEffect, useState, useCallback } from 'react';
import { loadCSVData } from './components/dataProcessor';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import EVTypeChart from './components/Charts/EVTypeChart';
import EVDataTable from './components/EVDataTable';

function App() {
  const [evData, setEvData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [summary, setSummary] = useState({ total: 0, manufacturers: 0 });
  const [loading, setLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [visibleData, setVisibleData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const BATCH_SIZE = 100; // Load 100 rows per batch

  // Load and process CSV data on mount
  useEffect(() => {
    loadCSVData()
      .then((data) => {
        console.log('Loaded EV Data:', data);
        setEvData(data);
        setVisibleData(data.slice(0, BATCH_SIZE)); // Initially load first 100 rows
        processEVData(data);
        setLoading(false);
        setHasMore(data.length > BATCH_SIZE); // Check if more data exists
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  // Process data for summary and charts
  const processEVData = (data) => {
    const typeCount = {};
    const manufacturersSet = new Set();

    data.forEach((item) => {
      const type = item['Electric Vehicle Type'];
      typeCount[type] = (typeCount[type] || 0) + 1;
      manufacturersSet.add(item.Make);
    });

    const chartData = Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
    }));

    setTypeData(chartData);
    setSummary({ total: data.length, manufacturers: manufacturersSet.size });
  };

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

  // Throttle scroll event to prevent spamming fetchMoreData
  const handleScroll = useCallback((event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchMoreData(); // Fetch more when near the bottom
    }
  }, [fetchMoreData]);

  // Show loading state during initial data load
  if (loading && visibleData.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <SummaryCards totalVehicles={summary.total} manufacturers={summary.manufacturers} />
      <div className="flex justify-center p-4">
        <EVTypeChart data={typeData} />
      </div>

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
