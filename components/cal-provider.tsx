"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

/**
 * Monta la API de Cal.com una sola vez para toda la app.
 * Configura el tema oscuro y el color de marca de Vibra (--cyan-400 / --accent).
 * No renderiza nada visible: los disparadores del modal son los botones con
 * los atributos data-cal-link / data-cal-config.
 */
export default function CalProvider() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#29d3ee" } },
      });
    })();
  }, []);

  return null;
}
