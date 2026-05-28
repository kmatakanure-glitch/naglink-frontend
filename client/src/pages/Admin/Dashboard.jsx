import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../services/api";
import toast from "react-hot-toast";

import TruckImageUpload from "../../components/TruckImageUpload";
import MultiTruckOrderForm from "../../components/MultiTruckOrderForm";
import DashboardLayout from "../../components/DashboardLayout";

import {
  Truck,
  Users,
  UserRound,
  DollarSign,
  PackageCheck,
  ListFilter,
  Clock,
  Loader,
  Route,
  ClipboardCheck,
  CheckCircle2,
  Search,
  XCircle,
  MapPin,
  ReceiptText,
  Download,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [showTruckForm, setShowTruckForm] = useState(false);
  const [showEditTruckForm, setShowEditTruckForm] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);

  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseOrder, setExpenseOrder] = useState(null);


const [quoteReplyData, setQuoteReplyData] = useState({
  estimatedPrice: "",
});

  const [showDriverForm, setShowDriverForm] = useState(false);
  const [showEditDriverForm, setShowEditDriverForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");

  const [showMultiTruckForm, setShowMultiTruckForm] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showRejectLoadingModal, setShowRejectLoadingModal] = useState(false);
  const [showRejectOffloadingModal, setShowRejectOffloadingModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [approvalData, setApprovalData] = useState({
    price: "",
    driverId: "",
    departureTime: "",
    forecastedArrival: "",
  });



  const [expenseData, setExpenseData] = useState({
  fuel: "",
  tollgate: "",
  maintenance: "",
  driverAllowance: "",
  loadingCost: "",
  offloadingCost: "",
  otherDescription: "",
  zimTolls: "",
  mozaTolls: "",
  roadAccess: "",
  vidCosts: "",
  emaCosts: "",
  portHealth: "",
  portFee: "",
  agentRunner: "",
  otherCost: "",
});




  const [truckData, setTruckData] = useState({
    truckName: "",
    licensePlate: "",
    capacity: "",
    description: "",
    assignedDriverId: "",
    imageFile: null,
  });

  const [driverData, setDriverData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    profileImage: null,
  });

  useEffect(() => {
    fetchDashboardStats();
    fetchOrders();
    fetchTrucks();
    fetchDrivers();
    fetchQuotes();
    fetchExpenses();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await API.get("/admin/dashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

 const fetchOrders = async () => {
  try {
    const response = await API.get("/orders");

    console.log("Admin orders with locations:", response.data.orders);

    setOrders(response.data.orders || []);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

  const fetchTrucks = async () => {
    try {
      const response = await API.get("/trucks");
      setTrucks(response.data.trucks || []);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await API.get("/users/drivers/all");
      setDrivers(response.data.drivers || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

// const getFilteredOrders = () => {
//   let filtered = [...orders];

//   if (statusFilter !== "all") {
//     filtered = filtered.filter((order) => order.status === statusFilter);
//   }

//   const finalSearchTerm = searchTerm || globalSearch;

//   if (finalSearchTerm) {
//     const q = finalSearchTerm.toLowerCase();

//     filtered = filtered.filter(
//       (order) =>
//         order.id?.toString().includes(q) ||
//         order.packageNumber?.toLowerCase().includes(q) ||
//         order.customer?.username?.toLowerCase().includes(q) ||
//         order.customer?.email?.toLowerCase().includes(q) ||
//         order.pickupLocation?.toLowerCase().includes(q) ||
//         order.deliveryLocation?.toLowerCase().includes(q) ||
//         order.goodsDescription?.toLowerCase().includes(q) ||
//         order.status?.toLowerCase().includes(q) ||
//         order.driver?.username?.toLowerCase().includes(q) ||
//         order.driver?.email?.toLowerCase().includes(q) ||
//         order.truck?.truckName?.toLowerCase().includes(q) ||
//         order.truck?.licensePlate?.toLowerCase().includes(q) ||
//         order.locations?.some((location) =>
//           location.locationName?.toLowerCase().includes(q)
//         ) ||
//         order.statusUpdates?.some((update) =>
//           update.title?.toLowerCase().includes(q) ||
//           update.note?.toLowerCase().includes(q) ||
//           update.status?.toLowerCase().includes(q) ||
//           update.updatedByUser?.username?.toLowerCase().includes(q)
//         )
//     );
//   }

//   return filtered;
// };

const normalizeText = (value) => {
  return String(value || "")
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getActiveSearch = () => normalizeText(searchTerm || globalSearch);

const matchesSearch = (items, query) => {
  if (!query) return true;

  const searchableText = items
    .flat(Infinity)
    .map(normalizeText)
    .filter(Boolean)
    .join(" ");

  return searchableText.includes(query);
};

const getFilteredOrders = () => {
  let filtered = [...orders];

  if (statusFilter !== "all") {
    if (statusFilter === "pending") {
      filtered = filtered.filter(
        (order) => order.approvalStatus === "pending" || order.status === "pending"
      );
    } else {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
  }

  const q = getActiveSearch();

  return filtered.filter((order) =>
    matchesSearch(
      [
        order.id,
        order.orderNumber,
        order.packageNumber,
        order.pickupLocation,
        order.deliveryLocation,
        order.goodsDescription,
        order.weight,
        order.price,
        order.status,
        order.approvalStatus,
        order.customer?.username,
        order.customer?.email,
        order.customer?.phone,
        order.customer?.companyName,
        order.driver?.username,
        order.driver?.email,
        order.driver?.phone,
        order.truck?.truckName,
        order.truck?.licensePlate,
        order.truck?.capacity,
        (order.locations || []).map((location) => [
          location.locationName,
          location.latitude,
          location.longitude,
        ]),
        (order.statusUpdates || []).map((update) => [
          update.title,
          update.note,
          update.status,
          update.locationName,
          update.updatedByUser?.username,
          update.updatedByUser?.role,
        ]),
      ],
      q
    )
  );
};

const getRecentOrders = () => {
  return [...getFilteredOrders()]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.updatedAt || 0) -
        new Date(a.createdAt || a.updatedAt || 0)
    )
    .slice(0, 5);
};

const fetchQuotes = async () => {
  try {
    const response = await API.get("/quotes");
    setQuotes(response.data.quotes || []);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    toast.error("Error fetching quotes");
  }
};


const fetchExpenses = async () => {
  try {
    const response = await API.get("/orders/expenses/all");
    setExpenses(response.data.expenses || []);
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
};

const handleOpenExpenseForm = (order) => {
  setExpenseOrder(order);
  setExpenseData({
    fuel: "",
    tollgate: "",
    maintenance: "",
    driverAllowance: "",
    loadingCost: "",
    offloadingCost: "",
    otherDescription: "",
    zimTolls: "",
    mozaTolls: "",
    roadAccess: "",
    vidCosts: "",
    emaCosts: "",
    portHealth: "",
    portFee: "",
    agentRunner: "",
    otherCost: "",
  });
  setShowExpenseForm(true);
};

const handleSubmitExpense = async (e) => {
  e.preventDefault();

  try {
    await API.post(`/orders/${expenseOrder.id}/expenses`, expenseData);

    toast.success("Expenses added successfully!");
    setShowExpenseForm(false);
    setExpenseOrder(null);

    fetchExpenses();
    fetchOrders();
  } catch (error) {
    toast.error(error.response?.data?.message || "Error adding expenses");
  }
};










const handleDownloadExpensePDF = async (orderId) => {
  const response = await API.get(`/orders/${orderId}/expenses/pdf`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `order_${orderId}_expenses.pdf`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};



const getExpenseTotal = (expense) => {
  return (
    Number(expense.fuel || 0) +
    Number(expense.tollgate || 0) +
    Number(expense.maintenance || 0) +
    Number(expense.driverAllowance || 0) +
    Number(expense.loadingCost || 0) +
    Number(expense.offloadingCost || 0) +
    Number(expense.zimTolls || 0) +
    Number(expense.mozaTolls || 0) +
    Number(expense.roadAccess || 0) +
    Number(expense.vidCosts || 0) +
    Number(expense.emaCosts || 0) +
    Number(expense.portHealth || 0) +
    Number(expense.portFee || 0) +
    Number(expense.agentRunner || 0) +
    Number(expense.otherCost || 0)
  );
};

const renderJourneyUpdates = (order, compact = false) => {
  const updates = order.statusUpdates || [];

  if (!updates.length) {
    return (
      <span className="text-xs text-sky-200">
        No journey updates
      </span>
    );
  }

  const visibleUpdates = compact ? updates.slice(0, 3) : updates;

  return (
    <div className={compact ? "max-h-32 space-y-2 overflow-y-auto" : "max-h-44 space-y-2 overflow-y-auto"}>
      {visibleUpdates.map((update) => (
        <div
          key={update.id}
          className="rounded-md border border-white/10 bg-white/10 p-2 text-xs"
        >
          <div className="flex items-start gap-2">
            <Route size={14} className="mt-0.5 shrink-0 text-sky-300" />

            <div className="min-w-0">
              <p className="font-bold text-white">
                {update.title || update.status?.replaceAll("_", " ") || "Journey update"}
              </p>

              {update.locationName && (
                <p className="mt-1 text-sky-200">
                  📍 {update.locationName}
                </p>
              )}

              {update.note && (
                <p className="mt-1 text-sky-200">
                  {update.note}
                </p>
              )}

              <p className="mt-1 text-[11px] text-sky-300">
                {update.updatedByUser?.username || "System"} • {update.createdAt ? new Date(update.createdAt).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      ))}

      {compact && updates.length > 3 && (
        <p className="text-[11px] font-semibold text-sky-200">
          +{updates.length - 3} more updates
        </p>
      )}
    </div>
  );
};


const handleOpenQuote = async (quote) => {
  console.log("Opening quote:", quote);

  setSelectedQuote(quote);

  setQuoteReplyData({
    estimatedPrice: quote.estimatedPrice || "",
  });

  setShowQuoteModal(true);

  if (quote.status === "pending") {
    try {
      await API.put(`/quotes/${quote.id}/open`);
      fetchQuotes();
    } catch (error) {
      console.error("Error opening quote:", error);
    }
  }
};

const handleSubmitQuotePrice = async (e) => {
  e.preventDefault();

  try {
    await API.put(`/quotes/${selectedQuote.id}/price`, quoteReplyData);

    toast.success("Quote submitted successfully!");
    setShowQuoteModal(false);
    setSelectedQuote(null);
    fetchQuotes();
  } catch (error) {
    console.error("Error submitting quote:", error);
    toast.error(error.response?.data?.message || "Error submitting quote");
  }
};

const getFilteredQuotes = () => {
  const q = getActiveSearch();

  return quotes.filter((quote) =>
    matchesSearch(
      [
        quote.id,
        quote.pickupCity,
        quote.deliveryCity,
        quote.goodsType,
        quote.preferredService,
        quote.estimatedPrice,
        quote.status,
        quote.customer?.username,
        quote.customer?.email,
        quote.customer?.phone,
        quote.order?.id,
        quote.order?.orderNumber,
        quote.order?.status,
      ],
      q
    )
  );
};

const getFilteredExpenses = () => {
  const q = getActiveSearch();

  return expenses.filter((expense) =>
    matchesSearch(
      [
        expense.id,
        expense.orderId,
        expense.order?.id,
        expense.order?.orderNumber,
        expense.order?.pickupLocation,
        expense.order?.deliveryLocation,
        expense.order?.customer?.username,
        expense.order?.customer?.email,
        expense.order?.driver?.username,
        expense.order?.driver?.email,
        expense.order?.truck?.truckName,
        expense.order?.truck?.licensePlate,
        expense.fuel,
        expense.tollgate,
        expense.maintenance,
        expense.driverAllowance,
        expense.loadingCost,
        expense.offloadingCost,
        expense.zimTolls,
        expense.mozaTolls,
        expense.roadAccess,
        expense.vidCosts,
        expense.emaCosts,
        expense.portHealth,
        expense.portFee,
        expense.agentRunner,
        expense.otherDescription,
        expense.otherCost,
        getExpenseTotal(expense),
      ],
      q
    )
  );
};

const getFilteredTrucks = () => {
  const q = getActiveSearch();

  return trucks.filter((truck) =>
    matchesSearch(
      [
        truck.id,
        truck.truckName,
        truck.licensePlate,
        truck.capacity,
        truck.description,
        truck.isAvailable ? "available ready" : "on trip booked",
        truck.assignedDriver?.username,
        truck.assignedDriver?.email,
        truck.assignedDriver?.phone,
      ],
      q
    )
  );
};

const getFilteredDrivers = () => {
  const q = getActiveSearch();

  return drivers.filter((driver) =>
    matchesSearch(
      [
        driver.id,
        driver.username,
        driver.email,
        driver.phone,
        driver.address,
        driver.isAvailable ? "available ready" : "on trip booked",
        driver.assignedTruck?.truckName,
        driver.assignedTruck?.licensePlate,
        driver.assignedTruck?.capacity,
        (driver.driverOrders || []).map((order) => [
          order.id,
          order.orderNumber,
          order.status,
          order.pickupLocation,
          order.deliveryLocation,
          order.customer?.username,
        ]),
      ],
      q
    )
  );
};

  const handleAddTruck = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/trucks", {
        truckName: truckData.truckName,
        licensePlate: truckData.licensePlate,
        capacity: truckData.capacity,
        description: truckData.description,
        assignedDriverId: truckData.assignedDriverId,
      });

      const truckId = response.data.truck.id;

      if (truckData.imageFile) {
        const formData = new FormData();
        formData.append("image", truckData.imageFile);

        await API.post(`/trucks/${truckId}/upload-image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Truck added successfully!");
      setShowTruckForm(false);
      fetchTrucks();
      fetchDashboardStats();

      setTruckData({
        truckName: "",
        licensePlate: "",
        capacity: "",
        description: "",
        assignedDriverId: "",
        imageFile: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding truck");
    }
  };

  const handleEditTruck = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/trucks/${editingTruck.id}`, {
        truckName: editingTruck.truckName,
        licensePlate: editingTruck.licensePlate,
        capacity: editingTruck.capacity,
        description: editingTruck.description,
      });

      toast.success("Truck updated successfully!");
      setShowEditTruckForm(false);
      fetchTrucks();
      fetchDashboardStats();
    } catch (error) {
      toast.error("Error updating truck");
    }
  };

  const handleDeleteTruck = async (truckId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this truck? This action cannot be undone."
      )
    ) {
      try {
        await API.delete(`/trucks/${truckId}`);
        toast.success("Truck deleted successfully!");
        fetchTrucks();
        fetchDashboardStats();
      } catch (error) {
        toast.error("Error deleting truck");
      }
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("username", driverData.username);
      formData.append("email", driverData.email);
      formData.append("password", driverData.password);
      formData.append("phone", driverData.phone);
      formData.append("address", driverData.address);

      if (driverData.profileImage) {
        formData.append("profileImage", driverData.profileImage);
      }

      await API.post("/users/drivers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Driver added successfully!");
      setShowDriverForm(false);

      setDriverData({
        username: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        profileImage: null,
      });

      fetchDrivers();
      fetchDashboardStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding driver");
    }
  };

  const handleEditDriver = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("username", editingDriver.username);
      formData.append("email", editingDriver.email);
      formData.append("phone", editingDriver.phone || "");
      formData.append("address", editingDriver.address || "");
      formData.append("isAvailable", editingDriver.isAvailable);

      if (editingDriver.newProfileImage) {
        formData.append("profileImage", editingDriver.newProfileImage);
      }

      await API.put(`/users/drivers/${editingDriver.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Driver updated successfully!");
      setShowEditDriverForm(false);
      setEditingDriver(null);
      fetchDrivers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating driver");
    }
  };

  const handleApproveOrder = (order) => {
    setSelectedOrder(order);

    setApprovalData({
      price: order.price || "",
      driverId: order.driverId || "",
      departureTime: order.departureTime ? order.departureTime.slice(0, 16) : "",
      forecastedArrival: order.forecastedArrival
        ? order.forecastedArrival.slice(0, 16)
        : "",
    });

    setShowApproveModal(true);
  };

  const submitApproval = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/orders/${selectedOrder.id}/approve`, {
        price: approvalData.price,
        driverId: approvalData.driverId,
        departureTime: approvalData.departureTime,
        forecastedArrival: approvalData.forecastedArrival,
      });
      toast.success("Order approved successfully!");
      setShowApproveModal(false);
      fetchOrders();
      fetchDashboardStats();
      fetchTrucks();
      fetchDrivers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error approving order");
    }
  };

  const handleApproveLoading = async (orderId) => {
    try {
      await API.post(`/admin/orders/${orderId}/approve-loading`);
      toast.success("Loading approved! Order is now in transit.");
      fetchOrders();
      fetchDashboardStats();
    } catch (error) {
      toast.error("Error approving loading");
    }
  };

  const handleApproveOffloading = async (orderId) => {
    try {
      await API.post(`/admin/orders/${orderId}/approve-offloading`);
      toast.success("Offloading approved! Order completed.");
      fetchOrders();
      fetchDashboardStats();
      fetchTrucks();
      fetchDrivers();
    } catch (error) {
      toast.error("Error approving offloading");
    }
  };

  const handleRejectLoading = async () => {
    if (!selectedOrder) return;

    try {
      await API.post(`/admin/orders/${selectedOrder.id}/reject-loading`, {
        reason: rejectionReason,
      });

      toast.success("Loading document rejected. Driver has been asked to re-upload.");

      setShowRejectLoadingModal(false);
      setSelectedOrder(null);
      setRejectionReason("");

      fetchOrders();
      fetchDashboardStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error rejecting loading document");
    }
  };

  const handleRejectOffloading = async () => {
    if (!selectedOrder) return;

    try {
      await API.post(`/admin/orders/${selectedOrder.id}/reject-offloading`, {
        reason: rejectionReason,
      });

      toast.success("Offloading/POD document rejected. Driver has been asked to re-upload.");

      setShowRejectOffloadingModal(false);
      setSelectedOrder(null);
      setRejectionReason("");

      fetchOrders();
      fetchDashboardStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error rejecting POD document");
    }
  };

  const closeRejectModal = () => {
    setShowRejectLoadingModal(false);
    setShowRejectOffloadingModal(false);
    setSelectedOrder(null);
    setRejectionReason("");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      approved: "bg-blue-100 text-blue-800 border border-blue-200",
      en_route_to_loading: "bg-cyan-100 text-cyan-800 border border-cyan-200",
      loading: "bg-purple-100 text-purple-800 border border-purple-200",
      loading_rejected: "bg-red-100 text-red-800 border border-red-200",
      loading_approved: "bg-purple-100 text-purple-800 border border-purple-200",
      in_transit: "bg-indigo-100 text-indigo-800 border border-indigo-200",
      arrived_at_destination: "bg-sky-100 text-sky-800 border border-sky-200",
      waiting_to_offload: "bg-orange-100 text-orange-800 border border-orange-200",
      offloading: "bg-orange-100 text-orange-800 border border-orange-200",
      offloading_rejected: "bg-red-100 text-red-800 border border-red-200",
      offloading_approved: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      delivered: "bg-green-100 text-green-800 border border-green-200",
      customer_confirmed: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
    };

    return colors[status] || "bg-slate-100 text-slate-800 border border-slate-200";
  };

  const getQuoteStatusColor = (status) => {
  const colors = {
    pending: "bg-blue-100 text-blue-700 border border-blue-200",
    open: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    closed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };

  return colors[status] || colors.pending;
};

  const orderTabs = [
    {
      key: "all",
      label: "All Orders",
      icon: ListFilter,
      count: orders.length,
    },
    {
      key: "pending",
      label: "Pending",
      icon: Clock,
      count: orders.filter((o) => o.approvalStatus === "pending").length,
    },
    {
      key: "loading",
      label: "Loading",
      icon: Loader,
      count: orders.filter((o) => o.status === "loading" && !o.loadingApproved)
        .length,
    },
    {
      key: "loading_rejected",
      label: "Loading Rejected",
      icon: XCircle,
      count: orders.filter((o) => o.status === "loading_rejected").length,
    },
    {
      key: "in_transit",
      label: "In Transit",
      icon: Route,
      count: orders.filter((o) => o.status === "in_transit").length,
    },
    {
      key: "offloading",
      label: "Offloading",
      icon: ClipboardCheck,
      count: orders.filter(
        (o) => o.status === "offloading" && !o.offloadingApproved
      ).length,
    },
    {
      key: "offloading_rejected",
      label: "POD Rejected",
      icon: XCircle,
      count: orders.filter((o) => o.status === "offloading_rejected").length,
    },
    {
      key: "delivered",
      label: "Completed",
      icon: CheckCircle2,
      count: orders.filter((o) => o.status === "delivered").length,
    },
  ];

  const inputClass =
    "w-full rounded-2xl border-2 border-sky-200 bg-white/90 px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-500 focus:border-blue-700";

  const labelClass = "mb-2 block font-bold text-blue-950";

  const primaryButton =
    "rounded-2xl bg-gradient-to-r from-blue-950 via-sky-600 to-blue-800 px-5 py-3 font-bold text-white shadow-lg shadow-blue-950/20 transition hover:opacity-90";

  const cancelButton =
    "rounded-2xl border-2 border-sky-200 bg-white px-5 py-3 font-bold text-blue-950 transition hover:bg-sky-100";

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    return `$${amount.toFixed(2)}`;
  };

  const weeklyRevenue = (stats?.finances?.weeklyRevenue || stats?.finances?.revenueByWeek || []).map(
    (week, index) => ({
      ...week,
      label: week.label || week.week || `Week ${index + 1}`,
      shortLabel: week.shortLabel || week.week || week.label || `W${index + 1}`,
      orders: week.orders || 0,
    })
  );
  const highestRevenueWeekRaw = stats?.finances?.highestRevenueWeek || null;
  const highestRevenueWeek = highestRevenueWeekRaw
    ? {
        ...highestRevenueWeekRaw,
        label: highestRevenueWeekRaw.label || highestRevenueWeekRaw.week,
        shortLabel: highestRevenueWeekRaw.shortLabel || highestRevenueWeekRaw.week,
        orders: highestRevenueWeekRaw.orders || 0,
      }
    : null;
  const maxWeeklyRevenue = Math.max(
    ...weeklyRevenue.map((week) => Number(week.revenue || 0)),
    1
  );

  return (
    <DashboardLayout
      user={user}
      logout={logout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title="Admin Panel"
      globalSearch={globalSearch}
      setGlobalSearch={setGlobalSearch}
      menuItems={[
        { key: "dashboard", label: "Dashboard" },
        { key: "orders", label: "Orders" },
        { key: "trucks", label: "Trucks" },
        { key: "drivers", label: "Drivers" },
        { key: "quotes", label: "Quotes" },
        { key: "expenses", label: "Expenses" },
      ]}
    >
      <div className="space-y-8">
        {activeTab === "dashboard" && stats && (
  <div className="space-y-8">
    <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-5 text-white shadow-xl sm:p-6">
      <h2 className="text-3xl font-black sm:text-4xl">
        Welcome back, {user?.username}
      </h2>

      <p className="mt-2 text-sm font-medium text-sky-100 sm:text-base">
        Here is the latest overview of your logistics system.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {[
        {
          title: "Total Trucks",
          value: stats.trucks?.total || 0,
          subtitle: `Available: ${stats.trucks?.available || 0} | In Use: ${
            stats.trucks?.inUse || 0
          }`,
          icon: Truck,
          bgColor: "bg-blue-500/10",
          textColor: "text-blue-300",
        },
        {
          title: "Total Drivers",
          value: stats.drivers || 0,
          subtitle: "Registered drivers",
          icon: Users,
          bgColor: "bg-emerald-500/10",
          textColor: "text-emerald-300",
        },
        {
          title: "Total Customers",
          value: stats.customers || 0,
          subtitle: "Registered customers",
          icon: UserRound,
          bgColor: "bg-purple-500/10",
          textColor: "text-purple-300",
        },
      ].map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 text-white shadow-xl transition duration-200 hover:border-white/40"
          >
            <div className="p-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-sm font-medium text-sky-100">
                    {card.title}
                  </p>

                  <p className="text-3xl font-black text-white sm:text-4xl">
                    {card.value}
                  </p>

                  <p className="mt-1 text-xs font-medium text-sky-200">
                    {card.subtitle}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${card.bgColor}`}>
                  <Icon size={22} className={card.textColor} />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 text-white shadow-xl transition duration-200 hover:border-white/40 sm:col-span-2 xl:col-span-1">
        <div className="p-6 py-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-sm font-medium text-sky-100">
                Revenue
              </p>

              <p className="text-3xl font-black text-white sm:text-4xl">
                {formatCurrency(stats.finances?.totalRevenue)}
              </p>

              <p className="mt-1 text-xs font-medium text-sky-200">
                Pending: {formatCurrency(stats.finances?.pendingPayments)}
              </p>
            </div>

            <div className="rounded-xl bg-orange-500/10 p-3">
              <DollarSign size={22} className="text-orange-300" />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-sky-100">
                Last 5 Weeks
              </p>

              <p className="text-[11px] font-semibold text-orange-200">
                Highest: {highestRevenueWeek?.label || "N/A"}
              </p>
            </div>

            <div className="flex h-24 items-end gap-2">
              {weeklyRevenue.length > 0 ? (
                weeklyRevenue.map((week, index) => {
                  const barHeight = Math.max(
                    8,
                    (Number(week.revenue || 0) / maxWeeklyRevenue) * 100
                  );

                  const isHighest =
                    highestRevenueWeek && week.label === highestRevenueWeek.label;

                  return (
                    <div
                      key={`${week.label}-${index}`}
                      className="flex flex-1 flex-col items-center gap-2"
                      title={`${week.label}: ${formatCurrency(week.revenue)}`}
                    >
                      <div className="flex h-16 w-full items-end rounded-lg bg-white/10 px-1">
                        <div
                          className={`w-full rounded-md ${
                            isHighest
                              ? "bg-orange-300"
                              : "bg-gradient-to-t from-sky-400 to-white"
                          }`}
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>

                      <span className="text-[10px] font-bold text-sky-100">
                        {week.shortLabel || `W${index + 1}`}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-sky-200">
                  No revenue data yet
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-sky-200">
              <span>
                Best: {formatCurrency(highestRevenueWeek?.revenue)}
              </span>
              <span>{highestRevenueWeek?.orders || 0} orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-6 text-white shadow-xl transition duration-200 hover:border-white/40">
        <h3 className="text-xl font-black text-white">
          Order Status Overview
        </h3>

        <p className="mt-1 text-sm font-medium text-sky-100">
          Current order distribution
        </p>

        <div className="mt-8 flex flex-col items-center">
          {(() => {
            const pending = stats.orders?.pending || 0;
            const loading = stats.orders?.loadingPending || 0;
            const transit = stats.orders?.inTransit || 0;
            const offloading = stats.orders?.offloadingPending || 0;
            const completed = stats.orders?.completed || 0;

            const total =
              pending + loading + transit + offloading + completed || 1;

            const p1 = (pending / total) * 100;
            const p2 = p1 + (loading / total) * 100;
            const p3 = p2 + (transit / total) * 100;
            const p4 = p3 + (offloading / total) * 100;

            return (
              <div
                className="relative flex h-52 w-52 items-center justify-center rounded-full sm:h-56 sm:w-56"
                style={{
                  background: `conic-gradient(
                    #facc15 0% ${p1}%,
                    #a855f7 ${p1}% ${p2}%,
                    #38bdf8 ${p2}% ${p3}%,
                    #f97316 ${p3}% ${p4}%,
                    #22c55e ${p4}% 100%
                  )`,
                }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/20 bg-blue-950 shadow-inner">
                  <p className="text-4xl font-black text-white">{total}</p>
                  <p className="text-xs font-bold uppercase text-sky-200">
                    Total
                  </p>
                </div>
              </div>
            );
          })()}

          <div className="mt-8 grid grid-cols-2 gap-4 text-sm font-semibold text-sky-100">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              Pending
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-purple-500" />
              Loading
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-sky-400" />
              In Transit
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500" />
              Offloading
            </div>

            <div className="col-span-2 flex items-center justify-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              Completed
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-6 text-white shadow-xl transition duration-200 hover:border-white/40 xl:col-span-2">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white">Recent Orders</h3>

            <p className="mt-1 text-sm font-medium text-sky-100">
              Latest 5 orders
            </p>
          </div>

          <div className="rounded-xl bg-blue-500/10 p-3">
            <PackageCheck className="text-blue-300" size={24} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-white/20">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead className="bg-white/10 text-sky-100">
              <tr>
                <th className="px-4 py-4">ORDER</th>
                <th className="px-4 py-4">CUSTOMER</th>
                <th className="px-4 py-4">FROM</th>
                <th className="px-4 py-4">TO</th>
                <th className="px-4 py-4">STATUS</th>
                <th className="px-4 py-4">DATE</th>
                <th className="px-4 py-4">LOCATION UPDATES</th>
                <th className="px-4 py-4">JOURNEY UPDATES</th>
              </tr>
            </thead>

            <tbody>
              {getRecentOrders().length > 0 ? (
  getRecentOrders().map((order) => (
                 <tr
  key={order.id}
  className="border-t border-white/10 text-sky-50 transition hover:bg-white/10"
>
  <td className="px-4 py-4 font-black text-white">{order.orderNumber || `#${order.id}`}</td>

  <td className="px-4 py-4">
    {order.customer?.username || "N/A"}
  </td>

  <td className="px-4 py-4">
    {order.pickupLocation || "N/A"}
  </td>

  <td className="px-4 py-4">
    {order.deliveryLocation || "N/A"}
  </td>

  <td className="px-4 py-4">
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${getStatusColor(
        order.status
      )}`}
    >
      {order.status?.replace("_", " ").toUpperCase() || "PENDING"}
    </span>
  </td>

  <td className="px-4 py-4 text-sky-100">
    {order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : "N/A"}
  </td>

  <td className="min-w-[260px] px-4 py-4">
    <div className="max-h-32 space-y-2 overflow-y-auto">
      {order.locations?.length > 0 ? (
        order.locations.map((location) => (
          <div
            key={location.id}
            className="rounded-md border border-white/10 bg-white/10 p-2 text-xs"
          >
            <div className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-sky-300" />

              <div>
                <p className="font-bold text-white">
                  {location.locationName}
                </p>

                <p className="text-sky-200">
                  {new Date(location.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <span className="text-xs text-sky-200">No location updates</span>
      )}
    </div>
  </td>

  <td className="min-w-[300px] px-4 py-4">
    {renderJourneyUpdates(order, true)}
  </td>
</tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center font-semibold text-sky-100"
                  >
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}

{activeTab === "orders" && (
  <div>
    {/* TOP RIGHT BUTTON */}
    <div className="mb-5 flex justify-end">
      <button
        onClick={() => setShowMultiTruckForm(true)}
        className="flex items-center justify-center gap-2 rounded-lg border border-blue-950 px-5 py-2 text-sm font-semibold text-blue transition bg-blue hover:border-blue-500 hover:bg-blue-700 hover:text-white"
      >
        + Create Order
      </button>
    </div>

    {/* CARD */}
    <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-4 text-white shadow-xl sm:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            Order Management
          </h2>

          <p className="mt-1 text-sm font-medium text-sky-100">
            Manage approvals, loading, transit and completed shipments.
          </p>
        </div>
      </div>

      <div className="mb-6 overflow-x-auto pb-2">
        <div className="inline-flex min-w-max overflow-hidden rounded-xl border border-white/20 bg-white/10">
          {orderTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-3 border-r border-white/10 px-5 py-3 font-bold transition last:border-r-0 ${
                  isActive
                    ? "bg-white text-blue-950"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Icon size={18} />

                <span>{tab.label}</span>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-blue-950 text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xl">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by order number, customer, pickup, delivery, truck, driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/20 bg-white px-11 text-blue-950 outline-none placeholder:text-slate-500 focus:border-sky-400"
          />
        </div>

        <button
          onClick={() => {
            setStatusFilter("all");
            setSearchTerm("");
            setGlobalSearch("");
          }}
          className="flex items-center justify-center gap-2 rounded-lg border border-white px-5 py-2 text-sm font-semibold text-white transition hover:border-blue-500 hover:bg-blue-700 hover:text-white"
        >
          <XCircle size={18} />
          Clear
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border border-white/20">
        <table className="w-full min-w-[2050px] text-left text-sm">
          <thead className="bg-white/10 text-sky-100">
            <tr>
              <th className="px-4 py-4">ORDER</th>
              <th className="px-4 py-4">CUSTOMER</th>
              <th className="px-4 py-4">ROUTE</th>
              <th className="px-4 py-4">GOODS</th>
              <th className="px-4 py-4">WEIGHT</th>
              <th className="px-4 py-4">PRICE</th>
              <th className="px-4 py-4">STATUS</th>
              <th className="px-4 py-4">DRIVER/TRUCK</th>
              <th className="px-4 py-4">SCHEDULE</th>
              <th className="px-4 py-4">EXPENSES</th>
              <th className="px-4 py-4">ACTIONS</th>
              <th className="px-4 py-4">LOCATION UPDATES</th>
              <th className="px-4 py-4">JOURNEY UPDATES</th>
            </tr>
          </thead>

          <tbody>
            {getFilteredOrders().length === 0 ? (
              <tr>
                <td
                  colSpan="13"
                  className="px-4 py-10 text-center font-semibold text-sky-100"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              getFilteredOrders().map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-white/10 text-sky-50 transition hover:bg-white/10"
                >
                  <td className="px-4 py-4 font-black text-white">
                    {order.orderNumber || `#${order.id}`}
                    {order.packageNumber && (
                      <p className="mt-1 text-xs font-medium text-sky-200">
                        Package: {order.packageNumber}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">
                      {order.customer?.username || "N/A"}
                    </p>
                    <p className="text-xs text-sky-200">
                      {order.customer?.email || ""}
                    </p>
                  </td>

                  <td className="min-w-[240px] px-4 py-4">
                    <p>📍 {order.pickupLocation || "N/A"}</p>
                    <p className="mt-1 text-sky-200">
                      🎯 {order.deliveryLocation || "N/A"}
                    </p>
                  </td>

                  <td className="min-w-[160px] px-4 py-4">
                    {order.goodsDescription || "N/A"}
                  </td>

                  <td className="px-4 py-4">
                    {order.weight || "N/A"} kg
                  </td>

                  <td className="px-4 py-4 font-black text-green-300">
                    {order.price ? `$${order.price}` : "N/A"}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status?.replace("_", " ").toUpperCase() ||
                        "PENDING"}
                    </span>
                  </td>

                  <td className="min-w-[220px] px-4 py-4">
                    {order.driver ? (
                      <div>
                        <p className="font-semibold text-white">
                          👨‍✈️ {order.driver.username}
                        </p>
                        <p className="text-xs text-sky-200">
                          {order.driver.email}
                        </p>
                        <p className="text-xs text-sky-200">
                          {order.driver.phone}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sky-200">No driver</p>
                    )}

                    {order.truck && (
                      <div className="mt-2 rounded-md border border-white/10 bg-white/10 p-2 text-xs text-sky-100">
                        🚚 {order.truck.truckName || "Truck"} - {order.truck.licensePlate || "N/A"}
                      </div>
                    )}
                  </td>

                  <td className="min-w-[240px] px-4 py-4 text-sky-100">
                    <p>
                      Departure: {" "}
                      {order.departureTime
                        ? new Date(order.departureTime).toLocaleString()
                        : "N/A"}
                    </p>
                    <p className="mt-1">
                      ETA: {" "}
                      {order.forecastedArrival
                        ? new Date(order.forecastedArrival).toLocaleString()
                        : "N/A"}
                    </p>
                  </td>

                  <td className="min-w-[180px] px-4 py-4">
                    <button
                      onClick={() => handleOpenExpenseForm(order)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-orange-300 bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-200"
                    >
                      <ReceiptText size={15} />
                      Add Expenses
                    </button>
                  </td>

                  <td className="min-w-[320px] px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {order.approvalStatus === "pending" && (
                        <button
                          onClick={() => handleApproveOrder(order)}
                          className="flex items-center justify-center gap-2 rounded-lg border border-emerald-400 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-600 hover:text-white"
                        >
                          Approve & Set Price
                        </button>
                      )}

                      {order.status === "loading" && !order.loadingApproved && (
                        <>
                          {(order.loadingDocumentUrl ||
                            order.loadingDocument ||
                            order.loadingDocumentPath ||
                            order.loadingImageUrl) && (
                            <a
                              href={
                                order.loadingDocumentUrl ||
                                order.loadingDocument ||
                                order.loadingDocumentPath ||
                                order.loadingImageUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 rounded-lg border border-purple-300 bg-purple-100 px-4 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-200"
                            >
                              View Loading Doc
                            </a>
                          )}

                          <button
                            onClick={() => handleApproveLoading(order.id)}
                            className="flex items-center justify-center gap-2 rounded-lg border border-emerald-400 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-600 hover:text-white"
                          >
                            Approve Loading
                          </button>

                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setRejectionReason("");
                              setShowRejectLoadingModal(true);
                            }}
                            className="flex items-center justify-center gap-2 rounded-lg border border-red-400 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-600 hover:text-white"
                          >
                            Reject Loading
                          </button>
                        </>
                      )}

                      {order.status === "loading_rejected" && (
                        <div className="rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-xs font-semibold text-red-700">
                          Loading rejected. Waiting for driver to re-upload.
                          {order.loadingRejectionReason && (
                            <p className="mt-1 font-medium">
                              Reason: {order.loadingRejectionReason}
                            </p>
                          )}
                        </div>
                      )}

                      {order.status === "in_transit" && (
                        <div className="flex items-center justify-center gap-2 rounded-lg border border-blue-300 bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
                          Waiting for POD
                        </div>
                      )}

                      {order.status === "offloading" && !order.offloadingApproved && (
                        <>
                          {(order.offloadingDocumentUrl ||
                            order.offloadingDocument ||
                            order.offloadingDocumentPath ||
                            order.podDocumentUrl) && (
                            <a
                              href={
                                order.offloadingDocumentUrl ||
                                order.offloadingDocument ||
                                order.offloadingDocumentPath ||
                                order.podDocumentUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 rounded-lg border border-orange-300 bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-200"
                            >
                              View POD
                            </a>
                          )}

                          <button
                            onClick={() => handleApproveOffloading(order.id)}
                            className="flex items-center justify-center gap-2 rounded-lg border border-emerald-400 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-600 hover:text-white"
                          >
                            Approve Offloading
                          </button>

                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setRejectionReason("");
                              setShowRejectOffloadingModal(true);
                            }}
                            className="flex items-center justify-center gap-2 rounded-lg border border-red-400 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-600 hover:text-white"
                          >
                            Reject POD
                          </button>
                        </>
                      )}

                      {order.status === "offloading_rejected" && (
                        <div className="rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-xs font-semibold text-red-700">
                          POD rejected. Waiting for driver to re-upload.
                          {order.offloadingRejectionReason && (
                            <p className="mt-1 font-medium">
                              Reason: {order.offloadingRejectionReason}
                            </p>
                          )}
                        </div>
                      )}

                      {order.status === "delivered" && (
                        <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700">
                          Completed
                        </div>
                      )}

                      {order.status === "approved" && (
                        <div className="flex items-center justify-center gap-2 rounded-lg border border-yellow-300 bg-yellow-100 px-4 py-2 text-xs font-semibold text-yellow-700">
                          Waiting for Driver Loading
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="min-w-[300px] px-4 py-4">
                    <div className="max-h-32 space-y-2 overflow-y-auto">
                      {order.locations?.length > 0 ? (
                        order.locations.map((location) => (
                          <div
                            key={location.id}
                            className="rounded-md border border-white/10 bg-white/10 p-2 text-xs"
                          >
                            <div className="flex items-start gap-2">
                              <MapPin
                                size={14}
                                className="mt-0.5 shrink-0 text-sky-300"
                              />

                              <div>
                                <p className="font-bold text-white">
                                  {location.locationName}
                                </p>
                                <p className="text-sky-200">
                                  {new Date(location.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-sky-200">
                          No location updates
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="min-w-[340px] px-4 py-4">
                    {renderJourneyUpdates(order)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{activeTab === "quotes" && (
  <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-4 text-white shadow-xl sm:p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-black text-white sm:text-3xl">
        Quote Requests
      </h2>

      <p className="mt-1 text-sm font-medium text-sky-100">
        View customer quote requests and submit prices.
      </p>
    </div>

    <div className="overflow-x-auto rounded-md border border-white/20">
      <table className="w-full min-w-[1050px] text-left text-sm">
        <thead className="bg-white/10 text-sky-100">
          <tr>
            <th className="px-4 py-4">QUOTE</th>
            <th className="px-4 py-4">CUSTOMER</th>
            <th className="px-4 py-4">PICKUP</th>
            <th className="px-4 py-4">DELIVERY</th>
            <th className="px-4 py-4">GOODS</th>
            <th className="px-4 py-4">SERVICE</th>
            <th className="px-4 py-4">STATUS</th>
            <th className="px-4 py-4">DATE</th>
            <th className="px-4 py-4">ACTION</th>
          </tr>
        </thead>

        <tbody>
          {getFilteredQuotes().length === 0 ? (
            <tr>
              <td
                colSpan="9"
                className="px-4 py-10 text-center font-semibold text-sky-100"
              >
                No quote requests found
              </td>
            </tr>
          ) : (
            getFilteredQuotes().map((quote) => (
              <tr
                key={quote.id}
                onClick={() => handleOpenQuote(quote)}
                className="cursor-pointer border-t border-white/10 text-sky-50 transition hover:bg-white/10"
              >
                <td className="px-4 py-4 font-black text-white">
                  #{quote.id}
                </td>

                <td className="px-4 py-4">
                  {quote.customer?.username || "N/A"}
                </td>

                <td className="px-4 py-4">
                  {quote.pickupCity || "N/A"}
                </td>

                <td className="px-4 py-4">
                  {quote.deliveryCity || "N/A"}
                </td>

                <td className="px-4 py-4">
                  {quote.goodsType || "N/A"}
                </td>

                <td className="px-4 py-4">
                  {quote.preferredService || "N/A"}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-medium ${getQuoteStatusColor(
                      quote.status
                    )}`}
                  >
                    {(quote.status || "pending").toUpperCase()}
                  </span>
                </td>

                <td className="px-4 py-4 text-sky-100">
                  {quote.createdAt
                    ? new Date(quote.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenQuote(quote);
                    }}
                    className="rounded-lg border border-white/40 px-4 py-2 text-xs font-semibold text-white transition hover:border-blue-500 hover:bg-blue-700"
                  >
                    Reply
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

{activeTab === "expenses" && (
  <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-4 text-white shadow-xl sm:p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-black text-white sm:text-3xl">
        Order Expenses
      </h2>

      <p className="mt-1 text-sm font-medium text-sky-100">
        View all expenses linked to orders, customers, trucks and drivers.
      </p>
    </div>

    <div className="overflow-x-auto rounded-md border border-white/20">
      <table className="w-full min-w-[2200px] text-left text-sm">
        <thead className="bg-white/10 text-sky-100">
          <tr>
            <th className="px-4 py-4">ORDER</th>
            <th className="px-4 py-4">CUSTOMER</th>
            <th className="px-4 py-4">DRIVER</th>
            <th className="px-4 py-4">TRUCK</th>
            <th className="px-4 py-4">FUEL</th>
            <th className="px-4 py-4">TOLLGATE</th>
            <th className="px-4 py-4">MAINTENANCE</th>
            <th className="px-4 py-4">ALLOWANCE</th>
            <th className="px-4 py-4">ZIM TOLLS</th>
            <th className="px-4 py-4">MOZA TOLLS</th>
            <th className="px-4 py-4">ROAD ACCESS</th>
            <th className="px-4 py-4">VID</th>
            <th className="px-4 py-4">EMA</th>
            <th className="px-4 py-4">PORT HEALTH</th>
            <th className="px-4 py-4">PORT FEE</th>
            <th className="px-4 py-4">AGENT/RUNNER</th>
            <th className="px-4 py-4">OTHER</th>
            <th className="px-4 py-4">TOTAL</th>
            <th className="px-4 py-4">PDF</th>
          </tr>
        </thead>

        <tbody>
          {getFilteredExpenses().length === 0 ? (
            <tr>
              <td
                colSpan="19"
                className="px-4 py-10 text-center font-semibold text-sky-100"
              >
                No expenses found
              </td>
            </tr>
          ) : (
            getFilteredExpenses().map((expense) => (
              <tr
                key={expense.id}
                className="border-t border-white/10 text-sky-50 transition hover:bg-white/10"
              >
                <td className="px-4 py-4 font-black text-white">
                  {expense.order?.orderNumber || `#${expense.order?.id || expense.orderId}`}
                </td>

                <td className="px-4 py-4">
                  {expense.order?.customer?.username || "N/A"}
                </td>

                <td className="px-4 py-4">
                  {expense.order?.driver?.username || "N/A"}
                </td>

                <td className="px-4 py-4">
                  {expense.order?.truck?.truckName || "N/A"}
                </td>

                <td className="px-4 py-4">${expense.fuel || 0}</td>
                <td className="px-4 py-4">${expense.tollgate || 0}</td>
                <td className="px-4 py-4">${expense.zimTolls || 0}</td>
                <td className="px-4 py-4">${expense.mozaTolls || 0}</td>
                <td className="px-4 py-4">${expense.roadAccess || 0}</td>
                <td className="px-4 py-4">${expense.vidCosts || 0}</td>
                <td className="px-4 py-4">${expense.emaCosts || 0}</td>
                <td className="px-4 py-4">${expense.portHealth || 0}</td>
                <td className="px-4 py-4">${expense.portFee || 0}</td>
                <td className="px-4 py-4">${expense.agentRunner || 0}</td>
                <td className="px-4 py-4">${expense.maintenance || 0}</td>
                <td className="px-4 py-4">${expense.driverAllowance || 0}</td>
                <td className="px-4 py-4">${expense.otherCost || 0}</td>

                <td className="px-4 py-4 font-black text-green-300">
                  ${getExpenseTotal(expense).toFixed(2)}
                </td>

                <td className="px-4 py-4">
                  <button
                    onClick={() =>
                      handleDownloadExpensePDF(expense.order?.id || expense.orderId)
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200"
                  >
                    <Download size={15} />
                    PDF
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

 {activeTab === "trucks" && (
  <div>
    {/* TOP RIGHT BUTTON */}
    <div className="mb-5 flex justify-end">
      <button
        onClick={() => setShowTruckForm(true)}
        className="flex items-center justify-center gap-2 rounded-lg border border-blue-950 px-5 py-2 text-sm font-semibold text-blue transition hover:border-blue-500 hover:bg-blue-700 hover:text-white"
      >
        + Add New Truck
      </button>
    </div>

    {/* CARD */}
    <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-4 text-white shadow-xl sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white sm:text-3xl">
          Truck Fleet
        </h2>

        <p className="mt-1 text-sm font-medium text-sky-100">
          Manage trucks, availability, images and assigned drivers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {getFilteredTrucks().map((truck) => {
          const isAvailable = truck.isAvailable;

          return (
            <div
              key={truck.id}
              className="overflow-hidden rounded-md border border-white/20 bg-white/10 text-white shadow-xl transition duration-200 hover:border-white/40 hover:bg-white/15"
            >
              <div className="h-72 w-full overflow-hidden bg-white/10 sm:h-80">
                {truck.imageUrl ? (
                  <img
                    src={truck.imageUrl}
                    alt={truck.truckName}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/10">
                    <span className="font-semibold text-sky-100">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-black text-white">
                      {truck.truckName}
                    </h3>

                    <p className="mt-1 text-sm text-sky-200">
                      Plate: {truck.licensePlate}
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center rounded px-2.5 py-1 text-xs font-medium ${
                      isAvailable
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isAvailable ? "Available" : "On Trip"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-white/10 bg-white/10 p-3">
                    <p className="text-xs font-medium text-sky-200">
                      Capacity
                    </p>
                    <p className="mt-1 font-bold text-white">
                      {truck.capacity || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-md border border-white/10 bg-white/10 p-3">
                    <p className="text-xs font-medium text-sky-200">
                      Status
                    </p>
                    <p className="mt-1 font-bold text-white">
                      {isAvailable ? "Ready" : "Booked"}
                    </p>
                  </div>
                </div>

                {truck.description && (
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-sky-100">
                    {truck.description}
                  </p>
                )}

                {truck.assignedDriver && (
                  <div className="mt-4 rounded-md border border-white/10 bg-white/10 p-4">
                    <p className="text-xs font-medium uppercase tracking-widest text-sky-200">
                      Assigned Driver
                    </p>

                    <p className="mt-2 font-bold text-white">
                      {truck.assignedDriver.username}
                    </p>

                    <p className="break-all text-sm text-sky-200">
                      {truck.assignedDriver.email}
                    </p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    onClick={() => {
                      setEditingTruck(truck);
                      setShowEditTruckForm(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-xs font-semibold text-white transition hover:border-blue-500 hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteTruck(truck.id)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-300/70 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}

{activeTab === "drivers" && (
  <div>
    {/* TOP RIGHT BUTTON */}
    <div className="mb-5 flex justify-end">
      <button
        onClick={() => setShowDriverForm(true)}
        className="flex items-center justify-center gap-2 rounded-lg border border-blue-950 px-5 py-2 text-sm font-semibold text-blue transition hover:border-blue-500 hover:bg-blue-700 hover:text-white"
      >
        + Add Driver
      </button>
    </div>

    {/* CARD */}
    <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-4 text-white shadow-xl sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white sm:text-3xl">
          Driver Profiles
        </h2>

        <p className="mt-1 text-sm font-medium text-sky-100">
          Manage drivers, assigned trucks, and current trip status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {getFilteredDrivers().map((driver) => {
          const activeOrder = driver.driverOrders?.[0];
          const isAvailable = driver.isAvailable;

          return (
            <div
              key={driver.id}
              className="overflow-hidden rounded-md border border-white/20 bg-white/10 text-white shadow-xl transition duration-200 hover:border-white/40 hover:bg-white/15"
            >
              <div className="relative h-72 w-full overflow-hidden bg-white/10 sm:h-80">
                {driver.profileImageUrl ? (
                  <img
                    src={driver.profileImageUrl}
                    alt={driver.username}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/10 text-6xl">
                    👤
                  </div>
                )}

                <div className="absolute left-4 top-4">
                  <span
                    className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-medium ${
                      isAvailable
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isAvailable ? "Available" : "On Trip"}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <h3 className="truncate text-xl font-black text-white">
                    {driver.username}
                  </h3>

                  <p className="break-all text-sm text-sky-200">
                    {driver.email}
                  </p>

                  <p className="mt-1 text-sm text-sky-200">
                    {driver.phone || "No phone number"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-white/10 bg-white/10 p-3">
                    <p className="text-xs font-medium text-sky-200">
                      Availability
                    </p>

                    <p className="mt-1 font-bold text-white">
                      {isAvailable ? "Ready" : "On Trip"}
                    </p>
                  </div>

                  <div className="rounded-md border border-white/10 bg-white/10 p-3">
                    <p className="text-xs font-medium text-sky-200">
                      Active Order
                    </p>

                    <p className="mt-1 font-bold text-white">
                      {activeOrder ? activeOrder.orderNumber || `#${activeOrder.id}` : "None"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-md border border-white/10 bg-white/10 p-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-sky-200">
                    Assigned Truck
                  </p>

                  {driver.assignedTruck ? (
                    <div className="mt-3 flex gap-3">
                      {driver.assignedTruck.imageUrl ? (
                        <img
                          src={driver.assignedTruck.imageUrl}
                          alt={driver.assignedTruck.truckName}
                          className="h-20 w-24 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-24 items-center justify-center rounded-md bg-white/10">
                          🚛
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-bold text-white">
                          {driver.assignedTruck.truckName}
                        </p>

                        <p className="text-sm text-sky-200">
                          Plate: {driver.assignedTruck.licensePlate}
                        </p>

                        <p className="text-sm text-sky-200">
                          Capacity: {driver.assignedTruck.capacity}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-sky-200">
                      No truck assigned
                    </p>
                  )}
                </div>

                <div className="mt-4 rounded-md border border-white/10 bg-white/10 p-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-sky-200">
                    Current Order
                  </p>

                  {activeOrder ? (
                    <div className="mt-2 text-sm text-sky-100">
                      <p className="font-bold text-white">
                        Order {activeOrder.orderNumber || `#${activeOrder.id}`}
                      </p>

                      <p>
                        Status:{" "}
                        {activeOrder.status?.replace("_", " ") || "N/A"}
                      </p>

                      <p>From: {activeOrder.pickupLocation || "N/A"}</p>

                      <p>To: {activeOrder.deliveryLocation || "N/A"}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-sky-200">
                      No active order currently
                    </p>
                  )}
                </div>

                <div className="mt-5 flex justify-end border-t border-white/10 pt-4">
                  <button
                    onClick={() => {
                      setEditingDriver(driver);
                      setShowEditDriverForm(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-xs font-semibold text-white transition hover:border-blue-500 hover:bg-blue-700"
                  >
                    Edit Driver
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}

        {showTruckForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/75 px-3 py-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-gradient-to-r from-blue-950 via-sky-500 to-blue-800 p-[4px] shadow-2xl">
              <div className="rounded-[24px] bg-gradient-to-r from-slate-100 via-sky-100 to-white p-5 sm:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-blue-950">
                      Add New Truck
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-600">
                      Register a new truck into the logistics fleet.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTruckForm(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleAddTruck} className="space-y-5">
                  <div>
                    <label className={labelClass}>Truck Name</label>
                    <input
                      type="text"
                      value={truckData.truckName}
                      onChange={(e) =>
                        setTruckData({ ...truckData, truckName: e.target.value })
                      }
                      placeholder="Enter truck name"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>License Plate</label>
                    <input
                      type="text"
                      value={truckData.licensePlate}
                      onChange={(e) =>
                        setTruckData({
                          ...truckData,
                          licensePlate: e.target.value,
                        })
                      }
                      placeholder="Enter license plate"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Capacity</label>
                    <input
                      type="text"
                      value={truckData.capacity}
                      onChange={(e) =>
                        setTruckData({ ...truckData, capacity: e.target.value })
                      }
                      placeholder="e.g. 25 tons"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={truckData.description}
                      onChange={(e) =>
                        setTruckData({
                          ...truckData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter truck description"
                      className={inputClass}
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Assign Driver</label>
                    <select
                      value={truckData.assignedDriverId}
                      onChange={(e) =>
                        setTruckData({
                          ...truckData,
                          assignedDriverId: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="">No driver assigned</option>
                      {drivers
                        .filter((driver) => !driver.assignedTruck)
                        .map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.username} - {driver.email}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="rounded-2xl border border-sky-200 bg-white/80 p-4">
                    <TruckImageUpload
                      onUpload={async (file) => {
                        setTruckData({ ...truckData, imageFile: file });
                      }}
                      currentImage={
                        truckData.imageFile
                          ? URL.createObjectURL(truckData.imageFile)
                          : null
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-sky-200 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowTruckForm(false)}
                      className={cancelButton}
                    >
                      Cancel
                    </button>

                    <button type="submit" className={primaryButton}>
                      Add Truck
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showEditTruckForm && editingTruck && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/75 px-3 py-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-gradient-to-r from-blue-950 via-sky-500 to-blue-800 p-[4px] shadow-2xl">
              <div className="rounded-[24px] bg-gradient-to-r from-slate-100 via-sky-100 to-white p-5 sm:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-blue-950">
                      Edit Truck
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-600">
                      Update truck details and fleet information.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowEditTruckForm(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleEditTruck} className="space-y-5">
                  <div>
                    <label className={labelClass}>Truck Name</label>
                    <input
                      type="text"
                      value={editingTruck.truckName}
                      onChange={(e) =>
                        setEditingTruck({
                          ...editingTruck,
                          truckName: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>License Plate</label>
                    <input
                      type="text"
                      value={editingTruck.licensePlate}
                      onChange={(e) =>
                        setEditingTruck({
                          ...editingTruck,
                          licensePlate: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Capacity</label>
                    <input
                      type="text"
                      value={editingTruck.capacity}
                      onChange={(e) =>
                        setEditingTruck({
                          ...editingTruck,
                          capacity: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={editingTruck.description || ""}
                      onChange={(e) =>
                        setEditingTruck({
                          ...editingTruck,
                          description: e.target.value,
                        })
                      }
                      className={inputClass}
                      rows="3"
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-sky-200 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowEditTruckForm(false)}
                      className={cancelButton}
                    >
                      Cancel
                    </button>

                    <button type="submit" className={primaryButton}>
                      Update Truck
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showApproveModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/75 px-3 py-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-gradient-to-r from-blue-950 via-sky-500 to-blue-800 p-[4px] shadow-2xl">
              <div className="rounded-[24px] bg-gradient-to-r from-slate-100 via-sky-100 to-white p-5 sm:p-6">
                <h2 className="mb-5 text-2xl font-black text-blue-950">
                  Approve Order #{selectedOrder.id}
                </h2>

                <form onSubmit={submitApproval} className="space-y-5">
                  <div>
                    <label className={labelClass}>Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={approvalData.price}
                      onChange={(e) =>
                        setApprovalData({
                          ...approvalData,
                          price: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Assign Driver</label>
                    <select
                      value={approvalData.driverId}
                      onChange={(e) =>
                        setApprovalData({
                          ...approvalData,
                          driverId: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    >
                      <option value="">Select Driver</option>
                      {drivers
                        .filter((d) => d.isAvailable !== false)
                        .map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.username} - {driver.email} (Available)
                          </option>
                        ))}
                    </select>
                  </div>

                  <p className="rounded-xl border border-sky-200 bg-white/70 p-3 text-sm font-semibold text-blue-950">
                    The truck will be selected automatically from the selected driver's assigned truck.
                  </p>

                  <div>
                    <label className={labelClass}>Departure Time</label>
                    <input
                      type="datetime-local"
                      value={approvalData.departureTime}
                      onChange={(e) =>
                        setApprovalData({
                          ...approvalData,
                          departureTime: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Forecasted Arrival Time
                    </label>
                    <input
                      type="datetime-local"
                      value={approvalData.forecastedArrival}
                      onChange={(e) =>
                        setApprovalData({
                          ...approvalData,
                          forecastedArrival: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-sky-200 pt-5 sm:flex-row">
                    <button type="submit" className={`${primaryButton} flex-1`}>
                      Approve Order
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowApproveModal(false)}
                      className={`${cancelButton} flex-1`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showQuoteModal && selectedQuote && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/70 px-3 py-4 backdrop-blur-sm">
    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-gradient-to-r from-blue-950 via-sky-500 to-blue-800 p-[4px] shadow-2xl">
      <div className="rounded-[24px] bg-gradient-to-r from-slate-100 via-sky-100 to-white p-5 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-blue-950">
              Quote #{selectedQuote.id}
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-600">
              Review customer request and submit quotation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowQuoteModal(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white"
          >
            ×
          </button>
        </div>

        <div className="mb-5 space-y-3 rounded-2xl border border-sky-200 bg-white/80 p-4 text-sm text-blue-950">
          <p>
            <span className="font-black">Customer:</span>{" "}
            {selectedQuote.customer?.username || "N/A"}
          </p>

          <p>
            <span className="font-black">Pickup:</span>{" "}
            {selectedQuote.pickupCity}
          </p>

          <p>
            <span className="font-black">Delivery:</span>{" "}
            {selectedQuote.deliveryCity}
          </p>

          <p>
            <span className="font-black">Goods:</span>{" "}
            {selectedQuote.goodsType}
          </p>

          <p>
            <span className="font-black">Preferred Service:</span>{" "}
            {selectedQuote.preferredService}
          </p>
        </div>

        <form
          onSubmit={handleSubmitQuotePrice}
          className="space-y-5"
        >
          <div>
            <label className={labelClass}>
              Estimated Price (USD)
            </label>

            <input
              type="number"
              step="0.01"
              required
              value={quoteReplyData.estimatedPrice}
              onChange={(e) =>
                setQuoteReplyData({
                  ...quoteReplyData,
                  estimatedPrice: e.target.value,
                })
              }
              className={inputClass}
              placeholder="Enter quotation amount"
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-sky-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowQuoteModal(false)}
              className={cancelButton}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={primaryButton}
            >
              Submit Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

        {showMultiTruckForm && (
          <MultiTruckOrderForm
            onClose={() => setShowMultiTruckForm(false)}
            onSuccess={() => {
              fetchOrders();
              fetchDashboardStats();
              fetchTrucks();
              fetchDrivers();
            }}
          />
        )}

        {showDriverForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/75 px-3 py-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-gradient-to-r from-blue-950 via-sky-500 to-blue-800 p-[4px] shadow-2xl">
              <div className="rounded-[24px] bg-gradient-to-r from-slate-100 via-sky-100 to-white p-5 sm:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-blue-950">
                      Add New Driver
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      Create a driver profile with contact details and profile
                      picture.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDriverForm(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddDriver} className="space-y-5">
                  <div>
                    <label className={labelClass}>Driver Name</label>
                    <input
                      type="text"
                      value={driverData.username}
                      onChange={(e) =>
                        setDriverData({
                          ...driverData,
                          username: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={driverData.email}
                      onChange={(e) =>
                        setDriverData({ ...driverData, email: e.target.value })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Password</label>
                    <input
                      type="password"
                      value={driverData.password}
                      onChange={(e) =>
                        setDriverData({
                          ...driverData,
                          password: e.target.value,
                        })
                      }
                      placeholder="dont leave blank"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="text"
                      value={driverData.phone}
                      onChange={(e) =>
                        setDriverData({ ...driverData, phone: e.target.value })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Address</label>
                    <textarea
                      value={driverData.address}
                      onChange={(e) =>
                        setDriverData({
                          ...driverData,
                          address: e.target.value,
                        })
                      }
                      className={inputClass}
                      rows="2"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Driver Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setDriverData({
                          ...driverData,
                          profileImage: e.target.files[0],
                        })
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-sky-200 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowDriverForm(false)}
                      className={cancelButton}
                    >
                      Cancel
                    </button>

                    <button type="submit" className={primaryButton}>
                      Save Driver
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}


        {showExpenseForm && expenseOrder && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/75 px-3 py-4 backdrop-blur-sm">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-gradient-to-r from-blue-950 via-sky-500 to-blue-800 p-[4px] shadow-2xl">
      <div className="rounded-[24px] bg-gradient-to-r from-slate-100 via-sky-100 to-white p-5 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-blue-950">
              Add Expenses - Order #{expenseOrder.id}
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-600">
              Add transport expenses for this order.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowExpenseForm(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmitExpense} className="space-y-5">
          {[
            ["fuel", "Fuel Cost"],
            ["tollgate", "Tollgate Cost"],
            ["maintenance", "Maintenance Cost"],
            ["driverAllowance", "Driver Allowance"],
            ["loadingCost", "Loading Cost"],
            ["offloadingCost", "Offloading Cost"],
            ["otherCost", "Other Cost"],
            ["zimTolls", "Zim Tolls"],
            ["mozaTolls", "Moza Tolls"],
            ["roadAccess", "Road Access"],
            ["vidCosts", "VID Costs"],
            ["emaCosts", "EMA Costs"],
            ["portHealth", "Port Health"],
            ["portFee", "Port Fee"],
            ["agentRunner", "Agent / Runner"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                type="number"
                step="0.01"
                value={expenseData[key]}
                onChange={(e) =>
                  setExpenseData({
                    ...expenseData,
                    [key]: e.target.value,
                  })
                }
                className={inputClass}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <div>
            <label className={labelClass}>Other Description</label>
            <textarea
              value={expenseData.otherDescription}
              onChange={(e) =>
                setExpenseData({
                  ...expenseData,
                  otherDescription: e.target.value,
                })
              }
              className={inputClass}
              rows="3"
              placeholder="Describe other expenses"
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-sky-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowExpenseForm(false)}
              className={cancelButton}
            >
              Cancel
            </button>

            <button type="submit" className={primaryButton}>
              Save Expenses
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

        {showEditDriverForm && editingDriver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/75 px-3 py-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-gradient-to-r from-blue-950 via-sky-500 to-blue-800 p-[4px] shadow-2xl">
              <div className="rounded-[24px] bg-gradient-to-r from-slate-100 via-sky-100 to-white p-5 sm:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-blue-950">
                      Edit Driver - {editingDriver.username}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      Update driver profile, picture, and availability.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowEditDriverForm(false);
                      setEditingDriver(null);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleEditDriver} className="space-y-5">
                  <div>
                    <label className={labelClass}>Driver Name</label>
                    <input
                      type="text"
                      value={editingDriver.username || ""}
                      onChange={(e) =>
                        setEditingDriver({
                          ...editingDriver,
                          username: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={editingDriver.email || ""}
                      onChange={(e) =>
                        setEditingDriver({
                          ...editingDriver,
                          email: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="text"
                      value={editingDriver.phone || ""}
                      onChange={(e) =>
                        setEditingDriver({
                          ...editingDriver,
                          phone: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Address</label>
                    <textarea
                      value={editingDriver.address || ""}
                      onChange={(e) =>
                        setEditingDriver({
                          ...editingDriver,
                          address: e.target.value,
                        })
                      }
                      className={inputClass}
                      rows="2"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Availability</label>
                    <select
                      value={String(editingDriver.isAvailable)}
                      onChange={(e) =>
                        setEditingDriver({
                          ...editingDriver,
                          isAvailable: e.target.value === "true",
                        })
                      }
                      className={inputClass}
                    >
                      <option value="true">Available</option>
                      <option value="false">On Trip / Unavailable</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Change Driver Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditingDriver({
                          ...editingDriver,
                          newProfileImage: e.target.files[0],
                        })
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-sky-200 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditDriverForm(false);
                        setEditingDriver(null);
                      }}
                      className={cancelButton}
                    >
                      Cancel
                    </button>

                    <button type="submit" className={primaryButton}>
                      Update Driver
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}


        {(showRejectLoadingModal || showRejectOffloadingModal) && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/75 px-3 py-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-gradient-to-r from-red-700 via-red-500 to-orange-500 p-[4px] shadow-2xl">
              <div className="rounded-[24px] bg-gradient-to-r from-slate-100 via-red-50 to-white p-5 sm:p-6">
                <div className="mb-5">
                  <h2 className="text-2xl font-black text-blue-950">
                    {showRejectLoadingModal
                      ? "Reject Loading Document"
                      : "Reject POD / Offloading Document"}
                  </h2>

                  <p className="mt-2 text-sm font-medium text-slate-600">
                    Order {selectedOrder.orderNumber || `#${selectedOrder.id}`} will be sent back to the driver for a clearer re-upload.
                  </p>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <p className="font-black">Default reason:</p>
                  <p className="mt-1">
                    {showRejectLoadingModal
                      ? "Loading proof image was not clear. Please re-upload a clear document/image."
                      : "Offloading/POD proof image was not clear. Please re-upload a clear document/image."}
                  </p>
                </div>

                <div className="mt-5">
                  <label className={labelClass}>Reason for rejection</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows="5"
                    placeholder={
                      showRejectLoadingModal
                        ? "Example: The loading image is blurry. Please upload a clearer image showing the goods properly."
                        : "Example: The POD image is unclear. Please upload a visible signed POD."
                    }
                    className={inputClass}
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-red-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeRejectModal}
                    className={cancelButton}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      showRejectLoadingModal
                        ? handleRejectLoading
                        : handleRejectOffloading
                    }
                    className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-700"
                  >
                    {showRejectLoadingModal ? "Reject Loading" : "Reject POD"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;