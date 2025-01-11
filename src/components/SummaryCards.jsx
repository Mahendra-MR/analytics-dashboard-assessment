const SummaryCards = ({ totalVehicles, manufacturers }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <div className="bg-white p-4 shadow rounded text-center">
        <h2 className="text-xl font-bold">{totalVehicles}</h2>
        <p>Total EVs</p>
      </div>
      <div className="bg-white p-4 shadow rounded text-center">
        <h2 className="text-xl font-bold">{manufacturers}</h2>
        <p>Manufacturers</p>
      </div>
    </div>
  );
  
  export default SummaryCards;
  