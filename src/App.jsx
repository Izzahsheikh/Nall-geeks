import './App.css';
import useReveal from './hooks/useReveal';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import ServiceStrips from './components/ServiceStrips';
import Projects from './components/Projects';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Careers from './components/Careers';
import CareerJob from './components/careers/CareerJob';
import CareerApply from './components/careers/CareerApply';
import FAQ from './components/FAQ';
import WebDevelopment from './pages/services/WebDevelopment';
import MobileApps from './pages/services/MobileApps';
import UIUXDesign from './pages/services/UIUXDesign';
import SoftwareManagement from './pages/services/SoftwareManagement';
import SEO from './pages/services/SEO';
import AIAutomation from './pages/services/AIAutomation';
import Footer from './components/Footer';
import AdminLayout from './admin/AdminLayout';

const SERVICE_PAGES = {
  '/services/web-development': WebDevelopment,
  '/services/mobile-apps': MobileApps,
  '/services/uiux-design': UIUXDesign,
  '/services/software-management': SoftwareManagement,
  '/services/seo': SEO,
  '/services/ai-automation': AIAutomation,
};

export default function App() {
  useReveal();
  const currentPath = window.location.pathname;
  const isAdminPage = currentPath.startsWith('/admin');
  const isAboutPage = currentPath === '/about';
  const isContactPage = currentPath === '/contact';
  const isProjectsPage = currentPath === '/projects';
  const isCareersPage = currentPath === '/careers';
  const ServicePage = SERVICE_PAGES[currentPath.replace(/\/+$/, '')];
  const careerRoute = currentPath.match(/^\/careers\/([^/]+)(\/apply)?\/?$/);

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
      ) : ServicePage ? (
        <ServicePage />
      ) : careerRoute ? (
        careerRoute[2]
          ? <CareerApply jobId={decodeURIComponent(careerRoute[1])} />
          : <CareerJob jobId={decodeURIComponent(careerRoute[1])} />
      ) : (
        <>
          <Hero />
          <Services />
          <ServiceStrips />
          <Testimonials />
          <FAQ />
        </>
      )}
      <Footer />
    </>
  );
}