import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { StarsBackground } from "@/components/StarsBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0a0f]">
      <StarsBackground />
      <Header />
      <main>
        <section id="home">
          <Hero />
        </section>
        <Features />
        <About />
        <Footer />
      </main>
    </div>
  );
}
