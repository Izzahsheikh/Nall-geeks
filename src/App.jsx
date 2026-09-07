import './App.css';
import useReveal from './hooks/useReveal';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import ServiceStrips from './components/ServiceStrips';
import Work from './components/Work';
import Projects from './components/Projects';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Careers from './components/Careers';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AdminLayout from './admin/AdminLayout';

export default function App() {
  useReveal();
  const currentPath = window.location.pathname;
  const isAdminPage = currentPath.startsWith('/admin');
  const isAboutPage = currentPath === '/about';
  const isContactPage = currentPath === '/contact';
  const isProjectsPage = currentPath === '/projects';
  const isCareersPage = currentPath === '/careers';

  if (isAdminPage) {
    return <AdminLayout />;
  }

  return (
    <>
      <Navbar />
      {isAboutPage ? (
        <About />
      ) : isContactPage ? (
        <Contact />
      ) : isProjectsPage ? (
        <Projects />
      ) : isCareersPage ? (
        <Careers />
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
