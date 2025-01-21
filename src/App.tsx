import React from 'react';
import Header from './sections/Header';
import Banner from './sections/Banner';
import WhyUs from './sections/WhyUs';
import CarsList from './sections/CarsList';
import ContactForm from './sections/ContactForm';
import Footer from './sections/Footer';
import LogoMarquee from './sections/LogoMarquee';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Banner />

     
      <WhyUs />
      <LogoMarquee /> 
      <CarsList />
      <ContactForm />
      <Footer />
    </>
  );
};

export default App;