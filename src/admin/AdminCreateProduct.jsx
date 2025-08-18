import React, { useState } from "react";
import axios from "axios";
import AlertModal from "../components/AlertModal";
import { useNavigate } from "react-router-dom";
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
  '10',
  '12',
  '14',
  '16',
  '18',
  '20',
  '22',
  '24',
  '26',
  '28',
  '30',
];


// For texture-only normalization (for unique texture grouping)
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

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [variantToRemove, setVariantToRemove] = useState(null);

  const navigate = useNavigate();

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

  const handleAddVariant = () => {
    if (
      !variantInput.texture ||
      !variantInput.length ||
      !variantInput.price ||
      !variantInput.stock
    ) {
      setModalMessage("Texture, length, price, and stock are required");
      setShowModal(true);
      return;
    }

    if (variantInput.price <= 0 || variantInput.stock < 0) {
      setModalMessage("Price must be greater than 0 and stock cannot be negative.");
      setShowModal(true);
      return;
    }

    const promo = {
      isActive: variantInput.promo.isActive,
      discountPercent: variantInput.promo.isActive
        ? Number(variantInput.promo.discountPercent) || 0
        : 0,
    };

    setVariants([
      ...variants,
      { ...variantInput, promo }
    ]);

    setVariantInput({
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
  };

  const handleRemoveVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const handleTextureMediaChange = async (texture, file) => {
    try {
      const compressedFile = await compressImageIfNeeded(file);
      const key = normalizeTexture(texture);
      setTextureMediaMap((prev) => ({ ...prev, [key]: compressedFile }));
    } catch (error) {
      setModalMessage("Failed to process image. Please try a smaller file.");
      setShowModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !description || !category || variants.length === 0) {
      setModalMessage("Fill all required fields and add at least one variant");
      setShowModal(true);
      return;
    }

    
    const uniqueTextures = [...new Set(variants.map(v => v.texture))];
    const texturesWithoutImage = uniqueTextures.filter(texture => 
      !textureMediaMap[normalizeTexture(texture)]
    );

    if (texturesWithoutImage.length > 0) {
      setModalMessage(
        `Please upload an image for: ${texturesWithoutImage.join(", ")}`
      );
      setShowModal(true);
      return;
    }

    
    const cleanVariants = variants.map(v => {
      const cleanVariant = {
        texture: v.texture,
        length: v.length,
        price: Number(v.price),
        stock: Number(v.stock),
        promo: {
          isActive: v.promo?.isActive || false,
          discountPercent: Number(v.promo?.discountPercent) || 0,
        }
      };

      
      if (v.origin && v.origin.trim()) cleanVariant.origin = v.origin.trim();
      if (v.style && v.style.trim()) cleanVariant.style = v.style.trim();
      if (v.weight && v.weight.toString().trim()) cleanVariant.weight = Number(v.weight);
      if (v.lace && v.lace.trim()) cleanVariant.lace = v.lace.trim();
      if (v.fullDescription && v.fullDescription.trim()) cleanVariant.fullDescription = v.fullDescription.trim();

      return cleanVariant;
    });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    if (brand && brand.trim()) formData.append("brand", brand.trim());
    formData.append("variants", JSON.stringify(cleanVariants));

    
    uniqueTextures.forEach(texture => {
      const frontendKey = normalizeTexture(texture);
      const file = textureMediaMap[frontendKey];
      
      if (file) {
        // Backend expects fieldname like "media_kinky_curly" (just texture)
        formData.append(`media_${normalizeTexture(texture)}`, file);
      }
    });

    try {
      setStatus("Uploading...");
      const res = await axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.status);
      setStatus("Product created successfully!");
      setTimeout(() => {
        navigate("/admin/products");
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to create product. Please try again.");
    }
  };

  
  const uniqueTextures = [...new Set(variants.map(v => v.texture))];

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">Create New Product</h4>
        </div>
        <div className="card-body">
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


            <div className="card mt-4 shadow-sm border-0">
              <div className="card-body bg-light rounded">
                <h5>Add Variant</h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Texture *</label>
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
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Length *</label>
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
                    <label className="form-label">Stock *</label>
                    <input
                      type="number"
                      min="0"
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
                    <label className="form-label">Price (£) *</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
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
                    <label className="form-label">Weight (g)</label>
                    <input
                      type="number"
                      min="0"
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
                    <label className="form-label">Promotion</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="promoActive"
                        checked={variantInput.promo.isActive}
                        onChange={(e) =>
                          setVariantInput({
                            ...variantInput,
                            promo: {
                              ...variantInput.promo,
                              isActive: e.target.checked,
                              discountPercent: e.target.checked 
                                ? variantInput.promo.discountPercent 
                                : "",
                            },
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="promoActive">
                        Active
                      </label>
                    </div>
                    {variantInput.promo.isActive && (
                      <input
                        type="number"
                        min="0"
                        max="100"
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


            {variants.length > 0 && (
              <div className="card mt-4 shadow-sm border-0">
                <div className="card-body bg-light rounded">
                  <h5>Variants Added ({variants.length})</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                      <thead>
                        <tr>
                          <th>Texture</th>
                          <th>Length</th>
                          <th>Origin</th>
                          <th>Stock</th>
                          <th>Price (£)</th>
                          <th>Promo</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((v, i) => (
                          <tr key={i}>
                            <td>{v.texture}</td>
                            <td>{v.length}</td>
                            <td>{v.origin || '-'}</td>
                            <td>{v.stock}</td>
                            <td>£{v.price}</td>
                            <td>
                              {v.promo?.isActive
                                ? `${v.promo.discountPercent}% OFF`
                                : "-"}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  setVariantToRemove(i);
                                  setShowConfirm(true);
                                }}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Media Upload - Only show if there are variants */}
            {uniqueTextures.length > 0 && (
              <div className="card mt-4 border-0 shadow-sm">
                <div className="card-body bg-light rounded">
                  <h5 className="card-title">
                    <i className="bi bi-image"></i> Upload Media per Texture
                  </h5>
                  <p className="text-muted small">
                    Upload one image per texture. This image will represent all variants with the same texture.
                  </p>
                  {uniqueTextures.map((texture) => {
                    const key = normalizeTexture(texture);
                    const hasImage = textureMediaMap[key];
                    return (
                      <div key={key} className="mb-3">
                        <label className="form-label">
                          Media for <strong>{texture}</strong> 
                          {hasImage && <span className="text-success ms-2">✓ Uploaded</span>}
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
                        {hasImage && (
                          <small className="text-muted">
                            Selected: {hasImage.name} ({(hasImage.size / (1024 * 1024)).toFixed(1)}MB)
                          </small>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 d-flex justify-content-between align-items-center">
              <button 
                type="submit" 
                className="btn btn-dark btn-lg shadow-sm"
                disabled={status === "Uploading..."}
              >
                <i className="bi bi-upload"></i> 
                {status === "Uploading..." ? " Creating..." : " Create Product"}
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
    </div>
  );
};

export default AdminCreateProduct;