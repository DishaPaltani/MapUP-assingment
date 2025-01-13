import './App.css';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [vehicles, setVehicles] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Electric Range of Vehicles (miles)',
        data: [],
        borderColor: 'rgb(240, 0, 180)',
        fill: false,
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/db.json')
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setVehicles(data.vehicles);

        const modelYears = [];
        const electricRange = [];

        data.vehicles.forEach((vehicle) => {
          if (vehicle.batteryRange && vehicle.batteryRange > 0) {
            modelYears.push(vehicle.modelYear);
            electricRange.push(vehicle.batteryRange);
          }
        });

        setChartData((prevData) => ({
          ...prevData,
          labels: modelYears,
          datasets: [
            {
              ...prevData.datasets[0],
              data: electricRange,
            },
          ],
        }));
      })
      .catch((error) => {
        console.error('Error fetching the JSON:', error);
        setIsLoading(false); // Stop loading state if there's an error
      });
  }, []);

  return (
    <div className="App">
      <h1 className="dashboard-title">Electric Vehicle Dashboard</h1>
      <div className="dashboard-container">
        {/* Chart */}
        <div className="chart-container">
          {isLoading ? (
            <div className="loading-spinner">Loading...</div> // You can replace with a spinner component
          ) : (
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          )}
        </div>

        {/* Vehicle Information Table */}
        <div className="vehicle-table-container">
          <h2>Vehicle Information</h2>
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>VIN</th>
                <th>County</th>
                <th>City</th>
                <th>State</th>
                <th>Postal Code</th>
                <th>Model Year</th>
                <th>Make</th>
                <th>Model</th>
                <th>Electric Vehicle Type</th>
                <th>Cafv Eligibility</th>
                <th>Electric Range</th>
                <th>Base MSRP</th>
                <th>Legislative District</th>
                <th>DOL Vehicle ID</th>
                <th>Vehicle Location</th>
                <th>Electric Utility</th>
                <th>Census Tract</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length > 0 ? (
                vehicles.map((vehicle, index) => (
                  <tr key={index}>
                    <td>{vehicle.make}</td>
                    <td>{vehicle.vin}</td>
                    <td>{vehicle.county}</td>
                    <td>{vehicle.city}</td>
                    <td>{vehicle.state}</td>
                    <td>{vehicle.postalCode}</td>
                    <td>{vehicle.modelYear}</td>
                    <td>{vehicle.make}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.electricVehicleType}</td>
                    <td>{vehicle.cafvEligibility}</td>
                    <td>{vehicle.electricRange}</td>
                    <td>{vehicle.baseMsrp}</td>
                    <td>{vehicle.legislativeDistrict}</td>
                    <td>{vehicle.dolVehicleId}</td>
                    <td>{vehicle.vehicleLocation}</td>
                    <td>{vehicle.electricUtility.join(", ")}</td> {/* Joining array of utilities with commas */}
                    <td>{vehicle.censusTract}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No vehicles available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
