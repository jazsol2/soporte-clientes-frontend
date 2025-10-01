import axios from "axios";


const API_URL = "http://localhost:8083/tickets"; 

// Crear un nuevo ticket
export const crearTicket = async (ticketData) => {
  try {
    const { data } = await axios.post(API_URL, ticketData);
    console.log("Tickets recibidos:", data);
    return data;
  } catch (error) {
    console.error("Error al crear el ticket:", error.response?.data || error.message);
    return null;
  }
};

// Listar todos los tickets
export const listarTickets = async () => {
  try {
    const { data } = await axios.get(API_URL);
    return data;
  } catch (error) {
    console.error("Error al listar tickets:", error.response?.data || error.message);
    return [];
  }
};

// Obtener un ticket por ID
export const obtenerTicket = async (idTicket) => {
  try {
    const { data } = await axios.get(`${API_URL}/${idTicket}`);
    return data;
  } catch (error) {
    console.error(`Error al obtener ticket ${idTicket}:`, error.response?.data || error.message);
    return null;
  }
};

// Asignar un agente a un ticket
export const asignarAgente = async (idTicket, idAgente) => {
  try {
    const { data } = await axios.put(`${API_URL}/${idTicket}/asignar/${idAgente}`);
    return data;
  } catch (error) {
    console.error(`Error al asignar agente al ticket ${idTicket}:`, error.response?.data || error.message);
    return null;
  }
};

// Actualizar un ticket
export const actualizarTicket = async (idTicket, ticketData) => {
  try {
    const { data } = await axios.put(`${API_URL}/${idTicket}`, ticketData);
    return data;
  } catch (error) {
    console.error(`Error al actualizar ticket ${idTicket}:`, error.response?.data || error.message);
    return null;
  }
};

// Eliminar un ticket
export const eliminarTicket = async (idTicket) => {
  try {
    await axios.delete(`${API_URL}/${idTicket}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar ticket ${idTicket}:`, error.response?.data || error.message);
    return false;
  }
};

// Exportar todo como un objeto para importar fácilmente
export default {
  crearTicket,
  listarTickets,
  obtenerTicket,
  asignarAgente,
  actualizarTicket,
  eliminarTicket,
};
