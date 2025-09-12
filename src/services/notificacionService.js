import axios from "axios";

const API_URL = "http://localhost:8080/api/notificaciones";

const registrarNotificacion = async (notificacion) => axios.post(API_URL, notificacion);
const listarNotificaciones = async (id) => axios.get(`${API_URL}/${id}`);

export default { registrarNotificacion, listarNotificaciones };
