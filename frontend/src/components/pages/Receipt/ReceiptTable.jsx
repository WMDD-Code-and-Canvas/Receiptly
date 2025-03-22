import React, {useState} from "react";
import { FiMoreVertical } from "react-icons/fi";
import ViewReceipt from "./ViewReceipt"; 

const ReceiptTable = ({
    paginatedReceipts,
    selectedReceipts,
    handleCheckboxChange,
    handleSelectAll,
    setSelectedReceipt,
    filteredReceipts,
}) => { 
  const [expandedReceipt, setExpandedReceipt] = useState(null);

  const toggleReceiptView = (receipt, dataIndex) => {
    if (expandedReceipt && expandedReceipt.receipt === receipt && expandedReceipt.dataIndex === dataIndex) {
      setExpandedReceipt(null);
    } else {
      setExpandedReceipt({ receipt, dataIndex });
    }
  };
    return (
      <table className="mt-6 w-full">
        <thead>
          <tr className="bg-[#F9FAFB]">
            <th className="border-y h-15 border-[#EAECF0]">
              <input
                type="checkbox"
                className="w-4 h-4 focus:ring-gray-200 mr-7"
                style={{ borderColor: "#D0D5DD" }}
                checked={selectedReceipts.length === filteredReceipts.length}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-2 border-y text-gray-500 font-light text-left border-[#EAECF0]">
              Store Name
            </th>
            <th className="p-2 border-y text-gray-500 font-light border-[#EAECF0]">
              Category
            </th>
            <th className="border-y text-gray-500 font-light border-[#EAECF0]">
              Total
            </th>
            <th className="border-y text-gray-500 font-light border-[#EAECF0]">
              Created At
            </th>
            <th className="border-y text-gray-500 font-light border-[#EAECF0]"></th>
          </tr>
        </thead>
        <tbody>
        {paginatedReceipts.map((receipt, index) =>
          receipt.receiptData.map((data, dataIndex) => (
            <React.Fragment key={`${index}-${dataIndex}`}>
              <tr>
                <td className="p-2 border-b border-[#EAECF0]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 focus:ring-gray-200 ml-6"
                    checked={selectedReceipts.includes(receipt)}
                    onChange={() => handleCheckboxChange(receipt)}
                  />
                </td>
                <td className="p-2 h-20 border-y border-[#EAECF0]">
                  {data.storeName}
                </td>
                <td className={`p-2 border-y border-[#EAECF0] text-center`}>
                  <span
                    className={`px-4 py-2 text-xs rounded-full ${
                      data.receiptCategory !== null
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {data.receiptCategory !== null
                      ? data.receiptCategory
                      : "Uncategorized"}
                  </span>
                </td>
                <td className="p-2 border-y border-[#EAECF0] text-center text-gray-400">
                  {data.total}
                </td>
                <td className="p-2 border-y border-[#EAECF0] text-center text-gray-400">
                  {new Date(
                    receipt.createdAt.$date?.$numberLong || receipt.createdAt
                  ).toLocaleDateString()}
                </td>
                <td className="p-2 border-y text-center border-[#EAECF0]">
                  <button
                    onClick={() => toggleReceiptView(receipt, dataIndex)}
                    className="text-[#98A2B3]"
                  >
                    <FiMoreVertical />
                  </button>
                </td>
              </tr>
              {expandedReceipt && expandedReceipt.receipt === receipt && expandedReceipt.dataIndex === dataIndex && (
                <tr>
                  <td colSpan="6" className="p-4 border-b border-[#EAECF0]">
                    <ViewReceipt
                      receipt={{
                        ...receipt,
                        data: receipt.receiptData[dataIndex],
                        imageUrl: receipt.imageUrls[dataIndex],
                      }}
                      onClose={() => setExpandedReceipt(null)}
                      onSave={(id, updatedReceipt) => {
                        // Update the receipt data here
                        setExpandedReceipt(null);
                      }}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))
        )}
        </tbody>
      </table>
    );
};

export default ReceiptTable;