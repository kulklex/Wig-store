import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";
import CollectionCard from "./CollectionCard";

const SpecialOffers = () => {
  const navigate = useNavigate();
  const { productsData } = useSelector((state) => state.products);
  const [discountedProducts, setDiscountedProducts] = useState([]);

  useEffect(() => {
    if (productsData?.products) {
      const productsWithDiscounts = productsData.products.filter((product) =>
        product.variants?.some(
          (variant) =>
            variant?.promo?.isActive && variant?.promo?.discountPercent > 0
        )
      );
      setDiscountedProducts(productsWithDiscounts);
    }
  }, [productsData]);

  if (discountedProducts.length === 0) return null;

  return (
    <section className="container-fluid py-5 bg-dark text-white">
      <div className="text-center mb-2">
        <h2 className="display-6 fw-bold mb-2">Special Offers</h2>
        <p className="lead opacity-75 mb-3">
          Limited time deals on premium hair extensions
        </p>
      </div>

      <main className="row gx-3">
          {discountedProducts.map((product) => (
                  <CollectionCard key={product._id} data={product} compact={false} />
          ))}
        </main>

      <div className="text-center mb-5 mt-3 d-flex justify-content-center">
        <Button
          variant="outline-light"
          size="lg"
          className="px-4 py-2 fw-medium d-flex align-items-center justify-content-center mb-5"
          onClick={() => navigate('/special-offers')}
        >
          Discover
          <FiArrowRight className="ms-2" />
        </Button>
      </div>
    </section>
  );
};

export default SpecialOffers;
