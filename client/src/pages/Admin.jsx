import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiClock,
  FiDroplet,
  FiDollarSign,
  FiLogOut,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiLock
} from "react-icons/fi";
import "../css/Admin.css";

function Admin() {
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(() => {
    return sessionStorage.getItem("chronoscent_admin_auth") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [watches, setWatches] = useState([]);
  const [fragrances, setFragrances] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for adding/editing products
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    _id: "",
    name: "",
    brand: "",
    model: "",
    price: "",
    rating: 4.8,
    image: "",
    category: "Luxury",
    gender: "Unisex",
    watchType: "Classic",
    fragranceType: "Fresh",
    inStock: true
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, watchesRes, fragrancesRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/api/orders"),
        fetch("http://127.0.0.1:5000/api/watches"),
        fetch("http://127.0.0.1:5000/api/fragrances")
      ]);

      setOrders(await ordersRes.json());
      setWatches(await watchesRes.json());
      setFragrances(await fragrancesRes.json());
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdminAuthorized) {
      fetchData();
    }
  }, [isAdminAuthorized]);

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditClick = (product) => {
    setProductForm({
      _id: product._id || "",
      name: product.name || "",
      brand: product.brand || "",
      model: product.model || "",
      price: product.price || "",
      rating: product.rating || 4.8,
      image: product.image || "",
      category: product.category || "Luxury",
      gender: product.gender || "Unisex",
      watchType: product.watchType || "Classic",
      fragranceType: product.fragranceType || "Fresh",
      inStock: product.inStock !== false
    });
    setIsEditing(true);
    setShowProductForm(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setProductForm({
      _id: "",
      name: "",
      brand: "",
      model: "",
      price: "",
      rating: 4.8,
      image: "",
      category: "Luxury",
      gender: "Unisex",
      watchType: "Classic",
      fragranceType: "Fresh",
      inStock: true
    });
    setIsEditing(false);
    setShowProductForm(false);
  };

  // CRUD API Calls
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const isWatch = activeTab === "watches";
    const endpoint = isWatch ? "watches" : "fragrances";
    const method = isEditing ? "PUT" : "POST";
    const url = `http://127.0.0.1:5000/api/${endpoint}${isEditing ? `/${productForm._id}` : ''}`;

    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        rating: Number(productForm.rating || 4.8)
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert(`${isWatch ? 'Watch' : 'Fragrance'} ${isEditing ? 'updated' : 'added'} successfully!`);
        handleCancelEdit();
        fetchData();
      }
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product. Please check the backend connection.");
    }
  };

  const handleDeleteProduct = async (id, isWatch) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const endpoint = isWatch ? "watches" : "fragrances";
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/${endpoint}/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        alert("Product deleted successfully!");
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === "admin123") {
      sessionStorage.setItem("chronoscent_admin_auth", "true");
      setIsAdminAuthorized(true);
      setPasscode(""); // Clean reset
      setErrorMsg("");
      fetchData();
    } else {
      setErrorMsg("Invalid access key. Default passcode is: admin123");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("chronoscent_admin_auth");
    setIsAdminAuthorized(false);
    setPasscode(""); // Reset passkey so input is blank
    setErrorMsg("");
  };

  // ==========================================
  // PASSCODE LOCK SCREEN
  // ==========================================
  if (!isAdminAuthorized) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-card">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ width: '56px', height: '56px', backgroundColor: '#F0F9FF', color: '#0F4C81' }}
            >
              <FiLock size={26} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#0F4C81', fontWeight: 700 }} className="mb-1">
              Executive Console
            </h3>
            <p className="text-muted small mb-0">
              ChronoScent Elite Administrator Portal
            </p>
          </div>

          {errorMsg && (
            <div className="alert alert-danger p-2 text-center small mb-3">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold small text-muted">ADMIN ACCESS KEY</label>
              <input
                type="password"
                className="form-control py-2"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                required
              />
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-muted" style={{ fontSize: '0.78rem' }}>Default key: <code>admin123</code></small>
                <Link to="/" className="small text-decoration-none" style={{ color: '#0F4C81', fontSize: '0.8rem' }}>
                  Return to Store →
                </Link>
              </div>
            </div>

            <button type="submit" className="btn admin-btn-primary w-100 py-2 fw-semibold mt-2">
              Unlock Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate gross revenue
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // ==========================================
  // MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="admin-wrapper">

      {/* Sleek Admin Header */}
      <header className="admin-header-bar py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span className="admin-logo-title">
              ChronoScent <span style={{ fontSize: '0.8rem', letterSpacing: '2px', color: '#64748B', textTransform: 'uppercase' }}>Elite</span>
            </span>
            <span className="admin-badge d-none d-sm-inline-block">
              Admin Portal
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link to="/" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
              <FiExternalLink size={14} /> <span className="d-none d-sm-inline">View Boutique</span>
            </Link>
            <button
              onClick={handleAdminLogout}
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
              title="Lock Console"
            >
              <FiLogOut size={14} /> <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="container py-4">

        {/* Top KPI Metrics Bar */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-stat-card">
              <div className="admin-stat-title">Customer Orders</div>
              <h3 className="admin-stat-value">{orders.length}</h3>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-stat-card">
              <div className="admin-stat-title">Watches in Catalog</div>
              <h3 className="admin-stat-value">{watches.length}</h3>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-stat-card">
              <div className="admin-stat-title">Fragrance Catalog</div>
              <h3 className="admin-stat-value">{fragrances.length}</h3>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-stat-card">
              <div className="admin-stat-title">Gross Revenue</div>
              <h3 className="admin-stat-value">₹{totalRevenue.toLocaleString("en-IN")}</h3>
            </div>
          </div>
        </div>

        {/* Clean Luxury Tabs Navigation */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div className="d-flex gap-2">
            <button
              className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => { setActiveTab('orders'); handleCancelEdit(); }}
            >
              Orders ({orders.length})
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'watches' ? 'active' : ''}`}
              onClick={() => { setActiveTab('watches'); handleCancelEdit(); }}
            >
              Watches ({watches.length})
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'fragrances' ? 'active' : ''}`}
              onClick={() => { setActiveTab('fragrances'); handleCancelEdit(); }}
            >
              Fragrances ({fragrances.length})
            </button>
          </div>

          {activeTab !== 'orders' && (
            <button
              className="btn admin-btn-primary btn-sm d-flex align-items-center gap-1 px-3 py-2"
              onClick={() => {
                if (showProductForm && !isEditing) {
                  setShowProductForm(false);
                } else {
                  handleCancelEdit();
                  setShowProductForm(true);
                }
              }}
            >
              <FiPlus /> {showProductForm && !isEditing ? "Close Form" : `Add ${activeTab === 'watches' ? 'Watch' : 'Fragrance'}`}
            </button>
          )}
        </div>

        {/* Product Add / Edit Form Modal Card */}
        {showProductForm && activeTab !== 'orders' && (
          <div className="admin-card mb-4" style={{ borderLeft: '4px solid #0F4C81' }}>
            <div className="admin-card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#0F4C81' }}>
                {isEditing ? `Edit ${activeTab === 'watches' ? 'Watch' : 'Fragrance'}` : `Add New ${activeTab === 'watches' ? 'Watch' : 'Fragrance'}`}
              </h5>
              <button className="btn btn-sm btn-close" onClick={handleCancelEdit}></button>
            </div>
            <div className="p-4">
              <form onSubmit={handleProductSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Product Name</label>
                    <input type="text" className="form-control" name="name" value={productForm.name} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Brand House</label>
                    <input type="text" className="form-control" name="brand" value={productForm.brand} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-muted">Model / Reference</label>
                    <input type="text" className="form-control" name="model" placeholder="e.g. 126610LN or Eau de Parfum" value={productForm.model} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-muted">Price (₹ INR)</label>
                    <input type="number" className="form-control" name="price" value={productForm.price} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-muted">Rating (e.g. 4.8)</label>
                    <input type="number" step="0.1" max="5" min="1" className="form-control" name="rating" value={productForm.rating} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Image Path or URL</label>
                    <input type="text" className="form-control" name="image" placeholder="/assests/Products/..." value={productForm.image} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-muted">Category</label>
                    <select className="form-select" name="category" value={productForm.category} onChange={handleInputChange}>
                      <option value="Luxury">Luxury</option>
                      <option value="Premium">Premium</option>
                      <option value="Classic">Classic</option>
                      <option value="Standard">Standard</option>
                      <option value="Niche">Niche</option>
                      <option value="Designer">Designer</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-muted">Gender</label>
                    <select className="form-select" name="gender" value={productForm.gender} onChange={handleInputChange}>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>

                  {activeTab === "watches" ? (
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Watch Style</label>
                      <input type="text" className="form-control" name="watchType" placeholder="Diver, Classic, Sport..." value={productForm.watchType || ""} onChange={handleInputChange} />
                    </div>
                  ) : (
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-muted">Fragrance Profile</label>
                      <input type="text" className="form-control" name="fragranceType" placeholder="Floral, Woody, Fresh..." value={productForm.fragranceType || ""} onChange={handleInputChange} />
                    </div>
                  )}

                  <div className="col-md-4 d-flex align-items-center pt-3">
                    <div className="form-check form-switch mt-2">
                      <input className="form-check-input" type="checkbox" name="inStock" id="stockSwitch" checked={productForm.inStock} onChange={handleInputChange} />
                      <label className="form-check-label fw-semibold" htmlFor="stockSwitch">Product in Stock</label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 d-flex gap-2">
                  <button type="submit" className="btn admin-btn-primary px-4">
                    {isEditing ? 'Save Changes' : 'Create Product'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="admin-card">
            <div className="admin-card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#0F4C81' }}>Customer Orders</h5>
              <span className="text-muted small">{orders.length} orders recorded</span>
            </div>
            <div className="p-0">
              {orders.length === 0 ? (
                <div className="py-5 text-center text-muted">
                  <h5>No orders placed yet.</h5>
                  <p className="small">Customer purchases will show up here automatically.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table admin-table mb-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items Ordered</th>
                        <th>Payment</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>
                            <code className="text-muted small" style={{ fontSize: '0.8rem' }}>
                              #{order._id.slice(-6).toUpperCase()}
                            </code>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(order.orderDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                            </small>
                          </td>
                          <td>
                            <div className="fw-semibold" style={{ color: '#0F4C81' }}>{order.customerInfo.name}</div>
                            <small className="text-muted">{order.customerInfo.email}</small>
                            <div className="small text-muted">{order.customerInfo.city}</div>
                          </td>
                          <td>
                            <ul className="list-unstyled mb-0" style={{ fontSize: '0.85rem' }}>
                              {order.orderItems.map((item, idx) => (
                                <li key={idx} className="text-truncate" style={{ maxWidth: '240px' }}>
                                  <span className="badge bg-light text-dark me-1">{item.quantity}x</span> {item.name}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <span className="badge rounded-pill bg-light text-dark border">
                              {order.customerInfo.paymentMethod || "COD"}
                            </span>
                          </td>
                          <td>
                            <span className="fw-bold fs-6" style={{ color: '#0F4C81' }}>
                              ₹{order.totalAmount.toLocaleString("en-IN")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WATCHES INVENTORY */}
        {activeTab === 'watches' && (
          <div className="admin-card">
            <div className="admin-card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#0F4C81' }}>Watch Catalog ({watches.length})</h5>
              <small className="text-muted">Manage timepieces in your boutique</small>
            </div>
            <div className="table-responsive">
              <table className="table admin-table mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand & Model</th>
                    <th>Price</th>
                    <th>Category / Style</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {watches.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
                          />
                          <div>
                            <div className="fw-bold" style={{ color: '#0F4C81' }}>{item.name}</div>
                            <small className="text-muted">Rating: {item.rating || 4.8}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold">{item.brand}</div>
                        <small className="text-muted">{item.model || "—"}</small>
                      </td>
                      <td className="fw-bold" style={{ color: '#0F4C81' }}>
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border me-1">{item.category || "Luxury"}</span>
                        <small className="text-muted">{item.watchType || "Classic"}</small>
                      </td>
                      <td>
                        <span className={`badge rounded-pill ${item.inStock !== false ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {item.inStock !== false ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditClick(item)}
                          title="Edit"
                        >
                          <FiEdit2 size={13} /> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteProduct(item._id, true)}
                          title="Delete"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FRAGRANCE INVENTORY */}
        {activeTab === 'fragrances' && (
          <div className="admin-card">
            <div className="admin-card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#0F4C81' }}>Fragrance Catalog ({fragrances.length})</h5>
              <small className="text-muted">Manage perfumes and colognes in your boutique</small>
            </div>
            <div className="table-responsive">
              <table className="table admin-table mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand & Type</th>
                    <th>Price</th>
                    <th>Category / Profile</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fragrances.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
                          />
                          <div>
                            <div className="fw-bold" style={{ color: '#0F4C81' }}>{item.name}</div>
                            <small className="text-muted">Rating: {item.rating || 4.8}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold">{item.brand}</div>
                        <small className="text-muted">{item.model || "Eau de Parfum"}</small>
                      </td>
                      <td className="fw-bold" style={{ color: '#0F4C81' }}>
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border me-1">{item.category || "Luxury"}</span>
                        <small className="text-muted">{item.fragranceType || "Fresh"}</small>
                      </td>
                      <td>
                        <span className={`badge rounded-pill ${item.inStock !== false ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {item.inStock !== false ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditClick(item)}
                          title="Edit"
                        >
                          <FiEdit2 size={13} /> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteProduct(item._id, false)}
                          title="Delete"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Admin;
