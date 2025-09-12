import { useRef } from "react";
import ContactForm from "../components/ContactForm";
import "../css/ContactForm.css";
import "../css/Contact.css";

function Contact() {
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="contact-page">
      <section className="info-cards">
        <h1>Contáctanos</h1>
        <div className="cards-container">
          <div className="card">
            <h2>Visítanos</h2>
            <p>Av. Amazonas N34-567, Quito, Ecuador</p>
            <button
            className="btn"
            onClick={() => window.open(
              "https://www.google.com/maps?q=Av.+Amazonas+N34-567,+Quito,+Ecuador", 
              "_blank"
            )}
            >
              Más información
            </button>
          </div>
          <div className="card">
            <h2>Escríbenos</h2>
            <p>soporte@tigo.com.ec</p>
            <button className="btn" onClick={scrollToForm}>
              Más información
            </button>
          </div>
          <div className="card">
            <h2>Llámanos</h2>
            <p>+593 2 345 6789</p>
            <button
            className="btn"
            onClick={() => window.open(
              "https://wa.me/59323456789", // número en formato internacional, sin "+" ni espacios
              "_blank"
            )}
            >
              Más información
              </button>
          </div>
        </div>
      </section>

      <section ref={formRef} className="form-section">
        <ContactForm />
      </section>
    </main>
  );
}

export default Contact;
