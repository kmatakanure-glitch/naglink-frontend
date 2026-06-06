import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../services/api";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";

import PrintableInvoice from "../../components/PrintableInvoice";
import RequestQuoteModal from "../../components/RequestQuoteModal";
import DashboardLayout from "../../components/DashboardLayout";

import {
  CalendarClock,
  ClipboardList,
  FileText,
  PackageCheck,
  PlusCircle,
  Truck,
  X,
  CheckCircle2,
} from "lucide-react";

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");

  const printRef = useRef();

  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printInvoice, setPrintInvoice] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);

  const [quoteData, setQuoteData] = useState({
    pickupCity: "",
    deliveryCity: "",
    goodsType: "",
    preferredService: "",
  });

  const [orderData, setOrderData] = useState({
    pickupLocation: "",
    deliveryLocation: "",
    goodsDescription: "",
    weight: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchQuotes();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders/my-orders");
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchQuotes = async () => {
    try {
      const response = await API.get("/quotes/my-quotes");
      setQuotes(response.data.quotes || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };

  const handleQuoteRequest = async (e) => {
    e.preventDefault();

    try {
      await API.post("/quotes", quoteData);

      toast.success("Quote requested successfully!");
      fetchQuotes();
      setShowQuoteForm(false);

      setQuoteData({
        pickupCity: "",
        deliveryCity: "",
        goodsType: "",
        preferredService: "",
      });
    } catch (error) {
      console.error("Quote request error:", error);

      toast.error(
        error.response?.data?.message ||
          error.response?.statusText ||
          "Error requesting quote"
      );
    }
  };

  const handleOrderCreation = async (e) => {
    e.preventDefault();

    try {
      await API.post("/orders", orderData);
      toast.success("Order created successfully!");
      setShowOrderForm(false);

      setOrderData({
        pickupLocation: "",
        deliveryLocation: "",
        goodsDescription: "",
        weight: "",
      });

      fetchOrders();
    } catch (error) {
      toast.error("Error creating order");
    }
  };

  const handleCustomerConfirmReceived = async (orderId) => {
    if (!window.confirm("Confirm that you received this delivery?")) {
      return;
    }

    try {
      await API.post(`/order-status-updates/${orderId}`, {
        status: "customer_confirmed",
        note: "Customer confirmed that the delivery was received.",
      });

      toast.success("Delivery confirmed successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Confirm delivery error:", error);
      toast.error(
        error.response?.data?.message || "Error confirming delivery"
      );
    }
  };

  const handlePrintInvoice = async (orderId) => {
    try {
      const response = await API.get(`/invoices/order/${orderId}`);
      const invoiceData = response.data.invoice;
      const order = orders.find((o) => o.id === orderId);

      setPrintInvoice(invoiceData);
      setPrintOrder(order);
      setShowPrintModal(true);
    } catch (error) {
      toast.error("Error loading invoice");
    }
  };

  const handleDownloadPDF = async (orderId) => {
    try {
      const response = await API.get(`/invoices/order/${orderId}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Invoice downloaded!");
    } catch (error) {
      toast.error("Error downloading invoice");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      approved: "bg-blue-100 text-blue-800 border border-blue-200",
      en_route_to_loading: "bg-cyan-100 text-cyan-800 border border-cyan-200",
      loading: "bg-purple-100 text-purple-800 border border-purple-200",
      loading_approved:
        "bg-purple-100 text-purple-800 border border-purple-200",
      in_transit: "bg-indigo-100 text-indigo-800 border border-indigo-200",
      arrived_at_destination:
        "bg-sky-100 text-sky-800 border border-sky-200",
      waiting_to_offload:
        "bg-orange-100 text-orange-800 border border-orange-200",
      offloading: "bg-orange-100 text-orange-800 border border-orange-200",
      offloading_approved:
        "bg-emerald-100 text-emerald-800 border border-emerald-200",
      delivered: "bg-green-100 text-green-800 border border-green-200",
      customer_confirmed:
        "bg-emerald-100 text-emerald-800 border border-emerald-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
    };

    return (
      colors[status] || "bg-slate-100 text-slate-800 border border-slate-200"
    );
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending",
      approved: "Approved",
      en_route_to_loading: "En Route To Loading",
      loading: "Loading",
      loading_approved: "Loading Approved",
      in_transit: "In Transit",
      arrived_at_destination: "Arrived At Destination",
      waiting_to_offload: "Waiting To Offload",
      offloading: "Offloading",
      offloading_approved: "Offloading Approved",
      delivered: "Delivered",
      customer_confirmed: "Customer Confirmed",
      cancelled: "Cancelled",
    };

    return labels[status] || "Pending";
  };

  const getQuoteStatusColor = (status) => {
    const colors = {
      pending: "bg-blue-100 text-blue-700 border border-blue-200",
      open: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      closed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    };

    return colors[status] || colors.pending;
  };

  const normalizeText = (value) =>
  String(value || "").toLowerCase().replaceAll("_", " ").trim();

 const getFilteredOrders = () => {
  const q = normalizeText(globalSearch);

  if (!q) return orders;

  return orders.filter((order) => {
    const searchableText = [
      order.id,
      order.orderNumber,
      order.pickupLocation,
      order.deliveryLocation,
      order.goodsDescription,
      order.weight,
      order.price,
      order.status,
      order.driver?.username,
      order.driver?.email,
      order.driver?.phone,
      ...(order.locations || []).map((location) => location.locationName),
      ...(order.statusUpdates || []).flatMap((update) => [
        update.title,
        update.note,
        update.status,
        update.locationName,
        update.updatedByUser?.username,
        update.updatedByUser?.role,
      ]),
    ]
      .map(normalizeText)
      .join(" ");

    return searchableText.includes(q);
  });
};

const getFilteredQuotes = () => {
  const q = normalizeText(globalSearch);

  if (!q) return quotes;

  return quotes.filter((quote) => {
    const searchableText = [
      quote.id,
      quote.pickupCity,
      quote.deliveryCity,
      quote.goodsType,
      quote.preferredService,
      quote.estimatedPrice,
      quote.status,
      quote.order?.id,
      quote.order?.orderNumber,
      quote.order?.status,
    ]
      .map(normalizeText)
      .join(" ");

    return searchableText.includes(q);
  });
};

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onPrintError: () => toast.error("Error printing invoice"),
  });

  const filteredOrders = getFilteredOrders();
  const filteredQuotes = getFilteredQuotes();

  const totalOrders = orders.length;

  const deliveredOrders = orders.filter((order) =>
    ["delivered", "customer_confirmed"].includes(order.status)
  ).length;

  const activeOrders = orders.filter((order) =>
    [
      "pending",
      "approved",
      "en_route_to_loading",
      "loading",
      "loading_approved",
      "in_transit",
      "arrived_at_destination",
      "waiting_to_offload",
      "offloading",
      "offloading_approved",
    ].includes(order.status)
  ).length;

  const latestOrders = [...filteredOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.updatedAt || 0) -
        new Date(a.createdAt || a.updatedAt || 0)
    )
    .slice(0, 5);

  const inputClass =
    "w-full rounded-2xl border-2 border-sky-200 bg-white/90 px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-500 focus:border-blue-700";

  const labelClass = "mb-2 block font-bold text-blue-950";

  const actionButton =
    "flex items-center justify-center gap-2 rounded-lg border border-blue-950 px-5 py-2 text-sm font-semibold text-blue-950 transition hover:border-blue-500 hover:bg-blue-700 hover:text-white";

  const modalPrimaryButton =
    "flex items-center justify-center gap-2 rounded-lg border border-blue-950 bg-blue-950 px-5 py-2 text-sm font-semibold text-white transition hover:border-blue-500 hover:bg-blue-700";

  const modalCancelButton =
    "flex items-center justify-center gap-2 rounded-lg border border-blue-950 px-5 py-2 text-sm font-semibold text-blue-950 transition hover:border-blue-500 hover:bg-blue-700 hover:text-white";

  return (
    <DashboardLayout
      user={user}
      logout={logout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title="Customer Portal"
      globalSearch={globalSearch}
      setGlobalSearch={setGlobalSearch}
      menuItems={[
        { key: "dashboard", label: "Dashboard" },
        { key: "orders", label: "My Orders" },
        { key: "quotes", label: "My Quotes" },
      ]}
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={() => setShowQuoteForm(true)}
            className={actionButton}
          >
            <FileText size={18} />
            Request Quote
          </button>

          <button onClick={() => setShowOrderForm(true)} className={actionButton}>
            <PlusCircle size={18} />
            Create Order
          </button>
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-5 text-white shadow-xl sm:p-6">
              <h2 className="text-3xl font-black sm:text-4xl">
                Welcome back, {user?.username}
              </h2>

              <p className="mt-2 text-sm font-medium text-sky-100 sm:text-base">
                Track your shipments, request quotes, and manage your logistics
                orders.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "Total Orders",
                  value: totalOrders,
                  subtitle: "All submitted orders",
                  icon: ClipboardList,
                  bgColor: "bg-blue-500/10",
                  textColor: "text-blue-300",
                },
                {
                  title: "Delivered",
                  value: deliveredOrders,
                  subtitle: "Completed deliveries",
                  icon: PackageCheck,
                  bgColor: "bg-emerald-500/10",
                  textColor: "text-emerald-300",
                },
                {
                  title: "Active Orders",
                  value: activeOrders,
                  subtitle: "Pending and ongoing orders",
                  icon: CalendarClock,
                  bgColor: "bg-orange-500/10",
                  textColor: "text-orange-300",
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
            </div>

            <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-6 text-white shadow-xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-white">
                    Recent Orders
                  </h3>

                  <p className="mt-1 text-sm font-medium text-sky-100">
                    Latest 5 submitted orders
                  </p>
                </div>

                <div className="rounded-xl bg-blue-500/10 p-3">
                  <Truck className="text-blue-300" size={24} />
                </div>
              </div>

              <div className="overflow-x-auto rounded-md border border-white/20">
                <table className="w-full min-w-[1100px] text-left text-sm">
                  <thead className="bg-white/10 text-sky-100">
                    <tr>
                      <th className="px-4 py-4">ORDER</th>
                      <th className="px-4 py-4">FROM</th>
                      <th className="px-4 py-4">TO</th>
                      <th className="px-4 py-4">WEIGHT</th>
                      <th className="px-4 py-4">STATUS</th>
                      <th className="px-4 py-4">LATEST JOURNEY</th>
                      <th className="px-4 py-4">DATE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {latestOrders.length > 0 ? (
                      latestOrders.map((order) => {
                        const latestUpdate = order.statusUpdates?.[0];

                        return (
                          <tr
                            key={order.id}
                            className="border-t border-white/10 text-sky-50 transition hover:bg-white/10"
                          >
                            <td className="px-4 py-4 font-black text-white">
                              {order.orderNumber || `#${order.id}`}
                            </td>

                            <td className="px-4 py-4">
                              {order.pickupLocation || "N/A"}
                            </td>

                            <td className="px-4 py-4">
                              {order.deliveryLocation || "N/A"}
                            </td>

                            <td className="px-4 py-4">
                              {order.weight || "N/A"} kg
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-black ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusLabel(order.status)}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              {latestUpdate ? (
                                <div className="rounded-md border border-white/10 bg-white/10 p-2">
                                  <p className="font-bold text-sky-100">
                                    {latestUpdate.title}
                                  </p>

                                  <p className="text-xs text-sky-200">
                                    {new Date(
                                      latestUpdate.createdAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-xs text-sky-200">
                                  No journey updates
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-4 text-sky-100">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
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
          </>
        )}

        {activeTab === "orders" && (
          <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-4 text-white shadow-xl sm:p-6">
            <h2 className="mb-4 text-2xl font-black text-white">My Orders</h2>

            {filteredOrders.length === 0 ? (
              <p className="py-8 text-center font-semibold text-sky-100">
                No orders found.
              </p>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-md border border-white/20 bg-white/10 p-4 text-white transition hover:bg-white/15"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-lg font-black text-white">
                          Order {order.orderNumber || `#${order.id}`}
                        </p>

                        <p className="mt-2 text-sm text-sky-100">
                          From: {order.pickupLocation}
                        </p>

                        <p className="text-sm text-sky-100">
                          To: {order.deliveryLocation}
                        </p>

                        <p className="text-sm text-sky-100">
                          Weight: {order.weight} kg
                        </p>

                        {order.price && (
                          <p className="mt-2 font-black text-green-300">
                            Price: ${order.price}
                          </p>
                        )}
                      </div>

                      <div className="text-left lg:text-right">
                        <span
                          className={`inline-flex rounded px-2.5 py-1 text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                        
                        {order.driver && (
                          <div className="mt-3 text-sm text-sky-100">
                            <p>Driver: {order.driver.username}</p>
                            <p>Contact: {order.driver.email}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 rounded-md border border-white/10 bg-white/10 p-3 text-sm text-sky-100">
                      <p className="mb-2 font-black text-white">
                        Location Updates
                      </p>

                      {order.locations?.length > 0 ? (
                        <div className="space-y-2">
                          {order.locations.map((location) => (
                            <div
                              key={location.id}
                              className="rounded-md border border-white/10 bg-white/10 p-2"
                            >
                              <p className="font-bold text-sky-100">
                                {location.locationName}
                              </p>

                              <p className="text-xs text-sky-200">
                                {new Date(
                                  location.createdAt
                                ).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-sky-200">
                          No location updates yet
                        </p>
                      )}
                    </div>

                    <div className="mt-4 rounded-md border border-white/10 bg-white/10 p-3 text-sm text-sky-100">
                      <p className="mb-2 font-black text-white">
                        Journey Timeline
                      </p>

                      {order.statusUpdates?.length > 0 ? (
                        <div className="space-y-2">
                          {order.statusUpdates.map((update) => (
                            <div
                              key={update.id}
                              className="rounded-md border border-white/10 bg-white/10 p-2"
                            >
                              <p className="font-bold text-sky-100">
                                {update.title}
                              </p>

                              {update.locationName && (
                                <p className="text-xs text-sky-200">
                                  Location: {update.locationName}
                                </p>
                              )}

                              {update.note && (
                                <p className="mt-1 text-xs text-sky-200">
                                  {update.note}
                                </p>
                              )}

                              <p className="mt-1 text-xs text-sky-300">
                                {update.updatedByUser?.username || "System"} •{" "}
                                {new Date(update.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-sky-200">
                          No journey updates yet
                        </p>
                      )}
                    </div>

                    {(order.departureTime || order.forecastedArrival) && (
                      <div className="mt-4 border-t border-white/10 pt-4">
                        <div className="flex flex-col gap-2 text-sm text-sky-100 md:flex-row md:justify-between">
                          <span>
                            Departure:{" "}
                            {order.departureTime
                              ? new Date(order.departureTime).toLocaleString()
                              : "N/A"}
                          </span>

                          <span>
                            Expected Arrival:{" "}
                            {order.forecastedArrival
                              ? new Date(
                                  order.forecastedArrival
                                ).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "quotes" && (
          <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-4 text-white shadow-xl sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                My Quotes
              </h2>

              <p className="mt-1 text-sm font-medium text-sky-100">
                Track all quote requests and admin responses.
              </p>
            </div>

            <div className="overflow-x-auto rounded-md border border-white/20">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-white/10 text-sky-100">
                  <tr>
                    <th className="px-4 py-4">QUOTE</th>
                    <th className="px-4 py-4">PICKUP</th>
                    <th className="px-4 py-4">DELIVERY</th>
                    <th className="px-4 py-4">GOODS</th>
                    <th className="px-4 py-4">SERVICE</th>
                    <th className="px-4 py-4">PRICE</th>
                    <th className="px-4 py-4">STATUS</th>
                    <th className="px-4 py-4">DATE</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredQuotes.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-10 text-center font-semibold text-sky-100"
                      >
                        No quotes found
                      </td>
                    </tr>
                  ) : (
                    filteredQuotes.map((quote) => (
                      <tr
                        key={quote.id}
                        className="border-t border-white/10 text-sky-50"
                      >
                        <td className="px-4 py-4 font-black text-white">
                          #{quote.id}
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

                        <td className="px-4 py-4 font-bold text-emerald-300">
                          {quote.estimatedPrice
                            ? `$${quote.estimatedPrice}`
                            : "Waiting..."}
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showQuoteForm && (
          <RequestQuoteModal
            quoteData={quoteData}
            setQuoteData={setQuoteData}
            onSubmit={handleQuoteRequest}
            onClose={() => setShowQuoteForm(false)}
            inputClass={inputClass}
            labelClass={labelClass}
            modalPrimaryButton={modalPrimaryButton}
            modalCancelButton={modalCancelButton}
          />
        )}

        {showOrderForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/75 px-3 py-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-gradient-to-r from-blue-950 via-sky-500 to-blue-800 p-[4px] shadow-2xl">
              <div className="rounded-[24px] bg-gradient-to-r from-slate-100 via-sky-100 to-white p-5 sm:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-blue-950">
                      Create New Order
                    </h2>

                    <p className="mt-2 text-sm font-medium text-slate-600">
                      Submit a new transportation request for approval.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white"
                  >
                    <X size={22} />
                  </button>
                </div>

                <form onSubmit={handleOrderCreation} className="space-y-5">
                  <div>
                    <label className={labelClass}>Pickup Location</label>
                    <textarea
                      value={orderData.pickupLocation}
                      onChange={(e) =>
                        setOrderData({
                          ...orderData,
                          pickupLocation: e.target.value,
                        })
                      }
                      placeholder="Enter pickup location"
                      className={inputClass}
                      rows="2"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Delivery Location</label>
                    <textarea
                      value={orderData.deliveryLocation}
                      onChange={(e) =>
                        setOrderData({
                          ...orderData,
                          deliveryLocation: e.target.value,
                        })
                      }
                      placeholder="Enter delivery location"
                      className={inputClass}
                      rows="2"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Goods Description</label>
                    <textarea
                      value={orderData.goodsDescription}
                      onChange={(e) =>
                        setOrderData({
                          ...orderData,
                          goodsDescription: e.target.value,
                        })
                      }
                      placeholder="Describe the goods being transported"
                      className={inputClass}
                      rows="2"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Weight (kg)</label>
                    <input
                      type="text"
                      value={orderData.weight}
                      onChange={(e) =>
                        setOrderData({ ...orderData, weight: e.target.value })
                      }
                      placeholder="Enter weight"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-sky-200 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      className={modalCancelButton}
                    >
                      Cancel
                    </button>

                    <button type="submit" className={modalPrimaryButton}>
                      Create Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showPrintModal && printInvoice && printOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/75 px-3 py-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-4 text-gray-800 shadow-2xl sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-black text-blue-950">
                  Invoice Preview
                </h2>

                <button
                  onClick={() => setShowPrintModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div ref={printRef}>
                <PrintableInvoice
                  invoice={printInvoice}
                  order={printOrder}
                  customer={user}
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handlePrint}
                  className={`${modalPrimaryButton} flex-1`}
                >
                  🖨️ Print Invoice
                </button>

                <button
                  onClick={() => handleDownloadPDF(printOrder.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-500 bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  📄 Download PDF
                </button>

                <button
                  onClick={() => setShowPrintModal(false)}
                  className={`${modalCancelButton} flex-1`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;