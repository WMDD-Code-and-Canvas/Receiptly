import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { useReports } from "../../../common/ReportsContent";

ChartJS.register(ArcElement, Tooltip);

const GaugeChart = () => {
  const { reportsData, loading } = useReports(); // Use reportsData and loading from context
  const [runwayPercentage, setRunwayPercentage] = useState(0);

  useEffect(() => {
    if (!loading && reportsData.length > 0) {
      try {
        // Sort by creation date descending, so the latest is first
        const sortedReports = reportsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const latestReport = sortedReports[0];

        // Retrieve finalCashBalance and netBurn from the latest report
        const finalCash = latestReport?.cashFlow?.finalCashBalance ?? 0;
        const netBurn = latestReport?.netBurn ?? 0; 
        // netBurn < 0 implies a cash burn rate

        let runwayMonths = 0;
        if (netBurn < 0) {
          // Compute runway in months (how long until cash runs out)
          runwayMonths = finalCash / Math.abs(netBurn);
        } else {
          // If there's no burn, consider runway infinite
          runwayMonths = Infinity;
        }

        // Map runwayMonths to a percentage gauge with a max of 12 months.
        let gaugeValue;
        if (!Number.isFinite(runwayMonths)) {
          gaugeValue = 100; // Infinite runway fills the gauge
        } else {
          gaugeValue = (runwayMonths / 12) * 100;
          if (gaugeValue < 0) gaugeValue = 0;
          if (gaugeValue > 100) gaugeValue = 100;
        }
        setRunwayPercentage(Math.round(gaugeValue));
      } catch (error) {
        console.error("Error processing runway data:", error);
      }
    }
  }, [loading, reportsData]);

  // Prepare the gauge data for the Doughnut chart.
  const data = {
    datasets: [
      {
        data: [runwayPercentage, 100 - runwayPercentage],
        backgroundColor: ["#161D7C", "#E8EAF6"],
        borderWidth: 0,
        borderRadius: 30,
        cutout: "85%", 
        rotation: -90, 
        circumference: 180, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { enabled: false },
    },
  };

  if (loading) return <p className="text-center">Loading gauge...</p>;

  return (
    <div className="w-full flex justify-center">
      <div className="relative flex flex-col items-center w-64 h-40">
        <div className="relative w-full h-full top-5">
          <Doughnut data={data} options={options} />
        </div>
        {/* Now display the runway gauge percentage at the center */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-gray-900">
          {runwayPercentage}%
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;