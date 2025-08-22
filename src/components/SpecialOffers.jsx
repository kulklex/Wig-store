import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import CollectionCard from "./CollectionCard";

const SpecialOffers = () => {
  const dispatch = useDispatch();
  const { productsData, loading } = useSelector((state) => state.products);
  const [discountedProducts, setDiscountedProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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

  if (loading) {
    return (
      <section className="py-5 bg-dark text-white">
        <Container>
          <div className="text-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (discountedProducts.length === 0) return null;

  return (
    <section className="container-fluid py-5 bg-dark text-white">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold mb-3">Special Offers</h2>
          <p className="lead opacity-75">
            Limited time deals on premium hair extensions
          </p>
        </div>

        <main className="row gx-3">
          {discountedProducts.map((product) => (
                  <CollectionCard data={product} compact />
          ))}
        </main>
    </section>
  );
};

export default SpecialOffers;
