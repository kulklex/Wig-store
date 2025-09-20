import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
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
  const { loading, error, hasData } = useHomepageData();

  if (loading && !hasData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="dark" size="lg" />
          <p className="mt-3 text-muted">Loading your personalized experience...</p>
        </div>
      </div>
    );
  }

  if (error && !hasData) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning" role="alert">
          <h4>Oops! Something went wrong</h4>
          <p className="mb-0">We're having trouble loading the page. Please refresh and try again.</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Banner />
      <ModelShowcase />
      <NewArrivals />
      <BestSellers />
      <TrustIndicators />
      <SpecialOffers />
      <ShippingReturns />
      <CustomerReviews />
      <InstagramFeed />
      <EducationalContent />
    </>
  );
}
