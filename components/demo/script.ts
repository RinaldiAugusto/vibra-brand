import type { WaMessage } from "../whatsapp/WhatsAppChat";

/**
 * GUION UNICO de la demo.
 *
 * Las seis pantallas cuentan UN turno: el mismo cliente, servicio, profesional
 * y horario aparecen en el chat de WhatsApp, en el JSON que sale de n8n, en el
 * hilo del CRM y en el turnero del mes. Esa continuidad es lo que hace que se
 * lea como un sistema y no como seis maquetas sueltas — por eso todo sale de
 * este archivo y ninguna pantalla escribe datos propios.
 *
 * Todo es simulado: no hay backend, ni fetch, ni datos reales de nadie.
 */

export const NEGOCIO = {
  nombre: "Barbería Kraken",
  web: "barberiakraken.com.ar",
  n8n: "kraken.app.n8n.cloud/workflow/turnos",
  crm: "kraken.vibra.app/conversaciones",
  crmPanel: "kraken.vibra.app/panel",
} as const;

export const TURNO = {
  cliente: "Juan Pérez",
  telefono: "+54 9 11 5527-8841",
  servicio: "Corte + barba",
  profesional: "Nico",
  fechaLarga: "hoy, miércoles 29 de julio",
  fechaIso: "2026-07-29",
  hora: "16:00",
  duracionMin: 45,
  precio: "$14.500",
} as const;

/** Fecha fija del turnero: constante, no `new Date()`, para que el HTML del
 *  servidor y el del cliente sean identicos (si no, hidratacion rota). */
export const CALENDARIO = {
  mes: "Julio 2026",
  dias: 31,
  /** Dia de la semana del 1 de julio de 2026: miercoles (0 = lunes). */
  offset: 2,
  hoy: 29,
} as const;

/** El mensaje que la web deja precargado en WhatsApp. */
export const PRIMER_MENSAJE = "Hola! tienen turno hoy?";

/**
 * El hilo completo. La pantalla 1 muestra solo el primer mensaje (el que manda
 * el cliente desde la web); la 2 revela el resto de a uno.
 */
export const CHAT: WaMessage[] = [
  { who: "client", text: PRIMER_MENSAJE, time: "16:02" },
  {
    who: "bot",
    text: `¡Hola Juan! 👋 Soy el asistente de ${NEGOCIO.nombre}. Sí, hoy nos queda lugar. ¿Qué te hacés: corte, barba, o corte + barba?`,
    time: "16:02",
  },
  { who: "client", text: "Corte + barba", time: "16:02" },
  { who: "bot", text: "Perfecto. Dame un segundo que reviso la agenda 📅", time: "16:03" },
  {
    who: "bot",
    text: `Con ${TURNO.profesional} me quedan estos horarios para hoy:\n10:00 · 16:00 · 18:30\n¿Cuál te sirve?`,
    time: "16:03",
  },
  { who: "client", text: "El de las 16", time: "16:03" },
  {
    who: "bot",
    text: "¡Listo Juan! Te lo dejo agendado 👇",
    time: "16:03",
    card: {
      title: "Turno confirmado ✅",
      rows: [
        { label: "Servicio", value: TURNO.servicio },
        { label: "Con", value: TURNO.profesional },
        { label: "Cuándo", value: `Hoy 16:00 hs` },
        { label: "Duración", value: `${TURNO.duracionMin} min` },
      ],
      footer: "Te mando un recordatorio 24 h antes. Si necesitás cambiarlo, escribime por acá.",
    },
  },
];

/** Cuántos mensajes del hilo se ven al terminar cada pantalla. */
export const CHAT_HASTA_PASO_1 = 1;

/* ============================================================
   Copy del panel de relato — uno por pantalla
   ============================================================ */

export type PasoMeta = {
  /** Etiqueta corta para los puntos del stepper. */
  chip: string;
  titulo: string;
  bajada: string;
};

export const PASOS: PasoMeta[] = [
  {
    chip: "La web",
    titulo: "El cliente entra por tu web",
    bajada:
      "Toca “Agendar turno” y WhatsApp se abre solo, con el mensaje ya escrito. Sin formularios ni descargar nada: entra por el canal que ya usa todos los días.",
  },
  {
    chip: "El agente",
    titulo: "El agente atiende y agenda",
    bajada:
      "Entiende el pedido, consulta la agenda real, ofrece solo los horarios libres y bloquea el que el cliente elige. Un miércoles a las 16:02, sin que nadie del equipo toque el teléfono.",
  },
  {
    chip: "El flujo",
    titulo: "La automatización se dispara",
    bajada:
      "Detrás de la conversación corre el flujo: entra el mensaje, responde el agente, se programa el recordatorio y el turno queda escrito en el sistema. Cuatro pasos, un segundo.",
  },
  {
    chip: "El dato",
    titulo: "El turno nace cargado",
    bajada:
      "Esto es lo que sale del flujo y entra al sistema. Nadie copia y pega: el turno llega estructurado, con cliente, profesional, horario y recordatorio ya definidos.",
  },
  {
    chip: "El CRM",
    titulo: "Vos ves todo — y podés meterte",
    bajada:
      "Cada conversación queda guardada con lo que dijo el agente. Si querés tomar el control, tocás “Responder manual” y seguís vos desde el mismo lugar.",
  },
  {
    chip: "El panel",
    titulo: "Tu operación, en una pantalla",
    bajada:
      "Turnos, conversaciones, recordatorios y la agenda del mes. Todo lo que acaba de pasar ya está acá: esto es el Sistema Total funcionando.",
  },
];

export const TOTAL_PASOS = PASOS.length;
