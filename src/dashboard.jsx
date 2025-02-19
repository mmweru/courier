import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

const Dashboard = () => {
  // Mock Data
  const wasteData = {
    labels: ["Plastic", "Metal", "Glass", "Organic", "Others"],
    datasets: [
      {
        data: [300, 150, 100, 200, 50],
        backgroundColor: ["#F7D083", "#FFB84D", "#FFDA77", "#FFD24C", "#FFBF00"],
        hoverBackgroundColor: ["#F7D083", "#FFB84D", "#FFDA77", "#FFD24C", "#FFBF00"],
      },
    ],
  };

  const barData = {
    labels: ["Plastic", "Metal", "Glass", "Organic", "Others"],
    datasets: [
      {
        label: "Waste (kg)",
        data: [300, 150, 100, 200, 50],
        backgroundColor: "#FFD24C",
      },
    ],
  };

  const recentEntries = [
    { id: 1, type: "Plastic", quantity: "5kg", date: "2025-01-01" },
    { id: 2, type: "Metal", quantity: "2kg", date: "2025-01-02" },
    { id: 3, type: "Organic", quantity: "8kg", date: "2025-01-03" },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
        <h1 className="title">Waste Management Dashboard</h1>
        <p className="subtitle">Track and analyze your waste management progress.</p>
      </div>

      {/* Grid Layout */}
      <div className="grid">
        {/* Summary Cards */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="card-title">Total Waste</h2>
          <p className="card-value">800kg</p>
          <p className="card-description">Carbon footprint reduced: 1.2 tons</p>
        </motion.div>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <h2 className="card-title">Recycled Waste</h2>
          <p className="card-value">400kg</p>
          <p className="card-description">50% of total waste</p>
        </motion.div>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
          <h2 className="card-title">Organic Waste</h2>
          <p className="card-value">200kg</p>
          <p className="card-description">Composted: 80%</p>
        </motion.div>

        {/* Pie Chart */}
        <div className="chart-container pie-chart">
          <h2 className="chart-title">Waste Distribution</h2>
          <Pie data={wasteData} />
        </div>

        {/* Bar Chart */}
        <div className="chart-container bar-chart">
          <h2 className="chart-title">Recycling Progress</h2>
          <Bar data={barData} />
        </div>

        {/* Recent Entries */}
        <div className="recent-entries">
          <h2 className="section-title">Recent Entries</h2>
          <ul>
            {recentEntries.map((entry) => (
              <motion.li key={entry.id} className="entry" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <div>
                  <p className="entry-type">{entry.type}</p>
                  <p className="entry-date">{entry.date}</p>
                </div>
                <span className="entry-quantity">{entry.quantity}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Add New Entry Button */}
      <motion.button className="add-entry-button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        + Add New Entry
      </motion.button>
    </div>
  );
};

export default Dashboard;
