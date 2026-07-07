"use client";

import { motion } from "framer-motion";

interface SectionFeatureProps {
  eyebrow: string;
  title: string;
  description: string;
  paddingBottom?: string;
  children?: React.ReactNode;
}

export default function SectionFeature({
  eyebrow,
  title,
  description,
  paddingBottom,
  children,
}: SectionFeatureProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="section"
      style={{ paddingBottom }}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      {children && <div style={{ marginTop: "2rem" }}>{children}</div>}
    </motion.section>
  );
}
