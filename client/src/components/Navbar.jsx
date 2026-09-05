
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  const [unreadCount, setUnreadCount] = useState(0);

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (
        !token ||
        !user ||
        (user.role !== "customer" && user.role !== "provider")
      ) {
        setUnreadCount(0);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const notifications = data.notifications || [];

        const count = notifications.filter(
          (notification) => !notification.isRead
        ).length;

        setUnreadCount(count);
      } catch (error) {
        console.error(
          "Failed to load notification count:",
          error
        );
      }
    };

    fetchUnreadNotifications();
  }, [token, user?.role]);

  const handleLogout = () => {
    // Remove authentication data.
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUnreadCount(0);

    // Redirect to Login.
    navigate("/login", { replace: true });
  };

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <span className="brand-mark">S</span>
          <span>SkillBridge</span>
        </Link>

        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Services
          </NavLink>

          {!token || !user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Login
              </NavLink>

              <Link to="/signup" className="nav-cta">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <NavLink
                to={
                  user.role === "customer"
                    ? "/customer/dashboard"
                    : user.role === "provider"
                    ? "/provider/dashboard"
                    : "/admin/dashboard"
                }
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Dashboard
              </NavLink>

              {/* =========================
                  ADMIN NAVIGATION
              ========================= */}
              {user.role === "admin" && (
                <>
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    Users
                  </NavLink>

                  <NavLink
                    to="/admin/providers"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    Providers
                  </NavLink>

                  <NavLink
                    to="/admin/services"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    Services
                  </NavLink>

                  <NavLink
                    to="/admin/requests"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    Requests
                  </NavLink>

                  <NavLink
                    to="/admin/messages"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    Messages
                  </NavLink>
                </>
              )}

              {/* =========================
                  TASK 7 — NOTIFICATIONS
                  Only Customer and Provider
              ========================= */}
              {(user.role === "customer" ||
                user.role === "provider") && (
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link notification-nav-link active"
                      : "nav-link notification-nav-link"
                  }
                >
                  <span className="notification-nav-icon">
                    🔔
                  </span>

                  <span>Notifications</span>

                  {unreadCount > 0 && (
                    <span
                      className="notification-badge"
                      aria-label={`${unreadCount} unread notifications`}
                    >
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </NavLink>
              )}

              <button
                type="button"
                className="nav-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label="Open navigation menu"
          onClick={() => {
            const menu = document.querySelector(
              ".navbar-links"
            );

            menu?.classList.toggle("mobile-open");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
}

export default Navbar;

