"use client";

import { motion } from "framer-motion";
import Button from "./Button";
import AgentsFanMockup, {
  AgentChatMockup,
  AgentCallMockup,
} from "./AgentsFanMockup";
import AutomationDesktopMockup from "./AutomationDesktopMockup";
import CrmDashboardMockup from "./CrmDashboardMockup";
import { useBorderGlow } from "./useBorderGlow";

export interface ServiceSubBlock {
  title: string;
  description: string;
}

export type MockupType =
  | "phone"
  | "phone-render"
  | "desktop-render"
  | "desktop"
  | "combo"
  | "agents"
  | "chat"
  | "call"
  | "ops"
  | "crm";

export interface ServiceRowProps {
  title: string;
  /** Frase corta (italic) debajo del título. */
  tagline?: string;
  description: string;
  bullets: string[];
  mockup: MockupType;
  /** Si es true, el mockup va a la izquierda y la card a la derecha (desktop). */
  reverse?: boolean;
  /** Fila destacada (borde celeste + glow + badge). */
  highlighted?: boolean;
  /** Texto del badge cuando highlighted (ej. "Más Popular"). */
  badge?: string;
  /** Sub-bloques dentro de la card, antes de los bullets (ej. fila 2). */
  subBlocks?: ServiceSubBlock[];
  /** Caption chico debajo del mockup (ej. fila 3). */
  caption?: string;
  /** Video demo para el frame de celular (solo mockup "phone" standalone). */
  phoneVideoSrc?: string;
  /** Destino del CTA. */
  ctaHref: string;
  /** Texto del botón CTA. */
  ctaLabel?: string;
}

// ---- Frames de mockup en CSS puro ----
// El área .mockup-phone-display / .mockup-screen es donde va la captura real.
function PhoneFrame({ videoSrc }: { videoSrc?: string }) {
  return (
    <div className="mockup-phone">
      <div className="mockup-phone-camera" aria-hidden />
      <div className="mockup-phone-display">
        {videoSrc ? (
          // Demo viva: se reproduce sola, en loop, sin sonido ni controles.
          // El recorte a los bordes redondeados y el object-position (ajuste
          // por la dynamic island) se manejan en globals.css.
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
          />
        ) : (
          /* Pegá acá la captura vertical (celular): <img> o <Image> */
          <span className="mockup-placeholder">[imagen aquí]</span>
        )}
      </div>
    </div>
  );
}

// Render 3D del celular (fila Presencia): el video ya trae su propio marco de
// iPhone sobre fondo negro. No usa el frame CSS; el negro se funde con la
// sección oscura via mix-blend-mode:screen (ver globals.css). El teléfono rota
// sobre su eje dentro del clip, por eso se muestra el render completo.
function PhoneRenderMockup({ videoSrc }: { videoSrc?: string }) {
  return (
    <div className="mockup-phone-render">
      {videoSrc ? (
        <video src={videoSrc} autoPlay loop muted playsInline aria-hidden />
      ) : (
        <span className="mockup-placeholder">[video aquí]</span>
      )}
    </div>
  );
}

// Render 3D de la laptop (fila Operaciones): el video ya trae su propio marco de
// MacBook sobre fondo negro. Mismo truco que el celular render: no usa el frame
// CSS, el negro se funde con la sección via mix-blend-mode:lighten (ver
// globals.css). Es horizontal, por eso su contenedor es más ancho.
function DesktopRenderMockup({ videoSrc }: { videoSrc?: string }) {
  return (
    <div className="mockup-desktop-render">
      {videoSrc ? (
        <video src={videoSrc} autoPlay loop muted playsInline aria-hidden />
      ) : (
        <span className="mockup-placeholder">[video aquí]</span>
      )}
    </div>
  );
}

function DesktopFrame() {
  return (
    <div className="mockup mockup-desktop">
      <div className="mockup-desktop-bar" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="mockup-screen">
        {/* Pegá acá la captura horizontal (n8n / escritorio) */}
        <span className="mockup-placeholder">[imagen aquí]</span>
      </div>
    </div>
  );
}

function Mockup({
  type,
  caption,
  phoneVideoSrc,
}: {
  type: MockupType;
  caption?: string;
  phoneVideoSrc?: string;
}) {
  return (
    <div className="service-mockup-wrap">
      {/* El video solo va en el celular standalone; el combo (fila 4) queda intacto. */}
      {type === "phone" && <PhoneFrame videoSrc={phoneVideoSrc} />}
      {type === "phone-render" && <PhoneRenderMockup videoSrc={phoneVideoSrc} />}
      {type === "desktop-render" && <DesktopRenderMockup videoSrc={phoneVideoSrc} />}
      {type === "agents" && <AgentsFanMockup />}
      {type === "chat" && <AgentChatMockup />}
      {type === "call" && <AgentCallMockup />}
      {type === "ops" && <AutomationDesktopMockup />}
      {type === "crm" && <CrmDashboardMockup />}
      {type === "desktop" && <DesktopFrame />}
      {type === "combo" && (
        // Computadora al frente + un celular asomando por detrás del lado izquierdo.
        <div className="mockup-combo">
          <div className="mockup-combo-phone mockup-combo-phone-left">
            <PhoneFrame />
          </div>
          <div className="mockup-combo-desktop">
            <DesktopFrame />
          </div>
        </div>
      )}

      {caption && <p className="service-mockup-caption">{caption}</p>}
    </div>
  );
}

export default function ServiceRow({
  title,
  tagline,
  description,
  bullets,
  mockup,
  reverse = false,
  highlighted = false,
  badge,
  subBlocks,
  caption,
  phoneVideoSrc,
  ctaHref,
  ctaLabel = "Adaptar a mi negocio",
}: ServiceRowProps) {
  const glow = useBorderGlow<HTMLDivElement>();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`service-row ${reverse ? "service-row-reverse" : ""}`}
    >
      {/* --- Lado card --- */}
      <div
        ref={glow.ref}
        {...glow.handlers}
        className={`service-info-card border-glow ${
          highlighted ? "service-info-card-highlighted" : ""
        }`}
      >
        <span className="edge-light" aria-hidden />
        {highlighted && badge && (
          <div className="premium-badge">{badge}</div>
        )}

        <h3 className="service-title font-heading">{title}</h3>
        {tagline && <p className="service-tagline">{tagline}</p>}
        <p className="service-desc">{description}</p>

        {subBlocks && subBlocks.length > 0 && (
          <div className="service-subblocks">
            {subBlocks.map((sb) => (
              <div key={sb.title} className="service-subblock">
                <h4 className="service-subblock-title font-heading">
                  {sb.title}
                </h4>
                <p className="service-subblock-desc">{sb.description}</p>
              </div>
            ))}
          </div>
        )}

        <ul className="service-features">
          {bullets.map((feat) => (
            <li key={feat}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {feat}
            </li>
          ))}
        </ul>

        <a href={ctaHref} style={{ width: "100%", display: "block", marginTop: "auto" }}>
          <Button style={{ width: "100%", padding: "1rem" }}>
            {ctaLabel}
          </Button>
        </a>
      </div>

      {/* --- Lado mockup --- */}
      <Mockup type={mockup} caption={caption} phoneVideoSrc={phoneVideoSrc} />
    </motion.div>
  );
}
