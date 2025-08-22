import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaYoutube, FaTiktok, FaHeart, FaComment } from "react-icons/fa";

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const token = "YOUR_INSTAGRAM_ACCESS_TOKEN"; 
        const fields = "id,caption,media_url,permalink,thumbnail_url,like_count,comments_count";
        const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}`;

        const response = await fetch(url);
        const data = await response.json();
        setPosts(data.data || []);
      } catch (error) {
        console.error("Error fetching Instagram posts:", error);
      }
    };

    fetchInstagramPosts();
  }, []);

  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold text-dark mb-3">Follow Our Journey</h2>
          <p className="lead text-muted">See real transformations and get inspired</p>
          <div className="d-flex justify-content-center gap-3 mb-4">
            <FaInstagram size={24} className="text-dark" />
            <FaYoutube size={24} className="text-dark" />
            <FaTiktok size={24} className="text-dark" />
          </div>
          <p className="text-muted mb-0">
            <strong>@karina_beautyhub_uk</strong> on Instagram
          </p>
        </div>
        
        <Row className="g-3">
          {posts.map((post) => (
            <Col key={post.id} lg={4} md={6} sm={6}>
              <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                <div className="instagram-post position-relative overflow-hidden rounded-3 shadow-sm">
                  <div className="position-relative" style={{ aspectRatio: '1' }}>
                    <img 
                      src={post.media_url || post.thumbnail_url} 
                      alt={post.caption || "Instagram post"}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-75 d-flex flex-column justify-content-center align-items-center text-white p-3"
                         style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                         onMouseEnter={(e) => e.target.style.opacity = 1}
                         onMouseLeave={(e) => e.target.style.opacity = 0}>
                      <div className="text-center">
                        <div className="d-flex justify-content-center gap-3 mb-2">
                          <span className="d-flex align-items-center gap-1">
                            <FaHeart size={16} />
                            <small>{post.like_count || 0}</small>
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <FaComment size={16} />
                            <small>{post.comments_count || 0}</small>
                          </span>
                        </div>
                        <p className="small mb-0" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>
                          {post.caption ? post.caption.slice(0, 80) + "..." : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </Col>
          ))}
        </Row>
        
        <div className="text-center mt-4">
          <a 
            href="https://www.instagram.com/karina_beautyhub_uk/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-dark btn-lg fw-bold px-4"
          >
            Follow Us on Instagram
          </a>
        </div>
      </Container>
    </section>
  );
};

export default InstagramFeed;
