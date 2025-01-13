import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const getSummaryData = (evData, header) => {
  if (!evData || evData.length === 0) return 'N/A';

  const columnData = evData.map(item => item[header]);

  // For VIN column, show only unique count
  if (header === 'VIN (1-10)') {
    const uniqueVINs = new Set(columnData);
    return (
      <div className="summary-data">
        Unique VINs: {uniqueVINs.size}
      </div>
    );
  }

  // Count occurrences of each value
  const valueCounts = {};
  columnData.forEach(value => {
    valueCounts[value] = (valueCounts[value] || 0) + 1;
  });

  const totalCount = columnData.length;

  // For Postal Code and Model Year, show bar graph
  if (header === 'Postal Code' || header === 'Model Year') {
    const labels = Object.keys(valueCounts);
    const data = labels.map(label => valueCounts[label]);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: header,
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw} (${((context.raw / totalCount) * 100).toFixed(1)}%)`;
            },
          },
        },
      },
      scales: {
        x: {
          display: false, // Hide x-axis labels
        },
        y: {
          display: false, // Hide y-axis labels
        },
      },
    };

    return (
      <div className="summary-data" style={{ height: '100px', width: '100%' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    );
  }

  // Get top 2 most frequent values for other columns
  const sortedValues = Object.entries(valueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const top2 = sortedValues.map(([value, count]) => {
    const percentage = ((count / totalCount) * 100).toFixed(1);
    return { value, percentage, count };
  });

  const top2Count = top2.reduce((acc, item) => acc + item.count, 0);
  const othersCount = totalCount - top2Count;
  const othersPercentage = ((othersCount / totalCount) * 100).toFixed(1);

  if (othersCount > 0) {
    top2.push({
      value: 'Others',
      percentage: othersPercentage,
      count: othersCount,
    });
  }

  return (
    <div className="summary-data">
      {top2.map((item, index) => (
        <div
          key={index}
          className="summary-item"
          title={`${item.value}: ${item.percentage}%`}
        >
          {item.value} ({item.percentage}%)
        </div>
      ))}
    </div>
  );
};
