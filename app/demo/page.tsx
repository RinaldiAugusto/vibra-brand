import type { Metadata } from "next";
import DemoPlayer from "@/components/demo/DemoPlayer";

export const metadata: Metadata = {
  title: "Demo — Un turno agendado solo | Vibra",
  description:
    "Recorré en seis pantallas cómo un cliente saca un turno por WhatsApp y el turno llega solo a tu agenda, tu CRM y tus recordatorios.",
  openGraph: {
    title: "Demo — Un turno agendado solo | Vibra",
    description:
      "Seis pantallas: de la web del negocio al WhatsApp del cliente, y del flujo automático al CRM del dueño.",
    url: "https://vibra.agency/demo",
    siteName: "Vibra",
    locale: "es_AR",
    type: "website",
  },
};

export default function DemoPage() {
  return (
    <>
      <div className="demo-intro">
        <p className="eyebrow">
          <span className="marker-underline">Demostración interactiva</span>
        </p>
        <h1 className="demo-intro-title font-heading">
          Un turno que se agenda solo
        </h1>
        <p className="demo-intro-sub">
          Seguí el mismo turno de una barbería a través de todo el sistema: la
          web, el WhatsApp del cliente, la automatización y el CRM del dueño.
        </p>
      </div>

      <DemoPlayer />
    </>
  );
}
