import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import Modal from "../../common/Modal";
import ViewReceipt from "./ViewReceipt";
import { fetchReceipts, saveReceipt } from "../../../api/receipts";
import { toast } from "react-toastify";
import ReceiptFilter from "./ReceiptFilter";
import ReceiptTable from "./ReceiptTable";
import Pagination from "./Pagination";
import UploadModal from "../../common/UploadModal";
import ResultsTable from "../Receipt/ResultsTable"; // Import ResultsTable
import Button from "../../common/Button"; // Import Button
import LoadingSpinner from "../../common/LoadingSpinner"; // Import LoadingSpinner

const Receipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [subcategoryFilter, setSubcategoryFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedReceipts, setSelectedReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [analyzedData, setAnalyzedData] = useState(null); // State to store analyzed data
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const itemsPerPage = 10;
    const [showReceipt, setShowReceipt] = useState(false); 

    useEffect(() => {
        const getReceipts = async () => {
            try {
                const data = await fetchReceipts();
                setReceipts(data);
            } catch (error) {
                console.error("Error fetching receipts:", error);
                toast.error("Error fetching receipts");
            }
        };

        getReceipts();
    }, []);

    const handleFileChange = (analyzedData) => {
        // Handle the analyzed data here
        setAnalyzedData(analyzedData); // Set the analyzed data
    };

    const uniqueCategories = [
        ...new Set(
            receipts.flatMap((receipt) =>
                receipt.receiptData ? receipt.receiptData.map((data) => data.receiptCategory) : []
            )
        ),
    ];

    const filteredReceipts = receipts.filter(
        (receipt) =>
            receipt.receiptData &&
            receipt.receiptData.some(
                (data) =>
                    data.storeName && // Ensure storeName is not null
                    data.storeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (categoryFilter === "" || data.receiptCategory === categoryFilter) &&
                    (subcategoryFilter === "" || data.subcategory === subcategoryFilter)
            ) &&
            (!startDate ||
                new Date(receipt.createdAt.$date?.$numberLong || receipt.createdAt) >=
                    new Date(startDate)) &&
            (!endDate ||
                new Date(receipt.createdAt.$date?.$numberLong || receipt.createdAt) <=
                    new Date(endDate))
    );

    const handleCheckboxChange = (receipt) => {
        setSelectedReceipts((prevSelected) =>
            prevSelected.includes(receipt)
                ? prevSelected.filter((r) => r !== receipt)
                : [...prevSelected, receipt]
        );
    };

    const handleSelectAll = () => {
        if (selectedReceipts.length === filteredReceipts.length) {
            setSelectedReceipts([]);
        } else {
            setSelectedReceipts(filteredReceipts);
        }
    };

    const csvData = selectedReceipts.flatMap((receipt) =>
        receipt.receiptData ? receipt.receiptData.map((data) => ({
            storeName: data.storeName,
            receiptCategory: data.receiptCategory,
            subcategory: data.subcategory,
            total: data.total,
            createdAt: new Date(
                receipt.createdAt.$date?.$numberLong || receipt.createdAt
            ).toLocaleDateString(),
        })) : []
    );

    const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
    const paginatedReceipts = filteredReceipts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSave = (id, updatedReceipt) => {
        setReceipts((prevReceipts) =>
            prevReceipts.map((receipt) =>
                receipt._id === id
                    ? { ...receipt, receiptData: [updatedReceipt] }
                    : receipt
            )
        );
        setSelectedReceipt(null); // Close the modal after saving
    };

    const handleSaveReceipt = async () => {
        console.log("Analyzed data:", analyzedData);
        if (analyzedData) {
            setIsLoading(true);
            setProgress(0);

            try {
                const base64Images = analyzedData.images.map(image => {
                    const reader = new FileReader();
                    return new Promise((resolve, reject) => {
                        reader.onload = (event) => {
                            resolve(event.target.result.split(",")[1]);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(image);
                    });
                });

                const images = await Promise.all(base64Images);
                const teamId = localStorage.getItem("teamId");

                await saveReceipt(JSON.stringify(analyzedData), images, teamId);
                // Clear everything after saving
                setAnalyzedData(null);
                toast.success("Receipt saved successfully!");
                // Refresh the table data
                const data = await fetchReceipts();
                setReceipts(data);
            } catch (error) {
                toast.error("Error saving receipt.");
            } finally {
                setIsLoading(false);
                setProgress(100);
            }
        }
    };

    return (
      <>
        <h2 className="text-2xl font-medium">Receipt Management</h2>
        <p className="text-[#98A2B3] mb-6">
          Transform how you manage receitps track expenses, monitor key metrics
          and gain the
          <br></br> 
          insights you need to grow your business
        </p>
        <div className="pt-6 pb-6 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between pb-4 pr-6">
            <h2 className="text-2xl font-medium pl-6">Receipt uploaded</h2>
            <UploadModal handleFileChange={handleFileChange} />
          </div>
          {analyzedData && (
            <>
              <ResultsTable data={analyzedData} onUpdate={setAnalyzedData} />
              <Button
                className="mt-4 bg-gray-500"
                onClick={handleSaveReceipt}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Results"}
              </Button>
            </>
          )}
          <ReceiptFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            uniqueCategories={uniqueCategories}
          />
          <div className="mt-4">
            <CSVLink
              data={csvData}
              filename={"receipts.csv"}
              className="p-2 bg-blue-500 text-white rounded-lg hidden"
            >
              Export to CSV
            </CSVLink>
          </div>
          {console.log("Receipts:", selectedReceipt)}
          <ReceiptTable
            paginatedReceipts={paginatedReceipts}
            selectedReceipts={selectedReceipts}
            handleCheckboxChange={handleCheckboxChange}
            handleSelectAll={handleSelectAll}
            setSelectedReceipt={(receipt) => {
                setSelectedReceipt(receipt);
                setShowReceipt(true)}}
            filteredReceipts={filteredReceipts}
            handleSave={handleSave} // Pass the handleSave function
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
          <Modal isOpen={isLoading} onClose={() => {}}>
            <LoadingSpinner />
            <h2 className="text-center text-xl mt-4">
              We're processing your receipts
            </h2>
            <h4 className="text-center mt-4 text-gray-400">
              hang in there, we'll be done in a bit.
            </h4>
          </Modal>
        </div>
      </>
    );
};

export default Receipts;