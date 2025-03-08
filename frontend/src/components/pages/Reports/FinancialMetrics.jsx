import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { FiDownloadCloud, FiCalendar } from "react-icons/fi";
import jsPDF from "jspdf";

const FinancialMetrics = ({ onDateChange }) => {
	const [dateRange, setDateRange] = useState([null, null]);
	const [startDate, endDate] = dateRange;

	const handleChange = (update) => {
		setDateRange(update);
		if (update[0] && update[1]) {
			onDateChange({
				start: format(update[0], "yyyy-MM-dd"),
				end: format(update[1], "yyyy-MM-dd"),
			});
		}
	};

	const handleExportReport = () => {
		const doc = new jsPDF();
		doc.text("Financial Report", 20, 20);
		doc.text(
			`Date Range: ${startDate ? format(startDate, "MMM d, yyyy") : "N/A"} - ${
				endDate ? format(endDate, "MMM d, yyyy") : "N/A"
			}`,
			20,
			30
		);
		doc.save("financial_report.pdf");
	};

	const handleAddMore = () => {
		console.log("Add More Clicked! Implement functionality here.");
	};

	return (
		<div className='mb-4 bg-white rounded'>
			<h3 className='text-md font-medium'>Financial Metrics</h3>
			<p className='text-xs/4 font-light text-gray-500 mb-4 mt-1'>
				Track your startup's financial health with real-time insights on cash
				flow, <br />
				profitability, and growth.
			</p>

			{/* Date Range Picker */}
			<div className='mt-4 flex items-center space-x-4'>
				<div className='relative inline-flex items-center border border-gray-300 px-3 py-1 rounded-lg cursor-pointer bg-white'>
					<FiCalendar className='w-4 h-4 text-gray-500 mr-2' />
					<DatePicker
						selected={startDate}
						onChange={handleChange}
						startDate={startDate}
						endDate={endDate}
						selectsRange
						dateFormat='MMM d, yyyy'
						placeholderText='Select Date Range'
						className='outline-none text-xs w-40 text-gray-500'
					/>
				</div>

				{/* Buttons */}
				<div>
					<button
						onClick={handleExportReport}
						className='px-3 py-2 bg-white text-xs text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-300 transition'
					>
						<div className="flex">
							<FiDownloadCloud />
							<p className="pl-2">Export Report</p>
						</div>
					</button>

					<button
						onClick={handleAddMore}
						className='px-3 py-2 bg-blue-600 text-xs text-white rounded-lg shadow hover:bg-blue-700 transition'
					>
						+ Add More
					</button>
				</div>
			</div>
		</div>
	);
};

export default FinancialMetrics;
