import axios from "axios";

const API_URL = "http://localhost:8084/respuestas";

const RespuestaService = {
  listarPorTicket: async (idTicket) => {
    try {
      const res = await axios.get(`${API_URL}/ticket/${idTicket}`);
      return res.data || [];
    } catch (err) {
      console.error("Error obteniendo respuestas:", err);
      return [];
    }
  },

  enviarRespuesta: async (idTicket, mensaje, idAgente = null, agenteNombre = null) => {
    try {
      const body = { idTicket, mensaje, idAgente, agenteNombre };
      const res = await axios.post(`${API_URL}`, body);
      return res.data;
    } catch (err) {
      console.error("Error enviando respuesta:", err);
      return null;
    }
  },
};

export default RespuestaService;
