import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Layout del sitio publico (landing). El header fijo y el footer viven aca y
 * no en el root: la demo (/demo) es una ruta inmersiva que necesita la pagina
 * limpia, y un route group deja separarlos sin tocar las URLs — "(site)" no
 * aparece en la ruta, asi que la landing sigue sirviendose en "/".
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
