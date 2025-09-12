import axios from "axios";

const API_URL = "http://localhost:8080/api/agentes";

const obtenerAgente = async (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const crearAgente = async (agente) => {
  return axios.post(API_URL, agente);
};

export default { obtenerAgente, crearAgente };
