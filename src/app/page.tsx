import { Hero } from "@/components/pages/(unauth)/home/hero";
import { LogoMarquee } from "@/components/pages/(unauth)/home/logo-marquee";
import { BentoGrid } from "@/components/pages/(unauth)/home/bento-grid";
import { Pricing } from "@/components/pages/(unauth)/home/pricing";
import { FinalCTA } from "@/components/pages/(unauth)/home/final-cta";
import { Navbar } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/pages/(unauth)/home/smooth-scroll";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-background">
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
