import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { fetchCategories } from "../redux/productSlice";
import { sanitizeText } from "../utils/sanitize";
import Header from "./Header";


const CATEGORY_IMAGES = {
  wigs:
    "https://res.cloudinary.com/dlhgfwgs6/image/upload/v1755460955/main5-copy-min_vysooi.jpg",
  closures:
    "https://res.cloudinary.com/dlhgfwgs6/image/upload/v1755460796/main3-min_2_jdwuze.jpg",
  frontals:
    "https://res.cloudinary.com/dlhgfwgs6/image/upload/v1755428279/main3-copy_zluofp.jpg",
  bundles:
    "https://res.cloudinary.com/dlhgfwgs6/image/upload/v1755460956/main5-min_qtvgyr.jpg",
  accessories:
    "https://res.cloudinary.com/dlhgfwgs6/image/upload/v1690987654/karina-accessories_uqzvvm.jpg",
};

const getCategoryImage = (name) => {
  if (!name) return CATEGORY_IMAGES.wigs;
  const key = name.toLowerCase();
  if (CATEGORY_IMAGES[key]) return CATEGORY_IMAGES[key];
  if (key.includes("wig")) return CATEGORY_IMAGES.wigs;
  if (key.includes("frontal")) return CATEGORY_IMAGES.frontals;
  if (key.includes("closure")) return CATEGORY_IMAGES.closures;
  if (key.includes("bundle")) return CATEGORY_IMAGES.bundles;
  return CATEGORY_IMAGES.wigs;
};

const SectionsPage = () => {
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
                className="btn p-0 border-0 bg-transparent w-100 text-start"
                onClick={() => handleClickCategory(cat)}
              >
                <div className="sections-card h-100 d-flex flex-column">
                  <div className="sections-card-image-wrapper mb-3">
                    <img
                      src={img}
                      alt={cat}
                      className="sections-card-image"
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
                      <span>View {cat}</span>
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

export default SectionsPage;

