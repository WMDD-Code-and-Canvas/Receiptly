import React, { useState } from "react";
import UploadIcon from "../../assets/upload-cloud.svg";
import RemoveButton from "../../assets/removeButton.svg";
import FileIcon from "../../assets/fileIcon.svg";
import Button from "./Button";
import CameraCapture from "../pages/Receipt/CameraCapture";

const FileInput = ({ handleFileChange, isLoading, fileNames }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
    const [progressBar, setProgressBar] = useState({});
    const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const simulateUpload = (fileIndex) => {
    const totalTime = Math.floor(Math.random() * 200) + 100; 
    const step = 100 / (totalTime / 200);
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += step; 
      setProgressBar((prev) => ({
        ...prev,
        [fileIndex]: Math.min(currentProgress, 100),
      }));

      if (currentProgress >= 100) clearInterval(interval);
    }, 200);
  };

  const handleFilesChange = (files) => {
    if (selectedFiles.length + files.length > 5) {
      alert("You can upload a maximum of 5 files.");
      return;
    }
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    handleFileChange(newFiles);

    newFiles.forEach((_, index) => {
      simulateUpload(index);
    });
  };

  const handleInputChange = (event) => {
    const files = Array.from(event.target.files);
    handleFilesChange(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    handleFilesChange(files);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    handleFileChange(updatedFiles);

    setProgressBar((prev) => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
  };
  const handleCapture = (imageData) => {
    const byteString = atob(imageData);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
  
    const blob = new Blob([uint8Array], { type: "image/jpeg" });
    const file = new File([blob], `captured_${Date.now()}.jpg`, { type: "image/jpeg" });
  
    handleFilesChange([file]);
  };
  

  return (
    <>
      <div
        className={`w-full py-9 bg-[#EAEBFD] rounded-2xl border gap-3 grid ${
          isLoading ? "border-gray-300" : "border-[#BEC2F7]"
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <label htmlFor="fileUpload" className="grid gap-1 cursor-pointer">
          <img
            src={UploadIcon}
            alt="Upload Icon"
            className="mx-auto w-12 h-12"
          />
          <p className="text-center text-[#5861EB]">
            <b className="text-[#131861]">Click to Upload</b> or drag and drop{" "}
            <br />
            <span className="text-[12px]">PDF, JPG or PNG</span>
          </p>
        </label>

        <input
          id="fileUpload"
          type="file"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
        <p className="text-center font-bold">OR</p>
        <Button 
          onClick={() => setIsCameraOpen(true)} 
          style={{ background: "#2E39E6",
            width: "20%",
            borderRadius: "8px",
            margin: "0 auto",
            border: "1px solid #2E39E6",
            transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#2E39E6";
              e.target.style.borderColor = "#2E39E6";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#2E39E6";
              e.target.style.color = "white"; 
              e.target.style.borderColor = "#2E39E6";
            }}
          >
          Use Camera
        </Button>
      </div>
      {isCameraOpen && <CameraCapture onCapture={handleCapture} />}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className="flex flex-col border border-gray-300 p-2 rounded-lg text-gray-500 mx-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={FileIcon} alt="File Icon" className="w-6 h-6" />
                    <div className="flex flex-col">
                      <span className="text-gray-700 text-lg">{file.name}</span>
                      <span className="text-gray-500 text-sm">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <img
                      src={RemoveButton}
                      alt="Remove Icon"
                      className="mx-auto w-12 h-12"
                    />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="w-[80%] bg-gray-200 ml-10 mb-6 rounded-full h-2 relative">
                    <div
                      className="bg-[#2E39E6] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressBar[index] || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-700 text-sm w-10">
                    {Math.round(progressBar[index] || 0)}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default FileInput;