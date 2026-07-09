"use client";

import { motion } from "framer-motion";

// ---- ESQUELETO ----
// "Sobre Nosotros": historia breve de la agencia + equipo.
// Reemplazar el texto de historia y los miembros del equipo por el copy real.
// Para las fotos: reemplazar el avatar placeholder por <Image> cuando estén.
const team = [
  { name: "[Nombre 1]", role: "[Rol 1]" },
  { name: "[Nombre 2]", role: "[Rol 2]" },
  { name: "[Nombre 3]", role: "[Rol 3]" },
];

export default function SobreNosotrosSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="section"
      id="sobre-nosotros"
    >
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <p className="eyebrow">[EYEBROW — ej. Sobre Nosotros]</p>
        <h2 className="font-heading">[TÍTULO DE LA SECCIÓN — Quiénes somos]</h2>
      </div>

      {/* Historia breve */}
      <div className="about-story">
        <p>[Párrafo 1 — historia de la agencia, placeholder]</p>
        <p>[Párrafo 2 — misión / enfoque, placeholder]</p>
      </div>

      {/* Equipo */}
      <div className="team-grid">
        {team.map((member) => (
          <div key={member.name} className="team-card">
            <div className="team-avatar" aria-hidden>
              {/* Reemplazar por <Image> cuando haya foto */}
            </div>
            <h3 className="team-name font-heading">{member.name}</h3>
            <p className="team-role">{member.role}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
