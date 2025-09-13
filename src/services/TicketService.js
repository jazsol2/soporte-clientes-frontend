import axios from "axios";

const API_URL = "http://localhost:8080/api/tickets";

const crearTicket = async (ticket) => axios.post(API_URL, ticket);
const listarTickets = async () => axios.get(API_URL);
const asignarAgente = async (idTicket, idAgente) =>
  axios.patch(`${API_URL}/${idTicket}/asignar/${idAgente}`);
const actualizarTicket = async (idTicket, ticket) =>
  axios.put(`${API_URL}/${idTicket}`, ticket);

export default { crearTicket, listarTickets, asignarAgente, actualizarTicket };
