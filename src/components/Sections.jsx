import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { fetchCategories } from "../redux/productSlice";
import { sanitizeText } from "../utils/sanitize";
import Header from "./Header";
import wigsImage from "../assets/mercie-pixie-wig1.jpeg"
import bulkHairImage from "../assets/bulk-hair1.jpeg"
import weavesHairImage from "../assets/weave1.jpeg"


const CATEGORY_IMAGES = {
  weaves: weavesHairImage,
  bulkHair: bulkHairImage,
  wigs: wigsImage,
}

const getCategoryImage = (name) => {
  if (!name) return CATEGORY_IMAGES.wigs;
  const key = name.toLowerCase();
  if (CATEGORY_IMAGES[key]) return CATEGORY_IMAGES[key];
  if (key.includes("wigs")) return CATEGORY_IMAGES.wigs;
  if (key.includes("bulk hair")) return CATEGORY_IMAGES.bulkHair;
  if (key.includes("weaves")) return CATEGORY_IMAGES.weaves;
  return CATEGORY_IMAGES.wigs;
};

const Sections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, categoriesLoading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories, dispatch]);

  const visibleCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories
      .map((c) => sanitizeText(String(c), { maxLength: 80 }))
      .filter(Boolean);
  }, [categories]);

  const handleClickCategory = (category) => {
    const safe = sanitizeText(category, { maxLength: 80 });
    if (!safe) return;
    const params = new URLSearchParams();
    params.append("category", safe);
    params.append("page", "1");
    navigate(`/search?${params.toString()}`);
  };

  if (!categoriesLoading && visibleCategories.length === 0) {
    return null;
  }

  return (
    <section className="latest-collections mt-5 container-fluid">
      <Header
        head1="SHOP"
        head2="BY CATEGORY"
        paragraph="Browse all of our key categories in one place and jump straight into the styles that suit you best."
      />

      <main className="row gx-3 gy-4 justify-content-center">
        {visibleCategories.map((cat) => {
          const img = getCategoryImage(cat);
          return (
            <div key={cat} className="col-12 col-sm-6 col-lg-3">
              <button
                type="button"
                className="btn p-0 border-0 bg-transparent w-200 text-start"
                onClick={() => handleClickCategory(cat)}
              >
                <div className="sections-card d-flex flex-column">
                  <div className="sections-card-image-wrapper mb-3">
                    <img
                      src={img}
                      alt={cat}
                      className="card-img-top rounded model-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-grow-1 d-flex flex-column">
                    <h3 className="sections-card-title mb-1">{cat}</h3>
                    <p className="sections-card-description mb-3">
                      Discover curated textures, lengths and colours in our{" "}
                      {cat.toLowerCase()} collection.
                    </p>
                    <div className="mt-auto d-flex align-items-center gap-2 sections-card-cta">
                      <span>View</span>
                      <FiArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </main>
    </section>
  );
};

export default Sections;

