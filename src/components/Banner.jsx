import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";


const slide_2_img_desktop = "https://res.cloudinary.com/dlhgfwgs6/image/upload/v1755428279/main3-copy_zluofp.jpg";
const slide_3_img_desktop = "https://res.cloudinary.com/dlhgfwgs6/image/upload/v1755460955/main5-copy-min_vysooi.jpg";
const slide_2_img_mobile = "https://res.cloudinary.com/dlhgfwgs6/image/upload/v1755460796/main3-min_2_jdwuze.jpg";
const slide_3_img_mobile = "https://res.cloudinary.com/dlhgfwgs6/image/upload/v1755460956/main5-min_qtvgyr.jpg";

const Banner = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const timeoutRef = useRef(null);

const slides = useMemo(() => [
    {
      id: 2,
      imageDesktop: slide_2_img_desktop,
      imageMobile: slide_2_img_mobile,
      title: "Luxury Wigs",
      subTitle: "TAPES, CLIPS, LINKS",
      price: 39.99,
      align: "start",
      textColor: "#ffffff",
      buttonBg: "#ffffff",
      buttonColor: "#808080",
      buttonText: "Shop Wigs",
    },
    {
      id: 3,
      imageDesktop: slide_3_img_desktop,
      imageMobile: slide_3_img_mobile,
      title: "Premium Hair Collection",
      subTitle: "FANCY A CHANGE?",
      price: 29.99,
      align: "center",
      textColor: "#000000",
      buttonBg: "#000000",
      buttonColor: "#ffffff",
      buttonText: "Shop Now",
    },
  ], []);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = slides.map((slide) => {
        const img = new Image();
        const src = isMobile ? slide.imageMobile : slide.imageDesktop;
        
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        });
      });

      Promise.all(imagePromises).then(() => {
        setImagesLoaded(true);
      });
    };

    preloadImages();
  }, [isMobile, slides]);

  // Auto-slide with cleanup
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
  }, [slides.length]);

  useEffect(() => {
    if (imagesLoaded) {
      resetTimer();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, imagesLoaded, resetTimer]);

  const getAlignmentStyles = (align) => {
    const baseStyles = {
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: "100%",
      position: "relative",
      zIndex: 2,
    };

    switch (align) {
      case "start":
        return {
          ...baseStyles,
          justifyContent: "flex-start",
          paddingLeft: isMobile ? "5%" : "8%",
        };
      case "end":
        return {
          ...baseStyles,
          justifyContent: "flex-end",
          paddingRight: isMobile ? "5%" : "8%",
        };
      case "center":
      default:
        return {
          ...baseStyles,
          justifyContent: "center",
        };
    }
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    resetTimer();
  };

  // Loading skeleton
  if (!imagesLoaded) {
    return (
      <div className="banner-loading" style={{
        width: "100%",
        height: isMobile ? "40vh" : "100vh",
        minHeight: isMobile ? "300px" : "600px",
        background: "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "shimmer 1.5s infinite linear",
      }}>
        <div style={{
          color: "#666",
          fontSize: "1.2rem",
          fontWeight: "500"
        }}>
          Loading...
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 0 0, 0 10px, 10px -10px, -10px 0px; }
            100% { background-position: 20px 20px, 20px 30px, 30px 10px, 10px 20px; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <motion.section
      className="banner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        width: "100%",
        position: "relative",
      }}
    >
      <div
        className="slider-container"
        style={{
          position: "relative",
          width: "100%",
          height: isMobile ? "50vh" : "100vh",
          minHeight: isMobile ? "400px" : "600px",
          overflow: "hidden",
          background: "#000", 
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`slide-${slides[currentIndex].id}-${isMobile ? 'mobile' : 'desktop'}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${isMobile ? slides[currentIndex].imageMobile : slides[currentIndex].imageDesktop})`,
                backgroundSize: "cover",
                backgroundPosition: isMobile ? "center center" : "center center",
                backgroundRepeat: "no-repeat",
                filter: "brightness(0.9)",
              }}
            />

            {/* Gradient overlay for better text readability */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: slides[currentIndex].align === "center" 
                  ? "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3))"
                  : slides[currentIndex].align === "start"
                  ? "linear-gradient(90deg, rgba(0,0,0,0.4), transparent 50%)"
                  : "linear-gradient(-90deg, rgba(0,0,0,0.4), transparent 50%)",
                zIndex: 1,
              }}
            />

            <div style={getAlignmentStyles(slides[currentIndex].align)}>
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.3, 
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                style={{
                  color: slides[currentIndex].textColor,
                  maxWidth: isMobile ? "90%" : "500px",
                  textAlign: slides[currentIndex].align === "center" ? "center" : slides[currentIndex].align === "end" ? "right" : "left",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
                }}
              >
                <motion.p
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: isMobile ? "1px" : "2px",
                    fontSize: isMobile ? "0.75rem" : "0.9rem",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                    opacity: 0.9,
                  }}
                >
                  {slides[currentIndex].subTitle}
                </motion.p>
                
                <motion.h2
                  style={{
                    fontSize: isMobile ? "1.8rem" : "3rem",
                    marginBottom: "1.5rem",
                    fontWeight: "700",
                    lineHeight: isMobile ? "1.2" : "1.1",
                    margin: "0.5rem 0 1.5rem 0",
                  }}
                >
                  {slides[currentIndex].title}
                </motion.h2>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: isMobile ? "12px 24px" : "15px 30px",
                    fontSize: isMobile ? "0.9rem" : "1.1rem",
                    backgroundColor: slides[currentIndex].buttonBg,
                    color: slides[currentIndex].buttonColor,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {slides[currentIndex].buttonText}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Pagination */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "15px" : "25px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
            zIndex: 10,
            background: "rgba(0,0,0,0.3)",
            padding: "8px 12px",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
          }}
        >
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index)}
              animate={{
                scale: currentIndex === index ? 1.3 : 1,
                backgroundColor: currentIndex === index ? "#fff" : "rgba(255,255,255,0.5)",
              }}
              whileHover={{ 
                scale: currentIndex === index ? 1.3 : 1.1,
                backgroundColor: currentIndex === index ? "#fff" : "rgba(255,255,255,0.8)"
              }}
              transition={{ duration: 0.2 }}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Banner;