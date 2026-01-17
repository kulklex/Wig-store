import React from 'react';
import { Container } from 'react-bootstrap';
import Banner from '../components/Banner';
import NewArrivals from '../components/NewArrivals';
import BestSellers from '../components/BestSellers';
import ModelShowcase from '../components/ModelShowcase';
import TrustIndicators from '../components/TrustIndicators';
import SpecialOffers from '../components/SpecialOffers';
import CustomerReviews from '../components/CustomerReviews';
import EducationalContent from '../components/EducationalContent';
import InstagramFeed from '../components/InstagramFeed';
import ShippingReturns from '../components/ShippingReturns';
import { useHomepageData } from '../hooks/useHomepageData';

export default function Home() {
  const { loading, error, newArrivals, bestSellers } = useHomepageData();

  return (
    <>
      {error && (
        <Container className="pt-3">
          <div className="alert alert-warning small mb-3" role="alert">
            We’re having trouble loading products right now. The rest of the site is still available.
          </div>
        </Container>
      )}

      <Banner />
      <ModelShowcase />
      {newArrivals.length > 0 && <NewArrivals />}
      {bestSellers.length > 0 && <BestSellers />}
      <TrustIndicators />
      <SpecialOffers />
      <ShippingReturns />
      <CustomerReviews />
      {/* <InstagramFeed /> */}
      <EducationalContent />
    </>
  );
}
