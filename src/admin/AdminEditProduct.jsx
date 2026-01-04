import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import AlertModal from "../components/AlertModal";
import ConfirmModal from "../components/ConfirmModal";
import imageCompression from "browser-image-compression";

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
  "10",
  "12",
  "14",
  "16",
  "18",
  "20",
  "22",
  "24",
  "26",
  "28",
  "30",
];

const predefinedColors = ["Black", "Brown", "Gold"];

const AdminEditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [textureMediaMap, setTextureMediaMap] = useState({});
  const [newVariant, setNewVariant] = useState({
    texture: "",
    length: "",
    origin: "",
    color: "",
    laceSize: "",
    price: "",
    stock: "",
    style: "",
    weight: "",
    lace: "",
    fullDescription: "",
    promo: {
      isActive: false,
      discountPercent: "",
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [variantToRemove, setVariantToRemove] = useState(null);

  const navigate = useNavigate();
  
  const normalizeTexture = (texture) => texture.toLowerCase().replace(/[^a-z0-9]/g, "_");

  const compressImageIfNeeded = async (file) => {
    const maxSizeMB = 10;
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (fileSizeMB <= maxSizeMB) {
      return file;
    }

    if (!file.type.startsWith('image/')) {
      setStatus(`Warning: ${file.name} is ${fileSizeMB.toFixed(1)}MB. Video files cannot be compressed. Please use a smaller file.`);
      setTimeout(() => setStatus(""), 5000);
      throw new Error("Video files cannot be compressed");
    }

    try {
      setStatus(`Compressing ${file.name} (${fileSizeMB.toFixed(1)}MB → target: <${maxSizeMB}MB)...`);
      
      const compressedFile = await imageCompression(file, {
        maxSizeMB: maxSizeMB - 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      });

      const compressedSizeMB = compressedFile.size / (1024 * 1024);
      setStatus(`Compression complete: ${file.name} (${fileSizeMB.toFixed(1)}MB → ${compressedSizeMB.toFixed(1)}MB)`);
      
      setTimeout(() => setStatus(""), 3000);
      
      return compressedFile;
    } catch (error) {
      console.error("Image compression failed:", error);
      setStatus("Image compression failed. Please try a smaller image.");
      setTimeout(() => setStatus(""), 3000);
      throw new Error("Image compression failed");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveVariant = async (variantId) => {
    try {
      const res = await axios.delete(
        `/api/products/${id}/variants/${variantId}`
      );
      const updatedProduct = res.data.product;
      setProduct(updatedProduct);
    } catch (error) {
      console.error("Failed to delete variant", error);
      setModalMessage("Failed to remove variant. Please try again.");
      setShowModal(true);
    }
  };

  const handleTextureMediaChange = async (texture, file) => {
    try {
      const compressedFile = await compressImageIfNeeded(file);
      const textureKey = normalizeTexture(texture);
      setTextureMediaMap((prev) => ({ ...prev, [textureKey]: compressedFile }));
    } catch (error) {
      setModalMessage("Failed to process image. Please try a smaller file.");
      setShowModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("brand", product.brand);
    formData.append("variants", JSON.stringify(product.variants));

    Object.entries(textureMediaMap).forEach(([textureKey, file]) => {
      formData.append(`media_${textureKey}`, file);
    });

    try {
      setStatus("Updating product...");
      await axios.put(`/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("Updated successfully");
      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);
    } catch (err) {
      console.error("Update failed", err);
      const apiMessage = err?.response?.data?.message;
      if (apiMessage?.toLowerCase().includes("already exists")) {
        setStatus("");
        setModalMessage("A product with this name already exists. Please choose a unique name.");
        setShowModal(true);
      } else {
        setStatus("Failed to update");
      }
    }
  };

  if (!product) return <p>Loading...</p>;

  const uniqueTextures = [...new Set(product.variants?.map(v => v.texture) || [])];

  return (
    <div className="container mt-5">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            name="name"
            value={product.name || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={product.description || ""}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            className="form-control"
            name="category"
            value={product.category || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input
            className="form-control"
            name="brand"
            value={product.brand || ""}
            onChange={handleChange}
          />
        </div>

        <hr />
        <h5>Variants</h5>
        <ul className="list-group mb-4">
          {product.variants?.map((variant, index) => {
            const isEditing = editingIndex === index;
            const descriptionPreview =
              variant.fullDescription?.length > 120
                ? `${variant.fullDescription.slice(0, 120)}...`
                : variant.fullDescription || "N/A";
            const basePrice = typeof variant.price === "number" ? variant.price : Number(variant.price) || 0;
            const promoPrice = variant.promo?.promoPrice;
            const isPromoActive = Boolean(variant.promo?.isActive);
            const displayPrice =
              isPromoActive && promoPrice ? promoPrice : basePrice;

            return (
              <li key={index} className="list-group-item">
                <div className="row">
                  <div className="col-12 col-md-8">
                    <p className="mb-2 fw-semibold">
                      <strong>{variant.length || "N/A"}</strong> — {variant.texture || "N/A"}
                    </p>
                    <div className="small text-muted">
                      <div>Origin: {variant.origin || "N/A"}</div>
                      <div>Color: {variant.color || "N/A"}</div>
                      <div>
                        Lace Size: {variant.laceSize || "N/A"} | Lace: {variant.lace || "N/A"}
                      </div>
                      <div>
                        Style: {variant.style || "N/A"} | Weight: {variant.weight || "N/A"}
                      </div>
                      <div>
                        Price: £{displayPrice.toFixed(2)} {isPromoActive && promoPrice ? `(base £${basePrice.toFixed(2)})` : ""}
                      </div>
                      <div>
                        Promo:{" "}
                        {isPromoActive
                          ? `${variant.promo?.discountPercent || 0}% • Promo Price £${(promoPrice || 0).toFixed(2)}`
                          : "Inactive"}
                      </div>
                      <div>Stock: {variant.stock}</div>
                      <div>Description: {descriptionPreview}</div>
                    </div>

                    {variant.media && (
                      <img
                        src={variant.media}
                        alt="Variant Preview"
                        className="img-fluid rounded"
                        style={{ maxWidth: "100px", objectFit: "cover" }}
                      />
                    )}
                  </div>

                  <div className="col-12 col-md-4 d-flex flex-wrap align-items-start gap-2 mt-3 mt-md-0">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setEditingIndex(isEditing ? null : index)}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setVariantToRemove(variant._id);
                        setShowConfirm(true);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="row g-2 mt-3">
                    <div className="col-6 col-md-2">
                      <label className="form-label small mb-1">Length</label>
                      <input
                        className="form-control"
                        value={variant.length}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].length = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Length"
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label small mb-1">Texture</label>
                      <input
                        className="form-control"
                        value={variant.texture}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].texture = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Texture"
                      />
                    </div>
                    <div className="col-6 col-md-2">
                      <label className="form-label small mb-1">Origin</label>
                      <input
                        className="form-control"
                        value={variant.origin}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].origin = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Origin"
                      />
                    </div>
                    <div className="col-6 col-md-2">
                      <label className="form-label small mb-1">Color</label>
                      <input
                        className="form-control"
                        value={variant.color || ""}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].color = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Color"
                      />
                    </div>
                    <div className="col-6 col-md-2">
                      <label className="form-label small mb-1">Lace Size</label>
                      <input
                        className="form-control"
                        value={variant.laceSize || ""}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].laceSize = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Lace Size"
                      />
                    </div>
                    <div className="col-6 col-md-2">
                      <label className="form-label small mb-1">Price (£)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={variant.price}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].price = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Price"
                      />
                    </div>
                    <div className="col-6 col-md-2">
                      <label className="form-label small mb-1">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={variant.stock}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].stock = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Stock"
                      />
                    </div>
                    <div className="col-6 col-md-2">
                      <label className="form-label small mb-1">Style</label>
                      <input
                        className="form-control"
                        value={variant.style || ""}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].style = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Style"
                      />
                    </div>
                    <div className="col-6 col-md-2">
                      <label className="form-label small mb-1">Weight</label>
                      <input
                        type="number"
                        className="form-control"
                        value={variant.weight || ""}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].weight = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Weight"
                      />
                    </div>
                    <div className="col-6 col-md-2">
                      <label className="form-label small mb-1">Lace</label>
                      <input
                        className="form-control"
                        value={variant.lace || ""}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].lace = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Lace"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small mb-1">Full Description</label>
                      <textarea
                        className="form-control"
                        value={variant.fullDescription || ""}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].fullDescription = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Full Description"
                        rows="2"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Promotion</label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`promoActive-${index}`}
                          checked={variant.promo?.isActive || false}
                          onChange={(e) => {
                            const updated = [...product.variants];
                            updated[index].promo = {
                              ...updated[index].promo,
                              isActive: e.target.checked,
                              discountPercent: e.target.checked
                                ? updated[index].promo?.discountPercent || ""
                                : "",
                            };
                            setProduct({ ...product, variants: updated });
                          }}
                        />
                        <label className="form-check-label" htmlFor={`promoActive-${index}`}>
                          Active
                        </label>
                      </div>
                      {variant.promo?.isActive && (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-control mt-1"
                          placeholder="% Discount"
                          value={variant.promo?.discountPercent ?? ""}
                          onChange={(e) => {
                            const updated = [...product.variants];
                            updated[index].promo = {
                              ...updated[index].promo,
                              discountPercent: e.target.value,
                            };
                            setProduct({ ...product, variants: updated });
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <hr />
        <h5>Add New Variant</h5>
        <div className="row g-2 mb-4">
          <div className="col-6 col-md-2">
            <label className="form-label">Texture *</label>
            <select
              className="form-select mb-1"
              value={newVariant.texture}
              onChange={(e) =>
                setNewVariant({ ...newVariant, texture: e.target.value })
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
              value={newVariant.texture}
              onChange={(e) =>
                setNewVariant({ ...newVariant, texture: e.target.value })
              }
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label">Length *</label>
            <select
              className="form-select mb-1"
              value={newVariant.length}
              onChange={(e) =>
                setNewVariant({ ...newVariant, length: e.target.value })
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
              value={newVariant.length}
              onChange={(e) =>
                setNewVariant({ ...newVariant, length: e.target.value })
              }
            />
          </div>
          <div className="col-6 col-md-2">
            <input
              className="form-control"
              placeholder="Origin"
              value={newVariant.origin}
              onChange={(e) =>
                setNewVariant({ ...newVariant, origin: e.target.value })
              }
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">Color *</label>
            <select
              className="form-select mb-1"
              value={newVariant.color}
              onChange={(e) =>
                setNewVariant({ ...newVariant, color: e.target.value })
              }
            >
              <option value="">-- Select --</option>
              {predefinedColors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              className="form-control"
              placeholder="Or type custom"
              value={newVariant.color}
              onChange={(e) =>
                setNewVariant({ ...newVariant, color: e.target.value })
              }
            />
          </div>
          <div className="col-6 col-md-2">
            <input
              className="form-control"
              placeholder="Lace Size"
              value={newVariant.laceSize}
              onChange={(e) =>
                setNewVariant({ ...newVariant, laceSize: e.target.value })
              }
            />
          </div>
          <div className="col-6 col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Price *"
              value={newVariant.price}
              onChange={(e) =>
                setNewVariant({ ...newVariant, price: e.target.value })
              }
            />
          </div>
          <div className="col-6 col-md-2">
            <input
              className="form-control"
              placeholder="Style"
              value={newVariant.style}
              onChange={(e) =>
                setNewVariant({ ...newVariant, style: e.target.value })
              }
            />
          </div>
          <div className="col-6 col-md-2">
            <input
              className="form-control"
              placeholder="Weight"
              value={newVariant.weight}
              onChange={(e) =>
                setNewVariant({ ...newVariant, weight: e.target.value })
              }
            />
          </div>
          <div className="col-6 col-md-2">
            <input
              className="form-control"
              placeholder="Lace"
              value={newVariant.lace}
              onChange={(e) =>
                setNewVariant({ ...newVariant, lace: e.target.value })
              }
            />
          </div>
          <div className="col-6 col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Stock *"
              value={newVariant.stock}
              onChange={(e) =>
                setNewVariant({ ...newVariant, stock: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <textarea
              className="form-control"
              placeholder="Full Description"
              value={newVariant.fullDescription}
              onChange={(e) =>
                setNewVariant({ ...newVariant, fullDescription: e.target.value })
              }
              rows="2"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Promotion</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="newPromoActive"
                checked={newVariant.promo.isActive}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    promo: {
                      ...newVariant.promo,
                      isActive: e.target.checked,
                      discountPercent: e.target.checked
                        ? newVariant.promo.discountPercent
                        : "",
                    },
                  })
                }
              />
              <label className="form-check-label" htmlFor="newPromoActive">
                Active
              </label>
            </div>
            {newVariant.promo.isActive && (
              <input
                type="number"
                min="0"
                max="100"
                className="form-control mt-1"
                placeholder="% Discount"
                value={newVariant.promo.discountPercent}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    promo: {
                      ...newVariant.promo,
                      discountPercent: e.target.value,
                    },
                  })
                }
              />
            )}
          </div>
          <div className="col-12 mt-2">
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => {
                const requiredFilled =
                  newVariant.texture?.trim() &&
                  newVariant.length?.trim() &&
                  newVariant.color?.trim() &&
                  newVariant.price !== "" &&
                  newVariant.stock !== "";

                if (
                  !requiredFilled
                ) {
                  setModalMessage(
                    "Please fill in all required fields (Texture, Length, Color, Price, Stock) for the new variant."
                  );
                  setShowModal(true);
                  return;
                }
                setProduct((prev) => ({
                  ...prev,
                  variants: [...(prev.variants || []), newVariant],
                }));
                setNewVariant({
                  texture: "",
                  length: "",
                  origin: "",
                  color: "",
                  laceSize: "",
                  price: "",
                  stock: "",
                  style: "",
                  weight: "",
                  lace: "",
                  fullDescription: "",
                  promo: {
                    isActive: false,
                    discountPercent: "",
                  },
                });
              }}
            >
              Add Variant
            </button>
          </div>
        </div>

        <hr />
        <h5>Update Media by Texture</h5>
        <div className="card mb-4">
          <div className="card-body">
            <p className="text-muted small">
              Upload a new image for a texture to update all variants with that texture.
            </p>
            {uniqueTextures.map((texture) => {
              const textureKey = normalizeTexture(texture);
              const hasNewImage = textureMediaMap[textureKey];
              return (
                <div key={textureKey} className="mb-3">
                  <label className="form-label">
                    Media for <strong>{texture}</strong>
                    {hasNewImage && <span className="text-success ms-2">✓ New Image Selected</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="form-control"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        await handleTextureMediaChange(texture, e.target.files[0]);
                      }
                    }}
                  />
                  {hasNewImage && (
                    <small className="text-muted">
                      Selected: {hasNewImage.name} ({(hasNewImage.size / (1024 * 1024)).toFixed(1)}MB)
                    </small>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <AlertModal
          isOpen={showModal}
          title="Validation Error"
          message={modalMessage}
          onClose={() => setShowModal(false)}
          onConfirm={() => setShowModal(false)}
          confirmText="OK"
          cancelText=""
        />

        <ConfirmModal
          isOpen={showConfirm}
          title="Remove Variant?"
          message="Are you sure you want to remove this variant? This action cannot be undone."
          onConfirm={() => {
            handleRemoveVariant(variantToRemove);
            setShowConfirm(false);
            setVariantToRemove(null);
          }}
          onCancel={() => {
            setShowConfirm(false);
            setVariantToRemove(null);
          }}
          confirmText="Remove"
          cancelText="Cancel"
          confirmVariant="danger"
        />

        <div className="d-flex justify-content-between align-items-center">
          <button type="submit" className="btn btn-dark">
            Update Product
          </button>
          {status && (
            <div
              className={`alert mb-0 ${
                status.includes("Failed") ? "alert-danger" : "alert-success"
              }`}
            >
              {status}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;
