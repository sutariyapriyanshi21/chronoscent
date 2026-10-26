import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  FiPackage,
  FiDollarSign,
  FiLogOut,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiUsers,
  FiShoppingBag,
  FiTag,
  FiFolder,
  FiStar,
  FiSettings,
  FiShield,
  FiHelpCircle,
  FiSearch,
  FiMenu,
  FiX,
  FiSlash,
  FiCheck,
  FiRefreshCw,
  FiMail,
  FiUpload,
  FiImage,
  FiEye,
  FiCheckCircle,
  FiAlertCircle,
  FiUserPlus
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import "../css/Admin.css";

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // 1. Current Logged-in Admin Session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("chronoscent_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = currentUser?.role === "admin" || currentUser?.email === "admin@chronoscent.com";

  // Lockscreen Passcode Fallback
  const [adminPasscode, setAdminPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState("orders");
  const [productSubTab, setProductSubTab] = useState("all"); // 'all', 'watches', 'fragrances'
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter States
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");

  // Data Collections
  const [orders, setOrders] = useState([]);
  const [watches, setWatches] = useState([]);
  const [fragrances, setFragrances] = useState([]);
  const [users, setUsers] = useState([]);
  const [dbBrands, setDbBrands] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Brand Houses Tab Filter
  const [brandTypeFilter, setBrandTypeFilter] = useState("all"); // 'all', 'watches', 'fragrances'

  // Brand Modal States (Add / Edit)
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [brandForm, setBrandForm] = useState({
    _id: "",
    name: "",
    categoryType: "both",
    origin: "",
    description: ""
  });

  // Category Modal States (Add / Edit)
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    _id: "",
    name: "",
    categoryType: "both",
    description: ""
  });

  // Product Add / Edit Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [formType, setFormType] = useState("watch");
  const [isEditing, setIsEditing] = useState(false);
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

  // Image Upload & Gallery Picker States
  const [catalogImages, setCatalogImages] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageTestStatus, setImageTestStatus] = useState("idle");

  // User Add / Edit Modal States
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active"
  });

  // Extract all customer reviews from orders (delivering true customer voice)
  const customerReviews = useMemo(() => {
    const list = [];
    orders.forEach((order) => {
      order.orderItems?.forEach((item, itemIdx) => {
        if (item.rating && item.rating > 0) {
          list.push({
            orderId: order._id,
            itemIndex: itemIdx,
            customerName: order.customerInfo?.name || "Verified Client",
            customerEmail: order.customerInfo?.email || "Unknown",
            customerCity: order.customerInfo?.city || "",
            productName: item.name,
            productImage: item.image,
            rating: item.rating,
            review: item.review,
            reviewedAt: item.reviewedAt || order.orderDate
          });
        }
      });
    });
    return list;
  }, [orders]);

  // Fetch all live data from backend
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [ordersRes, watchesRes, fragrancesRes, usersRes, brandsRes, categoriesRes, messagesRes, imagesRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/api/orders").catch(() => null),
        fetch("http://127.0.0.1:5000/api/watches").catch(() => null),
        fetch("http://127.0.0.1:5000/api/fragrances").catch(() => null),
        fetch("http://127.0.0.1:5000/api/users").catch(() => null),
        fetch("http://127.0.0.1:5000/api/brands").catch(() => null),
        fetch("http://127.0.0.1:5000/api/categories").catch(() => null),
        fetch("http://127.0.0.1:5000/api/messages").catch(() => null),
        fetch("http://127.0.0.1:5000/api/catalog-images").catch(() => null)
      ]);

      if (ordersRes && ordersRes.ok) setOrders(await ordersRes.json());
      if (watchesRes && watchesRes.ok) setWatches(await watchesRes.json());
      if (fragrancesRes && fragrancesRes.ok) setFragrances(await fragrancesRes.json());
      if (usersRes && usersRes.ok) setUsers(await usersRes.json());
      if (brandsRes && brandsRes.ok) setDbBrands(await brandsRes.json());
      if (categoriesRes && categoriesRes.ok) setDbCategories(await categoriesRes.json());
      if (messagesRes && messagesRes.ok) setMessages(await messagesRes.json());
      if (imagesRes && imagesRes.ok) setCatalogImages(await imagesRes.json());
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete message handler
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/messages/${messageId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
      } else {
        alert("Failed to delete message.");
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Error deleting message.");
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  // Sync active tab with URL query param ?tab=... (e.g. /admin?tab=products)
  useEffect(() => {
    const tabParam = searchParams.get("tab") || location.state?.tab;
    const validTabs = ["orders", "customers", "messages", "products", "brands", "categories", "reviews", "settings", "security"];
    if (tabParam && validTabs.includes(tabParam.toLowerCase())) {
      setActiveTab(tabParam.toLowerCase());
    }
  }, [searchParams, location.state]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("chronoscent_user");
    sessionStorage.removeItem("chronoscent_admin_auth");
    window.dispatchEvent(new Event("authChange"));
    setCurrentUser(null);
    navigate("/login");
  };

  // Quick Unlock on lockscreen
  const handleQuickUnlock = (e) => {
    e.preventDefault();
    if (adminPasscode.trim() === "admin123" || adminPasscode.trim() === "admin") {
      const adminObj = {
        name: "Store Administrator",
        email: "admin@chronoscent.com",
        role: "admin",
        status: "active"
      };
      localStorage.setItem("chronoscent_user", JSON.stringify(adminObj));
      window.dispatchEvent(new Event("authChange"));
      setCurrentUser(adminObj);
      setAuthError("");
      setAdminPasscode("");
      fetchAllData();
    } else {
      setAuthError("Invalid access key. Use 'admin123' or sign in via the login portal.");
    }
  };

  // ========================================================
  // 1. ORDER ACTIONS (UPDATE STATUS & DELETE)
  // ========================================================
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("Failed to update order status.");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order record?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/orders/${orderId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o._id !== orderId));
      }
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  // ========================================================
  // 2. USER ACTIONS (BLOCK, ACTIVATE & DELETE)
  // ========================================================
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === "blocked" ? "active" : "blocked";
    const confirmMsg = nextStatus === "blocked"
      ? "Are you sure you want to BLOCK this user? They will not be able to log in to ChronoScent."
      : "Re-activate this user account?";

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: nextStatus } : u));
      } else {
        alert("Failed to update user status.");
      }
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Permanently delete this user account from the database?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== userId));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const openAddUserModal = () => {
    setUserForm({
      _id: "",
      name: "",
      email: "",
      password: "",
      role: "user",
      status: "active"
    });
    setIsEditingUser(false);
    setShowUserModal(true);
  };

  const openEditUserModal = (u) => {
    setUserForm({
      _id: u._id,
      name: u.name || "",
      email: u.email || "",
      password: "",
      role: u.role || "user",
      status: u.status || "active"
    });
    setIsEditingUser(true);
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) return;

    try {
      const isEdit = Boolean(userForm._id);
      const url = isEdit
        ? `http://127.0.0.1:5000/api/users/${userForm._id}`
        : "http://127.0.0.1:5000/api/users";
      const method = isEdit ? "PUT" : "POST";

      const payload = { ...userForm };
      if (!isEdit) delete payload._id;
      if (isEdit && !payload.password) delete payload.password;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        alert(isEdit ? "Customer account updated!" : "New customer account created successfully!");
        setShowUserModal(false);
        fetchAllData();
      } else {
        alert(data.message || "Failed to save user account.");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Error saving user.");
    }
  };

  const handleDeleteReview = async (orderId, itemIndex) => {
    if (!window.confirm("Are you sure you want to remove this customer review?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/orders/${orderId}/review/${itemIndex}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Review removed successfully.");
        fetchAllData();
      } else {
        alert("Failed to delete review.");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Error deleting review.");
    }
  };

  // ========================================================
  // 3. PRODUCT CRUD ACTIONS
  // ========================================================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleEditClick = (product) => {
    const isWatch = product.productCategory === "watch" || product.watchType !== undefined;
    setFormType(isWatch ? "watch" : "fragrance");
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
    setActiveTab("products");
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const handleCancelForm = () => {
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
    setImageTestStatus("idle");
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      try {
        const res = await fetch("http://127.0.0.1:5000/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64Data,
            filename: file.name,
            folder: formType === "watch" ? "Watches" : "Fregerances"
          })
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setProductForm(prev => ({ ...prev, image: data.url }));
          setImageTestStatus("loaded");
          fetchAllData();
        } else {
          setProductForm(prev => ({ ...prev, image: base64Data }));
          setImageTestStatus("loaded");
        }
      } catch {
        setProductForm(prev => ({ ...prev, image: base64Data }));
        setImageTestStatus("loaded");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleQuickToggleStock = async (product) => {
    const isWatch = product.productCategory === "watch" || product.watchType !== undefined;
    const endpoint = isWatch ? "watches" : "fragrances";
    const nextStock = product.inStock === false ? true : false;

    // Optimistic update
    if (isWatch) {
      setWatches(prev => prev.map(w => w._id === product._id ? { ...w, inStock: nextStock } : w));
    } else {
      setFragrances(prev => prev.map(f => f._id === product._id ? { ...f, inStock: nextStock } : f));
    }

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/${endpoint}/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: nextStock })
      });
      if (!res.ok) {
        fetchAllData();
        alert("Failed to update stock status.");
      }
    } catch (err) {
      console.error("Error updating stock status:", err);
      fetchAllData();
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const isWatch = formType === "watch";
    const endpoint = isWatch ? "watches" : "fragrances";
    const method = isEditing ? "PUT" : "POST";
    const url = `http://127.0.0.1:5000/api/${endpoint}${isEditing ? `/${productForm._id}` : ""}`;

    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        rating: Number(productForm.rating || 4.8)
      };

      if (!isEditing || !payload._id) {
        delete payload._id;
      }

      if (isWatch) {
        delete payload.fragranceType;
      } else {
        delete payload.watchType;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(`${isWatch ? "Watch" : "Fragrance"} ${isEditing ? "updated" : "created"} successfully!`);
        handleCancelForm();
        fetchAllData();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Server responded with error. Please check backend.");
      }
    } catch (err) {
      console.error("Error submitting product:", err);
      alert("Error saving product. Please check backend connection.");
    }
  };

  const handleDeleteProduct = async (id, isWatch) => {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) return;
    const endpoint = isWatch ? "watches" : "fragrances";
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/${endpoint}/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // ========================================================
  // 4. BRAND CRUD ACTIONS
  // ========================================================
  const openAddBrandModal = () => {
    setBrandForm({
      _id: "",
      name: "",
      categoryType: "both",
      origin: "Switzerland",
      description: ""
    });
    setIsEditingBrand(false);
    setShowBrandModal(true);
  };

  const openEditBrandModal = (b) => {
    setBrandForm({
      _id: b._id || "",
      name: b.brand || b.name || "",
      categoryType: b.categoryType || "both",
      origin: b.origin || "",
      description: b.description || ""
    });
    setIsEditingBrand(true);
    setShowBrandModal(true);
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    if (!brandForm.name.trim()) return;

    try {
      const isEdit = Boolean(brandForm._id);
      const url = isEdit
        ? `http://127.0.0.1:5000/api/brands/${brandForm._id}`
        : "http://127.0.0.1:5000/api/brands";
      const method = isEdit ? "PUT" : "POST";

      const payload = { ...brandForm };
      if (!isEdit || !payload._id) delete payload._id;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        alert(isEdit ? "Brand updated successfully!" : `New brand "${brandForm.name.trim()}" added to catalog!`);
        setShowBrandModal(false);
        fetchAllData();
      } else {
        alert(data.message || "Failed to save brand.");
      }
    } catch (err) {
      console.error("Error saving brand:", err);
      alert("Error connecting to server.");
    }
  };

  const handleDeleteBrand = async (b) => {
    const brandName = b.brand || b.name;
    const confirmMsg = b.count > 0
      ? `Brand "${brandName}" currently has ${b.count} item(s) in catalog. Delete this brand entry?`
      : `Remove brand "${brandName}" from directory?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      if (b._id) {
        const res = await fetch(`http://127.0.0.1:5000/api/brands/${b._id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          alert(`Brand "${brandName}" removed successfully.`);
          fetchAllData();
        } else {
          alert("Failed to delete brand.");
        }
      } else {
        alert("This brand is attached to existing catalog products. You can edit the products or rename the brand.");
      }
    } catch (err) {
      console.error("Error deleting brand:", err);
    }
  };

  // ========================================================
  // 5. CATEGORY CRUD ACTIONS
  // ========================================================
  const openAddCategoryModal = () => {
    setCategoryForm({
      _id: "",
      name: "",
      categoryType: "both",
      description: ""
    });
    setIsEditingCategory(false);
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (c) => {
    setCategoryForm({
      _id: c._id || "",
      name: c.category || c.name || "",
      categoryType: c.categoryType || "both",
      description: c.description || ""
    });
    setIsEditingCategory(true);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    try {
      const isEdit = Boolean(categoryForm._id);
      const url = isEdit
        ? `http://127.0.0.1:5000/api/categories/${categoryForm._id}`
        : "http://127.0.0.1:5000/api/categories";
      const method = isEdit ? "PUT" : "POST";

      const payload = { ...categoryForm };
      if (!isEdit || !payload._id) delete payload._id;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        alert(isEdit ? "Category updated successfully!" : `New category "${categoryForm.name.trim()}" added to catalog!`);
        setShowCategoryModal(false);
        fetchAllData();
      } else {
        alert(data.message || "Failed to save category.");
      }
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Error connecting to server.");
    }
  };

  const handleDeleteCategory = async (c) => {
    const catName = c.category || c.name;
    const confirmMsg = c.count > 0
      ? `Category "${catName}" is assigned to ${c.count} items. Delete this category?`
      : `Remove category "${catName}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      if (c._id) {
        const res = await fetch(`http://127.0.0.1:5000/api/categories/${c._id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          alert(`Category "${catName}" removed.`);
          fetchAllData();
        } else {
          alert("Failed to delete category.");
        }
      } else {
        alert("This category is attached to existing catalog products.");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Filter products by Brand or Category shortcut
  const handleFilterByBrand = (brandName) => {
    setSearchQuery(brandName);
    setActiveTab("products");
  };

  const handleFilterByCategory = (categoryName) => {
    setSearchQuery(categoryName);
    setActiveTab("products");
  };

  // Aggregated totals
  const totalProducts = watches.length + fragrances.length;
  const totalOrders = orders.length;
  const totalUsers = users.length > 0 ? users.length : 2;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // Combined product list
  const combinedProducts = useMemo(() => {
    const list = [
      ...watches.map(w => ({ ...w, productCategory: "watch" })),
      ...fragrances.map(f => ({ ...f, productCategory: "fragrance" }))
    ];
    if (productSubTab === "watches") return list.filter(p => p.productCategory === "watch");
    if (productSubTab === "fragrances") return list.filter(p => p.productCategory === "fragrance");
    return list;
  }, [watches, fragrances, productSubTab]);

  // Dynamic Brand statistics (combining DB brands with products)
  const brandStats = useMemo(() => {
    const counts = {};
    [...watches, ...fragrances].forEach(item => {
      const b = item.brand || "Other";
      counts[b] = (counts[b] || 0) + 1;
    });

    const list = dbBrands.map(b => ({
      _id: b._id,
      brand: b.name,
      categoryType: b.categoryType || "both",
      origin: b.origin || "International",
      description: b.description || "",
      count: counts[b.name] || 0,
      isDbManaged: true
    }));

    Object.keys(counts).forEach(bName => {
      if (!list.some(item => item.brand.toLowerCase() === bName.toLowerCase())) {
        list.push({
          _id: null,
          brand: bName,
          categoryType: "both",
          origin: "Catalog",
          description: "",
          count: counts[bName],
          isDbManaged: false
        });
      }
    });

    let filtered = list.sort((a, b) => a.brand.localeCompare(b.brand));
    if (brandTypeFilter === "watches") {
      filtered = filtered.filter(b => b.categoryType === "watches" || b.categoryType === "both");
    } else if (brandTypeFilter === "fragrances") {
      filtered = filtered.filter(b => b.categoryType === "fragrances" || b.categoryType === "both");
    }
    return filtered;
  }, [watches, fragrances, dbBrands, brandTypeFilter]);

  // Dynamic Category statistics (combining DB categories with products)
  const categoryStats = useMemo(() => {
    const counts = {};
    [...watches, ...fragrances].forEach(item => {
      const c = item.category || "Luxury";
      counts[c] = (counts[c] || 0) + 1;
    });

    const list = dbCategories.map(c => ({
      _id: c._id,
      category: c.name,
      categoryType: c.categoryType || "both",
      description: c.description || "",
      count: counts[c.name] || 0,
      isDbManaged: true
    }));

    Object.keys(counts).forEach(cName => {
      if (!list.some(item => item.category.toLowerCase() === cName.toLowerCase())) {
        list.push({
          _id: null,
          category: cName,
          categoryType: "both",
          description: "Catalog tier",
          count: counts[cName],
          isDbManaged: false
        });
      }
    });

    return list.sort((a, b) => a.category.localeCompare(b.category));
  }, [watches, fragrances, dbCategories]);

  // Filtered queries based on Search Bar and Status Filters
  const q = searchQuery.toLowerCase().trim();

  const filteredOrders = orders.filter(o => {
    const matchesSearch = !q ||
      o._id?.toLowerCase().includes(q) ||
      o.customerInfo?.name?.toLowerCase().includes(q) ||
      o.customerInfo?.email?.toLowerCase().includes(q) ||
      o.customerInfo?.city?.toLowerCase().includes(q);

    const matchesStatus = orderStatusFilter === "all" || (o.status || "Processing") === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = combinedProducts.filter(p =>
    !q ||
    p.name?.toLowerCase().includes(q) ||
    p.brand?.toLowerCase().includes(q) ||
    p.model?.toLowerCase().includes(q) ||
    p.category?.toLowerCase().includes(q)
  );

  const filteredUsers = users.filter(u => {
    const matchesSearch = !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q);

    const matchesStatus = userStatusFilter === "all" || (u.status || "active") === userStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // ========================================================
  // LOCK SCREEN IF NOT SIGNED IN AS ADMIN
  // ========================================================
  if (!isAdmin) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-card">
          <div className="text-center mb-4">
            <div className="admin-lock-icon-wrap">
              <FiShield size={32} />
            </div>
            <h3 className="admin-lock-title">Administrator Portal</h3>
            <p className="text-muted small mb-0">ChronoScent Elite Administrator Portal</p>
          </div>

          {authError && (
            <div className="alert alert-danger py-2 px-3 small text-center mb-3">
              {authError}
            </div>
          )}

          <div className="p-3 mb-3 rounded" style={{ background: "#F0F9FF", border: "1px solid #BAE6FD" }}>
            <p className="small mb-2 text-dark">
              <strong>Unified Login:</strong> Sign in with your registered admin credentials from the store login portal.
            </p>
            <Link to="/login" className="btn btn-sm admin-btn-ocean w-100 py-2 text-center text-white">
              Go to Sign In Page →
            </Link>
          </div>

          <div className="text-center my-3 text-muted small position-relative">
            <span style={{ background: "#fff", padding: "0 10px", position: "relative", zIndex: 1 }}>
              OR DIRECT PASSKEY
            </span>
            <hr style={{ position: "absolute", top: "50%", left: 0, right: 0, margin: 0 }} />
          </div>

          <form onSubmit={handleQuickUnlock}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">ADMIN ACCESS KEY</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter passcode (e.g. admin123)"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn admin-btn-ocean w-100 py-2 fw-semibold mb-2">
              Unlock Console
            </button>
            <div className="text-center">
              <Link to="/" className="text-decoration-none small text-muted">
                ← Return to Boutique
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ========================================================
  // MAIN CONSOLE
  // ========================================================
  return (
    <div className="admin-console-layout">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpenMobile && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setIsSidebarOpenMobile(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className={`admin-sidebar ${isSidebarOpenMobile ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div className="d-flex align-items-center gap-2">
            
            <div>
              <div className="admin-brand-name">CHRONOSCENT</div>
              <div className="admin-brand-tag">ELITE </div>
            </div>
          </div>
          <button
            className="btn btn-sm d-lg-none text-white border-0"
            onClick={() => setIsSidebarOpenMobile(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="admin-sidebar-nav">
          <div className="admin-nav-group-label">OPERATIONS</div>
          <button
            className={`admin-nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => { setActiveTab("orders"); setIsSidebarOpenMobile(false); }}
          >
            <FiPackage className="admin-nav-icon" />
            <span>Orders</span>
            <span className="admin-nav-badge">{orders.length}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => { setActiveTab("customers"); setIsSidebarOpenMobile(false); }}
          >
            <FiUsers className="admin-nav-icon" />
            <span>Customers</span>
            <span className="admin-nav-badge">{totalUsers}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => { setActiveTab("messages"); setIsSidebarOpenMobile(false); }}
          >
            <FiMail className="admin-nav-icon" />
            <span>Messages</span>
            <span className="admin-nav-badge">{messages.length}</span>
          </button>

          <div className="admin-nav-group-label mt-3">CATALOG</div>
          <button
            className={`admin-nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => { setActiveTab("products"); setIsSidebarOpenMobile(false); }}
          >
            <FiShoppingBag className="admin-nav-icon" />
            <span>Product</span>
            <span className="admin-nav-badge">{totalProducts}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "brands" ? "active" : ""}`}
            onClick={() => { setActiveTab("brands"); setIsSidebarOpenMobile(false); }}
          >
            <FiTag className="admin-nav-icon" />
            <span>Brand</span>
            <span className="admin-nav-badge">{brandStats.length}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => { setActiveTab("categories"); setIsSidebarOpenMobile(false); }}
          >
            <FiFolder className="admin-nav-icon" />
            <span>Category</span>
            <span className="admin-nav-badge">{categoryStats.length}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => { setActiveTab("reviews"); setIsSidebarOpenMobile(false); }}
          >
            <FiStar className="admin-nav-icon" />
            <span>Reviews</span>
            <span className="admin-nav-badge">{customerReviews.length}</span>
          </button>

          <div className="admin-nav-group-label mt-3">PREFERENCES</div>
          <button
            className={`admin-nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => { setActiveTab("settings"); setIsSidebarOpenMobile(false); }}
          >
            <FiSettings className="admin-nav-icon" />
            <span>Setting</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => { setActiveTab("security"); setIsSidebarOpenMobile(false); }}
          >
            <FiShield className="admin-nav-icon" />
            <span>Security</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "help" ? "active" : ""}`}
            onClick={() => { setActiveTab("help"); setIsSidebarOpenMobile(false); }}
          >
            <FiHelpCircle className="admin-nav-icon" />
            <span>Help</span>
          </button>
        </div>

        <div className="admin-sidebar-footer">
          <div className="d-flex align-items-center gap-2">
            <div className="admin-avatar">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="admin-user-info text-truncate">
              <div className="admin-user-name text-truncate">{currentUser?.name || "Administrator"}</div>
              <div className="admin-user-role">Admin</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline-light border-0 admin-logout-btn"
            title="Log Out"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="admin-main-wrapper">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm admin-hamburger-btn d-lg-none"
              onClick={() => setIsSidebarOpenMobile(true)}
            >
              <FiMenu size={20} />
            </button>

            {/* Search Bar matching the photo */}
            <div className="admin-search-form">
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                className="admin-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="admin-search-button" type="button">
                <FiSearch size={14} className="me-1 d-none d-sm-inline" /> Search
              </button>
              {searchQuery && (
                <button
                  className="btn btn-sm btn-light border p-1"
                  onClick={() => setSearchQuery("")}
                  title="Clear Search"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-light border d-flex align-items-center gap-1"
              onClick={fetchAllData}
              title="Refresh Data"
            >
              <FiRefreshCw size={13} className={loading ? "spin" : ""} />
              <span className="d-none d-md-inline">Sync</span>
            </button>

            <Link to="/" className="btn btn-sm admin-btn-boutique d-flex align-items-center gap-1">
              <FiExternalLink size={14} />
              <span className="d-none d-sm-inline">Boutique</span>
            </Link>

            <div className="admin-profile-badge">
              <div className="admin-profile-avatar">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Canvas */}
        <main className="admin-canvas">
          {/* Top 4 Sober KPI Metric Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="admin-metric-card" onClick={() => setActiveTab("products")}>
                <div className="admin-metric-header">
                  <span className="admin-metric-title">Catalog Inventory</span>
                  <div className="admin-metric-icon ocean">
                    <FiShoppingBag size={16} />
                  </div>
                </div>
                <div className="admin-metric-value">{totalProducts}</div>
                <div className="admin-metric-sub">
                  <span>{watches.length} Watches</span> • <span>{fragrances.length} Fragrances</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="admin-metric-card" onClick={() => setActiveTab("orders")}>
                <div className="admin-metric-header">
                  <span className="admin-metric-title">Customer Orders</span>
                  <div className="admin-metric-icon amber">
                    <FiPackage size={16} />
                  </div>
                </div>
                <div className="admin-metric-value">{totalOrders}</div>
                <div className="admin-metric-sub">
                  <span>{orders.filter(o => o.status === "Delivered").length} Delivered</span> • <span>{orders.filter(o => o.status !== "Delivered").length} In Progress</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="admin-metric-card" onClick={() => setActiveTab("brands")}>
                <div className="admin-metric-header">
                  <span className="admin-metric-title">Brand Directory</span>
                  <div className="admin-metric-icon sky">
                    <FiTag size={16} />
                  </div>
                </div>
                <div className="admin-metric-value">{brandStats.length}</div>
                <div className="admin-metric-sub">
                  <span>{categoryStats.length} Catalog Categories</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="admin-metric-card">
                <div className="admin-metric-header">
                  <span className="admin-metric-title">Revenue (INR)</span>
                  <div className="admin-metric-icon emerald">
                    <FiDollarSign size={16} />
                  </div>
                </div>
                <div className="admin-metric-value">₹{totalRevenue.toLocaleString("en-IN")}</div>
                <div className="admin-metric-sub">
                  <span>Gross Sales Volume</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              VIEW 1: ORDERS (WITH UPDATE STATUS & DELETE)
             ======================================================== */}
          {activeTab === "orders" && (
            <div className="admin-panel-card">
              <div className="admin-panel-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <h6 className="admin-panel-title mb-0">Customer Purchases</h6>
                  <small className="text-muted">{filteredOrders.length} orders found</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <label className="small text-muted mb-0 fw-semibold">Status:</label>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "150px" }}
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <option value="all">All Orders</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="table-responsive">
                {filteredOrders.length === 0 ? (
                  <div className="py-5 text-center text-muted">
                    <h5>No orders matching your criteria</h5>
                    <p className="small">Customer purchases will show up here automatically.</p>
                  </div>
                ) : (
                  <table className="table admin-table mb-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items Ordered</th>
                        <th>Payment</th>
                        <th>Total Amount</th>
                        <th>Order Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => {
                        const currentStatus = order.status || "Processing";
                        return (
                          <tr key={order._id}>
                            <td>
                              <code className="text-muted small">
                                #{order._id.slice(-6).toUpperCase()}
                              </code>
                            </td>
                            <td>
                              <small className="text-muted">
                                {new Date(order.orderDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </small>
                            </td>
                            <td>
                              <div className="fw-semibold text-ocean">{order.customerInfo?.name}</div>
                              <small className="text-muted">{order.customerInfo?.email}</small>
                              <div className="small text-muted">{order.customerInfo?.city}</div>
                            </td>
                            <td>
                              <ul className="list-unstyled mb-0" style={{ fontSize: "0.85rem" }}>
                                {order.orderItems?.map((item, idx) => (
                                  <li key={idx} className="text-truncate" style={{ maxWidth: "200px" }}>
                                    <span className="badge bg-light text-dark border me-1">
                                      {item.quantity}x
                                    </span>{" "}
                                    {item.name}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border rounded-pill">
                                {order.customerInfo?.paymentMethod || "COD"}
                              </span>
                            </td>
                            <td>
                              <span className="fw-bold fs-6 text-ocean">
                                ₹{order.totalAmount?.toLocaleString("en-IN")}
                              </span>
                            </td>
                            <td>
                              <select
                                className={`form-select form-select-sm fw-semibold status-select ${currentStatus === "Delivered"
                                    ? "status-delivered"
                                    : currentStatus === "Shipped"
                                      ? "status-shipped"
                                      : currentStatus === "Cancelled"
                                        ? "status-cancelled"
                                        : "status-processing"
                                  }`}
                                value={currentStatus}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteOrder(order._id)}
                                title="Delete Order"
                              >
                                <FiTrash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 2: CUSTOMERS (WITH BLOCK / ACTIVE TOGGLE & DELETE)
             ======================================================== */}
          {activeTab === "customers" && (
            <div className="admin-panel-card">
              <div className="admin-panel-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <h6 className="admin-panel-title mb-0">Registered Customers</h6>
                  <small className="text-muted">{filteredUsers.length} total user accounts in database</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-sm admin-btn-ocean d-flex align-items-center gap-1"
                    onClick={openAddUserModal}
                  >
                    <FiUserPlus /> Add Customer
                  </button>
                  <label className="small text-muted mb-0 fw-semibold ms-2">Filter:</label>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "150px" }}
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                  >
                    <option value="all">All Accounts</option>
                    <option value="active">Active Only</option>
                    <option value="blocked">Blocked Only</option>
                  </select>
                </div>
              </div>
              <div className="table-responsive">
                {filteredUsers.length === 0 ? (
                  <div className="py-5 text-center text-muted">
                    <h5>No customers matching your filter</h5>
                  </div>
                ) : (
                  <table className="table admin-table mb-0">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Email Address</th>
                        <th>Account Role</th>
                        <th>Status</th>
                        <th className="text-end">Admin Controls</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => {
                        const isBlocked = u.status === "blocked";
                        return (
                          <tr key={u._id} className={isBlocked ? "user-row-blocked" : ""}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className={`customer-avatar-badge ${isBlocked ? "blocked" : ""}`}>
                                  {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div>
                                  <span className="fw-bold text-ocean d-block">{u.name}</span>
                                  {isBlocked && (
                                    <small className="text-danger fw-semibold">Suspended Account</small>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span
                                className={`badge rounded-pill ${u.role === "admin"
                                    ? "bg-primary text-white"
                                    : "bg-light text-dark border"
                                  }`}
                              >
                                {u.role || "user"}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge rounded-pill px-2 py-1 ${isBlocked
                                    ? "bg-danger text-white"
                                    : "bg-success-subtle text-success border border-success-subtle"
                                  }`}
                              >
                                {isBlocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="text-end">
                              {/* Edit, Toggle Block & Delete Buttons */}
                              {u.role !== "admin" ? (
                                <>
                                  <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => openEditUserModal(u)}
                                    title="Edit Customer"
                                  >
                                    <FiEdit2 size={13} />
                                  </button>

                                  <button
                                    className={`btn btn-sm me-2 ${isBlocked ? "btn-outline-success" : "btn-outline-warning"
                                      }`}
                                    onClick={() => handleToggleUserStatus(u._id, u.status || "active")}
                                    title={isBlocked ? "Re-activate User" : "Block User"}
                                  >
                                    {isBlocked ? (
                                      <>
                                        <FiCheck size={13} className="me-1" /> Unblock
                                      </>
                                    ) : (
                                      <>
                                        <FiSlash size={13} className="me-1" /> Block
                                      </>
                                    )}
                                  </button>

                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteUser(u._id)}
                                    title="Delete User Permanently"
                                  >
                                    <FiTrash2 size={13} />
                                  </button>
                                </>
                              ) : (
                                <span className="small text-muted italic">Protected Admin</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 3: PRODUCTS (CRUD: ADD, EDIT, DELETE, STOCK)
             ======================================================== */}
          {activeTab === "products" && (
            <div>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-sm ${productSubTab === "all" ? "admin-btn-ocean" : "btn-outline-secondary"}`}
                    onClick={() => setProductSubTab("all")}
                  >
                    All Products ({totalProducts})
                  </button>
                  <button
                    className={`btn btn-sm ${productSubTab === "watches" ? "admin-btn-ocean" : "btn-outline-secondary"}`}
                    onClick={() => setProductSubTab("watches")}
                  >
                    Watches ({watches.length})
                  </button>
                  <button
                    className={`btn btn-sm ${productSubTab === "fragrances" ? "admin-btn-ocean" : "btn-outline-secondary"}`}
                    onClick={() => setProductSubTab("fragrances")}
                  >
                    Fragrances ({fragrances.length})
                  </button>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm admin-btn-ocean d-flex align-items-center gap-1"
                    onClick={() => {
                      if (showProductForm && !isEditing) {
                        setShowProductForm(false);
                      } else {
                        handleCancelForm();
                        setFormType("watch");
                        setShowProductForm(true);
                      }
                    }}
                  >
                    <FiPlus /> {showProductForm && !isEditing ? "Close Form" : "Add Product"}
                  </button>
                </div>
              </div>

              {/* Add / Edit Form Card */}
              {showProductForm && (
                <div className="admin-panel-card mb-4" style={{ borderLeft: "4px solid #0F4C81" }}>
                  <div className="admin-panel-header d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="admin-panel-title mb-0">
                        {isEditing ? "Edit Product Details" : "Add New Luxury Item"}
                      </h6>
                      <small className="text-muted">
                        Targeting: {formType === "watch" ? "Watches Collection" : "Fragrances Collection"}
                      </small>
                    </div>
                    <button className="btn btn-sm btn-close" onClick={handleCancelForm}></button>
                  </div>
                  <div className="p-4">
                    <form onSubmit={handleProductSubmit}>
                      {!isEditing && (
                        <div className="mb-3">
                          <label className="form-label small fw-semibold text-muted">COLLECTION TYPE</label>
                          <div className="d-flex gap-3">
                            <label className="form-check-label d-flex align-items-center gap-1">
                              <input
                                type="radio"
                                name="collectionType"
                                checked={formType === "watch"}
                                onChange={() => setFormType("watch")}
                              />
                              Watch Timepiece
                            </label>
                            <label className="form-check-label d-flex align-items-center gap-1">
                              <input
                                type="radio"
                                name="collectionType"
                                checked={formType === "fragrance"}
                                onChange={() => setFormType("fragrance")}
                              />
                              Perfume / Fragrance
                            </label>
                          </div>
                        </div>
                      )}

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold text-muted">Product Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={productForm.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <label className="form-label small fw-semibold text-muted mb-0">Brand House</label>
                            <button
                              type="button"
                              className="btn btn-link p-0 text-decoration-none small text-primary fw-semibold"
                              onClick={openAddBrandModal}
                            >
                              + Add New Brand
                            </button>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            name="brand"
                            list="brand-datalist-suggestions"
                            placeholder="Select from directory or type brand (Rolex, Chanel, Creed...)"
                            value={productForm.brand}
                            onChange={handleInputChange}
                            required
                          />
                          <datalist id="brand-datalist-suggestions">
                            {brandStats.map((b) => (
                              <option key={b.brand} value={b.brand}>
                                {b.brand} ({b.origin || "Luxury House"})
                              </option>
                            ))}
                          </datalist>
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold text-muted">Model / Edition</label>
                          <input
                            type="text"
                            className="form-control"
                            name="model"
                            placeholder="e.g. 126610LN or Eau de Parfum"
                            value={productForm.model}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold text-muted">Price (₹ INR)</label>
                          <input
                            type="number"
                            className="form-control"
                            name="price"
                            value={productForm.price}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold text-muted">Rating (1 to 5)</label>
                          <input
                            type="number"
                            step="0.1"
                            max="5"
                            min="1"
                            className="form-control"
                            name="rating"
                            value={productForm.rating}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-md-12">
                          <label className="form-label small fw-semibold text-muted d-flex justify-content-between align-items-center mb-1">
                            <span>Image Source or Photo *</span>
                            <div className="d-flex gap-2">
                              <label className="btn btn-sm btn-outline-primary mb-0 py-1 px-2" style={{ fontSize: "0.78rem", cursor: "pointer" }}>
                                <FiUpload className="me-1" /> {isUploading ? "Uploading..." : "Upload from PC"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="d-none"
                                  onChange={handleImageFileUpload}
                                  disabled={isUploading}
                                />
                              </label>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary py-1 px-2"
                                style={{ fontSize: "0.78rem" }}
                                onClick={() => setShowGalleryModal(true)}
                              >
                                <FiImage className="me-1" /> Choose from Gallery
                              </button>
                            </div>
                          </label>

                          <div className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              name="image"
                              placeholder="e.g. /assests/Products/Watches/Cartier Crash.jpg or https://..."
                              value={productForm.image}
                              onChange={(e) => {
                                handleInputChange(e);
                                setImageTestStatus("idle");
                              }}
                              required
                            />
                          </div>

                          {/* Live Image Preview Card */}
                          <div className="admin-img-preview-box">
                            {productForm.image ? (
                              <img
                                src={productForm.image}
                                alt="Live Preview"
                                className="admin-preview-thumbnail"
                                onLoad={() => setImageTestStatus("loaded")}
                                onError={() => setImageTestStatus("error")}
                              />
                            ) : (
                              <div className="admin-preview-thumbnail d-flex align-items-center justify-content-center text-muted" style={{ fontSize: "0.7rem", textAlign: "center" }}>
                                No Image
                              </div>
                            )}
                            <div className="flex-grow-1">
                              {imageTestStatus === "loaded" && (
                                <div className="text-success small fw-semibold d-flex align-items-center gap-1">
                                  <FiCheckCircle /> Image verified & loaded correctly
                                </div>
                              )}
                              {imageTestStatus === "error" && (
                                <div className="text-danger small fw-semibold d-flex align-items-center gap-1">
                                  <FiAlertCircle /> File not found at this path. Click "Upload from PC" or "Choose from Gallery".
                                </div>
                              )}
                              {imageTestStatus === "idle" && (
                                <div className="text-muted small">
                                  {productForm.image ? "Checking image preview..." : "Paste a file path/URL, upload from your PC, or select from gallery above."}
                                </div>
                              )}
                              <small className="text-muted d-block text-truncate" style={{ maxWidth: "450px" }}>
                                Current source: <code>{productForm.image || "None"}</code>
                              </small>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <label className="form-label small fw-semibold text-muted mb-0">Category Tier</label>
                            <button
                              type="button"
                              className="btn btn-link p-0 text-decoration-none small text-primary fw-semibold"
                              onClick={openAddCategoryModal}
                            >
                              + New
                            </button>
                          </div>
                          <select
                            className="form-select"
                            name="category"
                            value={productForm.category}
                            onChange={handleInputChange}
                          >
                            {categoryStats.map((c) => (
                              <option key={c.category} value={c.category}>
                                {c.category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold text-muted">Gender</label>
                          <select
                            className="form-select"
                            name="gender"
                            value={productForm.gender}
                            onChange={handleInputChange}
                          >
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                          </select>
                        </div>

                        {formType === "watch" ? (
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold text-muted">Watch Style</label>
                            <input
                              type="text"
                              className="form-control"
                              name="watchType"
                              placeholder="Diver, Classic, Sport, Dress..."
                              value={productForm.watchType || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        ) : (
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold text-muted">Fragrance Profile</label>
                            <input
                              type="text"
                              className="form-control"
                              name="fragranceType"
                              placeholder="Floral, Woody, Fresh, Oriental..."
                              value={productForm.fragranceType || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}

                        <div className="col-md-6 d-flex align-items-center pt-3">
                          <div className="form-check form-switch mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="inStock"
                              id="stockSwitch"
                              checked={productForm.inStock}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label fw-semibold" htmlFor="stockSwitch">
                              Item in Stock
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 d-flex gap-2">
                        <button type="submit" className="btn admin-btn-ocean px-4">
                          {isEditing ? "Save Changes" : "Save Product"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handleCancelForm}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="admin-panel-card">
                <div className="table-responsive">
                  <table className="table admin-table mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Brand & Reference</th>
                        <th>Price</th>
                        <th>Type / Profile</th>
                        <th>Stock Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="admin-product-thumb"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = item.productCategory === "fragrance"
                                    ? "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&auto=format&fit=crop"
                                    : "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&auto=format&fit=crop";
                                }}
                              />
                              <div>
                                <div className="fw-bold text-ocean">{item.name}</div>
                                <small className="text-muted">
                                  {item.productCategory === "watch" ? "Watch" : "Fragrance"} • ★ {item.rating || 4.8}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold">{item.brand}</div>
                            <small className="text-muted">{item.model || "—"}</small>
                          </td>
                          <td>
                            <span className="fw-bold text-ocean">
                              ₹{Number(item.price).toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border me-1">
                              {item.category || "Luxury"}
                            </span>
                            <small className="text-muted">
                              {item.watchType || item.fragranceType || "Standard"}
                            </small>
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`btn btn-sm stock-toggle-btn badge rounded-pill border-0 py-1 px-2 ${item.inStock !== false
                                  ? "bg-success-subtle text-success"
                                  : "bg-danger-subtle text-danger"
                                }`}
                              onClick={() => handleQuickToggleStock(item)}
                              title="Click to toggle stock status"
                            >
                              {item.inStock !== false ? "● In Stock" : "○ Out of Stock"}
                            </button>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEditClick(item)}
                              title="Edit Product"
                            >
                              <FiEdit2 size={13} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDeleteProduct(
                                  item._id,
                                  item.productCategory === "watch" || item.watchType !== undefined
                                )
                              }
                              title="Delete Product"
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
            </div>
          )}

          {/* ========================================================
              VIEW 4: BRANDS (MANAGE & EDIT BRAND HOUSES)
             ======================================================== */}
          {activeTab === "brands" && (
            <div className="admin-panel-card">
              <div className="admin-panel-header d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <h6 className="admin-panel-title mb-0">Brand Houses Directory</h6>
                  <small className="text-muted">Register and manage luxury watch & perfume brand houses</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="btn-group btn-group-sm">
                    <button
                      className={`btn ${brandTypeFilter === 'all' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => setBrandTypeFilter('all')}
                    >
                      All ({dbBrands.length})
                    </button>
                    <button
                      className={`btn ${brandTypeFilter === 'watches' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => setBrandTypeFilter('watches')}
                    >
                      Watches
                    </button>
                    <button
                      className={`btn ${brandTypeFilter === 'fragrances' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => setBrandTypeFilter('fragrances')}
                    >
                      Fragrances
                    </button>
                  </div>
                  <button
                    className="btn btn-sm btn-dark d-flex align-items-center gap-1 px-3"
                    onClick={openAddBrandModal}
                  >
                    <FiPlus size={14} /> Add New Brand
                  </button>
                </div>
              </div>
              <div className="p-3 p-md-4">
                <div className="row g-3">
                  {brandStats.map((b) => (
                    <div key={b.brand} className="col-12 col-sm-6 col-lg-4">
                      <div className="admin-entity-card">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h5 className="fw-bold mb-0 text-dark">{b.brand}</h5>
                              <small className="text-muted">{b.origin || "International House"}</small>
                            </div>
                            <span className={`admin-tag-pill ${b.categoryType}`}>
                              {b.categoryType === "both" ? "Watches & Scents" : b.categoryType}
                            </span>
                          </div>
                          {b.description && (
                            <p className="small text-muted mb-2 text-truncate" title={b.description}>
                              {b.description}
                            </p>
                          )}
                          <div className="small text-secondary mb-3">
                            <span className="badge bg-light text-dark border me-1">
                              {b.count} products
                            </span>
                            <span className="text-muted">active in catalog</span>
                          </div>
                        </div>

                        <div className="d-flex gap-2 pt-2 border-top">
                          <button
                            className="btn btn-sm btn-outline-dark flex-grow-1"
                            onClick={() => handleFilterByBrand(b.brand)}
                          >
                            <FiSearch size={12} className="me-1" /> View Items
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openEditBrandModal(b)}
                            title="Edit Brand"
                          >
                            <FiEdit2 size={12} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteBrand(b)}
                            title="Delete Brand"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 5: CATEGORIES (MANAGE & EDIT CATEGORIES)
             ======================================================== */}
          {activeTab === "categories" && (
            <div className="admin-panel-card">
              <div className="admin-panel-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <h6 className="admin-panel-title mb-0">Catalog Category Tiers</h6>
                  <small className="text-muted">Manage product categorization taxonomy and classification</small>
                </div>
                <button
                  className="btn btn-sm btn-dark d-flex align-items-center gap-1 px-3"
                  onClick={openAddCategoryModal}
                >
                  <FiPlus size={14} /> Add New Category
                </button>
              </div>
              <div className="p-3 p-md-4">
                <div className="row g-3">
                  {categoryStats.map((c) => (
                    <div key={c.category} className="col-12 col-sm-6 col-lg-4">
                      <div className="admin-entity-card">
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <h5 className="fw-bold mb-0 text-dark">{c.category}</h5>
                            <span className="badge bg-light text-dark border">{c.count} items</span>
                          </div>
                          <div className="mb-2">
                            <span className={`admin-tag-pill ${c.categoryType}`}>
                              {c.categoryType === "both" ? "All Departments" : c.categoryType}
                            </span>
                          </div>
                          <p className="small text-muted mb-3" style={{ minHeight: "36px" }}>
                            {c.description || "Core catalog tier."}
                          </p>
                        </div>

                        <div className="d-flex gap-2 pt-2 border-top">
                          <button
                            className="btn btn-sm btn-outline-dark flex-grow-1"
                            onClick={() => handleFilterByCategory(c.category)}
                          >
                            <FiSearch size={12} className="me-1" /> View Items
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openEditCategoryModal(c)}
                            title="Edit Category"
                          >
                            <FiEdit2 size={12} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteCategory(c)}
                            title="Delete Category"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 6: REAL CUSTOMER REVIEWS
             ======================================================== */}
          {activeTab === "reviews" && (
            <div className="admin-panel-card">
              <div className="admin-panel-header d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="admin-panel-title mb-0">Customer Ratings & Reviews</h6>
                  <small className="text-muted">Verified client feedback on delivered orders ({customerReviews.length} reviews)</small>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={fetchAllData}
                >
                  <FiRefreshCw size={13} className="me-1" /> Refresh
                </button>
              </div>

              <div className="p-4">
                {customerReviews.length === 0 ? (
                  <div className="text-center py-5">
                    <FiStar size={40} className="text-muted mb-2" />
                    <h6 className="fw-bold text-dark">No Customer Reviews Yet</h6>
                    <p className="text-muted small mb-0">
                      When customers receive their delivered orders and submit ratings & reviews in "My Orders", they will immediately appear here!
                    </p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {customerReviews.map((rev, i) => (
                      <div key={i} className="col-12 col-lg-6">
                        <div className="p-3 border rounded-3 bg-white shadow-sm h-100 d-flex flex-column">
                          <div className="d-flex align-items-start gap-3 mb-2">
                            <img
                              src={
                                rev.productImage ||
                                (/perfume|fragrance|eau|parfum|chanel|creed|dior|versace|tom ford/i.test(rev.productName || "")
                                  ? "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&auto=format&fit=crop"
                                  : "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&auto=format&fit=crop")
                              }
                              alt={rev.productName}
                              style={{ width: "55px", height: "55px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                const isPerfume = /perfume|fragrance|eau|parfum|chanel|creed|dior|versace|tom ford/i.test(rev.productName || "");
                                e.target.src = isPerfume
                                  ? "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&auto=format&fit=crop"
                                  : "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&auto=format&fit=crop";
                              }}
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold text-dark">{rev.productName}</div>
                              <div className="d-flex align-items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    size={13}
                                    color={star <= rev.rating ? "#f59e0b" : "#cbd5e1"}
                                  />
                                ))}
                                <span className="ms-1 fw-bold text-dark small">
                                  ★ {rev.rating} / 5.0
                                </span>
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-light text-muted border" style={{ fontSize: "0.7rem" }}>
                                #ORD-{rev.orderId.slice(-6).toUpperCase()}
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger py-0 px-2 d-flex align-items-center gap-1"
                                style={{ fontSize: "0.7rem" }}
                                onClick={() => handleDeleteReview(rev.orderId, rev.itemIndex)}
                                title="Delete Customer Review"
                              >
                                <FiTrash2 size={11} /> Delete
                              </button>
                            </div>
                          </div>

                          {rev.review ? (
                            <div className="p-2 bg-light rounded text-dark small fst-italic my-2 flex-grow-1">
                              "{rev.review}"
                            </div>
                          ) : (
                            <div className="text-muted small fst-italic my-2 flex-grow-1">
                              No written comment provided.
                            </div>
                          )}

                          <div className="border-top pt-2 mt-auto d-flex justify-content-between align-items-center text-muted" style={{ fontSize: "0.78rem" }}>
                            <span>
                              By: <strong>{rev.customerName}</strong> ({rev.customerEmail})
                            </span>
                            <span>
                              {new Date(rev.reviewedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW: CONTACT MESSAGES / CONCIERGE INQUIRIES
             ======================================================== */}
          {activeTab === "messages" && (
            <div className="admin-panel-card">
              <div className="admin-panel-header d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="admin-panel-title mb-0">Client Concierge Inquiries</h6>
                  <small className="text-muted">Direct messages submitted from the contact portal ({messages.length} total)</small>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={fetchAllData}
                >
                  <FiRefreshCw size={13} className="me-1" /> Refresh Messages
                </button>
              </div>

              <div className="p-4">
                {messages.length === 0 ? (
                  <div className="text-center py-5">
                    <FiMail size={40} className="text-muted mb-2" />
                    <h6 className="fw-bold text-dark">No Client Inquiries Yet</h6>
                    <p className="text-muted small mb-0">When visitors send messages via the Contact page, they will show up here.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {messages.map((msg) => (
                      <div key={msg._id} className="p-3 border rounded-3 bg-white shadow-sm">
                        <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-2 mb-2 gap-2">
                          <div>
                            <strong className="text-dark me-2">{msg.name}</strong>
                            <a href={`mailto:${msg.email}`} className="text-primary small text-decoration-none">
                              &lt;{msg.email}&gt;
                            </a>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <small className="text-muted">
                              {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </small>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                              style={{ fontSize: "0.75rem", padding: "3px 8px" }}
                              onClick={() => handleDeleteMessage(msg._id)}
                              title="Delete inquiry"
                            >
                              <FiTrash2 size={12} /> Delete
                            </button>
                          </div>
                        </div>

                        <div className="mb-1">
                          <span className="badge bg-light text-dark border me-2">Subject</span>
                          <strong className="text-dark small">{msg.subject}</strong>
                        </div>

                        <div className="text-muted small p-2 bg-light rounded mt-2" style={{ whiteSpace: "pre-wrap" }}>
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 7: SETTINGS & SECURITY & HELP
             ======================================================== */}
          {(activeTab === "settings" || activeTab === "security" || activeTab === "help") && (
            <div className="admin-panel-card">
              <div className="admin-panel-header">
                <h6 className="admin-panel-title mb-0">
                  {activeTab === "settings" && "Console Settings"}
                  {activeTab === "security" && "Security & Access Control"}
                  {activeTab === "help" && "Console Documentation & Guide"}
                </h6>
                <small className="text-muted">System parameters for ChronoScent Elite</small>
              </div>
              <div className="p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <h6 className="fw-bold text-ocean mb-2">Administrator Account</h6>
                      <p className="small text-muted mb-1">
                        <strong>Logged In User:</strong> {currentUser?.name || "Administrator"}
                      </p>
                      <p className="small text-muted mb-1">
                        <strong>Email Address:</strong> {currentUser?.email || "admin@chronoscent.com"}
                      </p>
                      <p className="small text-muted mb-1">
                        <strong>Role Level:</strong> <span className="badge bg-primary">Admin</span>
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <h6 className="fw-bold text-ocean mb-2">Connected Database</h6>
                      <p className="small text-muted mb-1">
                        <strong>Database:</strong> <code>chronoscent</code> (Local MongoDB)
                      </p>
                      <p className="small text-muted mb-1">
                        <strong>Active Port:</strong> <code>5000</code> (Express REST Server)
                      </p>
                      <p className="small text-muted mb-1">
                        <strong>Status:</strong> <span className="text-success fw-bold">Online & Synchronized</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white border rounded">
                  <h6 className="fw-bold text-ocean mb-1">Administrator Facilities Overview</h6>
                  <ul className="small text-muted mb-0 ps-3">
                    <li><strong>Orders:</strong> Live update order delivery status (Processing, Shipped, Delivered, Cancelled) & order deletion.</li>
                    <li><strong>Customers:</strong> Immediate block/unblock control and account deletion. Blocked users are restricted from signing in.</li>
                    <li><strong>Products:</strong> Full Create, Read, Update, Delete (CRUD) with live in-stock toggles.</li>
                    <li><strong>Brands & Categories:</strong> Bulk rename across collections and direct inventory filtering.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 1. ADD / EDIT BRAND MODAL */}
      {showBrandModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="admin-modal-header d-flex justify-content-between align-items-center">
              <h6 className="admin-modal-title mb-0">
                {isEditingBrand ? "Edit Brand House" : "Add New Brand House"}
              </h6>
              <button
                className="btn btn-sm btn-close"
                onClick={() => setShowBrandModal(false)}
              />
            </div>
            <form onSubmit={handleSaveBrand} className="p-4">
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">BRAND NAME *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Patek Philippe, Audemars Piguet, Prada..."
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">CATALOG TYPE</label>
                  <select
                    className="form-select"
                    value={brandForm.categoryType}
                    onChange={(e) => setBrandForm({ ...brandForm, categoryType: e.target.value })}
                  >
                    <option value="both">Both (Watches & Fragrances)</option>
                    <option value="watches">Watches Only</option>
                    <option value="fragrances">Fragrances Only</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">ORIGIN / COUNTRY</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Geneva, Switzerland"
                    value={brandForm.origin}
                    onChange={(e) => setBrandForm({ ...brandForm, origin: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">HERITAGE / DESCRIPTION</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Brief description of brand heritage or specialty..."
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3"
                  onClick={() => setShowBrandModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-dark px-4">
                  {isEditingBrand ? "Save Changes" : "Create Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADD / EDIT CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="admin-modal-header d-flex justify-content-between align-items-center">
              <h6 className="admin-modal-title mb-0">
                {isEditingCategory ? "Edit Category Tier" : "Add New Category Tier"}
              </h6>
              <button
                className="btn btn-sm btn-close"
                onClick={() => setShowCategoryModal(false)}
              />
            </div>
            <form onSubmit={handleSaveCategory} className="p-4">
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">CATEGORY NAME *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Vintage, Limited Edition, Haute Horlogerie..."
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">APPLICABLE FOR</label>
                <select
                  className="form-select"
                  value={categoryForm.categoryType}
                  onChange={(e) => setCategoryForm({ ...categoryForm, categoryType: e.target.value })}
                >
                  <option value="both">Both (Watches & Fragrances)</option>
                  <option value="watches">Watches Only</option>
                  <option value="fragrances">Fragrances Only</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">DESCRIPTION</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Description of this category tier..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-dark px-4">
                  {isEditingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. BOUTIQUE GALLERY IMAGE PICKER MODAL */}
      {showGalleryModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card" style={{ maxWidth: "600px" }}>
            <div className="admin-modal-header d-flex justify-content-between align-items-center">
              <div>
                <h6 className="admin-modal-title mb-0">Boutique Image Gallery</h6>
                <small className="text-muted">Click any photo to attach it directly to this product</small>
              </div>
              <button
                className="btn btn-sm btn-close"
                onClick={() => setShowGalleryModal(false)}
              />
            </div>
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="small text-muted fw-semibold">
                  Available Catalog Photos ({catalogImages.length})
                </span>
                <span className="badge bg-light text-dark border">
                  Showing: {formType === "watch" ? "Watches Collection" : "Fragrance Collection"}
                </span>
              </div>
              <div className="admin-gallery-grid">
                {catalogImages
                  .filter(img => formType === "watch" ? img.categoryType === "watch" : img.categoryType === "fragrance")
                  .map((img, i) => (
                    <div
                      key={i}
                      className={`admin-gallery-item ${productForm.image === img.path ? "selected" : ""}`}
                      onClick={() => {
                        setProductForm(prev => ({ ...prev, image: img.path }));
                        setImageTestStatus("loaded");
                        setShowGalleryModal(false);
                      }}
                      title={img.name}
                    >
                      <img src={img.path} alt={img.name} />
                      <span className="admin-gallery-item-name">{img.name}</span>
                    </div>
                  ))}
              </div>
              <div className="text-end mt-3">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setShowGalleryModal(false)}
                >
                  Close Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADD / EDIT USER MODAL */}
      {showUserModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="admin-modal-header d-flex justify-content-between align-items-center">
              <h6 className="admin-modal-title mb-0">
                {isEditingUser ? "Edit Customer Account" : "Add New Customer Account"}
              </h6>
              <button
                className="btn btn-sm btn-close"
                onClick={() => setShowUserModal(false)}
              />
            </div>
            <form onSubmit={handleSaveUser} className="p-4">
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">FULL NAME *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Eleanor Vance"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. client@example.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  {isEditingUser ? "NEW PASSWORD (leave blank to keep unchanged)" : "PASSWORD *"}
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder={isEditingUser ? "Leave blank to keep current password" : "Enter account password"}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  required={!isEditingUser}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">ACCOUNT ROLE</label>
                  <select
                    className="form-select"
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  >
                    <option value="user">Customer (user)</option>
                    <option value="admin">Administrator (admin)</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">ACCOUNT STATUS</label>
                  <select
                    className="form-select"
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked / Suspended</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3"
                  onClick={() => setShowUserModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm admin-btn-ocean px-4">
                  {isEditingUser ? "Save Account" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
