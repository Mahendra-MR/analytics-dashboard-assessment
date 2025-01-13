import React, { useState, useCallback, useRef, useEffect } from 'react';
import './EVDataTable.css';
import { getSummaryData } from './generateSummaryData';

const EVDataTable = ({ evData, loading, fetchMoreData, hasMore }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filterPopup, setFilterPopup] = useState({ visible: false, x: 0, y: 0, column: '' });
  const [searchText, setSearchText] = useState('');

  const observer = useRef();
  const headerRefs = useRef([]);
  const popupRef = useRef(null);

  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreData();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMoreData]
  );

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    setFilterPopup({ ...filterPopup, visible: false });
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      closePopup();
    }
  };

  const filteredAndSortedData = React.useMemo(() => {
    let filteredData = evData;
    if (searchText) {
      filteredData = evData.filter(row =>
        Object.values(row).some(value =>
          value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    if (sortConfig.key) {
      filteredData = filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [evData, sortConfig, searchText]);

  const showFilterPopup = (event, column, index) => {
    event.stopPropagation();
    const headerRect = headerRefs.current[index].getBoundingClientRect();
    const popupHeight = 450;

    if (filterPopup.visible && filterPopup.column === column) {
      closePopup();
    } else {
      setFilterPopup({
        visible: true,
        x: headerRect.right - 210,
        y: headerRect.top - popupHeight,
        column,
      });
    }
  };

  const closePopup = () => setFilterPopup({ ...filterPopup, visible: false });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const resetFilters = () => {
    setSortConfig({ key: null, direction: null });
    setSearchText('');
    setFilterPopup({ ...filterPopup, visible: false });
  };

  const applyFilters = () => {
    setFilterPopup({ ...filterPopup, visible: false });
  };

  const headers = [
    'VIN (1-10)', 'County', 'City', 'State', 'Postal Code',
    'Model Year', 'Make', 'Model', 'Electric Vehicle Type',
    'Clean Alternative Fuel Vehicle (CAFV) Eligibility'
  ];

  return (
    <div className="table-container">
      <table className="ev-data-table">
        <thead>
          {/* First Row: Column Headers */}
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                ref={(el) => (headerRefs.current[index] = el)}
                onClick={(e) => showFilterPopup(e, header, index)}
                className="sortable-column"
              >
                {header}
                <span className="sort-icon">
                  {sortConfig.key === header && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                </span>
              </th>
            ))}
          </tr>

          {/* Second Row: Summary Data */}
          <tr>
            {headers.map((header, index) => (
              <th key={`summary-${index}`} className="summary-row">
                {getSummaryData(evData, header)} 
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredAndSortedData.map((row, index) => {
            const isLastRow = index === filteredAndSortedData.length - 1;
            return (
              <tr ref={isLastRow ? lastRowRef : null} key={index}>
                {headers.map((header, idx) => <td key={idx}>{row[header]}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>

      {filterPopup.visible && (
        <div
          className="sort-popup"
          style={{ top: filterPopup.y + window.scrollY, left: filterPopup.x }}
          onClick={(e) => e.stopPropagation()}
          ref={popupRef}
        >
          <button onClick={() => handleSort(filterPopup.column, 'ascending')}>⬆ Sort Ascending</button>
          <button onClick={() => handleSort(filterPopup.column, 'descending')}>⬇ Sort Descending</button>

          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            className="search-input"
          />

          <div className="popup-buttons">
            <button className="reset-button" onClick={resetFilters}>Reset</button>
            <button className="apply-button" onClick={applyFilters}>Apply</button>
          </div>
        </div>
      )}

      {loading && <div className="loading">Loading more data...</div>}
      {!hasMore && !loading && <div className="loading">All data loaded</div>}
    </div>
  );
};

export default EVDataTable;
