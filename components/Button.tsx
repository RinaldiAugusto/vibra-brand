"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";
import { POP_SPRING } from "./motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={POP_SPRING}
      className={`btn-primary ${className || ""}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
