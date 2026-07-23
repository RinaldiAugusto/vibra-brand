import Image from "next/image";

// Perfiles oficiales. Para sumar una red: agregar una entrada con su path de
// SVG (viewBox 24x24) — el markup del link y el estilo salen del map.
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/vibra.agencia.ai/",
    // Marco + lente + flash del logo de Instagram.
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/vibra-ia/",
    // Brazo de la "n", barra de la "i" y su punto.
    icon: (
      <>
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-13h4v1.5A6 6 0 0116 8z" />
        <line x1="4" y1="9" x2="4" y2="21" />
        <circle cx="4" cy="4" r="1.5" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Image src="/vibra-logo.png" alt="Vibra" width={1975} height={954} />
        </div>

        <ul className="footer-socials">
          {SOCIALS.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {social.icon}
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Vibra Agency. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
