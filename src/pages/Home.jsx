import React from 'react'
import Banner from '../components/Banner'
import NewArrivals from '../components/NewArrivals'
import BestSellers from '../components/BestSellers'
import ModelShowcase from '../components/ModelShowcase'
import FeaturedOffers from '../components/FeaturesdOffers'


export default function Home() {
  
  return (
    <>
        <Banner />
        <ModelShowcase />
        <NewArrivals />
        <BestSellers />
        <FeaturedOffers />
    </>
  )
}
