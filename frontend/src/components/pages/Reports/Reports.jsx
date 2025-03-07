import { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import Menu from "./Menu";
import FinancialMetrics from "./FinancialMetrics";
import jsPDF from "jspdf";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Reports = () => {
  const [selectedCategory, setSelectedCategory] = useState("Financial");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [chartData, setChartData] = useState({
    labels: ["Revenue", "Expenses", "Cash Inflows", "Cash Outflows"],
    datasets: [
      {
        label: "Financial Summary",
        data: [0, 0, 0, 0],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3", "#ff9800"],
        borderColor: ["#388e3c", "#d32f2f", "#1976d2", "#f57c00"],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.start || !dateRange.end) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/receipts/reports`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate: dateRange.start, endDate: dateRange.end },
        });

        const data = response.data || {};

        setChartData({
          labels: ["Revenue", "Expenses", "Cash Inflows", "Cash Outflows"],
          datasets: [
            {
              label: "Financial Summary",
              data: [
                data.revenue || 0,
                data.expenses || 0,
                data.cashFlow?.cashInflows || 0,
                data.cashFlow?.cashOutflows || 0,
              ],
              backgroundColor: ["#4caf50", "#f44336", "#2196f3", "#ff9800"],
              borderColor: ["#388e3c", "#d32f2f", "#1976d2", "#f57c00"],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, [dateRange]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Report", 10, 10);
    doc.save("report.pdf");
  };

  const handleAddMore = () => {
    console.log("Add more charts functionality pending...");
  };

  return (
    <div className="bg-white">
      <h2 className="text-lg font-medium mb-1">Reports & Insights</h2>
      <p className="text-xs/4 font-light text-gray-500 mb-6">Track key metrics and gain insights to make smarter<br />financial decisions.</p>
      {/* Menu Navigation */}
      <Menu selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      {/* Financial Metrics with Date Range */}
      {selectedCategory === "Financial" && <FinancialMetrics onDateChange={setDateRange} />}

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg mb-2">Bar Chart</h3>
          <Bar data={chartData} />
        </div>
        <div>
          <h3 className="text-lg mb-2">Line Chart</h3>
          <Line data={chartData} />
        </div>
        <div>
          <h3 className="text-lg mb-2">Pie Chart</h3>
          <Pie data={chartData} />
        </div>
        <div>
          <h3 className="text-lg mb-2">Doughnut Chart</h3>
          <Doughnut data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
