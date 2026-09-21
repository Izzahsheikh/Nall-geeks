import ServicePage from './ServicePage';

const PHOTOS = [
  { src: '/images/services/web-development/web1.png', width: 571, height: 356, alt: 'N&G Partitions Ltd website homepage with a "Precision Interior Specialists" hero over a modern commercial interior' },
  { src: '/images/services/web-development/web2.jpeg', width: 1325, height: 784, alt: 'N&G Partitions Ltd projects page showing ceiling, steel framing, glass partition and acoustic interior projects' },
  { src: '/images/services/web-development/web3.jpeg', width: 1408, height: 768, alt: 'Tyres online shop product page for an all-season touring tyre, with a photo gallery, price and add to cart button' },
];

export default function WebDevelopment() {
  return (
    <ServicePage
      title={'Web Development'}
      description={"We build web applications that are fast, scalable and built to grow with your business. Clean code, thoughtful architecture and a focus on real performance — not just aesthetics."}
      photos={PHOTOS}
    />
  );
}
