import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { About } from "../sections/About";
import { Branches } from "../sections/Branches";
import { Contact } from "../sections/Contact";
import { Faq } from "../sections/Faq";
import { Features } from "../sections/Features";
import { Hero } from "../sections/Hero";
import { Rates } from "../sections/Rates";
import { Services } from "../sections/Services";

export function HomePage() {
  return (
    <div className="pattern-bg min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Branches />
      <Features />
      <Rates />
      <Faq />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
