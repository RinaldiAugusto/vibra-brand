import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Image src="/vibra-logo.png" alt="Vibra" width={1975} height={954} />
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Vibra Agency. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
