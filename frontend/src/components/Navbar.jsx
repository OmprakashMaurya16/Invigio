import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  User
} from "lucide-react";
import UserSettingsModal from "./UserSettingsModal";
import { getMyNotifications } from "../services/notification";

const Navbar = ({ menuItems, onLogout, userRole = "admin" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUnread = async () => {
      try {
        const data = await getMyNotifications();
        if (data.success && data.notifications) {
          const unread = data.notifications.filter(n => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      }
    };
    fetchUnread();
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const isActive = (path) => {
    if (!path) return false;
    if (path === "/admin" || path === "/professor") {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-container mx-auto px-lg">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to={userRole === "admin" ? "/admin" : "/professor"} className="flex items-center flex-shrink-0">
                <div className="text-xl font-bold text-primary-700 tracking-tight">Invigio</div>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center h-16 gap-1">
                {menuItems.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`h-10 flex items-center px-4 rounded-md text-sm transition-colors ${
                        active
                          ? "font-semibold text-primary-600"
                          : "font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Link to={userRole === "admin" ? "/admin/notifications" : "/professor/notifications"} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative hidden sm:block">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative group ml-2">
                <button className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center">
                  <img src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" alt="User Avatar" className="w-full h-full object-cover" />
                </button>
                {/* User Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white text-on-surface rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-slate-200">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{userRole === "admin" ? "Administrator" : "Professor"}</p>
                    <p className="text-xs text-slate-500 truncate mt-1">
                      {userRole === "admin" ? "admin@invigio.com" : "prof@invigio.com"}
                    </p>
                  </div>
                  <div className="py-2 border-b border-slate-100">
                    <button
                      onClick={() => setShowSettingsModal(true)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <Settings size={16} className="text-slate-500" />
                      Settings
                    </button>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-2 space-y-1">
              {menuItems.map((item, index) => {
                 const active = isActive(item.path);
                 return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base transition-colors ${
                      active
                        ? "font-semibold text-primary-600 bg-slate-50"
                        : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                 )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Settings Modal */}
      <UserSettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
        userRole={userRole} 
      />
    </>
  );
};

export default Navbar;
