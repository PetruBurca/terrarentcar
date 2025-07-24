import {
  Header,
  Footer,
  RentSearch,
  LogoMarquee,
  About,
  Cars,
  Contact,
} from "@/components";
import { useState } from "react";
import { useLocalStorage } from "@/hooks";

const Index = () => {
  // Используем кэшированные даты поиска
  const [searchDates, setSearchDates] = useLocalStorage<{
    from: Date | null;
    to: Date | null;
  }>("search-dates", { from: null, to: null });

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
