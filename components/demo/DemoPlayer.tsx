"use client";

import { useCallback, useEffect, useState } from "react";
import DemoStage from "./DemoStage";
import DemoStepper from "./DemoStepper";
import { TOTAL_PASOS } from "./script";
import Step1WebToWhatsapp from "./steps/Step1WebToWhatsapp";
import Step2BotAgenda from "./steps/Step2BotAgenda";
import Step3N8nFlow from "./steps/Step3N8nFlow";
import Step4N8nNodeDetail from "./steps/Step4N8nNodeDetail";
import Step5CrmConversation from "./steps/Step5CrmConversation";
import Step6CrmPanel from "./steps/Step6CrmPanel";

/** Destino del CTA final: el mismo ancla de contacto que usa toda la landing. */
const CTA_HREF = "/#contacto-final";

const PANTALLAS = [
  Step1WebToWhatsapp,
  Step2BotAgenda,
  Step3N8nFlow,
  Step4N8nNodeDetail,
  Step5CrmConversation,
  Step6CrmPanel,
];

/**
 * Orquestador de la demo. Todo su estado es cual pantalla se ve y hacia donde
 * vamos (para que el slide entre en la direccion correcta).
 *
 * Las pantallas se montan y desmontan al cambiar de paso, asi que cada una
 * reproduce su animacion de cero cada vez que se entra — incluso volviendo
 * atras. Ver useStepPlayer.
 */
export default function DemoPlayer() {
  const [paso, setPaso] = useState(0);
  const [dir, setDir] = useState(1);

  const ir = useCallback(
    (n: number) => {
      const destino = Math.min(TOTAL_PASOS - 1, Math.max(0, n));
      if (destino === paso) return;
      setDir(destino > paso ? 1 : -1);
      setPaso(destino);
    },
    [paso]
  );

  // Teclado: la demo es un recorrido, y un recorrido se maneja con flechas.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // No secuestrar las flechas mientras se navega un control con teclado.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") ir(paso + 1);
      else if (e.key === "ArrowLeft") ir(paso - 1);
      else if (e.key === "Home") ir(0);
      else if (e.key === "End") ir(TOTAL_PASOS - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ir, paso]);

  const Pantalla = PANTALLAS[paso];

  return (
    <div className="demo-shell">
      <DemoStage paso={paso} dir={dir}>
        <Pantalla />
      </DemoStage>

      <DemoStepper paso={paso} ir={ir} ctaHref={CTA_HREF} />

      <p className="demo-hint">
        Usá las flechas <kbd>←</kbd> <kbd>→</kbd> para moverte. Todo lo que ves
        es una simulación.
      </p>
    </div>
  );
}
