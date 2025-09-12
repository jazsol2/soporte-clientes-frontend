// src/services/emailService.js
import axios from "axios";

const API_URL = "http://localhost:8080/send-email"; // Cambia al endpoint real de tu microservicio

const sendEmail = (data) => {
  return axios.post(API_URL, data);
};

export default { sendEmail };
