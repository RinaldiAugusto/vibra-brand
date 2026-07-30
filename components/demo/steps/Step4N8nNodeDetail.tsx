"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "../../motion";
import BrowserFrame from "../chrome/BrowserFrame";
import N8nCanvas, { N8N_NODOS } from "../chrome/N8nCanvas";
import { NEGOCIO, TURNO } from "../script";
import { useStepPlayer } from "../useStepPlayer";

/**
 * PANTALLA 4 — el dato que sale del flujo.
 *
 * El panel de nodo de n8n (input a la izquierda, output a la derecha) sobre el
 * canvas atenuado. El JSON de la derecha se escribe solo: es LO MISMO que el
 * cliente pidio por WhatsApp, ya estructurado y listo para entrar al sistema.
 * Todos los valores salen del guion (script.ts), no estan escritos acá.
 */

type Linea = {
  clave: string;
  valor: string;
  /** Cambia el color: los strings van en verde, los numeros y booleanos no. */
  tipo: "texto" | "numero";
};

const ENTRADA: Linea[] = [
  { clave: "intencion", valor: '"reservar_turno"', tipo: "texto" },
  { clave: "servicio", valor: `"${TURNO.servicio}"`, tipo: "texto" },
  { clave: "profesional", valor: `"${TURNO.profesional}"`, tipo: "texto" },
  { clave: "fecha", valor: `"${TURNO.fechaIso}"`, tipo: "texto" },
  { clave: "hora", valor: `"${TURNO.hora}"`, tipo: "texto" },
];

const SALIDA: Linea[] = [
  { clave: "turno_id", valor: '"TRN-2148"', tipo: "texto" },
  { clave: "cliente", valor: `"${TURNO.cliente}"`, tipo: "texto" },
  { clave: "telefono", valor: `"${TURNO.telefono}"`, tipo: "texto" },
  { clave: "servicio", valor: `"${TURNO.servicio}"`, tipo: "texto" },
  { clave: "profesional", valor: `"${TURNO.profesional}"`, tipo: "texto" },
  { clave: "inicio", valor: `"${TURNO.fechaIso}T16:00:00-03:00"`, tipo: "texto" },
  { clave: "duracion_min", valor: String(TURNO.duracionMin), tipo: "numero" },
  { clave: "precio", valor: "14500", tipo: "numero" },
  { clave: "estado", valor: '"confirmado"', tipo: "texto" },
  { clave: "recordatorio", valor: '"2026-07-28T16:00:00-03:00"', tipo: "texto" },
  { clave: "origen", valor: '"whatsapp"', tipo: "texto" },
];

function BloqueJson({
  lineas,
  hasta,
  parcial,
  caret,
}: {
  lineas: Linea[];
  /** Cuantas lineas ya estan completas. */
  hasta: number;
  /** Valor a medio escribir de la linea `hasta`. */
  parcial?: string;
  caret?: boolean;
}) {
  return (
    <pre className="n8n-json">
      <code>
        <span className="n8n-json-brace">{"{"}</span>
        {lineas.slice(0, hasta).map((l, i) => (
          <span key={l.clave} className="n8n-json-line">
            {"  "}
            <span className="n8n-json-key">&quot;{l.clave}&quot;</span>
            <span className="n8n-json-punct">: </span>
            <span className={`n8n-json-val n8n-json-val-${l.tipo}`}>
              {l.valor}
            </span>
            {i < lineas.length - 1 && (
              <span className="n8n-json-punct">,</span>
            )}
          </span>
        ))}

        {parcial !== undefined && hasta < lineas.length && (
          <span className="n8n-json-line">
            {"  "}
            <span className="n8n-json-key">
              &quot;{lineas[hasta].clave}&quot;
            </span>
            <span className="n8n-json-punct">: </span>
            <span className={`n8n-json-val n8n-json-val-${lineas[hasta].tipo}`}>
              {parcial}
            </span>
            {caret && <span className="n8n-caret" aria-hidden />}
          </span>
        )}

        <span className="n8n-json-line">
          <span className="n8n-json-brace">{"}"}</span>
        </span>
      </code>
    </pre>
  );
}

export default function Step4N8nNodeDetail() {
  const [abierto, setAbierto] = useState(false);
  const [hasta, setHasta] = useState(0);
  const [parcial, setParcial] = useState<string | undefined>(undefined);
  const [guardado, setGuardado] = useState(false);

  useStepPlayer(
    async ({ wait, alive }) => {
      await wait(320);
      setAbierto(true);
      await wait(650);

      for (let i = 0; i < SALIDA.length && alive(); i++) {
        const valor = SALIDA[i].valor;
        for (let c = 1; c <= valor.length && alive(); c++) {
          setParcial(valor.slice(0, c));
          await wait(9);
        }
        setHasta(i + 1);
        setParcial("");
        await wait(55);
      }

      if (!alive()) return;
      setParcial(undefined);
      await wait(420);
      setGuardado(true);
    },
    () => {
      setAbierto(true);
      setHasta(SALIDA.length);
      setParcial(undefined);
      setGuardado(true);
    }
  );

  const ultimo = N8N_NODOS.length - 1;

  return (
    <div className="demo-escena demo-escena-4">
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

          <div className="n8n-stage">
            <N8nCanvas
              listos={N8N_NODOS.length}
              conectores={N8N_NODOS.length - 1}
              seleccionado={ultimo}
              atenuado={abierto}
            />

            {/* Panel del nodo (NDV) */}
            <motion.div
              className="n8n-ndv"
              initial={false}
              animate={
                abierto
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.96, y: 10 }
              }
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <div className="n8n-ndv-head">
                <span className="n8n-ndv-titulo">
                  {N8N_NODOS[ultimo].titulo}
                </span>
                <span className="n8n-ndv-ok" aria-hidden>
                  1 item · 214 ms
                </span>
              </div>

              <div className="n8n-ndv-cols">
                <div className="n8n-ndv-col">
                  <span className="n8n-ndv-label">Entrada</span>
                  <BloqueJson lineas={ENTRADA} hasta={ENTRADA.length} />
                </div>

                <div className="n8n-ndv-col n8n-ndv-col-out">
                  <span className="n8n-ndv-label">Salida</span>
                  <BloqueJson
                    lineas={SALIDA}
                    hasta={hasta}
                    parcial={parcial}
                    caret
                  />
                </div>
              </div>

              <motion.div
                className="n8n-ndv-foot"
                initial={false}
                animate={{ opacity: guardado ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Turno escrito en el sistema — sin que nadie lo cargue a mano
              </motion.div>
            </motion.div>
          </div>
        </div>
      </BrowserFrame>
    </div>
  );
}
