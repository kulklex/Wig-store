import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";

const FeaturedCategories = () => {
  const dispatch = useDispatch();
  const { categories, productsData } = useSelector((state) => state.products);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const productsArray = Array.isArray(productsData?.products)
    ? productsData.products
    : [];

  const featuredCategories =
    categories?.slice(0, 4).map((category) => {
      const firstProduct = productsArray.find(
        (product) => product.category === category
      );
      const firstVariantImage = firstProduct?.variants?.[0]?.media || "";

      return {
        name: category,
        description: `Premium ${category.toLowerCase()} collection`,
        image: firstVariantImage,
        link: `/search?category=${encodeURIComponent(category)}`,
      };
    }).filter((c) => c.image) || [];

  if (featuredCategories.length === 0) return null;

  return (
    <section className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold text-dark mb-3">Shop by Category</h2>
          <p className="lead text-muted">
            Discover our premium hair extension collections
          </p>
        </div>

        <Row className="g-4">
          {featuredCategories.map((category, index) => (
            <Col key={index} lg={3} md={6}>
              <div
                className="category-card position-relative overflow-hidden rounded-3 shadow-sm h-100"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/search?query=${category.name}`)}
              >
                <div className="position-relative" style={{ aspectRatio: "1" }}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                  <div
                    className="position-absolute bottom-0 start-0 end-0 p-4 text-white"
                    style={{
                      background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                      transform: "translateY(0)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <h5 className="fw-bold mb-2">{category.name}</h5>
                    <p className="mb-3 opacity-75">{category.description}</p>
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="fw-medium"
                    >
                      Shop Now <FiArrowRight className="ms-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedCategories;
