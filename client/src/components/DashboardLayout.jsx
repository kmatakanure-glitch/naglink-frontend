import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Truck,
  ClipboardList,
  Users,
  Bell,
  LogOut,
  Search,
  Menu,
  FileText,
  X,
} from "lucide-react";
import API from "../services/api";
import logo from "../assets/logo.png";

const iconMap = {
  dashboard: LayoutDashboard,
  orders: ClipboardList,
  trucks: Truck,
  drivers: Users,
  quotes: FileText,
  expenses: FileText,
};

function DashboardLayout({
  children,
  user,
  logout,
  activeTab,
  setActiveTab,
  menuItems = [],
  title = "Dashboard",
  globalSearch = "",
  setGlobalSearch,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const searchValue =
    typeof globalSearch === "string" ? globalSearch : localSearch;

  const fetchUnreadCount = async () => {
    try {
      const response = await API.get("/notifications/unread-count");
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await API.get("/notifications");
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const updateSearchValue = (value) => {
    if (typeof setGlobalSearch === "function") {
      setGlobalSearch(value);
    } else {
      setLocalSearch(value);
    }
  };

  const handleSearchChange = (e) => {
    updateSearchValue(e.target.value);
  };

  const clearSearch = () => {
    updateSearchValue("");
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    setSidebarOpen(false);
  };

  const handleNotificationClick = async () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);

    if (nextState) {
      await fetchNotifications();
      await fetchUnreadCount();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await API.put(`/notifications/${notificationId}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-950 via-sky-300 to-white text-blue-950">
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-blue-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 transform border-r border-white/20 bg-gradient-to-b from-blue-950 via-sky-700 to-blue-900 shadow-2xl shadow-blue-950/30 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-28 items-center justify-between px-5">
          <a
            href="/"
            className="transition duration-300 hover:scale-105"
            title="Go to Website Home"
          >
            <img
              src={logo}
              alt="Naglink Logo"
              className="h-24 w-auto cursor-pointer object-contain"
            />
          </a>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mt-4 space-y-3 px-4">
          {menuItems.map((item) => {
            const Icon = iconMap[item.key] || LayoutDashboard;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleTabClick(item.key)}
                className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left font-semibold transition ${
                  isActive
                    ? "bg-white text-blue-950 shadow-lg shadow-sky-900/30"
                    : "text-white hover:bg-white/15"
                }`}
              >
                <Icon size={21} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full border-t border-white/20 px-4 pt-6">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-4 rounded-2xl border border-white/20 px-4 py-4 font-semibold text-white transition hover:bg-red-500/25"
          >
            <LogOut size={21} />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-20 border-b border-white/30 bg-gradient-to-r from-white via-sky-200 to-blue-950 px-4 py-4 shadow-lg shadow-blue-950/10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl bg-blue-950 p-3 text-white shadow-md transition hover:bg-blue-800 lg:hidden"
              >
                <Menu size={22} />
              </button>

              <h1 className="text-xl font-black text-blue-950 sm:text-2xl lg:text-3xl">
                {title}
              </h1>
            </div>

            <div className="relative w-full flex-1">
              <Search
                size={20}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-blue-950/60"
              />

              <input
                type="text"
                placeholder="Search orders, order numbers, trucks, drivers, quotes..."
                value={searchValue}
                onChange={handleSearchChange}
                className="h-12 w-full rounded-2xl border-2 border-sky-200 bg-white/85 px-14 pr-12 text-blue-950 outline-none backdrop-blur placeholder:text-slate-500 focus:border-blue-700"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-blue-950 text-white transition hover:bg-red-600"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 lg:justify-end">
              <div className="relative">
                <button
                  type="button"
                  onClick={handleNotificationClick}
                  className="relative rounded-full bg-white/80 p-3 text-blue-950 shadow-sm transition hover:bg-blue-700 hover:text-white"
                >
                  <Bell size={22} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-black text-white shadow-lg">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-2xl border border-white/30 bg-white shadow-2xl shadow-blue-950/30">
                    <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-950 via-sky-700 to-blue-900 px-4 py-3 text-white">
                      <div>
                        <h3 className="font-black">Notifications</h3>
                        <p className="text-xs text-sky-100">
                          {unreadCount} unread
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        className="rounded-full bg-white/10 p-1 transition hover:bg-white/20"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="max-h-[420px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm font-semibold text-slate-500">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <button
                            key={notification.id}
                            type="button"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-sky-50 ${
                              notification.isRead ? "bg-white" : "bg-blue-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-black text-blue-950">
                                  {notification.title}
                                </p>

                                <p className="mt-1 text-sm leading-5 text-slate-600">
                                  {notification.message}
                                </p>

                                <p className="mt-2 text-xs font-semibold text-slate-400">
                                  {notification.createdAt
                                    ? new Date(
                                        notification.createdAt
                                      ).toLocaleString()
                                    : ""}
                                </p>
                              </div>

                              {!notification.isRead && (
                                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-600" />
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
                <div className="min-w-0 text-right">
                  <p className="truncate text-sm font-bold text-blue-950 sm:text-base">
                    {user?.username || "User"}
                  </p>

                  <p className="text-xs font-semibold capitalize text-slate-600">
                    {user?.role || "system user"}
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-950 via-sky-600 to-blue-800 font-bold text-white shadow-md">
                  {(user?.username || "U").slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {searchValue && (
            <div className="mt-3 rounded-xl border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-950 shadow-sm">
              Searching for:{" "}
              <span className="font-black text-blue-700">{searchValue}</span>
            </div>
          )}
        </header>

        <section className="px-3 py-6 sm:px-6 lg:px-8">{children}</section>
      </main>
    </div>
  );
}

export default DashboardLayout;