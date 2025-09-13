import { useState } from "react";
import ClienteService from "../services/ClienteService";
import "../css/ChatModal.css";

export default function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "skill", text: "¡Hola! Soy tu asistente Tigo 😃\nSelecciona una opción:" }
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    tipo: "",      // 1: Atención al cliente, 2: Contratar servicio
    nombre: "",
    apellido: "",
    email: "",
    cedula: "",
    servicio: "",
    mensaje: ""
  });

  // Cuando el usuario selecciona opción 1 o 2
  const handleOptionClick = (option) => {
    setFormData({ ...formData, tipo: option });
    setMessages(prev => [
      ...prev,
      { from: "skill", text: "¡Gracias! 😎 ¿Puedes ingresar tu número de cédula, RUC o pasaporte?" }
    ]);
    setStep(1);
  };

  // Función principal para manejar los mensajes
  const handleSend = async () => {
    if (!input) return;
    const newMsg = { from: "user", text: input };
    setMessages(prev => [...prev, newMsg]);

    try {
      switch (step) {

        // Paso 1: Validar si el cliente existe
        case 1:
          try {
            const response = await ClienteService.obtenerCliente(input).catch(() => null);

            if (response && response.data) {
              // Cliente encontrado
              setFormData({ ...formData, cedula: input });
              setMessages(prev => [
                ...prev,
                { from: "skill", text: "Cliente encontrado ✅" },
                { from: "skill", text: formData.tipo === "1" ? "Para comenzar, ¿cuál es tu nombre?" : "Perfecto, te conectaré con un agente de ventas 😎" }
              ]);

              setStep(formData.tipo === "1" ? 2 : 99); // 99 = redirigir a WhatsApp para ventas
            } else {
              // Cliente no encontrado
              setMessages(prev => [
                ...prev,
                { from: "skill", text: "No encontramos un cliente con esa cédula 😕. ¿Deseas registrarlo?" }
              ]);
              setStep(1); // Mantener en el mismo paso hasta que se registre
            }
          } catch (err) {
            setMessages(prev => [
              ...prev,
              { from: "skill", text: "Ocurrió un error al validar la cédula, intenta más tarde." }
            ]);
            console.error(err);
          }
          break;

        // Paso 2: Nombre
        case 2:
          setFormData({ ...formData, nombre: input });
          setMessages(prev => [...prev, { from: "skill", text: "Tu apellido?" }]);
          setStep(3);
          break;

        // Paso 3: Apellido
        case 3:
          setFormData({ ...formData, apellido: input });
          setMessages(prev => [...prev, { from: "skill", text: "Correo electrónico?" }]);
          setStep(4);
          break;

        // Paso 4: Email
        case 4:
          setFormData({ ...formData, email: input });
          setMessages(prev => [
            ...prev,
            { from: "skill", text: formData.tipo === "1" ? "Describe tu solicitud o problema:" : "Describe el servicio que deseas contratar:" }
          ]);
          setStep(5);
          break;

        // Paso 5: Mensaje/servicio
        case 5:
          if (formData.tipo === "1") setFormData({ ...formData, mensaje: input });
          else setFormData({ ...formData, servicio: input });

          // Crear cliente si no existía
          if (formData.tipo === "1" && !formData.nombre) {
            await ClienteService.crearCliente(formData);
          }

          // Mensaje final según tipo
          if (formData.tipo === "1") {
            setMessages(prev => [
              ...prev,
              { from: "skill", text: "¡Gracias! Un agente de soporte se pondrá en contacto contigo." }
            ]);
          } else {
            // Redirigir a WhatsApp
            const numeroVentas = "593987654321"; // Coloca el número de ventas Tigo
            const mensajeWhatsapp = `Hola, quiero contratar el servicio: ${formData.servicio}`;
            window.open(`https://wa.me/${numeroVentas}?text=${encodeURIComponent(mensajeWhatsapp)}`, "_blank");
            setMessages(prev => [
              ...prev,
              { from: "skill", text: "Te estoy redirigiendo a un agente de ventas por WhatsApp 😎" }
            ]);
          }

          setStep(6);
          break;

        default:
          setMessages(prev => [...prev, { from: "skill", text: "Gracias por contactarnos 😃" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { from: "skill", text: "Ocurrió un error, intenta más tarde." }]);
      console.error(err);
    }

    setInput("");
  };

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          Chat Tigo
          <button className="chat-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.from === "user" ? "user" : "bot"}`}>
              {m.text}
            </div>
          ))}

          {step === 0 && (
            <div className="chat-options-container">
              <button className="chat-option-button" onClick={() => handleOptionClick("1")}>
                Atención al cliente
              </button>
              <button className="chat-option-button" onClick={() => handleOptionClick("2")}>
                Contratar un servicio
              </button>
            </div>
          )}
        </div>

        {step > 0 && step !== 99 && (
          <div className="chat-input-container">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe un mensaje..."
            />
            <button className="chat-send-btn" onClick={handleSend}>Enviar</button>
          </div>
        )}
      </div>
    </div>
  );
}
