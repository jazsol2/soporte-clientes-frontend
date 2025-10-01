// ChatModal.jsx
import React, { useState, useEffect, useRef } from "react";
import ClienteService from "../services/clienteService";
import TicketService from "../services/ticketService";
import RespuestaService from "../services/respuestaService";
import NotificacionService from "../services/notificacionService";
import EmailService from "../services/emailService";
import "../css/ChatModal.css";

export default function ChatModal({ onClose, agente }) {
  const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const agenteActual = agente || { idAgente: null, nombre: "Agente" };
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const initialMessage = { id: generateId(), from: "skill", text: "Hola. Soy tu asistente. Selecciona una opción:" };
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    tipo: "",
    cedula: "",
    clienteData: null,
    idTicket: null
  });
  const [loading, setLoading] = useState(false);

  const menuOptions = {
    1: "Estado de servicios contratados",
    2: "Cambiar nombre de red",
    3: "Cambiar clave WiFi",
    4: "Reportar falla o lentitud",
    5: "Productos adicionales",
    6: "Reclamo",
    7: "Facturación",
    8: "Ir al menú principal"
  };

  const categoriaAgenteMap = {
    "estado de servicios contratados": null,
    "cambiar nombre de red": "SOPORTE_TECNICO",
    "cambiar clave wifi": "SOPORTE_TECNICO",
    "reportar falla o lentitud": "SOPORTE_TECNICO",
    "productos adicionales": "CONSULTA",
    "reclamo": "RECLAMO",
    "facturacion": "FACTURACION"
  };

  // ======================
  // Funciones de Chat
  // ======================
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const stopPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = null;
  };

  const resetChat = () => {
    stopPolling();
    setMessages([{ ...initialMessage, id: generateId() }]);
    setInput("");
    setStep(0);
    setFormData({ tipo: "", cedula: "", clienteData: null, idTicket: null });
  };

  const notificarCliente = async (cliente, mensaje, idTicket) => {
    try {
      if (!cliente) return;
      if (NotificacionService && cliente.idCliente) {
        await NotificacionService.registrarNotificacion({
          idCliente: cliente.idCliente,
          idTicket,
          mensaje,
          emailDestinatario: cliente.email,
          destinatario: cliente.nombre || "Cliente",
          estado: "ENVIADO"
        });
      }
      if (EmailService && cliente.email) {
        await EmailService.sendEmail({
          destinatario: cliente.email,
          asunto: "Información del sistema",
          mensaje
        });
      }
    } catch (err) {
      console.error("Error enviando notificación o email:", err);
    }
  };

  const mostrarEstadoPlan = (cliente) => {
    if (!cliente || !cliente.servicios || cliente.servicios.length === 0)
      return "No se encontraron servicios activos para tu cuenta";
    return cliente.servicios.map((s, i) => `${i + 1}. ${s.tipo}: ${s.detalle}`).join("\n");
  };

  // ======================
  // Polling de respuestas
  // ======================
  useEffect(() => {
    if (!formData.idTicket) return;

    const fetchRespuestas = async () => {
      try {
        const res = await RespuestaService.listarPorTicket(formData.idTicket);
        const ordenadas = res.sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));

        setMessages(prev => {
          const nuevos = ordenadas.filter(r => !prev.some(m => m.id === r.id_respuesta));
          return [...prev, ...nuevos.map(r => ({
            id: r.id_respuesta,
            from: r.idAgente ? "agent" : "user",
            text: r.mensaje,
            agenteNombre: r.agenteNombre
          }))];
        });
      } catch (err) {
        console.error("Error obteniendo respuestas:", err);
      }
    };

    fetchRespuestas();
    pollingRef.current = setInterval(fetchRespuestas, 2000);

    return () => stopPolling();
  }, [formData.idTicket]);

  // ======================
  // Enviar mensajes
  // ======================
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    const texto = input.trim();
    setInput("");
    setMessages(prev => [...prev, { id: generateId(), from: "user", text: texto }]);

    try {
      switch (step) {
        case 1:
          const clienteResp = await ClienteService.obtenerCliente(texto).catch(() => null);
          if (clienteResp?.data) {
            setFormData(prev => ({ ...prev, cedula: texto, clienteData: clienteResp.data }));
            setMessages(prev => [...prev, { id: generateId(), from: "skill", text: `Cliente encontrado. Hola ${clienteResp.data.nombre} ${clienteResp.data.apellido}` }]);
            setStep(2);
          } else {
            setMessages(prev => [...prev, { id: generateId(), from: "skill", text: "No se encontró cliente con esa cédula" }]);
          }
          break;

        case 3:
          if (!formData.idTicket) {
            setMessages(prev => [...prev, { id: generateId(), from: "skill", text: "No se identificó ticket para enviar mensaje" }]);
            break;
          }
          await RespuestaService.enviarRespuesta(
            formData.idTicket,
            texto,
            agenteActual.idAgente,
            agenteActual.nombre
          ).catch(() => null);
          break;

        default:
          setMessages(prev => [...prev, { id: generateId(), from: "skill", text: "Gracias por contactarnos" }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: generateId(), from: "skill", text: "Ocurrió un error, intenta más tarde" }]);
    }

    setLoading(false);
  };

  const handleOptionClick = (option) => {
    setFormData(prev => ({ ...prev, tipo: option }));
    setMessages(prev => [...prev, { id: generateId(), from: "skill", text: "Ingresa tu número de cédula, RUC o pasaporte:" }]);
    setStep(1);
  };

  const handleMenuOptionClick = async (optionValue) => {
    const opcionInput = optionValue.toLowerCase();
    if (opcionInput === "8" || opcionInput === "ir al menú principal") {
      setMessages(prev => [...prev, { id: generateId(), from: "skill", text: "Regresando al menú principal" }]);
      resetChat();
      return;
    }

    const categoria = categoriaAgenteMap[opcionInput] || "SOPORTE_TECNICO";
    if (!formData.clienteData) {
      setMessages(prev => [...prev, { id: generateId(), from: "skill", text: "No se pudo crear ticket sin cliente" }]);
      return;
    }

    let descripcion = "";
    switch (opcionInput) {
      case "1":
      case "estado de servicios contratados":
        descripcion = mostrarEstadoPlan(formData.clienteData);
        setMessages(prev => [...prev, { id: generateId(), from: "skill", text: `Tus servicios activos:\n${descripcion}` }]);
        break;

      default:
        descripcion = `Desde chat: ${menuOptions[optionValue] || optionValue}`;
        const ticketPayload = {
          idCliente: formData.clienteData.idCliente,
          emailCliente: formData.clienteData.email,
          categoria,
          descripcion,
          prioridad: "MEDIA"
        };
        const ticketResp = await TicketService.crearTicket(ticketPayload).catch(() => null);
        if (ticketResp?.ticket?.idTicket) {
          const idTicket = ticketResp.ticket.idTicket;
          setFormData(prev => ({ ...prev, idTicket }));
          setMessages(prev => [...prev, { id: generateId(), from: "skill", text: `Ticket creado con ID ${idTicket}. Ahora puedes chatear con un agente.` }]);
          await notificarCliente(formData.clienteData, `Se ha creado un ticket con ID ${idTicket}`, idTicket);
          setStep(3);
        } else {
          setMessages(prev => [...prev, { id: generateId(), from: "skill", text: "Error creando ticket" }]);
        }
    }
  };

  // ======================
  // Scroll automático
  // ======================
  useEffect(scrollToBottom, [messages]);

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          Chat
          <button className="chat-close-btn" onClick={() => { resetChat(); onClose(); }}>×</button>
        </div>

        <div className="chat-messages">
          {messages.map(m => (
            <div key={m.id} className={`chat-message ${m.from}`}>
              {m.agenteNombre && <strong>{m.agenteNombre}: </strong>}
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {step === 0 && (
          <div className="chat-options-container">
            {["Atención al cliente", "Contratar un servicio"].map((opt, i) => (
              <button key={i} className="chat-option-button" onClick={() => handleOptionClick(opt)}>{opt}</button>
            ))}
          </div>
        )}

        {step === 2 && formData.clienteData && (
          <div className="chat-options-container">
            {Object.entries(menuOptions).map(([key, value]) => (
              <button key={key} className="chat-option-button" onClick={() => handleMenuOptionClick(value)}>
                {key}. {value}
              </button>
            ))}
          </div>
        )}

        {step > 0 && (
          <div className="chat-input-container">
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Escribe un mensaje"
            />
            <button className="chat-send-btn" onClick={handleSend} disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
