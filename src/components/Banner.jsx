/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slide_12_img from "../assets/slide-15.jpg";
import slide_13_img from "../assets/black-woman.jpg";
import slide_3_img from "../assets/model8.jpg";

const Banner = () => {
  const [slides] = useState([
    {
      id: 1,
      image: slide_12_img,
      title: "Natural Extensions",
      subTitle: "CLOSURES & FRONTALS",
      price: 49.99,
      align: "end",
      textColor: "#fff",
      buttonBg: "#ffffff",
      buttonColor: "#000000",
      buttonText: "Shop Natural",
    },
    {
      id: 2,
      image: slide_13_img,
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
      image: slide_3_img,
      title: "Premium Hair Collection",
      subTitle: "FANCY A CHANGE?",
      price: 29.99,
      align: "center",
      textColor: "#000000",
      buttonBg: "#000000",
      buttonColor: "#ffffff",
      buttonText: "Shop Now",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  const slideVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.9 },
  };

  const getAlignmentStyles = (align) => {
    switch (align) {
      case "start":
        return {
          justifyContent: "flex-start",
          textAlign: "left",
          paddingLeft: "5%",
        };
      case "end":
        return {
          justifyContent: "flex-end",
          textAlign: "right",
          paddingRight: "5%",
        };
      case "center":
      default:
        return {
          justifyContent: "center",
          textAlign: "center",
        };
    }
  };

  return (
    <motion.section
      className="banner py-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="slider-container"
        style={{
          position: "relative",
          height: "100vh",
          minHeight: "80vh",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slides[currentIndex].id}
            className="slide"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${slides[currentIndex].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              display: "flex",
              alignItems: "center",
              ...getAlignmentStyles(slides[currentIndex].align),
            }}
          >
            <motion.div
              className="slide-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                color: slides[currentIndex].textColor,
                maxWidth: "600px",
                padding: "20px",
              }}
            >
              <motion.p
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                }}
              >
                {slides[currentIndex].subTitle}
              </motion.p>
              <motion.h2
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                {slides[currentIndex].title}
              </motion.h2>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                style={{
                  padding: "12px 24px",
                  fontSize: "1.2rem",
                  backgroundColor: slides[currentIndex].buttonBg,
                  color: slides[currentIndex].buttonColor,
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
              >
                {slides[currentIndex].buttonText}
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div
          className="pagination"
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
            zIndex: 10,
          }}
        >
          {slides?.map((_, index) => (
            <motion.span
              key={index}
              onClick={() => setCurrentIndex(index)}
              animate={{
                scale: currentIndex === index ? 1.2 : 1,
                backgroundColor: currentIndex === index ? "#fff" : "#888",
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* RESPONSIVE HEIGHT STYLING */}
      <style>{`
        @media (max-width: 768px) {
          .slider-container,
          .slide {
            height: 60vh !important;
            min-height: 60vh !important;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default Banner;
