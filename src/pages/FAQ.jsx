import { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [search, setSearch] = useState("");

  const faqs = [
    {
      category: "Cuenta y Acceso",
      question: "¿Cómo puedo restablecer mi contraseña?",
      answer:
        "Puedes restablecer tu contraseña desde la sección 'Mi Cuenta'. Haz clic en 'Olvidé mi contraseña' y sigue las instrucciones que enviaremos a tu correo.",
    },
    {
      category: "Soporte Técnico",
      question: "¿Qué hago si mi servicio no funciona?",
      answer:
        "Primero reinicia tu equipo (módem o celular). Si persiste, comunícate al 1800-TIGO o usa nuestro chat de soporte.",
    },
    {
      category: "Datos Personales",
      question: "¿Cómo actualizo mis datos personales?",
      answer:
        "Ingresa al portal en línea en 'Mi Perfil'. También puedes llamar a atención al cliente.",
    },
    {
      category: "Facturación",
      question: "¿Dónde consulto mi factura?",
      answer:
        "Puedes revisar tu factura en la aplicación Mi Tigo o en el portal web, sección 'Facturación'.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Filtro de búsqueda
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="faq">
      <h2>Centro de Ayuda - Preguntas Frecuentes</h2>

      {/* 🔍 Buscador */}
      <input
        type="text"
        placeholder="Busca tu pregunta..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "10px",
          margin: "20px auto",
          display: "block",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      {/* Lista de FAQs */}
      <div className="faq-list">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
              style={{
                cursor: "pointer",
                marginBottom: "10px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: activeIndex === index ? "#f0f0f0" : "#fff",
              }}
            >
              <h3 style={{ margin: 0, color: "#0049B7" }}>
                {faq.category} - {faq.question}
              </h3>
              {activeIndex === index && (
                <p style={{ marginTop: "10px" }}>{faq.answer}</p>
              )}
            </div>
          ))
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </section>
  );
};

export default FAQ;
