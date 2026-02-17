import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0a0f]">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
