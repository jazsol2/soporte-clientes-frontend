import axios from "axios";

const API_URL = "http://localhost:8080/api/clientes";

const obtenerCliente = async (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const crearCliente = async (cliente) => {
  return axios.post(API_URL, cliente);
};

const actualizarCliente = async (id, cliente) => {
  return axios.put(`${API_URL}/${id}`, cliente);
};

export default { obtenerCliente, crearCliente, actualizarCliente };
