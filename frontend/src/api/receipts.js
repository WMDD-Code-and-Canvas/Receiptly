import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const analyzeReceipt = async (base64Images) => {
  const userId = localStorage.getItem("userId"); // Retrieve userId from local storage
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  const response = await axios.post(`${API_BASE_URL}/receipts/analyze`, {
    userId, // Include userId in the request body
    images: base64Images,
    features: [{ type: "TEXT_DETECTION" }],
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error("Receipt analysis failed");
  }

  return response.data;
};

export const saveReceipt = async (results, images, teamId) => {
  const userId = localStorage.getItem("userId"); // Retrieve userId from local storage
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  try {
    const response = await axios.post(`${API_BASE_URL}/receipts/saveReceipt`, {
      userId: userId,
      teamId: teamId, // Include teamId in the request body
      results: JSON.parse(results).results,
      images,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Results saved successfully', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving results:', error);
    // alert('Error saving results');
  }
};

export const fetchReceipts = async () => {
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  const response = await axios.get(`${API_BASE_URL}/receipts`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch receipts");
  }

  return response.data;
};

export const updateReceipt = async (id, updatedData) => {
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  const response = await axios.put(`${API_BASE_URL}/receipts/${id}`, updatedData, {
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
  });

  if (response.status !== 200) {
      throw new Error("Receipt update failed");
  }

  return response.data;
};