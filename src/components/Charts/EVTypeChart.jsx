import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const EVTypeChart = ({ data }) => {
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <PieChart width={400} height={300}>
      <Pie data={data} dataKey="count" nameKey="type" outerRadius={100} label>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default EVTypeChart;
