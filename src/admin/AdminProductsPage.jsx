import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [variantToRemove, setVariantToRemove] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleRemoveVariant = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-md-start">Manage Products</h2>

      {/* Responsive table wrapper */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle text-nowrap">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Variants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.variants?.length || 0}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Link
                      to={`/admin/edit-product/${p._id}`}
                      className="btn btn-sm btn-warning"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setVariantToRemove(p._id);
                        setShowConfirm(true);
                      }}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ConfirmModal
          isOpen={showConfirm}
          title="Delete Product?"
          message="Are you sure you want to delete this product? This action cannot be undone."
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
    </div>
  );
};

export default AdminProductsPage;
