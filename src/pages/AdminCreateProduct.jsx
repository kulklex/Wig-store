import React, { useState } from "react";
import axios from "axios";

const predefinedTextures = [
  "Straight",
  "Bodywave",
  "Luxe Curl (Deep Wave)",
  "Loose Wave",
  "Loose Curls (Water Wave)",
  "Kinky Curly",
  "Yaki Straight",
  "Kinky Straight",
  "Vietnamese (DD) Straight",
  "Cambodian (DD) Wavy",
  "Burmese (DD) Curly",
];

const predefinedLengths = [
  '10"',
  '12"',
  '14"',
  '16"',
  '18"',
  '20"',
  '22"',
  '24"',
  '26"',
  '28"',
  '30"',
];

const normalizeTexture = (texture) =>
  texture.toLowerCase().replace(/[^a-z0-9]/gi, "_");

const AdminCreateProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [variants, setVariants] = useState([]);
  const [variantInput, setVariantInput] = useState({
    length: "",
    texture: "",
    origin: "",
    price: "",
    stock: "",
    style: "",
    weight: "",
    lace: "",
    fullDescription: "",
    promo: { isActive: false, discountPercent: "" },
  });
  const [textureMediaMap, setTextureMediaMap] = useState({});
  const [status, setStatus] = useState("");
  const [lockedTexture, setLockedTexture] = useState("");

  const handleAddVariant = () => {
    if (!variantInput.texture || !variantInput.length) {
      return alert("Texture and length are required");
    }
    setVariants([...variants, variantInput]);
    setVariantInput({
      texture: "",
      length: "",
      origin: "",
      price: "",
      stock: "",
      style: "",
      weight: "",
      lace: "",
      fullDescription: "",
      promo: { isActive: false, discountPercent: "" },
    });
  };

  const handleRemoveVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
    if (updated.length === 0) setLockedTexture("");
  };

  const handleTextureMediaChange = (texture, file) => {
    const key = normalizeTexture(texture);
    setTextureMediaMap((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !category || variants.length === 0) {
      return alert("Fill all required fields and add at least one variant");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("variants", JSON.stringify(variants));

    Object.entries(textureMediaMap).forEach(([key, file]) => {
      formData.append(`media_${key}`, file);
    });

    try {
      setStatus("Uploading...");
      const res = await axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("Product created!");
    } catch (err) {
      console.error(err);
      setStatus("Failed to create product");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">Create New Product</h4>
        </div>
        <div className="card-body">
          {/* General Info */}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="productName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
                required
              />
              <label htmlFor="productName">Name *</label>
            </div>

            <div className="form-floating mb-3">
              <textarea
                className="form-control"
                id="desc"
                placeholder="Product Description"
                style={{ height: "100px" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <label htmlFor="desc">Description *</label>
            </div>

            <div className="row g-3">
              <div className="col-md-6 form-floating">
                <input
                  className="form-control"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  required
                />
                <label htmlFor="category">Category *</label>
              </div>
              <div className="col-md-6 form-floating">
                <input
                  className="form-control"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Brand"
                />
                <label htmlFor="brand">Brand</label>
              </div>
            </div>

            {/* Variants Section */}
            <div className="card mt-4 shadow-sm border-0">
              <div className="card-body bg-light rounded">
                <h5>Add Variant</h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Texture</label>
                    {lockedTexture ? (
                      <input
                        className="form-control"
                        value={lockedTexture}
                        disabled
                      />
                    ) : (
                      <>
                        <select
                          className="form-select mb-1"
                          value={variantInput.texture}
                          onChange={(e) =>
                            setVariantInput({
                              ...variantInput,
                              texture: e.target.value,
                            })
                          }
                        >
                          <option value="">-- Select --</option>
                          {predefinedTextures.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <input
                          className="form-control"
                          placeholder="Or type custom"
                          value={variantInput.texture}
                          onChange={(e) =>
                            setVariantInput({
                              ...variantInput,
                              texture: e.target.value,
                            })
                          }
                        />
                      </>
                    )}
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Length</label>
                    <select
                      className="form-select mb-1"
                      value={variantInput.length}
                      onChange={(e) =>
                        setVariantInput({
                          ...variantInput,
                          length: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Select --</option>
                      {predefinedLengths.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <input
                      className="form-control"
                      placeholder="Or type"
                      value={variantInput.length}
                      onChange={(e) =>
                        setVariantInput({
                          ...variantInput,
                          length: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Origin</label>
                    <input
                      className="form-control"
                      value={variantInput.origin}
                      onChange={(e) =>
                        setVariantInput({
                          ...variantInput,
                          origin: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      value={variantInput.stock}
                      onChange={(e) =>
                        setVariantInput({
                          ...variantInput,
                          stock: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Price (£)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={variantInput.price}
                      onChange={(e) =>
                        setVariantInput({
                          ...variantInput,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Style</label>
                    <input
                      className="form-control"
                      placeholder="e.g. Drawstring or custom"
                      value={variantInput.style}
                      onChange={(e) =>
                        setVariantInput({
                          ...variantInput,
                          style: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Weight</label>
                    <input
                      className="form-control"
                      placeholder="Enter weight"
                      value={variantInput.weight}
                      onChange={(e) =>
                        setVariantInput({
                          ...variantInput,
                          weight: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Lace</label>
                    <input
                      className="form-control"
                      placeholder="e.g. HD or custom"
                      value={variantInput.lace}
                      onChange={(e) =>
                        setVariantInput({
                          ...variantInput,
                          lace: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Full Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={variantInput.fullDescription}
                      onChange={(e) =>
                        setVariantInput({
                          ...variantInput,
                          fullDescription: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Promo</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={variantInput.promo.isActive}
                        onChange={(e) =>
                          setVariantInput({
                            ...variantInput,
                            promo: {
                              ...variantInput.promo,
                              isActive: e.target.checked,
                            },
                          })
                        }
                      />
                      <label className="form-check-label">Active</label>
                    </div>
                    {variantInput.promo.isActive && (
                      <input
                        type="number"
                        className="form-control mt-1"
                        placeholder="% Discount"
                        value={variantInput.promo.discountPercent}
                        onChange={(e) =>
                          setVariantInput({
                            ...variantInput,
                            promo: {
                              ...variantInput.promo,
                              discountPercent: e.target.value,
                            },
                          })
                        }
                      />
                    )}
                  </div>

                  <div className="col-md-3 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={handleAddVariant}
                    >
                      <i className="bi bi-plus-circle"></i> Add Variant
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Variants List */}
            {variants.length > 0 && (
              <ul className="list-group mt-4 shadow-sm">
                {variants.map((v, i) => (
                  <li
                    key={i}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div>
                      <strong>{v.length}</strong> – {v.texture} ({v.origin})
                      <br />
                      <small>
                        ${v.price} | Stock: {v.stock}{" "}
                        {v.promo?.isActive &&
                          `| Promo: ${v.promo.discountPercent}%`}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveVariant(i)}
                    >
                      <i className="bi bi-x-circle"></i> Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Texture Media Upload */}
            <div className="card mt-4 border-0 shadow-sm">
              <div className="card-body bg-light rounded">
                <h5 className="card-title">Upload Media per Texture</h5>
                {[...new Set(variants.map((v) => v.texture))].map((texture) => {
                  const key = normalizeTexture(texture);
                  return (
                    <div key={key} className="mb-3">
                      <label className="form-label">
                        Media for <strong>{texture}</strong>
                      </label>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="form-control"
                        onChange={(e) =>
                          handleTextureMediaChange(texture, e.target.files[0])
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-dark btn-lg mt-4 w-100 shadow-sm"
            >
              <i className="bi bi-upload"></i> Create Product
            </button>

            {status && (
              <div
                className={`alert mt-4 ${
                  status.includes("Failed") ? "alert-danger" : "alert-success"
                }`}
              >
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateProduct;
