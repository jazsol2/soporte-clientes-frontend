import axios from "axios";

const API_URL = "http://localhost:8080/respuestas";

const crearRespuesta = async (respuesta) => axios.post(API_URL, respuesta);
const obtenerRespuesta = async (id) => axios.get(`${API_URL}/${id}`);

export default { crearRespuesta, obtenerRespuesta };
