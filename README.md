# MapUp Analytics Dashboard Frontend Assessment

## Electric Vehicle Population Dashboard.

### Overview

This project is an Electric Vehicle Population Dashboard that visualizes and analyzes a dataset of electric vehicle population in the United States. It provides insights into various attributes of electric vehicles, such as VIN, model year, county, city, and eligibility for clean alternative fuel vehicle (CAFV) programs. The project uses React, Chart.js, and PapaParse for data processing and visualization.

### Features

- **CSV Data Parsing**: The data is fetched and parsed from a CSV file using PapaParse.
- **Data Table**: A table is used to display vehicle data with sorting and filtering capabilities.
- **Responsive Layout**: The dashboard is responsive and works well on different screen sizes.
- **Search Functionality**: A search bar allows users to filter the data by keywords.
- **Infinite Scroll**: More data is loaded as the user scrolls down the table.

### Requirements

Before running the project, ensure you have the following installed:

- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js)

### Getting Started

1. Clone this repository to your local machine:
    ```bash
    git clone https://github.com/Mahendra-MR/analytics-dashboard-assessment.git
    ```

2. Navigate to the project directory:
    ```bash
    cd analytics-dashboard-assessment
    ```

3. Install the project dependencies:
    ```bash
    npm install
    ```

### Usage

1. After installation, start the development server:
    ```bash
    npm run dev
    ```

2. Open `http://localhost:5173` in your browser to view the Electric Vehicle Population Data Dashboard.

### Project Details

This dashboard reads the dataset from the `Electric_Vehicle_Population_Data.csv` file. The focus is on providing an easy-to-understand comparison of the data.


#### Functionalities

- **Data Import**: The dashboard loads data from the provided CSV file and processes it for visualization.
- **Bar Graph Rendering**: Bar graphs are dynamically created using the data to show vehicle population by various parameters.


### Data Rendering

The Electric Vehicle Population Data is dynamically loaded and rendered in the dashboard. Initially, a small portion of the dataset is displayed, and as the user interacts with the page (e.g., by scrolling), more data is progressively rendered. This technique, often referred to as lazy loading or infinite scrolling, helps improve performance by minimizing the initial load time and reducing memory consumption.

#### How it Works:

- **Initial Data Load**: When the application starts, only a few lines of data are rendered, ensuring a quick initial load.
- **Progressive Rendering**: As the user scrolls or interacts with the page, additional data is fetched and rendered incrementally. This creates a smooth experience without overwhelming the user or the browser.
- **Efficient Data Handling**: This approach reduces the strain on the browser and allows the dashboard to handle large datasets without performance degradation.

This progressive rendering approach ensures that the dashboard remains responsive even with large volumes of data.

### Technologies Used

- **React**: JavaScript library for building user interfaces.
- **CSV Parser**: To parse and import the dataset into the app.


### Project Assessment Overview

This project serves as an assessment for the MapUp Analytics Dashboard Frontend, showcasing the ability to visualize and interact with large datasets. It demonstrates skills in data parsing, dynamic rendering, and creating responsive, user-friendly dashboards