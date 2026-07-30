"use client";

import { useState } from "react";
import PhoneShell from "../../PhoneShell";
import WhatsAppChat from "../../whatsapp/WhatsAppChat";
import { CHAT, CHAT_HASTA_PASO_1, NEGOCIO } from "../script";
import { useStepPlayer } from "../useStepPlayer";

/**
 * PANTALLA 2 — el agente atiende y agenda.
 *
 * Sigue el mismo hilo de la pantalla 1 (arranca con el mensaje del cliente ya
 * mandado) y lo completa hasta la tarjeta de turno confirmado.
 *
 * El ritmo esta escrito a mano y no derivado del largo del texto: cada pausa
 * es una decision de lectura. La mas importante es la de "dame un segundo que
 * reviso la agenda" — ese silencio es el que se lee como el sistema
 * consultando la disponibilidad de verdad.
 */

// Por mensaje revelado: cuanto "escribe" antes y cuanto se deja leer despues.
// El total ronda los 9 s: alcanza para leer sin que se haga larga (es la unica
// pantalla con seis eventos encadenados).
const RITMO: { escribe: number; lee: number }[] = [
  { escribe: 1000, lee: 1000 }, // 1 · bot saluda y pregunta el servicio
  { escribe: 650, lee: 600 }, //   2 · cliente: "Corte + barba"
  { escribe: 700, lee: 900 }, //   3 · bot: "reviso la agenda"
  { escribe: 800, lee: 1100 }, //  4 · bot: horarios libres
  { escribe: 650, lee: 600 }, //   5 · cliente: "El de las 16"
  { escribe: 950, lee: 0 }, //     6 · tarjeta de turno confirmado
];

export default function Step2BotAgenda() {
  const [visible, setVisible] = useState(CHAT_HASTA_PASO_1);
  const [typing, setTyping] = useState(false);
  const [contactTyping, setContactTyping] = useState(false);

  useStepPlayer(
    async ({ wait, alive }) => {
      await wait(600);

      for (let i = CHAT_HASTA_PASO_1; i < CHAT.length && alive(); i++) {
        const ritmo = RITMO[i - CHAT_HASTA_PASO_1];
        const esBot = CHAT[i].who === "bot";

        // El agente escribe con la burbuja de puntitos; el cliente, con el
        // "escribiendo…" de la cabecera. Igual que WhatsApp real.
        if (esBot) setTyping(true);
        else setContactTyping(true);
        await wait(ritmo.escribe);
        if (!alive()) return;
        setTyping(false);
        setContactTyping(false);

        setVisible(i + 1);
        await wait(ritmo.lee);
      }
    },
    () => {
      setVisible(CHAT.length);
      setTyping(false);
      setContactTyping(false);
    }
  );

  return (
    <div className="demo-escena demo-escena-2">
      <div className="demo-phone-grande">
        <PhoneShell>
          <WhatsAppChat
            contactName={NEGOCIO.nombre}
            messages={CHAT.slice(0, visible)}
            typing={typing}
            contactTyping={contactTyping}
            unreadCount={3}
          />
        </PhoneShell>
      </div>
    </div>
  );
}
