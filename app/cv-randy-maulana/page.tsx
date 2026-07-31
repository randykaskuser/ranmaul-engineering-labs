import { Metadata } from 'next';
import CvClient from './CvClient';

export const metadata: Metadata = {
  title: 'CV - Randy Maulana',
  description: 'Senior QA Engineer specializing in the Merchant Experience domain.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function CVPage() {
  return <CvClient />;
}