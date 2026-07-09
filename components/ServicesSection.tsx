"use client";

import { motion } from "framer-motion";
import Button from "./Button";

export default function ServicesSection() {
  const services = [
    {
      title: "Presencia Digital",
      description: "Diseño de páginas web premium. Tu tarjeta de presentación en internet para que tus clientes te encuentren fácil y rápido.",
      price: "$70.000",
      features: ["Diseño a medida", "Optimización móvil", "Alta velocidad"],
      premium: false,
    },
    {
      title: "Agente WhatsApp",
      description: "Un asistente virtual en tu WhatsApp que atiende consultas y agenda turnos automáticamente 24/7. Olvidate de responder a mano.",
      price: "$70.000",
      features: ["Atención 24/7", "Integración con agenda", "Respuestas inteligentes"],
      premium: false,
    },
    {
      title: "Agente Telefónico",
      description: "Nuestra IA avanzada contesta las llamadas de tus clientes de manera fluida y natural para agendar citas sin que tengas que atender el teléfono.",
      price: "$100.000",
      features: ["Voz natural humana", "Agendamiento en tiempo real", "Filtro de llamadas"],
      premium: false,
    },
    {
      title: "Ecosistema Total",
      description: "La solución definitiva. Combinamos el Agente de WhatsApp y el Telefónico para cubrir todos tus canales de comunicación de forma automática.",
      price: "$150.000",
      features: ["WhatsApp + Teléfono", "Sincronización perfecta", "Delegación absoluta"],
      premium: true,
    },
  ];

  return (
    <section className="section" id="servicios">
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <p className="eyebrow">Nuestros Servicios</p>
        <h2 className="font-heading">Soluciones que liberan tu tiempo.</h2>
        <p style={{ margin: "0 auto" }}>Elegí el nivel de automatización que tu negocio necesita.</p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`service-card ${service.premium ? "service-card-premium" : ""}`}
          >
            {service.premium && <div className="premium-badge">MÁS POPULAR</div>}
            <h3 className="service-title font-heading">{service.title}</h3>
            <p className="service-desc">{service.description}</p>
            <div className="service-price">
              <span className="price-label">Desde</span>
              <span className="price-value font-heading">{service.price}</span>
            </div>
            <ul className="service-features">
              {service.features.map((feat) => (
                <li key={feat}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>
            <a href="mailto:contacto@vibra.agency" style={{ width: "100%", display: "block" }}>
              <Button style={{ width: "100%", padding: "1rem" }}>
                Me interesa
              </Button>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
