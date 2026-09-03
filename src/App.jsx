import './App.css';
import useReveal from './hooks/useReveal';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import ServiceStrips from './components/ServiceStrips';
import Work from './components/Work';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  useReveal();
  const currentPath = window.location.pathname;
  const isAboutPage = currentPath === '/about';
  const isContactPage = currentPath === '/contact';

  return (
    <>
      <Navbar />
      {isAboutPage ? (
        <About />
      ) : isContactPage ? (
        <Contact />
      ) : (
        <>
          <Hero />
          <Services />
          <ServiceStrips />
          <Work />
          <Testimonials />
          <FAQ />
        </>
      )}
      <Footer />
    </>
  );
}
