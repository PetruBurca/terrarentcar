import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Cars from "@/components/Cars";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Cars />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
