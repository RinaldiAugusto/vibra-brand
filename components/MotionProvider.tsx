"use client";

import { MotionConfig } from "framer-motion";

/**
 * Aplica prefers-reduced-motion a TODAS las animaciones de framer-motion del
 * sitio. Con reducedMotion="user", framer desactiva las animaciones de
 * transform/layout (los slides y y-reveals) cuando el usuario pide menos
 * movimiento, conservando los fades de opacidad. Asi no hay que tocar cada
 * componente uno por uno.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
