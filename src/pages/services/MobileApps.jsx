import ServicePage from './ServicePage';
import { Code2, Smartphone, Store, TestTubeDiagonal } from 'lucide-react';

const PHOTOS = [
  {
    src: '/images/services/mobileapp1.jpeg',
    width: 1450,
    height: 720,
    alt: 'N&G Partitions Ltd mobile app screens showing a precision interior specialists home screen and featured projects listing',
  },
  {
    src: '/images/services/mobileapp2.jpeg',
    width: 1450,
    height: 720,
    alt: 'Trip2Airport mobile app screen showing airport transfer booking and service cards for Heathrow, Gatwick, Stansted and Luton',
  },
];

const PROJECTS = [
  {
    name: 'N&G Partitions Mobile',
    description: 'A polished interiors app with service expertise, project browsing and clear enquiry paths.',
    tags: ['Mobile UI', 'Projects', 'Enquiries'],
  },
  {
    name: 'Trip2Airport Booking',
    description: 'A booking-focused airport transfer app with quick ride selection and destination pricing.',
    tags: ['Booking', 'Travel', 'iOS & Android'],
  },
];

const PLATFORM_SECTION = {
  eyebrow: 'ONE APP, TWO PLATFORMS',
  title: 'How we build for iOS and Android',
  intro: 'We build with a single shared codebase using React Native or Flutter, so your app feels native on both iPhone and Android and ships faster.',
  items: [
    {
      icon: Code2,
      title: 'One codebase',
      description: 'Write once, run on iOS and Android, so it costs less and updates stay in sync.',
    },
    {
      icon: Smartphone,
      title: 'Native feel',
      description: 'Platform-specific navigation, gestures and design make each device feel familiar.',
    },
    {
      icon: Store,
      title: 'Store-ready',
      description: 'We handle App Store and Google Play setup, review and publishing.',
    },
    {
      icon: TestTubeDiagonal,
      title: 'Tested on real devices',
      description: 'Screen sizes, iOS and Android versions, offline and slow-network behaviour are checked.',
    },
  ],
};

export default function MobileApps() {
  return (
    <ServicePage
      title={'Mobile Apps'}
      description={"We design and develop mobile applications for iOS and Android that feel native, load instantly and keep users coming back. From concept to launch, we handle it all."}
      photos={PHOTOS}
      projects={PROJECTS}
      platformSection={PLATFORM_SECTION}
      pageClassName="sp--mobile-apps"
      hideCta
    />
  );
}
