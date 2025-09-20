import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CollectionCard from "./CollectionCard";

const SpecialOffers = () => {
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
                  <CollectionCard data={product} compact={false} />
          ))}
        </main>
    </section>
  );
};

export default SpecialOffers;
