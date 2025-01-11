import Papa from 'papaparse';

// Fetch the CSV file from the public folder
export const loadCSVData = () => {
  return new Promise((resolve, reject) => {
    // Fetch CSV from the public folder
    fetch('/data-to-visualize/Electric_Vehicle_Population_Data.csv')
      .then((response) => response.text())
      .then((csvData) => {
        // Parse the CSV data using PapaParse
        Papa.parse(csvData, {
          header: true, // Parse the CSV with headers
          skipEmptyLines: true, // Skip empty lines
          dynamicTyping: true,  // Automatically convert strings to appropriate types (e.g., numbers)
          complete: (result) => {
            console.log('Parsed CSV Result:', result);
            resolve(result.data); // Return the parsed data
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            reject(error);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching CSV:', error);
        reject(error);
      });
  });
};
