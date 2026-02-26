import { Hero } from "@/components/pages/(unauth)/home/hero";
import { LogoMarquee } from "@/components/pages/(unauth)/home/logo-marquee";
import { BentoGrid } from "@/components/pages/(unauth)/home/bento-grid";
import { Pricing } from "@/components/pages/(unauth)/home/pricing";
import { FinalCTA } from "@/components/pages/(unauth)/home/final-cta";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/pages/(unauth)/home/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-zinc-950">
        <Navbar />
        <Hero />
        <LogoMarquee />
        <BentoGrid />
        <Pricing />
        <FinalCTA />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
