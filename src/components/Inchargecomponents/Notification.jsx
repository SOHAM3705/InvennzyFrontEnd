import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
} from "lucide-react";

const LabInchargeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staffId");

  // Fetch notifications for labincharge
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `/api/notifications/labincharge/${staffId}?t=${Date.now()}`
        );
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, [staffId]);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== notificationId)
      );
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  // Helper functions (same as Lab Assistant)
  const getNotificationIcon = (type) => {
    switch (type) {
      case "query":
        return <Info className="w-5 h-5" />;
      case "maintenance":
        return <Clock className="w-5 h-5" />;
      case "alert":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
        return <Bell className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "query":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "alert":
        return "bg-red-100 text-red-700 border-red-200";
      case "info":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const readCount = notifications.filter((n) => n.is_read).length;

  return (
    <div className="space-y-6 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              <p className="text-sm text-gray-600">Unread Notifications</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{readCount}</p>
              <p className="text-sm text-gray-600">Read Notifications</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.length}
              </p>
              <p className="text-sm text-gray-600">Total Notifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            All Notifications
          </h3>
          <p className="text-gray-600 mt-1">
            Stay updated with system alerts and queries
          </p>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const colorClass = getNotificationColor(notification.type);
              return (
                <div
                  key={notification.id}
                  onClick={() =>
                    navigate(
                      `/labinchargedash/requests/${notification.request_id}`
                    )
                  }
                  className={`cursor-pointer p-6 hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg border ${colorClass}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className={`text-sm font-semibold ${
                              !notification.is_read
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                            {!notification.is_read && (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                            )}
                          </h4>

                          <p className="text-0.5xl text-gray-500 mt-1">
                            Equipment: {notification.equipment_name} (ID:{" "}
                            {notification.equipment_id})
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.is_read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LabInchargeNotifications;
