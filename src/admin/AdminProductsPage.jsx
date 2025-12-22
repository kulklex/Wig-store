import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import { FiTrash } from "react-icons/fi";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalVariants: 0,
    totalStock: 0,
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [variantToRemove, setVariantToRemove] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products", {
          params: { limit: 10000, page: 1 },
        });
        const list = res.data.products || [];
        setProducts(list);

        const totals = list.reduce(
          (acc, p) => {
            const variantCount = p.variants?.length || 0;
            const stockSum = (p.variants || []).reduce(
              (sum, v) => sum + (Number(v.stock) || 0),
              0
            );
            acc.totalProducts += 1;
            acc.totalVariants += variantCount;
            acc.totalStock += stockSum;
            return acc;
          },
          { totalProducts: 0, totalVariants: 0, totalStock: 0 }
        );
        setMetrics(totals);
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
      <div className="mb-4 d-flex flex-wrap gap-3">
        <div
          className="card shadow-sm"
          style={{ minWidth: "110px", flex: "1 1 calc(33.33% - 12px)", maxWidth: "200px" }}
        >
          <div className="card-body">
            <h6 className="text-muted text-uppercase mb-1">Products</h6>
            <h4 className="mb-0">{metrics.totalProducts}</h4>
          </div>
        </div>
        <div
          className="card shadow-sm"
          style={{ minWidth: "110px", flex: "1 1 calc(33.33% - 12px)", maxWidth: "200px" }}
        >
          <div className="card-body">
            <h6 className="text-muted text-uppercase mb-1">Variants</h6>
            <h4 className="mb-0">{metrics.totalVariants}</h4>
          </div>
        </div>
        <div
          className="card shadow-sm"
          style={{ minWidth: "110px", flex: "1 1 calc(33.33% - 12px)", maxWidth: "200px" }}
        >
          <div className="card-body">
            <h6 className="text-muted text-uppercase mb-1">Total Stock</h6>
            <h4 className="mb-0">{metrics.totalStock}</h4>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle text-nowrap">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Variants</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p, idx) => (
              <tr
                key={p._id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/admin/edit-product/${p._id}`)}
              >
                <td>{idx + 1}</td>
                <td>{p.name}</td>
                <td>{p.variants?.length || 0}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Link
                      to={`/admin/edit-product/${p._id}`}
                      className="btn btn-sm btn-outline-primary"
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
                      <FiTrash />
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
