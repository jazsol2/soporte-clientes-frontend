import axios from "axios";

const API_URL = "http://localhost:8081/notificaciones";

const registrarNotificacion = async (notificacion) =>
  axios.post(API_URL, notificacion);

const listarNotificaciones = async (id) =>
  axios.get(`${API_URL}/${id}`);

// Nuevo helper para tu ChatModal
export const notificarCliente = async (cliente, mensaje) => {
  if (!cliente?.idCliente) return;

  const notificacion = {
    idCliente: cliente.idCliente,
    idTicket: ticket.idTicket,
    mensaje,
    emailDestinatario: cliente.email,
    destinatario: `${cliente.nombre} ${cliente.apellido}`, 
    estado: "ENVIADO",                                     
    fechaEnvio: new Date().toISOString()                  
  };

  return registrarNotificacion(notificacion);
};


export default { registrarNotificacion, listarNotificaciones };
