import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { StarsBackground } from "@/components/StarsBackground";
import { CupidGraphic } from "@/components/CupidGraphic";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0a0f]">
      <StarsBackground />
      <Header />
      <main>
        <section id="home">
          <Hero />
        </section>
        {/* Cupids in gap between Learn More and Features - mobile only */}
        <section className="md:hidden flex justify-center items-center gap-12 py-12 px-4 pointer-events-none">
          <CupidGraphic side="left" variant="inline" />
          <CupidGraphic side="right" variant="inline" />
        </section>
        <Features />
        <About />
        <Footer />
      </main>
    </div>
  );
}
