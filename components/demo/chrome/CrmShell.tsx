"use client";

/**
 * Chrome del CRM: la barra lateral y el encabezado que comparten las pantallas
 * 5 y 6. Que sea el MISMO marco en las dos es parte del argumento — la
 * conversacion y el panel no son dos productos, son dos secciones del mismo
 * sistema; entre una pantalla y la otra solo cambia que item del menu esta
 * encendido.
 */

function IconoPanel() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </svg>
  );
}

function IconoChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.4 8.4 0 01-9 8.5 9.5 9.5 0 01-4-.9L3 20l1.9-4.1A8.4 8.4 0 013.5 11 8.5 8.5 0 0112 3a8.4 8.4 0 019 8.5z" />
    </svg>
  );
}

function IconoAgenda() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8.5 3v4M15.5 3v4" />
    </svg>
  );
}

function IconoClientes() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="8" r="3.6" />
      <path d="M2.8 20c.6-3.4 3.2-5.2 6.2-5.2s5.6 1.8 6.2 5.2" />
      <path d="M16.5 5.2a3.4 3.4 0 010 6.4M18.2 14.9c2.2.5 3.7 2.2 4.1 5.1" />
    </svg>
  );
}

export type SeccionCrm = "panel" | "conversaciones" | "turnos" | "clientes";

const MENU: { id: SeccionCrm; label: string; icono: React.ReactNode }[] = [
  { id: "panel", label: "Panel", icono: <IconoPanel /> },
  { id: "conversaciones", label: "Conversaciones", icono: <IconoChat /> },
  { id: "turnos", label: "Turnos", icono: <IconoAgenda /> },
  { id: "clientes", label: "Clientes", icono: <IconoClientes /> },
];

export default function CrmShell({
  activa,
  negocio,
  children,
}: {
  activa: SeccionCrm;
  negocio: string;
  children: React.ReactNode;
}) {
  return (
    <div className="crmx-app">
      <aside className="crmx-side">
        <span className="crmx-brand">
          <span className="crmx-brand-mark" aria-hidden>
            ✂
          </span>
          <span className="crmx-brand-text">{negocio}</span>
        </span>

        <nav className="crmx-menu" aria-hidden>
          {MENU.map((m) => (
            <span
              key={m.id}
              className={`crmx-menu-item${
                m.id === activa ? " crmx-menu-item-on" : ""
              }`}
            >
              <span className="crmx-menu-icon">{m.icono}</span>
              <span className="crmx-menu-label">{m.label}</span>
            </span>
          ))}
        </nav>

        <span className="crmx-user" aria-hidden>
          <span className="crmx-avatar">M</span>
          <span className="crmx-user-text">
            <span className="crmx-user-name">Martín</span>
            <span className="crmx-user-rol">Dueño</span>
          </span>
        </span>
      </aside>

      <div className="crmx-main">{children}</div>
    </div>
  );
}
