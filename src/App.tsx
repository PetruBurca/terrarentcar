import React, { Suspense } from "react";
import Header from "./sections/Header";
import Banner from "./sections/Banner";
import WhyUs from "./sections/WhyUs";
import Footer from "./sections/Footer";
import LogoMarquee from "./sections/LogoMarquee";
import FormContact from './sections/FormContact'
import CarCards from './sections/CarCards'
import './ i18n/config.ts';


const App: React.FC = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <Banner />
        <LogoMarquee />
        <WhyUs />
        <CarCards />
        <FormContact />
        <Footer />
      </Suspense>
    </>
  );
};

export default App;
