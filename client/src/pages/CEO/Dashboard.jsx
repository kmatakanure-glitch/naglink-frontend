import React, { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  ReceiptText,
  TrendingUp,
  PackageCheck,
  ClipboardList,
  Activity,
  Search,
  BarChart3,
  PieChart as PieChartIcon,
  CheckCircle2,
  Edit3,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import toast from "react-hot-toast";

import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";

const CEODashboard = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({});
  const [ceoEditNote, setCeoEditNote] = useState("");

  useEffect(() => {
    fetchCEODashboard();
    fetchCEOExpenses();
  }, []);

  const fetchCEODashboard = async () => {
    try {
      const response = await API.get("/ceo/dashboard");
      setDashboardData(response.data);
    } catch (error) {
      console.error("CEO dashboard error:", error);
      toast.error("Error fetching CEO dashboard");
    }
  };

  const fetchCEOExpenses = async () => {
    try {
      const response = await API.get("/ceo/expenses");
      setExpenses(response.data.expenses || []);
    } catch (error) {
      console.error("CEO expenses error:", error);
      toast.error("Error fetching expense requisitions");
    }
  };

  const normalizeText = (value) =>
    String(value || "")
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\s+/g, " ")
      .trim();

  const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return `$${amount.toFixed(2)}`;
  };

  const expenseFields = [
    "fuel",
    "tollgate",
    "maintenance",
    "driverAllowance",
    "loadingCost",
    "offloadingCost",
    "zimTolls",
    "mozaTolls",
    "roadAccess",
    "vidCosts",
    "emaCosts",
    "portHealth",
    "portFee",
    "agentRunner",
    "otherCost",
  ];

  const expenseFieldLabels = {
    fuel: "Fuel",
    tollgate: "Tollgate",
    maintenance: "Maintenance",
    driverAllowance: "Driver Allowance",
    loadingCost: "Loading Cost",
    offloadingCost: "Offloading Cost",
    zimTolls: "Zim Tolls",
    mozaTolls: "Moza Tolls",
    roadAccess: "Road Access",
    vidCosts: "VID Costs",
    emaCosts: "EMA Costs",
    portHealth: "Port Health",
    portFee: "Port Fee",
    agentRunner: "Agent Runner",
    otherCost: "Other Cost",
  };

  const calculateExpenseTotal = (expense) =>
    expenseFields.reduce(
      (sum, field) => sum + Number(expense?.[field] || 0),
      0
    );

  const chartColors = {
    revenue: "#22c55e",
    expenses: "#ef4444",
    profit: "#facc15",
  };

  const pieColors = [
    "#84cc16",
    "#22c55e",
    "#eab308",
    "#f97316",
    "#ef4444",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f59e0b",
    "#a855f7",
    "#10b981",
    "#fb7185",
    "#38bdf8",
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-xl border border-yellow-400/40 bg-slate-950/95 px-4 py-3 text-white shadow-2xl">
        {label && <p className="mb-2 font-black text-yellow-300">{label}</p>}

        {payload.map((item, index) => (
          <p key={index} className="text-sm font-semibold">
            <span style={{ color: item.color }}>●</span> {item.name}:{" "}
            {formatCurrency(item.value)}
          </p>
        ))}
      </div>
    );
  };

  const getExpenseStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      approved: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      rejected: "bg-red-100 text-red-800 border border-red-200",
    };

    return colors[status] || colors.pending;
  };

  const handleApproveExpense = async (expenseId) => {
    try {
      await API.put(`/ceo/expenses/${expenseId}/approve`);

      toast.success("Expense approved successfully");

      fetchCEOExpenses();
      fetchCEODashboard();
    } catch (error) {
      console.error("Approve expense error:", error);
      toast.error(error.response?.data?.message || "Error approving expense");
    }
  };

  const openEditExpenseModal = (expense) => {
    setSelectedExpense(expense);

    const initialForm = {};
    expenseFields.forEach((field) => {
      initialForm[field] = expense[field] || 0;
    });

    initialForm.otherDescription = expense.otherDescription || "";

    setExpenseForm(initialForm);
    setCeoEditNote("");
    setShowEditExpenseModal(true);
  };

  const handleEditExpenseChange = (field, value) => {
    setExpenseForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditAndApproveExpense = async () => {
    if (!selectedExpense) return;

    try {
      await API.put(`/ceo/expenses/${selectedExpense.id}/edit-approve`, {
        ...expenseForm,
        ceoEditNote,
      });

      toast.success("Expense edited and approved");

      setSelectedExpense(null);
      setExpenseForm({});
      setCeoEditNote("");
      setShowEditExpenseModal(false);

      fetchCEOExpenses();
      fetchCEODashboard();
    } catch (error) {
      console.error("Edit expense error:", error);
      toast.error(
        error.response?.data?.message || "Error editing and approving expense"
      );
    }
  };

  const overview = dashboardData?.overview || {};
  const expenseBreakdown = dashboardData?.expenseBreakdown || {};
  const revenueByWeek = dashboardData?.revenueByWeek || [];
  const profitPerLoad = dashboardData?.profitPerLoad || [];

  const expensePieData = useMemo(() => {
    return Object.entries(expenseBreakdown)
      .map(([key, value]) => ({
        name: expenseFieldLabels[key] || key,
        value: Number(value || 0),
      }))
      .filter((item) => item.value > 0);
  }, [expenseBreakdown]);

  const lineGraphData = useMemo(() => {
    return revenueByWeek.map((week) => {
      const revenue = Number(week.revenue || 0);
      const expenses = Number(week.expenses || 0);
      const profit = Number(week.profit || revenue - expenses);

      return {
        week: week.week || week.label || "Week",
        revenue,
        expenses,
        profit,
      };
    });
  }, [revenueByWeek]);

  const filteredProfitLoads = useMemo(() => {
    const q = normalizeText(globalSearch);

    if (!q) return profitPerLoad;

    return profitPerLoad.filter((load) => {
      const searchable = [
        load.id,
        load.orderNumber,
        load.customer,
        load.driver,
        load.pickupLocation,
        load.deliveryLocation,
        load.revenue,
        load.expenses,
        load.profit,
        load.createdAt,
      ]
        .map(normalizeText)
        .join(" ");

      return searchable.includes(q);
    });
  }, [globalSearch, profitPerLoad]);

  const filteredExpenses = useMemo(() => {
    const q = normalizeText(globalSearch);

    if (!q) return expenses;

    return expenses.filter((expense) => {
      const searchable = [
        expense.id,
        expense.status,
        expense.totalAmount,
        expense.order?.id,
        expense.order?.orderNumber,
        expense.order?.pickupLocation,
        expense.order?.deliveryLocation,
        expense.order?.customer?.username,
        expense.order?.driver?.username,
        expense.requestedByUser?.username,
        expense.approvedByUser?.username,
        expense.ceoEditNote,
        expense.otherDescription,
        expense.createdAt,
      ]
        .map(normalizeText)
        .join(" ");

      return searchable.includes(q);
    });
  }, [expenses, globalSearch]);

  const topProfitLoads = [...profitPerLoad]
    .sort((a, b) => Number(b.profit || 0) - Number(a.profit || 0))
    .slice(0, 6);

  return (
    <DashboardLayout
      user={user}
      logout={logout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title="CEO Portal"
      globalSearch={globalSearch}
      setGlobalSearch={setGlobalSearch}
      menuItems={[
        { key: "dashboard", label: "Dashboard" },
        { key: "profit", label: "Profit Per Load" },
        { key: "expenses", label: "Expenses" },
      ]}
    >
      <div className="space-y-8">
        <div className="rounded-md border border-white/20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-5 text-white shadow-xl sm:p-6">
          <h2 className="text-3xl font-black sm:text-4xl">
            Welcome, {user?.username}
          </h2>

          <p className="mt-2 text-sm font-medium text-sky-100 sm:text-base">
            Executive financial overview of company performance.
          </p>
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Total Revenue",
                  value: formatCurrency(overview.totalRevenue),
                  icon: DollarSign,
                  color: "text-emerald-300",
                },
                {
                  title: "Approved Expenses",
                  value: formatCurrency(overview.totalExpenses),
                  icon: ReceiptText,
                  color: "text-red-300",
                },
                {
                  title: "Total Profit",
                  value: formatCurrency(overview.totalProfit),
                  icon: TrendingUp,
                  color:
                    Number(overview.totalProfit || 0) >= 0
                      ? "text-emerald-300"
                      : "text-red-300",
                },
                {
                  title: "Pending Requisitions",
                  value: overview.pendingExpenseCount || 0,
                  icon: Activity,
                  color: "text-yellow-300",
                },
                {
                  title: "Profit Margin",
                  value: `${overview.profitMargin || 0}%`,
                  icon: Activity,
                  color: "text-orange-300",
                },
                {
                  title: "Total Loads",
                  value: overview.totalOrders || 0,
                  icon: ClipboardList,
                  color: "text-sky-300",
                },
                {
                  title: "Completed Loads",
                  value: overview.completedOrders || 0,
                  icon: PackageCheck,
                  color: "text-emerald-300",
                },
                {
                  title: "Active Loads",
                  value: overview.activeOrders || 0,
                  icon: ClipboardList,
                  color: "text-yellow-300",
                },
              ].map((card, index) => {
                const Icon = card.icon;

                return (
                  <div
                    key={index}
                    className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-5 text-white shadow-xl transition hover:-translate-y-1 hover:border-yellow-300/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-sky-100">
                          {card.title}
                        </p>

                        <p className="mt-2 text-3xl font-black">
                          {card.value}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/10 p-3 shadow-inner">
                        <Icon size={23} className={card.color} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-md border border-yellow-400/20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 text-white shadow-2xl xl:col-span-2">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-yellow-200">
                      Revenue vs Expenses vs Profit
                    </h3>
                    <p className="mt-1 text-sm text-sky-100">
                      Weekly financial performance trend.
                    </p>
                  </div>

                  <BarChart3 className="text-yellow-300" size={30} />
                </div>

                <div className="h-80 rounded-2xl border border-yellow-400/10 bg-black/20 p-4 shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineGraphData}>
                      <defs>
                        <linearGradient
                          id="revenueGlow"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#a3e635" />
                        </linearGradient>

                        <linearGradient
                          id="expenseGlow"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#fb923c" />
                        </linearGradient>

                        <linearGradient
                          id="profitGlow"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#facc15" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                      </defs>

                      <CartesianGrid stroke="#facc1530" strokeDasharray="4 4" />

                      <XAxis
                        dataKey="week"
                        stroke="#fde68a"
                        tick={{ fill: "#fde68a", fontWeight: 700 }}
                      />

                      <YAxis
                        stroke="#fde68a"
                        tick={{ fill: "#fde68a", fontWeight: 700 }}
                      />

                      <Tooltip content={<CustomTooltip />} />

                      <Legend
                        wrapperStyle={{
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="url(#revenueGlow)"
                        strokeWidth={5}
                        dot={{
                          r: 6,
                          fill: chartColors.revenue,
                          stroke: "#ffffff",
                          strokeWidth: 2,
                        }}
                        activeDot={{ r: 9 }}
                        name="Revenue"
                      />

                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="url(#expenseGlow)"
                        strokeWidth={5}
                        dot={{
                          r: 6,
                          fill: chartColors.expenses,
                          stroke: "#ffffff",
                          strokeWidth: 2,
                        }}
                        activeDot={{ r: 9 }}
                        name="Expenses"
                      />

                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="url(#profitGlow)"
                        strokeWidth={5}
                        dot={{
                          r: 6,
                          fill: chartColors.profit,
                          stroke: "#ffffff",
                          strokeWidth: 2,
                        }}
                        activeDot={{ r: 9 }}
                        name="Profit"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-md border border-yellow-400/20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 text-white shadow-2xl">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-yellow-200">
                      Expense Breakdown
                    </h3>
                    <p className="mt-1 text-sm text-sky-100">
                      Approved expense categories only.
                    </p>
                  </div>

                  <PieChartIcon className="text-yellow-300" size={30} />
                </div>

                <div className="h-80 rounded-2xl border border-yellow-400/10 bg-black/20 p-3 shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensePieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={108}
                        paddingAngle={3}
                        label={({ percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {expensePieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={pieColors[index % pieColors.length]}
                            stroke="#0f172a"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>

                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-5 max-h-44 space-y-2 overflow-y-auto pr-2">
                  {expensePieData.length === 0 ? (
                    <p className="text-sm font-semibold text-sky-100">
                      No approved expenses recorded yet.
                    </p>
                  ) : (
                    expensePieData.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex justify-between rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm shadow-inner"
                      >
                        <span className="flex items-center gap-2 font-semibold text-sky-100">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor:
                                pieColors[index % pieColors.length],
                            }}
                          />
                          {item.name}
                        </span>
                        <span className="font-black text-white">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-md border border-yellow-400/20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 text-white shadow-2xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-yellow-200">
                    Top Profit Loads
                  </h3>
                  <p className="mt-1 text-sm text-sky-100">
                    Highest earning loads by approved profit.
                  </p>
                </div>

                <TrendingUp className="text-emerald-300" size={30} />
              </div>

              <div className="h-80 rounded-2xl border border-yellow-400/10 bg-black/20 p-4 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProfitLoads}>
                    <defs>
                      <linearGradient
                        id="profitBar"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#facc15" />
                        <stop offset="50%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#7c2d12" />
                      </linearGradient>
                    </defs>

                    <CartesianGrid stroke="#facc1530" strokeDasharray="4 4" />

                    <XAxis
                      dataKey="orderNumber"
                      stroke="#fde68a"
                      tick={{ fill: "#fde68a", fontWeight: 700 }}
                    />

                    <YAxis
                      stroke="#fde68a"
                      tick={{ fill: "#fde68a", fontWeight: 700 }}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Bar
                      dataKey="profit"
                      name="Profit"
                      fill="url(#profitBar)"
                      radius={[14, 14, 0, 0]}
                      barSize={70}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === "profit" && (
          <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-4 text-white shadow-xl sm:p-6">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white sm:text-3xl">
                  Profit Per Load
                </h2>

                <p className="mt-1 text-sm font-medium text-sky-100">
                  Revenue, approved expenses, and profit for each load.
                </p>
              </div>

              <div className="relative w-full lg:max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search order, driver, customer, route..."
                  className="h-12 w-full rounded-xl border border-white/20 bg-white px-11 text-blue-950 outline-none placeholder:text-slate-500 focus:border-sky-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-md border border-white/20">
              <table className="w-full min-w-[1250px] text-left text-sm">
                <thead className="bg-white/10 text-sky-100">
                  <tr>
                    <th className="px-4 py-4">ORDER</th>
                    <th className="px-4 py-4">CUSTOMER</th>
                    <th className="px-4 py-4">DRIVER</th>
                    <th className="px-4 py-4">PICKUP</th>
                    <th className="px-4 py-4">DELIVERY</th>
                    <th className="px-4 py-4">REVENUE</th>
                    <th className="px-4 py-4">APPROVED EXPENSES</th>
                    <th className="px-4 py-4">PROFIT</th>
                    <th className="px-4 py-4">DATE</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProfitLoads.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-4 py-10 text-center font-semibold text-sky-100"
                      >
                        No loads found.
                      </td>
                    </tr>
                  ) : (
                    filteredProfitLoads.map((load) => (
                      <tr
                        key={load.id}
                        className="border-t border-white/10 text-sky-50 transition hover:bg-white/10"
                      >
                        <td className="px-4 py-4 font-black text-white">
                          {load.orderNumber}
                        </td>

                        <td className="px-4 py-4">{load.customer}</td>

                        <td className="px-4 py-4">{load.driver}</td>

                        <td className="px-4 py-4">
                          {load.pickupLocation || "N/A"}
                        </td>

                        <td className="px-4 py-4">
                          {load.deliveryLocation || "N/A"}
                        </td>

                        <td className="px-4 py-4 font-bold text-emerald-300">
                          {formatCurrency(load.revenue)}
                        </td>

                        <td className="px-4 py-4 font-bold text-red-300">
                          {formatCurrency(load.expenses)}
                        </td>

                        <td
                          className={`px-4 py-4 font-black ${
                            Number(load.profit || 0) >= 0
                              ? "text-emerald-300"
                              : "text-red-300"
                          }`}
                        >
                          {formatCurrency(load.profit)}
                        </td>

                        <td className="px-4 py-4 text-sky-100">
                          {load.createdAt
                            ? new Date(load.createdAt).toLocaleDateString()
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

        {activeTab === "expenses" && (
          <div className="rounded-md border border-white/20 bg-gradient-to-br from-blue-950 via-sky-800 to-blue-900 p-4 text-white shadow-xl sm:p-6">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white sm:text-3xl">
                  Expense Requisitions
                </h2>

                <p className="mt-1 text-sm font-medium text-sky-100">
                  Approve expenses as submitted, or edit amounts before
                  approval.
                </p>
              </div>

              <div className="relative w-full lg:max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search expense, order, admin, customer..."
                  className="h-12 w-full rounded-xl border border-white/20 bg-white px-11 text-blue-950 outline-none placeholder:text-slate-500 focus:border-sky-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-md border border-white/20">
              <table className="w-full min-w-[1400px] text-left text-sm">
                <thead className="bg-white/10 text-sky-100">
                  <tr>
                    <th className="px-4 py-4">ORDER</th>
                    <th className="px-4 py-4">CUSTOMER</th>
                    <th className="px-4 py-4">DRIVER</th>
                    <th className="px-4 py-4">ROUTE</th>
                    <th className="px-4 py-4">REQUESTED BY</th>
                    <th className="px-4 py-4">AMOUNT</th>
                    <th className="px-4 py-4">STATUS</th>
                    <th className="px-4 py-4">CEO EDIT</th>
                    <th className="px-4 py-4">DATE</th>
                    <th className="px-4 py-4">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        className="px-4 py-10 text-center font-semibold text-sky-100"
                      >
                        No expense requisitions found.
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-t border-white/10 text-sky-50 transition hover:bg-white/10"
                      >
                        <td className="px-4 py-4 font-black text-white">
                          {expense.order?.orderNumber ||
                            `#${expense.orderId}`}
                        </td>

                        <td className="px-4 py-4">
                          {expense.order?.customer?.username || "N/A"}
                        </td>

                        <td className="px-4 py-4">
                          {expense.order?.driver?.username || "N/A"}
                        </td>

                        <td className="px-4 py-4">
                          <p>{expense.order?.pickupLocation || "N/A"}</p>
                          <p className="text-xs text-sky-200">
                            to {expense.order?.deliveryLocation || "N/A"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          {expense.requestedByUser?.username || "N/A"}
                        </td>

                        <td className="px-4 py-4 font-black text-yellow-300">
                          {formatCurrency(expense.totalAmount)}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase ${getExpenseStatusColor(
                              expense.status
                            )}`}
                          >
                            {expense.status || "pending"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          {expense.wasEditedByCEO ? (
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-800">
                              Edited
                            </span>
                          ) : (
                            <span className="text-xs text-sky-200">
                              Not edited
                            </span>
                          )}

                          {expense.ceoEditNote && (
                            <p className="mt-1 text-xs text-sky-200">
                              {expense.ceoEditNote}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-sky-100">
                          {expense.createdAt
                            ? new Date(expense.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td className="px-4 py-4">
  <div className="flex flex-wrap gap-2">
    {expense.status === "pending" && (
      <button
        type="button"
        onClick={() => handleApproveExpense(expense.id)}
        className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-500/20 px-3 py-2 text-xs font-black text-emerald-200 transition hover:bg-emerald-600 hover:text-white"
      >
        <CheckCircle2 size={15} />
        Approve
      </button>
    )}

    <button
      type="button"
      onClick={() => openEditExpenseModal(expense)}
      className="flex items-center gap-1 rounded-lg border border-yellow-300 bg-yellow-500/20 px-3 py-2 text-xs font-black text-yellow-200 transition hover:bg-yellow-500 hover:text-blue-950"
    >
      <Edit3 size={15} />
      {expense.status === "pending" ? "Edit & Approve" : "Edit Expense"}
    </button>
  </div>
</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showEditExpenseModal && selectedExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 px-3 py-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-gradient-to-r from-yellow-400 via-sky-500 to-blue-900 p-[4px] shadow-2xl">
              <div className="rounded-[24px] bg-gradient-to-br from-slate-100 via-sky-100 to-white p-5 sm:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-blue-950">
                      Edit & Approve Expense
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-slate-600">
                      Order{" "}
                      {selectedExpense.order?.orderNumber ||
                        `#${selectedExpense.orderId}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowEditExpenseModal(false);
                      setSelectedExpense(null);
                      setExpenseForm({});
                      setCeoEditNote("");
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {expenseFields.map((field) => (
                    <div key={field}>
                      <label className="mb-2 block font-black text-blue-950">
                        {expenseFieldLabels[field]}
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={expenseForm[field] || ""}
                        onChange={(e) =>
                          handleEditExpenseChange(field, e.target.value)
                        }
                        className="w-full rounded-2xl border-2 border-sky-200 bg-white/90 px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-500 focus:border-blue-700"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <label className="mb-2 block font-black text-blue-950">
                    Other Description
                  </label>

                  <textarea
                    rows="2"
                    value={expenseForm.otherDescription || ""}
                    onChange={(e) =>
                      handleEditExpenseChange(
                        "otherDescription",
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border-2 border-sky-200 bg-white/90 px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-500 focus:border-blue-700"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block font-black text-blue-950">
                    CEO Edit Note
                  </label>

                  <textarea
                    rows="3"
                    value={ceoEditNote}
                    onChange={(e) => setCeoEditNote(e.target.value)}
                    placeholder="Example: Fuel reduced after review, tollgate adjusted."
                    className="w-full rounded-2xl border-2 border-sky-200 bg-white/90 px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-500 focus:border-blue-700"
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-bold text-slate-600">
                    New Approved Total
                  </p>

                  <p className="mt-1 text-3xl font-black text-blue-950">
                    {formatCurrency(calculateExpenseTotal(expenseForm))}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-sky-200 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditExpenseModal(false);
                      setSelectedExpense(null);
                      setExpenseForm({});
                      setCeoEditNote("");
                    }}
                    className="rounded-lg border border-blue-950 px-5 py-2 text-sm font-semibold text-blue-950 transition hover:border-blue-500 hover:bg-blue-700 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleEditAndApproveExpense}
                    className="rounded-lg border border-blue-950 bg-blue-950 px-5 py-2 text-sm font-semibold text-white transition hover:border-blue-500 hover:bg-blue-700"
                  >
                    Save Changes & Approve
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

export default CEODashboard;