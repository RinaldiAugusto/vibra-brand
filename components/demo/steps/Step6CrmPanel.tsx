"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "../../motion";
import BrowserFrame from "../chrome/BrowserFrame";
import CrmShell from "../chrome/CrmShell";
import { CALENDARIO, NEGOCIO, TURNO } from "../script";
import { countUp, useStepPlayer } from "../useStepPlayer";

/**
 * PANTALLA 6 — el panel y el turnero del mes.
 *
 * El cierre: todo lo que paso en las cinco pantallas anteriores ya esta acá.
 * El turno de las 16:00 aparece marcado en el dia de hoy y encabeza la lista,
 * asi el visitante puede seguir el mismo dato desde el WhatsApp hasta el
 * tablero del dueño.
 */

const STATS = [
  { label: "Conversaciones", target: 128, suf: "" },
  { label: "Turnos del mes", target: 67, suf: "" },
  { label: "Recordatorios", target: 45, suf: "" },
  { label: "Ocupación", target: 18, suf: "%", pre: "+" },
];

const SEMANA = [
  { dia: "L", alto: 44 },
  { dia: "M", alto: 66 },
  { dia: "M", alto: 52 },
  { dia: "J", alto: 78 },
  { dia: "V", alto: 60 },
  { dia: "S", alto: 92 },
  { dia: "D", alto: 0 },
];

const AGENDA_HOY = [
  { hora: "11:00", cliente: "Sofía Ruiz", servicio: "Corte clásico", pro: "Ema" },
  { hora: "14:30", cliente: "Martín Díaz", servicio: "Perfilado de barba", pro: "Nico" },
  {
    hora: TURNO.hora,
    cliente: TURNO.cliente,
    servicio: TURNO.servicio,
    pro: TURNO.profesional,
    nuevo: true,
  },
  { hora: "18:30", cliente: "Diego Sosa", servicio: "Corte + barba", pro: "Ema" },
];

/**
 * Carga de cada dia del mes, deterministica: nada de Math.random ni new Date,
 * asi el HTML del servidor y el del cliente son identicos (si no, hidratacion
 * rota). Los domingos la barberia cierra.
 */
function cargaDelDia(d: number) {
  const domingo = (d + 1) % 7 === 6;
  if (domingo) return -1;
  return (d * 13) % 4; // 0-3 puntitos
}

export default function Step6CrmPanel() {
  const [valores, setValores] = useState(STATS.map(() => 0));
  const [barras, setBarras] = useState(false);
  const [calendario, setCalendario] = useState(false);
  const [nuevo, setNuevo] = useState(false);

  useStepPlayer(
    async ({ wait, alive }) => {
      await wait(300);
      await Promise.all(
        STATS.map((s, i) =>
          countUp(
            s.target,
            (n) => setValores((prev) => prev.map((v, j) => (j === i ? n : v))),
            alive,
            1100
          )
        )
      );
      if (!alive()) return;
      setBarras(true);
      await wait(500);
      setCalendario(true);
      await wait(800);
      setNuevo(true);
    },
    () => {
      setValores(STATS.map((s) => s.target));
      setBarras(true);
      setCalendario(true);
      setNuevo(true);
    }
  );

  const celdas = [
    ...Array.from({ length: CALENDARIO.offset }, () => null),
    ...Array.from({ length: CALENDARIO.dias }, (_, i) => i + 1),
  ];

  return (
    <div className="demo-escena demo-escena-6">
      <BrowserFrame url={NEGOCIO.crmPanel}>
        <CrmShell activa="panel" negocio={NEGOCIO.nombre}>
          <div className="crmx-panel">
            {/* ---- Stats ---- */}
            <div className="crmx-stats">
              {STATS.map((s, i) => (
                <div key={s.label} className="crmx-stat">
                  <span className="crmx-stat-valor">
                    {s.pre}
                    {valores[i]}
                    {s.suf}
                  </span>
                  <span className="crmx-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="crmx-panel-cols">
              {/* ---- Turnero del mes ---- */}
              <div className="crmx-card crmx-card-cal">
                <span className="crmx-card-head">
                  Turnero · {CALENDARIO.mes}
                </span>

                <div className="crmx-cal-dow" aria-hidden>
                  {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                    <span key={i}>{d}</span>
                  ))}
                </div>

                <div className="crmx-cal">
                  {celdas.map((d, i) =>
                    d === null ? (
                      <span key={`v${i}`} className="crmx-cal-dia crmx-cal-vacio" />
                    ) : (
                      <motion.span
                        key={d}
                        className={[
                          "crmx-cal-dia",
                          cargaDelDia(d) < 0 ? "crmx-cal-cerrado" : "",
                          d === CALENDARIO.hoy ? "crmx-cal-hoy" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        initial={false}
                        animate={{ opacity: calendario ? 1 : 0.15 }}
                        transition={{
                          duration: 0.3,
                          delay: calendario ? d * 0.008 : 0,
                        }}
                      >
                        {d}
                        {cargaDelDia(d) > 0 && (
                          <span className="crmx-cal-carga" aria-hidden>
                            {Array.from({ length: cargaDelDia(d) }, (_, k) => (
                              <span key={k} />
                            ))}
                          </span>
                        )}
                      </motion.span>
                    )
                  )}
                </div>

                <span className="crmx-cal-legend">
                  Cada punto es un turno tomado · los domingos cerramos
                </span>
              </div>

              {/* ---- Semana + agenda de hoy ---- */}
              <div className="crmx-panel-col">
                <div className="crmx-card">
                  <span className="crmx-card-head">Turnos por día</span>
                  <div className="crmx-chart" aria-hidden>
                    {SEMANA.map((b, i) => (
                      <span key={i} className="crmx-chart-col">
                        <motion.span
                          className="crmx-bar"
                          initial={false}
                          animate={{ scaleY: barras ? Math.max(b.alto, 3) / 100 : 0 }}
                          transition={{
                            duration: 0.5,
                            ease: EASE_OUT,
                            delay: barras ? i * 0.06 : 0,
                          }}
                        />
                        <span className="crmx-bar-dia">{b.dia}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="crmx-card crmx-card-grow">
                  <span className="crmx-card-head">
                    Agenda de hoy
                    <span className="crmx-card-sub">{TURNO.fechaLarga}</span>
                  </span>

                  <div className="crmx-agenda">
                    {AGENDA_HOY.map((t) => (
                      <motion.div
                        key={t.hora}
                        className={`crmx-turno${
                          t.nuevo && nuevo ? " crmx-turno-nuevo" : ""
                        }`}
                        initial={false}
                        animate={{ opacity: calendario ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="crmx-turno-hora">{t.hora}</span>
                        <span className="crmx-turno-main">
                          <span className="crmx-turno-cliente">{t.cliente}</span>
                          <span className="crmx-turno-serv">
                            {t.servicio} · {t.pro}
                          </span>
                        </span>
                        {t.nuevo && nuevo && (
                          <motion.span
                            className="crmx-turno-tag"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, ease: EASE_OUT }}
                          >
                            nuevo
                          </motion.span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CrmShell>
      </BrowserFrame>
    </div>
  );
}
