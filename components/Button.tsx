"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React, { useState } from "react";
import HoverBorderGradient from "./HoverBorderGradient";
import { POP_SPRING } from "./motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  // Enciende el anillo con el puntero Y con foco de teclado: el CTA no puede
  // depender del mouse para dar feedback.
  const [active, setActive] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={POP_SPRING}
      className={`btn-primary ${className || ""}`}
      {...props}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <HoverBorderGradient active={active} />
      <span className="btn-label">{children}</span>
    </motion.button>
  );
}
