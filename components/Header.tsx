"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "./Button";

/**
 * Header fijo con navegacion colapsable.
 *
 * Mobile (base): logo + boton hamburguesa. Los links viven en un panel que se
 * despliega bajo la barra. Desktop (>=768px): el panel se vuelve una fila
 * horizontal siempre visible y el boton desaparece.
 *
 * El toggle es estado de React, no listeners sobre el DOM: el panel se
 * renderiza igual en SSR y solo cambia la clase. Los unicos listeners nativos
 * son los de cerrar (click afuera / Escape), que por definicion escuchan fuera
 * del arbol del componente y se limpian al desmontar o al cerrar.
 */

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#faq", label: "Preguntas" },
  { href: "#sobre-nosotros", label: "Nosotros" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLUListElement | null>(null);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Cerrar con click afuera y con Escape. Solo se suscribe mientras esta
  // abierto: cerrado no hay nada que escuchar.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (target instanceof Node && !navRef.current?.contains(target)) close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  // Al abrir, el foco entra al primer link para que el teclado siga el orden
  // visual en vez de quedarse detras del panel.
  //
  // El focus va diferido un frame a proposito: el panel cerrado tiene
  // visibility: hidden y un elemento invisible no acepta foco, asi que
  // llamarlo en el mismo commit que abre el menu no hace nada.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Si se pasa a desktop con el menu abierto, el panel ya es una fila fija:
  // hay que soltar el estado para que aria-expanded no mienta.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="header"
    >
      <div className="header-container" ref={navRef}>
        <Link href="/" className="header-logo" onClick={() => close()}>
          <Image
            src="/vibra-logo-dark.png"
            alt="Vibra"
            width={1975}
            height={954}
            priority
            quality={100}
          />
        </Link>

        <button
          type="button"
          ref={toggleRef}
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => (open ? close(true) : setOpen(true))}
        >
          <span className="nav-toggle-box" aria-hidden="true">
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </span>
        </button>

        <nav
          id="nav-menu"
          className={`site-nav${open ? " is-open" : ""}`}
          aria-label="Principal"
        >
          <ul className="nav-list" ref={panelRef}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="nav-link" onClick={() => close()}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            className="nav-cta"
            data-cal-link="augusto-rinaldi-r0s8ra/30min"
            data-cal-config='{"layout":"month_view"}'
            onClick={() => close()}
          >
            Agenda una Llamada
          </Button>
        </nav>
      </div>
    </motion.header>
  );
}
