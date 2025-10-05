import Cta from "@/component/sections/Cta";
import Features from "@/component/sections/Features";
import Footer from "@/component/sections/Footer";
import Hero from "@/component/sections/Hero";
import Navbar from "@/component/sections/Navbar";
import Services from "@/component/sections/Services";
import Testmonials from "@/component/sections/Testmonials";


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Features />
      <Testmonials/>
      <Cta />
      <Footer />
    </>
  );
}