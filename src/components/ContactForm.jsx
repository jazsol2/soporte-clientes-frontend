import React, { useState } from "react";
import axios from "axios";
import "./ContactForm.css";

const ContactForm = () => {
  const [nombre, setNombre] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !emailCliente || !asunto || !mensaje) {
      setStatus("Por favor, completa todos los campos.");
      return;
    }

    try {
      const payload = {
        destinatario: "jazminsolis2@gmail.com", // tu correo receptor
        asunto: asunto,
        mensaje: `Nombre: ${nombre}\nCorreo: ${emailCliente}\n\nMensaje:\n${mensaje}`,
      };

      const response = await axios.post("http://localhost:8093/send-email", payload);

      if (response.status === 200) {
        setStatus("Correo enviado con éxito ✅");
        setNombre("");
        setEmailCliente("");
        setAsunto("");
        setMensaje("");
      } else {
        setStatus("Error al enviar correo. ❌");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error al enviar correo. ❌");
    }
  };

  return (
    <div className="contact-form-container">
      <h2>Contáctanos</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Tu correo"
          value={emailCliente}
          onChange={(e) => setEmailCliente(e.target.value)}
        />
        <input
          type="text"
          placeholder="Asunto"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
        />
        <textarea
          placeholder="Mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default ContactForm;
