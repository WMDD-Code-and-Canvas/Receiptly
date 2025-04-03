import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import dayjs from "dayjs";
import { useReports } from "../../../common/ReportsContent";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = () => {
  const [labels, setLabels] = useState([]);
  const [burnRateData, setBurnRateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { reportsData } = useReports(); // Use reportsData from context

  useEffect(() => {
    if (reportsData && reportsData.length > 0) {
      try {
        // Group reports by month (using the month abbreviation) and aggregate grossBurn
        const monthData = {}; // e.g., { Jan: 100, Feb: 150, ... }
        reportsData.forEach((report) => {
          const month = dayjs(report.createdAt).format("MMM");
          if (monthData[month]) {
            monthData[month] += report.grossBurn;
          } else {
            monthData[month] = report.grossBurn;
          }
        });

        // Define the desired month order
        const monthOrder = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        // Filter out only those months that have data
        const sortedMonths = monthOrder.filter((month) => month in monthData);

        // Prepare chart arrays
        const labels = sortedMonths;
        const burnRateData = sortedMonths.map((month) => monthData[month]);

        setLabels(labels);
        setBurnRateData(burnRateData);
      } catch (error) {
        console.error("Error processing report data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [reportsData]);

  const data = {
    labels,
    datasets: [
      {
        label: "Gross Burn",
        data: burnRateData,
        borderColor: "#8a42f5",
        borderWidth: 2,
        pointRadius: 0,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(138, 66, 245, 0.2)");
          gradient.addColorStop(1, "rgba(138, 66, 245, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { display: false },
        grid: {
          drawBorder: false,
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        grid: {
          drawBorder: false,
          drawOnChartArea: false,
          display: false,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0,0,0,0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  };

  if (loading) return <p className="text-center">Loading chart...</p>;

  return (
    <div className="flex justify-center items-center">
      <div className="h-64 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;