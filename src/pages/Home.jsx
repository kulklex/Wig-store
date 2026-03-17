import React, { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import Banner from '../components/Banner';
import Sections from '../components/Sections';
import NewArrivals from '../components/NewArrivals';
import BestSellers from '../components/BestSellers';
import TrustIndicators from '../components/TrustIndicators';
import SpecialOffers from '../components/SpecialOffers';
import EducationalContent from '../components/EducationalContent';
import ShippingReturns from '../components/ShippingReturns';
import Seo from '../components/Seo';
import { useHomepageData } from '../hooks/useHomepageData';
import PromoBanner from '../components/PromoBanner';

export default function Home() {
  const { error, newArrivals, bestSellers } = useHomepageData();
  const structuredData = useMemo(() => {
    const origin =
      process.env.REACT_APP_SITE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '');

    if (!origin) return null;

    const baseUrl = origin.endsWith('/') ? origin : `${origin}/`;
    const logoUrl = `${baseUrl}android-chrome-512x512.png`;
    const searchUrl = `${baseUrl}search?query={search_term_string}`;

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Karina Hair',
        url: baseUrl,
        logo: logoUrl,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: baseUrl,
        name: 'Karina Hair',
        potentialAction: {
          '@type': 'SearchAction',
          target: searchUrl,
          'query-input': 'required name=search_term_string',
        },
      },
    ];
  }, []);

  return (
    <>
      <Seo
        title="Karina Hair | Luxury Wigs, Frontals & Extensions"
        description="Discover premium human hair wigs, lace frontals, and extensions crafted for natural-looking volume, effortless styling, and all-day comfort."
        canonicalPath="/"
        image="/android-chrome-512x512.png"
        structuredData={structuredData}
      />
      {error && (
        <Container className="pt-3">
          <div className="alert alert-warning small mb-3" role="alert">
            We’re having trouble loading products right now. The rest of the site is still available.
          </div>
        </Container>
      )}

      <PromoBanner />
      <Banner />
      <Sections />
      {/* <ModelShowcase /> */}
      {bestSellers.length > 0 && <BestSellers />}
      {newArrivals.length > 0 && <NewArrivals />}
      <TrustIndicators />
      <SpecialOffers />
      <ShippingReturns />
      {/* <CustomerReviews /> */}
      {/* <InstagramFeed /> */}
      <EducationalContent />
    </>
  );
}
