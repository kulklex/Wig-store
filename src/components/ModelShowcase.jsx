import React from "react";
import model7 from "../assets/oldItems/model7.jpg"
import model2 from "../assets/oldItems/model2.png"
import model3 from "../assets/oldItems/model3.jpg"
import model4 from "../assets/oldItems/model4.jpg"
import model5 from "../assets/oldItems/model5.jpg"
import model6 from "../assets/oldItems/model6.jpg"

const models = [
  {
    id: 1,
    image: model7,
    alt: "Straight black wig",
  },
  {
    id: 2,
    image: model2,
    alt: "Platinum blonde wig",
  },
  {
    id: 3,
    image: model3,
    alt: "Curly black wig",
  },
  {
    id: 4,
    image: model4,
    alt: "Dark wavy wig",
  },
  {
    id: 5,
    image: model5,
    alt: "Copper waves wig",
  },
  {
    id: 6,
    image: model6,
    alt: "Headband straight wig",
  },
];

export default function ModelShowcase() {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="row g-3 justify-content-center">
          {models.map((model) => (
            <div key={model.id} className="col-6 col-sm-4 col-md-2">
              <div className="card border-0 shadow-sm model-card">
                <img
                  src={model.image}
                  alt={model.alt}
                  className="card-img-top rounded model-img"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
