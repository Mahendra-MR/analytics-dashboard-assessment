import React, { useCallback, useRef } from 'react';
import './EVDataTable.css';

const EVDataTable = ({ evData, loading, fetchMoreData, hasMore }) => {
  const observer = useRef();

  // Infinite Scroll Observer for the last row
  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreData();  // Load more data when the last row is visible
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMoreData]
  );

  return (
    <div className="table-container">
      <table className="ev-data-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>VIN (1-10)</th>
            <th>County</th>
            <th>City</th>
            <th>State</th>
            <th>Postal Code</th>
            <th>Model Year</th>
            <th>Make</th>
            <th>Model</th>
            <th>Electric Vehicle Type</th>
            <th>CAFV Eligibility</th>
            <th>Electric Range</th>
            <th>Base MSRP</th>
            <th>Legislative District</th>
            <th>DOL Vehicle ID</th>
            <th>Vehicle Location</th>
            <th>Electric Utility</th>
            <th>2020 Census Tract</th>
          </tr>
        </thead>

        <tbody>
          {evData.map((row, index) => {
            if (index === evData.length - 1) {
              return (
                <tr ref={lastRowRef} key={index}>
                  <td>{index + 1}</td>
                  <td>{row['VIN (1-10)']}</td>
                  <td>{row['County']}</td>
                  <td>{row['City']}</td>
                  <td>{row['State']}</td>
                  <td>{row['Postal Code']}</td>
                  <td>{row['Model Year']}</td>
                  <td>{row['Make']}</td>
                  <td>{row['Model']}</td>
                  <td>{row['Electric Vehicle Type']}</td>
                  <td>{row['Clean Alternative Fuel Vehicle (CAFV) Eligibility']}</td>
                  <td>{row['Electric Range']}</td>
                  <td>{row['Base MSRP']}</td>
                  <td>{row['Legislative District']}</td>
                  <td>{row['DOL Vehicle ID']}</td>
                  <td>{row['Vehicle Location']}</td>
                  <td>{row['Electric Utility']}</td>
                  <td>{row['2020 Census Tract']}</td>
                </tr>
              );
            } else {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row['VIN (1-10)']}</td>
                  <td>{row['County']}</td>
                  <td>{row['City']}</td>
                  <td>{row['State']}</td>
                  <td>{row['Postal Code']}</td>
                  <td>{row['Model Year']}</td>
                  <td>{row['Make']}</td>
                  <td>{row['Model']}</td>
                  <td>{row['Electric Vehicle Type']}</td>
                  <td>{row['Clean Alternative Fuel Vehicle (CAFV) Eligibility']}</td>
                  <td>{row['Electric Range']}</td>
                  <td>{row['Base MSRP']}</td>
                  <td>{row['Legislative District']}</td>
                  <td>{row['DOL Vehicle ID']}</td>
                  <td>{row['Vehicle Location']}</td>
                  <td>{row['Electric Utility']}</td>
                  <td>{row['2020 Census Tract']}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>

      {/* Loading Indicator */}
      {loading && <div className="loading">Loading more data...</div>}
      {!hasMore && !loading && <div className="loading">All data loaded</div>}
    </div>
  );
};

export default EVDataTable;
