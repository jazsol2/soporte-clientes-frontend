import React, { useState } from "react";
import ChatModal from "../components/ChatModal"; // tu componente de chat
import chatIcon from "../assets/chatbot.jpg"; // tu icono flotante

function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => setChatOpen(!chatOpen);

  return (
    <main className="content">
      <h1>Bienvenido a TIGO Ecuador</h1>

      <h2>¿Quiénes somos?</h2>
      <p>
        TIGO es una empresa multinacional de telecomunicaciones perteneciente al
        grupo Millicom International Cellular S.A., con operaciones en América Latina
        y África. En varios países, TIGO es líder en servicios móviles y fijos.
      </p>

      <h2>¿A qué nos dedicamos?</h2>
      <p>
        Nos dedicamos a ofrecer servicios de telefonía, internet, televisión y servicios
        financieros móviles, como Tigo Money, brindando soluciones integrales a nuestros clientes.
      </p>

      <h2>¿Qué ofrecemos?</h2>
      <ul style={{ textAlign: "left", margin: "20px auto", maxWidth: "600px" }}>
        <li>Telefonía móvil y fija.</li>
        <li>Internet de alta velocidad.</li>
        <li>Televisión digital y paquetes de entretenimiento.</li>
        <li>Servicios financieros móviles (Tigo Money).</li>
        <li>Soporte y atención personalizada para clientes.</li>
      </ul>

      {/* Icono flotante */}
      <img
        src={chatIcon}
        alt="Chat"
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          cursor: "pointer",
          borderRadius: "50%",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      />

      {/* Modal de chat */}
      {chatOpen && <ChatModal onClose={toggleChat} />}
    </main>
  );
}

export default Home;
