import Head from 'next/head';
import { useState } from 'react';
import Header from '../blocks/Header';
import Hero from '../blocks/Hero';
import StreamPlayer from '../blocks/StreamPlayer';
import StatsCard from '../blocks/StatsCard';
import PrivacyNotice from '../blocks/PrivacyNotice';
import ShareCard from '../blocks/ShareCard';
import AccessBanner from '../blocks/AccessBanner';
import Footer from '../blocks/Footer';

export default function Home() {
  const [activeTab] = useState('dining');

  return (
    <>
      <Head>
        <title>Dining Area — Live View</title>
        <meta
          name="description"
          content="Secure live view of the Dining Area for authorized investors and stakeholders."
        />
        <meta property="og:title" content="Dining Area — Live View" />
        <meta
          property="og:description"
          content="Secure live view for authorized investors and stakeholders."
        />
        <meta property="og:type" content="website" />
      </Head>

      <Header />
      <Hero />
      <StreamPlayer activeTab={activeTab} />

      <div className="below-wrapper">
        <div className="below-container">
          <StatsCard />
          <div className="split-row">
            <PrivacyNotice />
            <ShareCard
              shareUrl="https://yourdomain.com/live-streaming"
              shareText="Secure live view of our Dining Area for authorized investors and stakeholders:"
            />
          </div>
          <AccessBanner />
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .below-wrapper {
          background: linear-gradient(180deg, #fff 0%, #fbf8ef 60%, #f8f2e1 100%);
          padding: 56px 24px 80px;
        }
        .below-container {
          max-width: 1180px;
          margin: 0 auto;
        }
        .split-row {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
          margin-top: 24px;
        }
        @media (max-width: 900px) {
          .split-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .below-wrapper { padding: 40px 16px 56px; }
        }
      `}</style>
    </>
  );
}