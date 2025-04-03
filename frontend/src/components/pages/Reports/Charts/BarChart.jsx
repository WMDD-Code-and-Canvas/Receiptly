import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useReports } from "../../../common/ReportsContent";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const { reportsData, loading } = useReports(); // Use reportsData and loading from context
  const [labels, setLabels] = useState([]);
  const [growthRateData, setGrowthRateData] = useState([]);

  useEffect(() => {
    if (!loading && reportsData.length > 0) {
      try {
        // Group revenue by month
        const revenueByMonth = {};

        reportsData.forEach((report) => {
          const month = dayjs(report.createdAt).format("MMM");
          if (revenueByMonth[month]) {
            revenueByMonth[month] += report.revenue;
          } else {
            revenueByMonth[month] = report.revenue;
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
        // Filter and sort months with data
        const sortedMonths = monthOrder.filter(
          (month) => revenueByMonth[month] !== undefined
        );

        // Aggregate revenues for sorted months
        const aggregatedRevenues = sortedMonths.map(
          (month) => revenueByMonth[month]
        );

        // Calculate growth rates
        const growthRates = aggregatedRevenues.map((current, index, arr) => {
          if (index === 0) return 0; // No growth rate for the first month
          const previous = arr[index - 1];
          return previous ? ((current - previous) / previous) * 100 : 0;
        });

        setLabels(sortedMonths);
        setGrowthRateData(growthRates);
      } catch (error) {
        console.error("Error processing report data:", error);
      }
    }
  }, [loading, reportsData]);

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue Growth Rate (%)",
        data: growthRateData,
        backgroundColor: "#6F77F8",
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.5,
        categoryPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          display: false,
          beginAtZero: true,
        },
        grid: {
          drawBorder: false,
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        ticks: {
          color: "#6B7280",
        },
        grid: {
          drawBorder: false,
          drawOnChartArea: false,
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
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
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;