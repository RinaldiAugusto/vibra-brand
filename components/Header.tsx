"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="header"
    >
      <div className="header-container">
        <Link href="/" className="header-logo">
          <Image
            src="/vibra-logo-dark.png"
            alt="Vibra"
            width={1975}
            height={954}
            priority
            quality={100}
          />
        </Link>
        <nav>
          <Link href="#contacto-final">
            <Button>Agenda una Llamada</Button>
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
