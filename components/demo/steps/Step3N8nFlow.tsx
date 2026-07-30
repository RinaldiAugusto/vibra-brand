"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "../../motion";
import BrowserFrame from "../chrome/BrowserFrame";
import N8nCanvas, { N8N_NODOS } from "../chrome/N8nCanvas";
import { NEGOCIO } from "../script";
import { useStepPlayer } from "../useStepPlayer";

/**
 * PANTALLA 3 — la automatizacion ejecutandose.
 *
 * El mismo minuto de la conversacion, visto por atras. Cada nodo se enciende,
 * pasa el dato al siguiente y queda con su tilde verde, igual que una ejecucion
 * real de n8n.
 */
export default function Step3N8nFlow() {
  const [ejecutando, setEjecutando] = useState(-1);
  const [listos, setListos] = useState(0);
  const [conectores, setConectores] = useState(0);
  const [fin, setFin] = useState(false);

  useStepPlayer(
    async ({ wait, alive }) => {
      await wait(500);

      for (let i = 0; i < N8N_NODOS.length && alive(); i++) {
        setEjecutando(i);
        await wait(560);
        if (!alive()) return;
        setEjecutando(-1);
        setListos(i + 1);
        await wait(180);
        if (i < N8N_NODOS.length - 1) {
          setConectores(i + 1);
          await wait(420);
        }
      }

      await wait(320);
      setFin(true);
    },
    () => {
      setListos(N8N_NODOS.length);
      setConectores(N8N_NODOS.length - 1);
      setFin(true);
    }
  );

  return (
    <div className="demo-escena demo-escena-3">
      <BrowserFrame url={NEGOCIO.n8n}>
        <div className="n8n-app">
          <div className="n8n-topbar">
            <span className="n8n-wf">
              <span className="n8n-mark" aria-hidden />
              Turnos · {NEGOCIO.nombre}
            </span>
            <span className="n8n-tabs" aria-hidden>
              <span className="n8n-tab n8n-tab-on">Editor</span>
              <span className="n8n-tab">Ejecuciones</span>
            </span>
            <span className="n8n-activo" aria-hidden>
              <span className="n8n-switch" />
              Activo
            </span>
          </div>

          <N8nCanvas
            ejecutando={ejecutando}
            listos={listos}
            conectores={conectores}
          />

          <div className="n8n-statusbar">
            <motion.span
              className="n8n-status-pill"
              initial={false}
              animate={{ opacity: fin ? 1 : 0, y: fin ? 0 : 8 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Ejecución completada · 1,2 s
            </motion.span>
          </div>
        </div>
      </BrowserFrame>
    </div>
  );
}
