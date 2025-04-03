import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ReportsContext = createContext();

export const ReportsProvider = ({ children }) => {
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/reports/generate`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReportsData(response.data);
      } catch (error) {
        console.error("Error fetching reports data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [API_BASE_URL]);

  return (
    <ReportsContext.Provider value={{ reportsData, loading }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => useContext(ReportsContext);