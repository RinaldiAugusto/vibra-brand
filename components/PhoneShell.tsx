/**
 * Frame de celular: el render de iPhone con la pantalla calada
 * (public/iphone-frame.png) apoyado ENCIMA de lo que se dibuje adentro. El
 * bisel y la isla dinamica tapan solos los bordes del contenido, asi que la UI
 * de adentro no tiene que recortarse ni redibujar nada. Ver las medidas y el
 * porque en globals.css → "Frame de celular (vertical)".
 *
 * Lo comparten el mockup del landing (AgentsFanMockup) y la demo de /demo.
 */
export default function PhoneShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mockup-phone">
      <div className="mockup-phone-display">{children}</div>
    </div>
  );
}
