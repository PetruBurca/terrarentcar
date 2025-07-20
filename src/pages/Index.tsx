import Header from "@/components/Header";
import RentSearch from "@/components/RentSearch";
import LogoMarquee from "@/components/LogoMarquee";
import About from "@/components/About";
import Cars from "@/components/Cars";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useState } from "react";

const Index = () => {
  const [searchDates, setSearchDates] = useState<{
    from: Date | null;
    to: Date | null;
  }>({ from: null, to: null });

  const handleSearchDates = (dates: { from: Date | null; to: Date | null }) => {
    setSearchDates(dates);
    // Скролл к блоку с машинами
    const carsBlock = document.getElementById("cars");
    if (carsBlock) {
      carsBlock.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <RentSearch onSearch={handleSearchDates} />
        <LogoMarquee />
        <About />
        <Cars searchDates={searchDates} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
