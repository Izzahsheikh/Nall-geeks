import ServicePage from './ServicePage';
import {
  Building2,
  Code2,
  Compass,
  LayoutDashboard,
  PanelsTopLeft,
  PenTool,
  Rocket,
  ScanSearch,
  ShoppingBag,
} from 'lucide-react';

const PHOTOS = [
  { src: '/images/services/web-development/web1.png', width: 571, height: 356, alt: 'N&G Partitions Ltd website homepage with a "Precision Interior Specialists" hero over a modern commercial interior' },
  { src: '/images/services/web-development/web2.jpeg', width: 1325, height: 784, alt: 'N&G Partitions Ltd projects page showing ceiling, steel framing, glass partition and acoustic interior projects' },
  { src: '/images/services/web-development/web3.jpeg', width: 1408, height: 768, alt: 'Tyres online shop product page for an all-season touring tyre, with a photo gallery, price and add to cart button' },
];

const PROJECTS = [
  {
    name: 'Interior Specialists',
    description: 'An image-led website for a commercial interior specialist.',
    tags: ['React', 'Responsive', 'Interiors'],
  },
  {
    name: 'Partitions Portfolio',
    description: 'A project gallery showcasing partition and ceiling installations.',
    tags: ['React', 'Responsive', 'Projects'],
  },
  {
    name: 'Tyreline Online',
    description: 'A smooth shopping experience for tyres and accessories.',
    tags: ['E-commerce', 'Responsive', 'React'],
  },
];

const PROCESS_STEPS = [
  {
    number: '01',
    icon: Compass,
    title: 'Discovery',
    description: 'We learn your business, goals, audience and competitors.',
  },
  {
    number: '02',
    icon: PenTool,
    title: 'Design',
    description: 'Wireframes and a custom UI design you approve before any code is written.',
  },
  {
    number: '03',
    icon: Code2,
    title: 'Development',
    description: 'Clean, fast, scalable code built with modern tools like React and Node.',
  },
  {
    number: '04',
    icon: ScanSearch,
    title: 'Testing & Review',
    description: 'Cross-browser, mobile, speed and SEO checks, plus your feedback rounds.',
  },
  {
    number: '05',
    icon: Rocket,
    title: 'Launch & Support',
    description: 'Deployment, handover, and ongoing maintenance whenever you need it.',
  },
];

const BUILD_TYPES = [
  { icon: Building2, title: 'Business Websites', description: 'A confident home for your brand and services.' },
  { icon: ShoppingBag, title: 'E-commerce Stores', description: 'Easy-to-use online shops built to convert.' },
  { icon: LayoutDashboard, title: 'Web Apps & Dashboards', description: 'Useful digital tools shaped around your workflow.' },
  { icon: PanelsTopLeft, title: 'Landing Pages', description: 'Focused pages that turn attention into action.' },
];

export default function WebDevelopment() {
  return (
    <ServicePage
      title="Web Development"
      description="We build web applications that are fast, scalable and built to grow with your business. Clean code, thoughtful architecture and a focus on real performance — not just aesthetics."
      photos={PHOTOS}
      projects={PROJECTS}
      processSteps={PROCESS_STEPS}
      buildTypes={BUILD_TYPES}
      hideCta
    />
  );
}