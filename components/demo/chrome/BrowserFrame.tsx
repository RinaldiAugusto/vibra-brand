/**
 * Marco de navegador para las pantallas que no pasan por el celular (la web de
 * la barberia, n8n y el CRM). Mismo lenguaje visual que el .mockup-desktop del
 * landing —barra con tres puntos, pantalla oscura recortada— mas una pastilla
 * de URL, que es lo que le dice al visitante en que aplicacion esta parado.
 */
export default function BrowserFrame({
  url,
  children,
  className = "",
}: {
  url: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`demo-browser ${className}`.trim()}>
      <div className="demo-browser-bar">
        <span className="demo-browser-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="demo-browser-url">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
            <path d="M8 10.5V7.5a4 4 0 018 0v3" />
          </svg>
          {url}
        </span>
      </div>
      <div className="demo-browser-screen">{children}</div>
    </div>
  );
}
