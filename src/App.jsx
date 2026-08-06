import './App.css';
import useReveal from './hooks/useReveal';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import ServiceStrips from './components/ServiceStrips';
import Work from './components/Work';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  useReveal();

  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <ServiceStrips />
      <Work />
      <Testimonials />
      <Contact />
      <FAQ />
      <Footer />
    </>
  );
}
