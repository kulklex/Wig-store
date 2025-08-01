import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AlertModal from "../components/AlertModal";
import ConfirmModal from "../components/ConfirmModal";

const AdminEditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [variantMediaMap, setVariantMediaMap] = useState({});
  const [newVariant, setNewVariant] = useState({
    texture: "",
    length: "",
    origin: "",
    price: "",
    stock: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [variantToRemove, setVariantToRemove] = useState(null);

  const navigate = useNavigate();
  const normalizeKey = (texture, length, origin) =>
    `${texture}_${length}_${origin}`.toLowerCase().replace(/[^a-z0-9]/g, "_");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("brand", product.brand);
    formData.append("variants", JSON.stringify(product.variants));

    Object.entries(variantMediaMap).forEach(([key, file]) => {
      formData.append(`media_${key}`, file);
    });

    try {
      await axios.put(`/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("Updated successfully");
      navigate("/admin/manage");
    } catch (err) {
      console.error("Update failed", err);
      setStatus("Failed to update");
    }
  };

  if (!product) return <p>Loading...</p>;

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
            const key = `${variant.texture}_${variant.length}_${variant.origin}`
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "_");
            const mediaFile = variantMediaMap[key];
            let imageUrl = null;
            if (mediaFile instanceof File) {
              imageUrl = URL.createObjectURL(mediaFile);
            } else if (typeof variant.media === "string") {
              imageUrl = variant.media;
            }

            const isEditing = editingIndex === index;

            return (
              <li key={index} className="list-group-item">
                <div className="row">
                  <div className="col-12 col-md-8">
                    <p className="mb-2">
                      <strong>{variant.length}</strong> - {variant.texture} (
                      {variant.origin}) - £{variant.price}
                      <br />
                      <small>Stock: {variant.stock}</small>
                    </p>

                    {imageUrl && (
                      <img
                        src={imageUrl}
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
                        className="form-control"
                        value={variant.style}
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
                        className="form-control"
                        value={variant.weight}
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
                        value={variant.lace}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].lace = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Lace"
                      />
                    </div>
                    <div className="col-6 col-md-2">
                      <input
                        className="form-control"
                        value={variant.fullDescription}
                        onChange={(e) => {
                          const updated = [...product.variants];
                          updated[index].fullDescription = e.target.value;
                          setProduct({ ...product, variants: updated });
                        }}
                        placeholder="Full Description"
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
                    <div className="col-12 col-md-4">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="form-control"
                        onChange={(e) =>
                          setVariantMediaMap((prev) => ({
                            ...prev,
                            [normalizeKey(
                              variant.texture,
                              variant.length,
                              variant.origin
                            )]: e.target.files[0],
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <hr />
        <div className="border-1 p-2">
          <h5>Add New Variant</h5>
          <div className="row g-2 mb-3">
            <div className="col-md-2">
              <input
                className="form-control"
                value={newVariant.length}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, length: e.target.value })
                }
                placeholder="Length"
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                value={newVariant.texture}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, texture: e.target.value })
                }
                placeholder="Texture"
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control"
                value={newVariant.origin}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, origin: e.target.value })
                }
                placeholder="Origin"
              />
            </div>
            <div className="col-6 col-md-2">
              <input
                className="form-control"
                value={newVariant.style}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, style: e.target.value })
                }
                placeholder="Style"
              />
            </div>
            <div className="col-6 col-md-2">
              <input
                className="form-control"
                value={newVariant.weight}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, weight: e.target.value })
                }
                placeholder="Weight"
              />
            </div>
            <div className="col-6 col-md-2">
              <input
                className="form-control"
                value={newVariant.lace}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, lace: e.target.value })
                }
                placeholder="Lace"
              />
            </div>
            <div className="col-6 col-md-2">
              <input
                className="form-control"
                value={newVariant.fullDescription}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    fullDescription: e.target.value,
                  })
                }
                placeholder="Full Description"
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                value={newVariant.price}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, price: e.target.value })
                }
                placeholder="Price"
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                value={newVariant.stock}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, stock: e.target.value })
                }
                placeholder="Stock"
              />
            </div>
            <div className="col-12 col-md-4">
              <input
                type="file"
                accept="image/*,video/*"
                className="form-control"
                onChange={(e) =>
                  setVariantMediaMap((prev) => ({
                    ...prev,
                    [normalizeKey(
                      newVariant.texture,
                      newVariant.length,
                      newVariant.origin
                    )]: e.target.files[0],
                  }))
                }
              />
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button
                className="btn btn-success w-100"
                type="button"
                onClick={() => {
                  if (
                    !newVariant.texture ||
                    !newVariant.length ||
                    !newVariant.price ||
                    !newVariant.stock
                  ) {
                    return setModalMessage(
                      "Texture, Length, Price, and Stock are all required"
                    );
                  } else {
                    setProduct({
                      ...product,
                      variants: [...product.variants, newVariant],
                    });
                    setNewVariant({
                      texture: "",
                      length: "",
                      origin: "",
                      price: "",
                      stock: "",
                      lace: "",
                      fullDescription: "",
                      weight: "",
                      style: "",
                    });
                  }
                }}
                disabled={
                  !newVariant.texture ||
                  !newVariant.length ||
                  !newVariant.price ||
                  !newVariant.stock
                }
              >
                Add
              </button>
            </div>
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

        <button type="submit" className="btn btn-primary my-2">
          Save Changes
        </button>
      </form>
      {status && <div className="alert mt-3">{status}</div>}
    </div>
  );
};

export default AdminEditProduct;
