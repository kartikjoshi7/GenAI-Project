// frontend/src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // your backend

export const simplifyText = async (text) => {
  const res = await axios.post(`${API_URL}/simplify`, { text });
  return res.data;
};

export const analyzeRisks = async (documentText) => {
  const res = await axios.post(`${API_URL}/analyze`, { documentText });
  return res.data;
};

export const askQuestion = async (question, context) => {
  const res = await axios.post(`${API_URL}/ask`, { question, context });
  return res.data;
};

export const translateText = async (text, targetLanguage) => {
  const res = await axios.post(`${API_URL}/translate`, { text, targetLanguage });
  return res.data;
};
