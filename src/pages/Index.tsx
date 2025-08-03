import {
  Header,
  Footer,
  RentSearch,
  // LogoMarquee,
  About,
  Cars,
  Contact,
} from "@/components";
import { useState } from "react";


const Index = () => {
  // Используем кэшированные даты поиска
  const [searchDates, setSearchDates] = useState<{
    from: Date | null;
    to: Date | null;
  });

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
        {/* <LogoMarquee /> */}
        <Cars searchDates={searchDates} />
        <About />
       
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
