import exchangeImg from "../assets/download-f.png";
import qualityImg from "../assets/quality_icon.png";
import supportImg from "../assets/download-set.png";

const FeaturedOffers = () => {
  const features = [
    {
      img: exchangeImg,
      title: "Easy Installations",
      description: "We offer hassle free installations",
    },
    {
      img: qualityImg,
      title: "7 Days Return Policy",
      description: "We provide 7 days free return policy",
    },
    {
      img: supportImg,
      title: "Best Customer Support",
      description: "We provide 24/7 customer support",
    },
  ];

  return (
    <section className="container py-5">
      <div className="row text-center justify-content-center gx-5">
        {features.map((feature, index) => (
          <div
            className="col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center py-2"
            key={index}
            data-aos="fade-up"
          >
            <img
              src={feature.img}
              alt={feature.title}
              style={{ width: "64px", height: "64px", objectFit: "contain" }}
              className="mb-3"
            />
            <h5 className="fw-bold mb-2 text-dark">{feature.title}</h5>
            <p
              className="text-muted mb-0 text-nowrap"
              style={{ fontSize: "1rem" }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedOffers;
