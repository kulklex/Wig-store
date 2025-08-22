import React from "react";
import { Container, Row, Col, Badge, Button } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";

const EducationalContent = () => {
  const educationalContent = [
    {
      id: 1,
      title: "How to Choose the Right Hair Extension",
      description: "Understand extension types, hair textures, lifestyle fit, and what works best for Afro-textured and protective styles.",
      image: "https://images.pexels.com/photos/15868320/pexels-photo-15868320.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=800&h=400",
      readTime: "5 min read",
      category: "Guide",
      link: "https://toallmyblackgirls.com/blogs/news/the-complete-guide-to-choosing-hair-extensions-for-afro-black-hair?srsltid=AfmBOootN8q9dg1UINu-pazBAcFWTgmvy-tjQbdkhLTz3qnirwXBSVao&utm"
    },
    {
      id: 2,
      title: "Hair Care Tips for Extensions",
      description: "Daily maintenance, wash routines, detangling, and nighttime protection to keep extensions looking fresh longer.",
      image: "https://images.pexels.com/photos/30662887/pexels-photo-30662887.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=800&h=400",
      readTime: "7 min read",
      category: "Care",
      link: "https://www.curlsqueen.com/blog/tips-tricks/what-are-the-different-types-of-hair-extensions-how-to-maintain-them.html"
    },
    {
      id: 3,
      title: "Installing Tape-In Extensions",
      description: "Step-by-step visual walkthrough of installing tape-ins on natural hair by a Nigerian creator.",
      image: "https://m.supernovahair.com/media/catalog/product/cache/6/image/9df78eab33525d08d6e5fb8d27136e95/1/_/1_tape_in_human_hair_extensions.jpg",
      readTime: "8 min watch",
      category: "Tutorial",
      link: "https://www.youtube.com/watch?v=DE3EqFrdo-k&ab_channel=SimplySubrena"
    },
    {
      id: 4,
      title: "Styling Your Extensions",
      description: "Practical ways to style clip-ins on natural hair: sleek, curly, and voluminous looks that blend seamlessly.",
      image: "https://i.ytimg.com/vi/zkPApBV9DHA/maxresdefault.jpg",
      readTime: "13 min watch",
      category: "Styling",
      link: "https://www.youtube.com/watch?v=LXkWPQYb9lo&ab_channel=StephanieVoltaire"
    },
    {
      id: 5,
      title: "Choosing the Perfect Color Match",
      description: "Methods for matching undertone, root shade, and dimension so extensions blend naturally with your hair.",
      image: "https://static.wixstatic.com/media/8d4658_621217a3dcc64240bdc413c2b58dd3d4~mv2.jpg/v1/fill/w_640,h_180,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/8d4658_621217a3dcc64240bdc413c2b58dd3d4~mv2.jpg",
      readTime: "6 min watch",
      category: "Color",
      link: "https://www.youtube.com/watch?v=0_czNeYW0WE&ab_channel=GoSleekHairCompany"
    },
    {
      id: 6,
      title: "Extension Removal & Aftercare",
      description: "Safe removal approaches for tape-ins, sew-ins, and keratin bonds, plus post-removal recovery tips.",
      image: "https://media.istockphoto.com/id/1470666964/photo/hairstyling-education-course-for-hairdressers-mannequin-head.jpg?s=612x612&w=0&k=20&c=322pmsK6-VUJ__aLNqBVbsXIiOUQVFIPcZV4yQGExhY=",
      readTime: "6 min read",
      category: "Maintenance",
      link: "https://www.allure.com/story/how-to-remove-hair-extensions"
    }
  ];

  return (
    <section className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold text-dark mb-3">Hair Extension Guides & Tips</h2>
          <p className="lead text-muted">Trusted, real-world resources tailored for Afro-textured hair</p>
        </div>
        <Row className="g-4">
          {educationalContent.map((content) => (
            <Col key={content.id} lg={4} md={6}>
              <div className="card border-0 shadow-sm h-100 educational-card">
                <div className="position-relative">
                  <img
                    src={content.image}
                    alt={content.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover", }}
                  />
                  <Badge bg="dark" className="position-absolute top-0 end-0 m-3">
                    {content.readTime}
                  </Badge>
                </div>
                <div className="card-body p-4 d-flex flex-column">
                  <Badge bg="light" text="dark" className="mb-2">{content.category}</Badge>
                  <h5 className="card-title fw-bold mb-2">{content.title}</h5>
                  <p className="card-text text-muted mb-4">{content.description}</p>
                  <Button
                    as="a"
                    href={content.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline-dark"
                    size="sm"
                    className="fw-medium mt-auto align-self-start"
                  >
                    Read More <FiArrowRight className="ms-1" />
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default EducationalContent;
