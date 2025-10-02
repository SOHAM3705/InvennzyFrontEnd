import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Bell,
  Package,
  BarChart3,
  Settings,
  Database,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import logo2 from "../../assets/logo2.png";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <div className="w-64 bg-white p-4 border-r border-gray-200">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gray-300 animate-pulse"></div>
            <div className="h-6 w-32 rounded bg-gray-300 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 rounded-lg"
              >
                <div className="w-6 h-6 rounded bg-gray-300 animate-pulse"></div>
                <div className="h-4 flex-1 rounded bg-gray-300 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="h-8 w-48 rounded bg-gray-300 animate-pulse"></div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-64 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("userName");
    if (nameFromStorage) {
      setUserName(nameFromStorage);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch pending notifications count
  useEffect(() => {
    const fetchPendingNotifications = async () => {
      try {
        const res = await fetch("/api/admin/notifications/pending/count");
        const data = await res.json();
        setNotifications(data.count);
      } catch (err) {
        console.error("Error fetching pending notifications:", err);
      }
    };
    fetchPendingNotifications();
  }, []);

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/admindash" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/admindash/notifications",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      path: "/admindash/inventory",
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      path: "/admindash/reports",
    },
    {
      id: "deadstock",
      label: "Dead Stock Reports",
      icon: Database,
      path: "/admindash/deadreport",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/admindash/settings",
    },
  ];

  const location = useLocation();
  const currentMenu = menuItems.find((item) =>
    location.pathname.startsWith(item.path)
  );

  const handleBellClick = () => {
    navigate("/admindash/notifications");
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-50 w-64 h-full bg-white shadow-lg transform transition-all duration-300 ease-in-out border-r border-gray-200
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <div className="h-9 w-13 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                  <img src={logo2} alt="Logo" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Smart Inventory
                </h1>
                <p className="text-xs text-gray-500">College Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="text-gray-500" size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.id === "overview"}
                className={({ isActive }) =>
                  `flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="ml-3 font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="text-white" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {userName || "Admin"}
                </p>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut size={18} className="flex-shrink-0" />
              <span className="ml-3">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for closing sidebar on outside click */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-40 border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 mr-3 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="text-gray-500" size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentMenu?.label || "Dashboard"}
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {userName || "Admin"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBellClick}
                className="p-2 relative rounded-lg hover:bg-gray-100"
              >
                <Bell className="text-gray-500" size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {showLogoutModal && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-[400px] p-8 rounded-2xl shadow-2xl border border-gray-300 bg-white backdrop-blur-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Confirm Logout
              </h2>
              <p className="text-base text-gray-600 mb-6 text-center">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={handleCancelLogout}
                  className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
