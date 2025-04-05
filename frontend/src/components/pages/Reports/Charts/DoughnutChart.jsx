import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useReports } from "../../../common/ReportsContent";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const { reportsData, loading } = useReports(); // Use reportsData and loading from context
  const [rangeData, setRangeData] = useState([0, 0, 0, 0, 0]);

  // Labels for the chart
  const labels = ["81–100", "61–80", "41–60", "21–40", "0–20"];

  useEffect(() => {
    if (!loading && reportsData.length > 0) {
     
      // Set dummy values when loading or no reportsData
      const dummyRangeData = [5, 10, 15, 20, 25]; // Dummy values for each range
      setRangeData(dummyRangeData);
    }
  }, [loading, reportsData]);

  // Build the chart data
  const data = {
    labels,
    datasets: [
      {
        data: rangeData,
        backgroundColor: [
          "#6466F1",
          "#C0C3F8",
          "#060636",
          "#121456",
          "#D4D6FA",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Chart options
  const options = {
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        align: "center",
        labels: {
          color: "#4A4A4A",
          font: {
            size: 14,
          },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
    },
    layout: {
      padding: {
        right: 32,
      },
    },
  };

  if (loading) return <p className="text-center">Loading chart...</p>;

  return (
    <div className="flex justify-center items-center w-full">
      <div className="relative w-80 h-60 flex justify-center items-center">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default DoughnutChart;