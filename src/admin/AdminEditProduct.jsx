import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AlertModal from "../components/AlertModal";
import ConfirmModal from "../components/ConfirmModal";
import imageCompression from "browser-image-compression";

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
    price: "",
    stock: "",
    style: "",
    weight: "",
    lace: "",
    fullDescription: "",
    promo: {
      isActive: false,
      discountPercent: 0,
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
      setStatus("Failed to update");
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

            return (
              <li key={index} className="list-group-item">
                <div className="row">
                  <div className="col-12 col-md-8">
                    <p className="mb-2">
                      <strong>{variant.length}</strong> - {variant.texture} (
                      {variant.origin}) - £{variant.price}
                      {variant.promo?.isActive &&
                        variant.promo.discountPercent > 0 && (
                          <>
                            {" "}
                            <br />
                            <small>
                              Promo: {variant.promo.discountPercent}% off
                            </small>
                            <br />
                            <small>
                              Promo Price: £
                              {(
                                variant.price *
                                (1 - variant.promo.discountPercent / 100)
                              ).toFixed(2)}
                            </small>
                          </>
                        )}
                      <br />
                      <small>Stock: {variant.stock}</small>
                    </p>

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
                    <div className="col-6 col-md-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={variant.promo?.isActive || false}
                          onChange={(e) => {
                            const updated = [...product.variants];
                            updated[index].promo = {
                              ...updated[index].promo,
                              isActive: e.target.checked,
                            };
                            setProduct({ ...product, variants: updated });
                          }}
                        />
                        <label className="form-check-label">Promo Active</label>
                      </div>
                    </div>
                    <div className="col-6 col-md-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        className="form-control"
                        placeholder="Discount %"
                        value={variant.promo?.discountPercent || ""}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].promo = {
                            ...updated[index].promo,
                            discountPercent: e.target.value
                              ? parseFloat(e.target.value)
                              : 0,
                          };
                          setProduct({ ...product, variants: updated });
                        }}
                        disabled={!variant.promo?.isActive}
                      />
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
            <input
              className="form-control"
              placeholder="Length"
              value={newVariant.length}
              onChange={(e) =>
                setNewVariant({ ...newVariant, length: e.target.value })
              }
            />
          </div>
          <div className="col-6 col-md-3">
            <input
              className="form-control"
              placeholder="Texture"
              value={newVariant.texture}
              onChange={(e) =>
                setNewVariant({ ...newVariant, texture: e.target.value })
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
            <input
              type="number"
              className="form-control"
              placeholder="Price"
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
              placeholder="Stock"
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
          <div className="col-6 col-md-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={newVariant.promo.isActive}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    promo: { ...newVariant.promo, isActive: e.target.checked },
                  })
                }
              />
              <label className="form-check-label">Promo Active</label>
            </div>
          </div>
          <div className="col-6 col-md-2">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              className="form-control"
              placeholder="Discount %"
              value={newVariant.promo.discountPercent}
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  promo: {
                    ...newVariant.promo,
                    discountPercent: e.target.value
                      ? parseFloat(e.target.value)
                      : 0,
                  },
                })
              }
              disabled={!newVariant.promo.isActive}
            />
          </div>
          <div className="col-12 mt-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (
                  !newVariant.texture ||
                  !newVariant.length ||
                  !newVariant.origin ||
                  !newVariant.price ||
                  !newVariant.stock
                ) {
                  setModalMessage(
                    "Please fill in all required fields for the new variant."
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
                  price: "",
                  stock: "",
                  style: "",
                  weight: "",
                  lace: "",
                  fullDescription: "",
                  promo: {
                    isActive: false,
                    discountPercent: 0,
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
          show={showModal}
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
          <button type="submit" className="btn btn-success">
            Save Product
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
