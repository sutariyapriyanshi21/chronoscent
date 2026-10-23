import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiShoppingBag,
  FiPrinter,
  FiAlertCircle,
  FiArrowRight,
  FiRefreshCw
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import "../css/MyOrders.css";

function MyOrders() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("chronoscent_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [reviewModalData, setReviewModalData] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Sync user state on storage changes
  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const saved = localStorage.getItem("chronoscent_user");
        setCurrentUser(saved ? JSON.parse(saved) : null);
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Fetch orders for this logged-in user
  const fetchOrders = async () => {
    if (!currentUser?.email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/orders/user/${encodeURIComponent(currentUser.email)}`);
      if (!res.ok) {
        throw new Error("Unable to load your orders.");
      }
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError("Could not load your orders. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser?.email]);

  // Handle customer cancelling order if Processing
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    );
    if (!confirmCancel) return;

    setCancellingOrderId(orderId);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to cancel order.");
        return;
      }

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "Cancelled" } : o))
      );
      alert("Order has been cancelled successfully.");
    } catch (err) {
      console.error("Cancel order error:", err);
      alert("An error occurred while cancelling your order.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Open review modal for an item
  const handleOpenReviewModal = (orderId, itemIndex, item) => {
    setReviewModalData({
      orderId,
      itemIndex,
      item,
      rating: item.rating || 5,
      review: item.review || ""
    });
    setHoverRating(0);
  };

  // Submit or update rating & review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewModalData) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/orders/${reviewModalData.orderId}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemIndex: reviewModalData.itemIndex,
          rating: reviewModalData.rating,
          review: reviewModalData.review
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to submit review.");
        return;
      }

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === reviewModalData.orderId ? updated.order : o))
      );
      alert("Thank you! Your rating and review have been saved.");
      setReviewModalData(null);
    } catch (err) {
      console.error("Submit review error:", err);
      alert("Error submitting review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Status counts for filter pills
  const counts = useMemo(() => {
    return {
      all: orders.length,
      Processing: orders.filter((o) => (o.status || "Processing") === "Processing").length,
      Shipped: orders.filter((o) => o.status === "Shipped").length,
      Delivered: orders.filter((o) => o.status === "Delivered").length,
      Cancelled: orders.filter((o) => o.status === "Cancelled").length,
    };
  }, [orders]);

  // Filtered orders based on selected tab and search term
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      const currentStatus = order.status || "Processing";
      if (statusFilter !== "all" && currentStatus.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // Search filter (Matches Order ID, product title, or city)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order._id?.toLowerCase().includes(q);
        const matchesCity = order.customerInfo?.city?.toLowerCase().includes(q);
        const matchesItem = order.orderItems?.some((item) =>
          item.name?.toLowerCase().includes(q)
        );
        return matchesId || matchesCity || matchesItem;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Helper for status badge presentation
  const renderStatusBadge = (status = "Processing") => {
    switch (status) {
      case "Shipped":
        return (
          <span className="status-badge status-shipped">
            <FiTruck size={13} /> Shipped
          </span>
        );
      case "Delivered":
        return (
          <span className="status-badge status-delivered">
            <FiCheckCircle size={13} /> Delivered
          </span>
        );
      case "Cancelled":
        return (
          <span className="status-badge status-cancelled">
            <FiXCircle size={13} /> Cancelled
          </span>
        );
      case "Processing":
      default:
        return (
          <span className="status-badge status-processing">
            <FiClock size={13} /> Processing
          </span>
        );
    }
  };

  // Helper for timeline progress calculation
  const getProgressState = (status = "Processing") => {
    if (status === "Cancelled") return { percentage: 0, isCancelled: true };
    if (status === "Delivered") return { percentage: 100, isCancelled: false };
    if (status === "Shipped") return { percentage: 66, isCancelled: false };
    return { percentage: 33, isCancelled: false }; // Processing
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // If user is not logged in
  if (!currentUser) {
    return (
      <div className="orders-page py-5">
        <div className="container">
          <div className="orders-empty-state">
            <div className="empty-state-icon">
              <FiPackage />
            </div>
            <h2 className="empty-state-title">Track Your Luxury Orders</h2>
            <p className="empty-state-desc">
              Please sign in to your Chronoscent Elite account to view your past orders, delivery status, and invoice receipts.
            </p>
            <Link to="/login" className="btn-explore-catalog">
              Sign In to Your Account <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">

        {/* ================= PAGE HEADER ================= */}
        <div className="orders-header d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">
              Track real-time shipment updates, review order histories, and download tax receipts for <strong>{currentUser.name}</strong> ({currentUser.email}).
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            title="Refresh Orders"
          >
            <FiRefreshCw className={loading ? "spin" : ""} size={14} /> Refresh
          </button>
        </div>

        {/* ================= STATS OVERVIEW CARDS ================= */}
        <div className="orders-stats-grid">
          <div className="order-stat-card">
            <div className="stat-icon-wrapper stat-icon-total">
              <FiShoppingBag />
            </div>
            <div className="stat-info">
              <div className="stat-value">{counts.all}</div>
              <div className="stat-label">Total Placed</div>
            </div>
          </div>

          <div className="order-stat-card">
            <div className="stat-icon-wrapper stat-icon-processing">
              <FiClock />
            </div>
            <div className="stat-info">
              <div className="stat-value">{counts.Processing}</div>
              <div className="stat-label">In Preparation</div>
            </div>
          </div>

          <div className="order-stat-card">
            <div className="stat-icon-wrapper stat-icon-shipped">
              <FiTruck />
            </div>
            <div className="stat-info">
              <div className="stat-value">{counts.Shipped}</div>
              <div className="stat-label">In Transit</div>
            </div>
          </div>

          <div className="order-stat-card">
            <div className="stat-icon-wrapper stat-icon-delivered">
              <FiCheckCircle />
            </div>
            <div className="stat-info">
              <div className="stat-value">{counts.Delivered}</div>
              <div className="stat-label">Delivered</div>
            </div>
          </div>
        </div>

        {/* ================= FILTER & SEARCH BAR ================= */}
        <div className="orders-filter-container">
          <div className="filter-pills">
            <button
              className={`filter-pill ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All Orders <span className="pill-count">{counts.all}</span>
            </button>
            <button
              className={`filter-pill ${statusFilter === "Processing" ? "active" : ""}`}
              onClick={() => setStatusFilter("Processing")}
            >
              Processing <span className="pill-count">{counts.Processing}</span>
            </button>
            <button
              className={`filter-pill ${statusFilter === "Shipped" ? "active" : ""}`}
              onClick={() => setStatusFilter("Shipped")}
            >
              Shipped <span className="pill-count">{counts.Shipped}</span>
            </button>
            <button
              className={`filter-pill ${statusFilter === "Delivered" ? "active" : ""}`}
              onClick={() => setStatusFilter("Delivered")}
            >
              Delivered <span className="pill-count">{counts.Delivered}</span>
            </button>
            <button
              className={`filter-pill ${statusFilter === "Cancelled" ? "active" : ""}`}
              onClick={() => setStatusFilter("Cancelled")}
            >
              Cancelled <span className="pill-count">{counts.Cancelled}</span>
            </button>
          </div>

          <div className="orders-search-box">
            <FiSearch className="orders-search-icon" size={16} />
            <input
              type="text"
              className="orders-search-input"
              placeholder="Search by product name or order #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ================= ORDERS CONTENT ================= */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading orders...</span>
            </div>
            <p className="text-muted mt-3">Fetching your orders from Chronoscent Elite...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger d-flex align-items-center gap-3">
            <FiAlertCircle size={20} />
            <div>{error}</div>
            <button onClick={fetchOrders} className="btn btn-sm btn-outline-danger ms-auto">
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-empty-state">
            <div className="empty-state-icon">
              <FiPackage />
            </div>
            <h3 className="empty-state-title">
              {orders.length === 0 ? "No Orders Placed Yet" : "No Orders Matching Filter"}
            </h3>
            <p className="empty-state-desc">
              {orders.length === 0
                ? "You haven't ordered any luxury timepieces or haute perfumery yet. Start curating your personal collection today."
                : "Try resetting your search query or switching to another status tab to find what you're looking for."}
            </p>
            {orders.length === 0 ? (
              <div className="d-flex justify-content-center gap-3">
                <Link to="/watches" className="btn-explore-catalog">
                  Explore Watches
                </Link>
                <Link to="/fragrances" className="btn btn-outline-dark px-4 py-2" style={{ borderRadius: "8px", fontWeight: 600 }}>
                  Explore Fragrances
                </Link>
              </div>
            ) : (
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => {
              const currentStatus = order.status || "Processing";
              const progress = getProgressState(currentStatus);
              const orderIdDisplay = order._id ? `#ORD-${order._id.slice(-6).toUpperCase()}` : "N/A";

              return (
                <div className="order-card" key={order._id}>
                  {/* Card Header */}
                  <div className="order-card-header">
                    <div className="order-id-group">
                      <span className="order-id-label">Order Number</span>
                      <span className="order-id-number">{orderIdDisplay}</span>
                    </div>

                    <div className="order-meta-item">
                      <span className="order-meta-label">Date Placed</span>
                      <span className="order-meta-value">{formatDate(order.orderDate)}</span>
                    </div>

                    <div className="order-meta-item">
                      <span className="order-meta-label">Total Amount</span>
                      <span className="order-meta-value" style={{ color: "#0f4c81", fontSize: "1.05rem" }}>
                        ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="order-meta-item">
                      <span className="order-meta-label">Payment</span>
                      <span className="order-meta-value">
                        {order.customerInfo?.paymentMethod || "Cash on Delivery"}
                      </span>
                    </div>

                    <div className="ms-md-auto">
                      {renderStatusBadge(currentStatus)}
                    </div>
                  </div>

                  {/* Order Progress Tracker */}
                  <div className="order-tracker-container">
                    {progress.isCancelled ? (
                      <div className="order-cancelled-banner">
                        <FiAlertCircle size={18} />
                        <span>
                          This order was marked as <strong>Cancelled</strong>. If you have questions or require a refund, please contact concierge support.
                        </span>
                      </div>
                    ) : (
                      <div className="order-tracker">
                        <div className="tracker-bar-bg">
                          <div
                            className="tracker-bar-fill"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>

                        {/* Step 1: Placed */}
                        <div className="tracker-step completed">
                          <div className="tracker-node">
                            <FiCheckCircle size={16} />
                          </div>
                          <span className="tracker-label">Order Placed</span>
                        </div>

                        {/* Step 2: Processing */}
                        <div
                          className={`tracker-step ${currentStatus === "Processing"
                            ? "current"
                            : ["Shipped", "Delivered"].includes(currentStatus)
                              ? "completed"
                              : ""
                            }`}
                        >
                          <div className="tracker-node">
                            <FiClock size={16} />
                          </div>
                          <span className="tracker-label">Processing</span>
                        </div>

                        {/* Step 3: Shipped */}
                        <div
                          className={`tracker-step ${currentStatus === "Shipped"
                            ? "current"
                            : currentStatus === "Delivered"
                              ? "completed"
                              : ""
                            }`}
                        >
                          <div className="tracker-node">
                            <FiTruck size={16} />
                          </div>
                          <span className="tracker-label">Shipped</span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div
                          className={`tracker-step ${currentStatus === "Delivered" ? "completed current" : ""
                            }`}
                        >
                          <div className="tracker-node">
                            <FiCheckCircle size={16} />
                          </div>
                          <span className="tracker-label">Delivered</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Body: Items Purchased */}
                  <div className="order-card-body">
                    <h6 className="fw-bold mb-3 text-muted text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                      Items in this shipment ({order.orderItems?.length || 0})
                    </h6>

                    <div className="order-items-list">
                      {order.orderItems?.map((item, idx) => (
                        <div className="order-item-row" key={idx}>
                          <div className="order-item-details">
                            <img
                              src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150"}
                              alt={item.name}
                              className="order-item-img"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150";
                              }}
                            />
                            <div>
                              <div className="order-item-title">{item.name}</div>
                              <div className="order-item-sub">
                                Quantity: <strong>{item.quantity}</strong> × ₹{(item.price || 0).toLocaleString("en-IN")}
                              </div>

                              {/* If order is Delivered, show Rate & Review */}
                              {currentStatus === "Delivered" && (
                                item.rating > 0 ? (
                                  <div className="item-reviewed-badge">
                                    <div className="reviewed-stars-row">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                          key={star}
                                          size={12}
                                          color={star <= item.rating ? "#f59e0b" : "#cbd5e1"}
                                        />
                                      ))}
                                      <span className="ms-1 fw-bold text-dark" style={{ fontSize: "0.78rem" }}>
                                        {item.rating}/5
                                      </span>
                                      <button
                                        type="button"
                                        className="btn btn-link btn-sm p-0 ms-2 text-decoration-none"
                                        style={{ fontSize: "0.75rem", color: "#0f4c81" }}
                                        onClick={() => handleOpenReviewModal(order._id, idx, item)}
                                      >
                                        Edit
                                      </button>
                                    </div>
                                    {item.review && (
                                      <div className="reviewed-text">
                                        "{item.review}"
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn-rate-item"
                                    onClick={() => handleOpenReviewModal(order._id, idx, item)}
                                  >
                                    <FaStar size={12} /> Rate & Review Product
                                  </button>
                                )
                              )}
                            </div>
                          </div>

                          <div className="order-item-pricing">
                            <div className="order-item-total">
                              ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                            </div>
                            <div className="order-item-unit">Tax & Packaging incl.</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Shipping Info & Actions */}
                  <div className="order-card-footer">
                    <div className="shipping-info-snippet">
                      <div>
                        <strong>Shipping to:</strong> {order.customerInfo?.name || currentUser.name}
                      </div>
                      <div>
                        {order.customerInfo?.address}, {order.customerInfo?.city} - {order.customerInfo?.zip}
                      </div>
                    </div>

                    <div className="order-actions-group">
                      {/* Cancel button if order is still Processing */}
                      {currentStatus === "Processing" && (
                        <button
                          type="button"
                          className="btn-order-action btn-order-cancel"
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingOrderId === order._id}
                        >
                          <FiXCircle size={14} />
                          {cancellingOrderId === order._id ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}

                      {/* View Receipt / Invoice */}
                      <button
                        type="button"
                        className="btn-order-action btn-order-receipt"
                        onClick={() => setSelectedReceiptOrder(order)}
                      >
                        <FiPrinter size={14} /> View Receipt
                      </button>

                      <Link
                        to="/watches"
                        className="btn-order-action btn-order-receipt"
                        style={{ textDecoration: "none" }}
                      >
                        Shop More
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= INVOICE / VIRTUAL RECEIPT MODAL ================= */}
      {selectedReceiptOrder && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", zIndex: 1060 }}
          tabIndex="-1"
          role="dialog"
          onClick={() => setSelectedReceiptOrder(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white py-3 px-4" style={{ backgroundColor: "#0f4c81" }}>
                <h5 className="modal-title font-heading mb-0 text-white">
                  Chronoscent Elite - Official Order Receipt
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setSelectedReceiptOrder(null)}
                />
              </div>

              <div className="modal-body p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
                  <div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", color: "#0f4c81" }}>
                      CHRONOSCENT ELITE
                    </h3>
                    <p className="text-muted small mb-0">Elegent Time & Parfume Boutique</p>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-light text-dark border px-3 py-2 fs-6">
                      #ORD-{selectedReceiptOrder._id.slice(-6).toUpperCase()}
                    </span>
                    <div className="text-muted small mt-1">
                      {formatDate(selectedReceiptOrder.orderDate)}
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <h6 className="fw-bold text-muted small text-uppercase">Billed & Shipped To:</h6>
                    <div className="fw-semibold text-dark">{selectedReceiptOrder.customerInfo?.name}</div>
                    <div className="text-muted small">{selectedReceiptOrder.customerInfo?.email}</div>
                    <div className="text-muted small">
                      {selectedReceiptOrder.customerInfo?.address}, {selectedReceiptOrder.customerInfo?.city} - {selectedReceiptOrder.customerInfo?.zip}
                    </div>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <h6 className="fw-bold text-muted small text-uppercase">Payment & Status:</h6>
                    <div className="fw-semibold text-dark">
                      Method: {selectedReceiptOrder.customerInfo?.paymentMethod || "Cash on Delivery"}
                    </div>
                    <div className="mt-1">
                      Status: <strong>{selectedReceiptOrder.status || "Processing"}</strong>
                    </div>
                  </div>
                </div>

                <div className="table-responsive mb-4">
                  <table className="table table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Item Description</th>
                        <th className="text-center" style={{ width: "90px" }}>Qty</th>
                        <th className="text-end" style={{ width: "130px" }}>Price</th>
                        <th className="text-end" style={{ width: "140px" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReceiptOrder.orderItems?.map((it, i) => (
                        <tr key={i}>
                          <td>
                            <strong>{it.name}</strong>
                          </td>
                          <td className="text-center">{it.quantity}</td>
                          <td className="text-end">₹{(it.price || 0).toLocaleString("en-IN")}</td>
                          <td className="text-end fw-semibold">
                            ₹{((it.price || 0) * (it.quantity || 1)).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end fw-bold">Total Paid / Payable:</td>
                        <td className="text-end fw-bold fs-5 text-primary" style={{ color: "#0f4c81" }}>
                          ₹{(selectedReceiptOrder.totalAmount || 0).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="bg-light p-3 rounded text-muted small text-center">
                  Thank you for being a valued client of Chronoscent Elite. All luxury items include complimentary concierge insurance during transit.
                </div>
              </div>

              <div className="modal-footer bg-light px-4 py-3 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedReceiptOrder(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center gap-2"
                  style={{ backgroundColor: "#0f4c81", borderColor: "#0f4c81" }}
                  onClick={() => window.print()}
                >
                  <FiPrinter size={15} /> Print / Save as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= REVIEW & RATING MODAL ================= */}
      {reviewModalData && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", zIndex: 1070 }}
          tabIndex="-1"
          role="dialog"
          onClick={() => setReviewModalData(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="modal-header text-white py-3 px-4" style={{ backgroundColor: "#0f4c81" }}>
                <h5 className="modal-title font-heading mb-0 text-white">
                  Rate & Review Product
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setReviewModalData(null)}
                />
              </div>

              <form onSubmit={handleSubmitReview}>
                <div className="modal-body p-4 text-center">
                  <img
                    src={reviewModalData.item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150"}
                    alt={reviewModalData.item.name}
                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                  />
                  <h5 className="mt-2 mb-1 font-heading text-dark">
                    {reviewModalData.item.name}
                  </h5>
                  <small className="text-muted d-block mb-3">
                    Verified Purchase • Chronoscent Elite
                  </small>

                  <div className="border-top pt-3">
                    <label className="fw-semibold text-muted small text-uppercase">
                      Select Your Star Rating
                    </label>

                    {/* Interactive 5 Stars */}
                    <div className="star-interactive-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className={`star-btn ${(hoverRating || reviewModalData.rating) >= star ? "active" : ""}`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewModalData({ ...reviewModalData, rating: star })}
                          aria-label={`Rate ${star} stars`}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>

                    <div className="rating-score-text">
                      {reviewModalData.rating === 5 && "★★★★★ 5.0 - Outstanding Quality"}
                      {reviewModalData.rating === 4 && "★★★★☆ 4.0 - Very Good"}
                      {reviewModalData.rating === 3 && "★★★☆☆ 3.0 - Good"}
                      {reviewModalData.rating === 2 && "★★☆☆☆ 2.0 - Fair"}
                      {reviewModalData.rating === 1 && "★☆☆☆☆ 1.0 - Poor"}
                    </div>

                    <div className="text-start mt-3">
                      <label className="form-label small fw-semibold text-muted">
                        Your Feedback / Review Note:
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Write a few words about design, craftsmanship, aroma, or fit..."
                        value={reviewModalData.review}
                        onChange={(e) => setReviewModalData({ ...reviewModalData, review: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setReviewModalData(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    style={{ backgroundColor: "#0f4c81", borderColor: "#0f4c81" }}
                    disabled={submittingReview}
                  >
                    {submittingReview ? "Saving..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
