import React from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const CustomerReviews = () => {
  const customerReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "London, UK",
      rating: 5,
      comment: "The Brazilian straight hair extensions are absolutely amazing! They blend perfectly with my natural hair and the quality is outstanding. Will definitely order again!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michelle Chen",
      location: "Manchester, UK",
      rating: 5,
      comment: "I've tried many hair extensions but Karina Beauty Hub's Malaysian curly hair is by far the best. The texture is so natural and they last forever with proper care.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emma Thompson",
      location: "Birmingham, UK",
      rating: 5,
      comment: "The Peruvian wavy hair extensions transformed my look completely. The lace frontal is so undetectable and the hair quality is premium. Highly recommend!",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Lisa Rodriguez",
      location: "Leeds, UK",
      rating: 5,
      comment: "Amazing customer service and the Indian straight hair bundles are incredible quality. They're soft, silky, and the color match was perfect. Love this company!",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const StarRating = ({ value }) => {
    const rounded = Math.round((Number(value) || 0) * 2) / 2;
    const full = Math.floor(rounded);
    const hasHalf = rounded - full === 0.5;
    const empty = Math.max(0, 5 - full - (hasHalf ? 1 : 0));

    return (
      <div className="d-flex justify-content-center gap-1 text-warning mb-3">
        {[...Array(full)].map((_, i) => (
          <FaStar key={`full-${i}`} size={20} />
        ))}
        {hasHalf && <FaStarHalfAlt size={20} />}
        {[...Array(empty)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} size={20} />
        ))}
      </div>
    );
  };

  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold text-dark mb-3">What Our Customers Say</h2>
          <p className="lead text-muted">Real reviews from satisfied customers worldwide</p>
        </div>
        
        <Row className="justify-content-center">
          <Col lg={10}>
            <Carousel 
              indicators={false}
              controls={true}
              interval={5000}
              className="customer-reviews-carousel"
            >
              {customerReviews.map((review) => (
                <Carousel.Item key={review.id}>
                  <div className="text-center p-5">
                    <div className="mb-4">
                      <img 
                        src={review.image} 
                        alt={review.name}
                        className="rounded-circle border border-3 border-white shadow"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    </div>
                    
                    <StarRating value={review.rating} />
                    
                    <blockquote className="blockquote mb-4">
                      <p className="lead text-dark fst-italic mb-0">
                        "{review.comment}"
                      </p>
                    </blockquote>
                    
                    <div className="text-center">
                      <h6 className="fw-bold text-dark mb-1">{review.name}</h6>
                      <small className="text-muted">{review.location}</small>
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CustomerReviews;
