import { useState } from "react";
import axios from "axios";

export default function ChatModal() {
  const [messages, setMessages] = useState([
    { from: "skill", text: "¡Hola! Soy tu asistente Tigo 😃\nSelecciona una opción:\n1. Atención al cliente\n2. Contratar un servicio\n3. Reportar falla\n4. Hablar con un agente" }
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    tipo: "",
    nombre: "",
    apellido: "",
    email: "",
    cedula: "",
    servicio: "",
    mensaje: ""
  });

  const handleSend = async () => {
    if (!input) return;

    const newMsg = { from: "user", text: input };
    setMessages(prev => [...prev, newMsg]);

    try {
      switch(step) {
        case 0:
          if (["1","2","3","4"].includes(input)) {
            setFormData({ ...formData, tipo: input });
            setMessages(prev => [...prev, { from: "skill", text: "Para comenzar, ¿cuál es tu nombre?" }]);
            setStep(1);
          } else {
            setMessages(prev => [...prev, { from: "skill", text: "Opción no válida, intenta de nuevo." }]);
          }
          break;

        case 1:
          setFormData({ ...formData, nombre: input });
          setMessages(prev => [...prev, { from: "skill", text: "Tu apellido?" }]);
          setStep(2);
          break;

        case 2:
          setFormData({ ...formData, apellido: input });
          setMessages(prev => [...prev, { from: "skill", text: "Correo electrónico?" }]);
          setStep(3);
          break;

        case 3:
          setFormData({ ...formData, email: input });
          setMessages(prev => [...prev, { from: "skill", text: "Número de cédula, RUC o pasaporte?" }]);
          setStep(4);
          break;

        case 4:
          setFormData({ ...formData, cedula: input });

          // Verificar si el cliente ya existe
          const cliente = await axios.get(`http://localhost:8082/clientes/${input}`).catch(() => null);

          if(!cliente) {
            await axios.post("http://localhost:8082/clientes", formData);
          }

          if(formData.tipo === "2") {
            setMessages(prev => [...prev, { from: "skill", text: "¿Qué servicio deseas contratar?" }]);
          } else {
            setMessages(prev => [...prev, { from: "skill", text: "Describe tu solicitud o problema:" }]);
          }
          setStep(5);
          break;

        case 5:
          if(formData.tipo === "2") setFormData({ ...formData, servicio: input });
          else setFormData({ ...formData, mensaje: input });

          // Crear ticket
          const ticketResp = await axios.post("http://localhost:8083/tickets", formData);
          const ticketId = ticketResp.data.id;

          // Notificación y email
          await axios.post("http://localhost:8081/notificaciones", { ticketId, texto: "Ticket creado" });
          await axios.post("http://localhost:8093/send-email", { ...formData, ticketId });

          // Asignar agente automático
          await axios.patch(`http://localhost:8083/tickets/${ticketId}/asignar/1`);

          setMessages(prev => [...prev, { from: "skill", text: "¡Gracias! Un agente se pondrá en contacto contigo." }]);
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
    <div style={{ position: "fixed", bottom: 20, right: 20, width: 350, border: "1px solid #ccc", borderRadius: 10, background: "white", display: "flex", flexDirection: "column", maxHeight: "500px" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === "user" ? "right" : "left", margin: "5px 0" }}>
            <span style={{ background: m.from === "user" ? "#0d6efd" : "#f1f1f1", color: m.from === "user" ? "white" : "black", padding: "5px 10px", borderRadius: 10, display: "inline-block" }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
        <input style={{ flex: 1, padding: 10, border: "none" }} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Escribe un mensaje..." />
        <button style={{ padding: 10, background: "#0d6efd", color: "white", border: "none" }} onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}
