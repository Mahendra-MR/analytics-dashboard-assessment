import React, { useState, useCallback, useRef, useEffect } from 'react';
import './EVDataTable.css';

const EVDataTable = ({ evData, loading, fetchMoreData, hasMore }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filterPopup, setFilterPopup] = useState({ visible: false, x: 0, y: 0, column: '' });
  const [searchText, setSearchText] = useState(''); // State to store search input

  const observer = useRef();
  const headerRefs = useRef([]);
  const popupRef = useRef(null);  // To refer to the popup itself

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
    setSearchText(event.target.value); // Update search text
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Close the popup when Enter is pressed
      closePopup();
    }
  };

  // Filter and sort data based on search and sort configuration
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
    const popupHeight = 450;  // Set an estimated height for the popup
  
    setFilterPopup({
      visible: true, // Ensure the popup is visible whenever clicked
      x: headerRect.right - 210,  // Adjust the horizontal position if needed
      y: headerRect.top - popupHeight,  // Position the popup above the header
      column,
    });
  };

  const closePopup = () => setFilterPopup({ ...filterPopup, visible: false });

  // Add event listener to close the popup if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Reset sorting and filtering
  const resetFilters = () => {
    setSortConfig({ key: null, direction: null });
    setSearchText('');
    setFilterPopup({ ...filterPopup, visible: false });
  };

  // Apply filters (search)
  const applyFilters = () => {
    setFilterPopup({ ...filterPopup, visible: false });
  };

  const headers = [
    'VIN (1-10)',
    'County',
    'City',
    'State',
    'Postal Code',
    'Model Year',
    'Make',
    'Model',
    'Electric Vehicle Type',
    'Clean Alternative Fuel Vehicle (CAFV) Eligibility'
  ];

  return (
    <div className="table-container">
      <table className="ev-data-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                ref={(el) => (headerRefs.current[index] = el)}
                onClick={(e) => {
                  // Ensure popup is visible when a column is clicked
                  setFilterPopup({ ...filterPopup, visible: true }); // Force popup to show
                  showFilterPopup(e, header, index);
                }}
                className="sortable-column"
              >
                {header}
                <span className="sort-icon">
                  {sortConfig.key === header && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.map((row, index) => {
            if (index === filteredAndSortedData.length - 1) {
              return (
                <tr ref={lastRowRef} key={index}>
                  {headers.map((header, idx) => (
                    <td key={idx}>{row[header]}</td>
                  ))}
                </tr>
              );
            } else {
              return (
                <tr key={index}>
                  {headers.map((header, idx) => (
                    <td key={idx}>{row[header]}</td>
                  ))}
                </tr>
              );
            }
          })}
        </tbody>
      </table>

      {filterPopup.visible && (
        <div
          className="sort-popup"
          style={{
            top: filterPopup.y + window.scrollY, // Adding scrollY to adjust popup positioning
            left: filterPopup.x,
          }}
          onClick={(e) => e.stopPropagation()}  // Prevent the popup from closing if clicked inside
          ref={popupRef}  // Set reference to the popup
        >
          <button onClick={() => handleSort(filterPopup.column, 'ascending')}>⬆ Sort Ascending</button>
          <button onClick={() => handleSort(filterPopup.column, 'descending')}>⬇ Sort Descending</button>

          {/* Search bar added below the sort buttons */}
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}  // Add onKeyDown event handler to listen for Enter key
            className="search-input"
          />

          {/* Reset and Apply buttons */}
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
