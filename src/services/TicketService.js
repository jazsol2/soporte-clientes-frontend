import axios from "axios";

const API_URL = "http://localhost:8083/tickets"; 

// Crear un nuevo ticket
const crearTicket = async (ticketData) => {
  try {
    const response = await axios.post(API_URL, ticketData);
    return response.data; // devuelve el ticket creado
  } catch (error) {
    console.error("Error al crear el ticket:", error);
    return null;
  }
};

// Listar todos los tickets
const listarTickets = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al listar tickets:", error);
    return [];
  }
};

// Obtener un ticket por ID
const obtenerTicket = async (idTicket) => {
  try {
    const response = await axios.get(`${API_URL}/${idTicket}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener ticket ${idTicket}:`, error);
    return null;
  }
};

// Asignar un agente a un ticket
const asignarAgente = async (idTicket, idAgente) => {
  try {
    const response = await axios.put(`${API_URL}/${idTicket}/asignar/${idAgente}`);
    return response.data;
  } catch (error) {
    console.error(`Error al asignar agente al ticket ${idTicket}:`, error);
    return null;
  }
};

// Actualizar un ticket
const actualizarTicket = async (idTicket, ticketData) => {
  try {
    const response = await axios.put(`${API_URL}/${idTicket}`, ticketData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar ticket ${idTicket}:`, error);
    return null;
  }
};

// Eliminar un ticket
const eliminarTicket = async (idTicket) => {
  try {
    await axios.delete(`${API_URL}/${idTicket}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar ticket ${idTicket}:`, error);
    return false;
  }
};

export default {
  crearTicket,
  listarTickets,
  obtenerTicket,
  asignarAgente,
  actualizarTicket,
  eliminarTicket,
};
