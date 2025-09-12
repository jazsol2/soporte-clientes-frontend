import { useState } from "react";
import TicketForm from "../components/TicketForm";

const Home = () => {
  const [showTicket, setShowTicket] = useState(false);

  return (
    <div>
      <h1>Bienvenido al Soporte de Clientes</h1>
      <button onClick={() => setShowTicket(true)}>Abrir Ticket</button>

      {showTicket && (
        <div className="modal">
          <button onClick={() => setShowTicket(false)}>Cerrar</button>
          <TicketForm />
        </div>
      )}
    </div>
  );
};

export default Home;
