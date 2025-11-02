import { ReactNode } from "react";
import Footer from "./Footer";
import BackgroundMusic from "./BackgroundMusic";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <BackgroundMusic />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

