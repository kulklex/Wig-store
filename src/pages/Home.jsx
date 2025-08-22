import React from 'react';
import Banner from '../components/Banner';
import NewArrivals from '../components/NewArrivals';
import BestSellers from '../components/BestSellers';
import ModelShowcase from '../components/ModelShowcase';
import TrustIndicators from '../components/TrustIndicators';
import FeaturedCategories from '../components/FeaturedCategories';
import SpecialOffers from '../components/SpecialOffers';
import CustomerReviews from '../components/CustomerReviews';
import EducationalContent from '../components/EducationalContent';
import InstagramFeed from '../components/InstagramFeed';
import NewsletterSignup from '../components/NewsletterSignup';
import ShippingReturns from '../components/ShippingReturns';

export default function Home() {
  return (
    <>
      <Banner />
      <ModelShowcase />
      <NewArrivals />
      <BestSellers />
      <ShippingReturns />
      <TrustIndicators />
      <FeaturedCategories />
      <SpecialOffers />
      <CustomerReviews />
      <EducationalContent />
      <InstagramFeed />
      <NewsletterSignup />
    </>
  );
}
