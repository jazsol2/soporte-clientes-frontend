import axios from "axios";

const API_URL = "http://localhost:8082/clientes";

// Cambié `id` por `documento` y la URL a `/documento/${documento}`
const obtenerCliente = async (documento) => {
  return axios.get(`${API_URL}/documento/${documento}`);
};

const crearCliente = async (cliente) => {
  return axios.post(API_URL, cliente);
};

const actualizarCliente = async (id, cliente) => {
  return axios.put(`${API_URL}/${id}`, cliente);
};

export default { obtenerCliente, crearCliente, actualizarCliente };
