import axios from "axios";
const API_URL = "http://localhost:8093/send-email";

const sendEmail = async ({ destinatario, asunto, mensaje }) => {
  try {
    const res = await axios.post(API_URL, { destinatario, asunto, mensaje });
    return res.status;
  } catch (err) {
    console.error("EmailService error:", err.response?.data || err.message);
    throw err;
  }
};

export default { sendEmail };
