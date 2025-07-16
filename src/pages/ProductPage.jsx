import React, { useState } from 'react';
import { Container, Row, Col, Button, Accordion, Dropdown, ButtonGroup, Carousel } from 'react-bootstrap';
import p_img1 from '../assets/p_img1.png'
import p_img2_1 from '../assets/p_img2_1.png'
import p_img2_2 from '../assets/p_img2_2.png'
import p_img2_3 from '../assets/p_img2_3.png'
import p_img2_4 from '../assets/p_img2_4.png'
import p_img3 from '../assets/p_img3.png'
import p_img4 from '../assets/p_img4.png'
import p_img5 from '../assets/p_img5.png'
import p_img6 from '../assets/p_img6.png'
import p_img7 from '../assets/p_img7.png'
import p_img8 from '../assets/p_img8.png'
import p_img9 from '../assets/p_img9.png'
import p_img10 from '../assets/p_img10.png'
import p_img11 from '../assets/p_img11.png'
import p_img12 from '../assets/p_img12.png'
import p_img13 from '../assets/p_img13.png'
import p_img14 from '../assets/p_img14.png'
import p_img15 from '../assets/p_img15.png'
import p_img16 from '../assets/p_img16.png'
import p_img17 from '../assets/p_img17.png'
import p_img18 from '../assets/p_img18.png'
import p_img19 from '../assets/p_img19.png'
import p_img20 from '../assets/p_img20.png'
import p_img21 from '../assets/p_img21.png'
import p_img22 from '../assets/p_img22.png'
import p_img23 from '../assets/p_img23.png'
import p_img24 from '../assets/p_img24.png'
import p_img25 from '../assets/p_img25.png'
import p_img26 from '../assets/p_img26.png'
import p_img27 from '../assets/p_img27.png'
import p_img28 from '../assets/p_img28.png'
import p_img29 from '../assets/p_img29.png'
import p_img30 from '../assets/p_img30.png'
import p_img31 from '../assets/p_img31.png'
import p_img32 from '../assets/p_img32.png'
import p_img33 from '../assets/p_img33.png'
import p_img34 from '../assets/p_img34.png'
import p_img35 from '../assets/p_img35.png'
import p_img36 from '../assets/p_img36.png'
import p_img37 from '../assets/p_img37.png'
import p_img38 from '../assets/p_img38.png'
import p_img39 from '../assets/p_img39.png'
import p_img40 from '../assets/p_img40.png'
import p_img41 from '../assets/p_img41.png'
import p_img42 from '../assets/p_img42.png'
import p_img43 from '../assets/p_img43.png'
import p_img44 from '../assets/p_img44.png'
import p_img45 from '../assets/p_img45.png'
import p_img46 from '../assets/p_img46.png'
import p_img47 from '../assets/p_img47.png'
import p_img48 from '../assets/p_img48.png'
import p_img49 from '../assets/p_img49.png'
import p_img50 from '../assets/p_img50.png'
import p_img51 from '../assets/p_img51.png'
import p_img52 from '../assets/p_img52.png'


const productImages = [
 p_img1, p_img2_1,
 p_img2_2,
 p_img2_3,
 p_img2_4,
 p_img3, p_img4, p_img5, p_img6, p_img7, p_img8, p_img9, p_img10,
//  p_img11,
//  p_img12,
//  p_img13,
//  p_img14,
//  p_img15,
//  p_img16,
//  p_img17,
//  p_img18,
//  p_img19,
//  p_img20,
//  p_img21,
//  p_img22,
//  p_img23,
//  p_img24,
//  p_img25,
//  p_img26,
//  p_img27,
//  p_img28,
//  p_img29,
//  p_img30,
//  p_img31,
//  p_img32,
//  p_img33,
//  p_img34,
//  p_img35,
//  p_img36,
//  p_img37,
//  p_img38,
//  p_img39,
//  p_img40,
//  p_img41,
//  p_img42,
//  p_img43,
//  p_img44,
//  p_img45,
//  p_img46,
//  p_img47,
//  p_img48,
//  p_img49,
//  p_img50,
//  p_img51,
//  p_img52,

];

const ProductPage = () => {
 const [mainImage, setMainImage] = useState(productImages[0]);

  return (
    <Container className="my-4">
      <Row>
        {/* Desktop View */}
        <Col lg={6} className="d-none d-lg-flex">
          <div className="d-flex flex-column align-items-center me-3 overflow-auto" style={{ maxHeight: '600px' }}>
            {productImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className="img-thumbnail mb-2"
                style={{ width: '80px', cursor: 'pointer' }}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <img src={mainImage} alt="Main product" className="img-fluid" />
          </div>
        </Col>

        {/* Mobile View */}
        <Col xs={12} className="d-lg-none mb-4">
          <Carousel indicators={true} controls={false}>
            {productImages.map((img, idx) => (
              <Carousel.Item key={idx}>
                <img src={img} className="d-block w-100" alt={`slide-${idx}`} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        {/* Right Side: Product Details */}
        <Col lg={6}>
          <h2 className="fw-bold">1B RAW BUNDLES</h2>
          <h4 className="my-3">£85.00</h4>

          {/* Length Options */}
          <h6>LENGTH</h6>
          <div className="d-flex flex-wrap mb-3">
            {["10", "12", "14", "16", "18", "20", "22", "24", "26"].map((len) => (
              <Button variant="outline-dark" className="me-2 mb-2" key={len}>{len}"</Button>
            ))}
          </div>

          {/* Texture */}
          <h6>TEXTURE <span className="text-warning">?</span></h6>
          <div className="d-flex flex-wrap mb-3">
            {["(SD) Straight", "(SD) Body Wave", "(SD) Deep Wave", "(SD) Loose Wave", "(SD) Kinky Curly", "(DD) Cambodian Wavy"].map((texture) => (
              <Button variant="outline-dark" className="me-2 mb-2" key={texture}>{texture}</Button>
            ))}
          </div>

          {/* Origin */}
          <h6>ORIGIN <span className="text-warning">?</span></h6>
          <div className="d-flex flex-wrap mb-3">
            {["(SD) Peruvian", "(SD) Brazilian", "(SD) Indian"].map((origin) => (
              <Button variant="outline-dark" className="me-2 mb-2" key={origin}>{origin}</Button>
            ))}
          </div>

          {/* Quantity */}
          <h6>QUANTITY</h6>
          <ButtonGroup className="mb-3">
            <Button variant="outline-dark">−</Button>
            <Button variant="light" disabled>1</Button>
            <Button variant="outline-dark">+</Button>
          </ButtonGroup>

          {/* Add to Cart */}
          <Button variant="dark" size="lg" className="w-100 mb-3">ADD TO CART</Button>

          {/* Delivery Note */}
          <div className="text-center mb-4">
            <small className="text-muted">
              Order within <b>18 Hours 29 Minutes</b> to receive Next Day Delivery by <b>Fri, 11 Jul</b>
            </small>
          </div>

          {/* Accordion */}
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Description</Accordion.Header>
              <Accordion.Body>
                Full product details, care instructions, and styling info.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Hair Textures + Origins</Accordion.Header>
              <Accordion.Body>
                Descriptions of hair texture types and sourcing locations.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Delivery Info</Accordion.Header>
              <Accordion.Body>
                Express worldwide shipping available. See checkout for rates.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
