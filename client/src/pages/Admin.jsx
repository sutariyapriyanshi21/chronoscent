import { useState, useEffect } from "react";

function Admin() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [watches, setWatches] = useState([]);
  const [fragrances, setFragrances] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for adding/editing products
  const [productForm, setProductForm] = useState({
    _id: "",
    name: "",
    brand: "",
    price: "",
    image: "",
    gender: "",
    watchType: "",
    fragranceType: ""
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
    fetchData();
  }, []);

  // Form Handlers
  const handleInputChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleEditClick = (product) => {
    setProductForm(product);
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    setProductForm({ _id: "", name: "", brand: "", price: "", image: "", gender: "", watchType: "", fragranceType: "" });
    setIsEditing(false);
  };

  // CRUD API Calls
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const isWatch = activeTab === "watches";
    const endpoint = isWatch ? "watches" : "fragrances";
    const method = isEditing ? "PUT" : "POST";
    const url = `http://127.0.0.1:5000/api/${endpoint}${isEditing ? `/${productForm._id}` : ''}`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm)
      });
      if (response.ok) {
        alert(`${isWatch ? 'Watch' : 'Fragrance'} ${isEditing ? 'updated' : 'added'} successfully!`);
        handleCancelEdit();
        fetchData(); // Refresh the list
      }
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product.");
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
        alert("Product deleted!");
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) {
    return <div className="container py-5 text-center"><h2>Loading Admin Dashboard...</h2></div>;
  }

  // Sub-components for cleaner code
  const renderProductForm = () => (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">{isEditing ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleProductSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" value={productForm.name} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Brand</label>
              <input type="text" className="form-control" name="brand" value={productForm.brand} onChange={handleInputChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Price ($)</label>
              <input type="number" className="form-control" name="price" value={productForm.price} onChange={handleInputChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Image URL</label>
              <input type="text" className="form-control" name="image" placeholder="/assests/..." value={productForm.image} onChange={handleInputChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Gender</label>
              <select className="form-select" name="gender" value={productForm.gender} onChange={handleInputChange}>
                <option value="">Select...</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
            {activeTab === "watches" ? (
              <div className="col-md-4">
                <label className="form-label">Watch Type</label>
                <input type="text" className="form-control" name="watchType" value={productForm.watchType || ""} onChange={handleInputChange} />
              </div>
            ) : (
              <div className="col-md-4">
                <label className="form-label">Fragrance Type</label>
                <input type="text" className="form-control" name="fragranceType" value={productForm.fragranceType || ""} onChange={handleInputChange} />
              </div>
            )}
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-success me-2">{isEditing ? 'Update Product' : 'Add Product'}</button>
            {isEditing && <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );

  const renderProductTable = (items, isWatch) => (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td><img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} /></td>
              <td className="fw-bold">{item.name}</td>
              <td>{item.brand}</td>
              <td>${item.price}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(item)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProduct(item._id, isWatch)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="admin-page py-5 bg-light min-vh-100">
      <div className="container">
        <h1 className="mb-4">Admin Dashboard</h1>
        
        {/* Navigation Tabs */}
        <ul className="nav nav-pills mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'orders' ? 'active bg-dark' : 'text-dark'}`} onClick={() => {setActiveTab('orders'); handleCancelEdit();}}>Orders</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'watches' ? 'active bg-dark' : 'text-dark'}`} onClick={() => {setActiveTab('watches'); handleCancelEdit();}}>Manage Watches</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'fragrances' ? 'active bg-dark' : 'text-dark'}`} onClick={() => {setActiveTab('fragrances'); handleCancelEdit();}}>Manage Fragrances</button>
          </li>
        </ul>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white p-3">
              <h4 className="mb-0">Recent Orders</h4>
            </div>
            <div className="card-body p-0">
              {orders.length === 0 ? (
                <div className="p-5 text-center"><h5 className="text-muted">No orders found.</h5></div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td><small className="text-muted">{order._id}</small></td>
                          <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                          <td>{order.customerInfo.name} <br/><small className="text-muted">{order.customerInfo.email}</small></td>
                          <td>
                            <ul className="list-unstyled mb-0">
                              {order.orderItems.map((item, idx) => (
                                <li key={idx}>{item.quantity}x {item.name}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="fw-bold">${order.totalAmount.toLocaleString("en-US")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'watches' && (
          <>
            {renderProductForm()}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-dark text-white p-3">
                <h4 className="mb-0">Watch Inventory</h4>
              </div>
              <div className="card-body p-0">
                {renderProductTable(watches, true)}
              </div>
            </div>
          </>
        )}

        {activeTab === 'fragrances' && (
          <>
            {renderProductForm()}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-dark text-white p-3">
                <h4 className="mb-0">Fragrance Inventory</h4>
              </div>
              <div className="card-body p-0">
                {renderProductTable(fragrances, false)}
              </div>
            </div>
          </>
        )}
        
      </div>
    </section>
  );
}

export default Admin;
