export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          vibra<span className="dot" />
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Vibra Agency. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
