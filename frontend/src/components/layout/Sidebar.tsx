import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Calendar, LayoutGrid, Image, Settings, Sun, X, Image as ImageIcon } from "lucide-react";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "", isOpen = false, onClose }) => {
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Events", path: "/events", icon: LayoutGrid },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Gallery", path: "/gallery", icon: Image },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-5">
      {/* Top Header & Brand */}
      <div>
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e07a3c] to-[#c85a28] flex items-center justify-center shadow-md text-white shrink-0">
              <Sun className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-[#2d1f19]">
                EventRecorder
              </h1>
              <p className="text-[9px] uppercase tracking-wider text-[#9c8a82] font-semibold">
                CAPTURE • ORGANIZE • REMEMBER
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[#6e5c54] hover:bg-[#efe6da] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-[#fbebe3] text-[#c85a28] font-bold shadow-xs border border-[#f7d6c5]"
                      : "text-[#6e5c54] hover:bg-[#f5ede0] hover:text-[#2d1f19]"
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Quote & Decorative Illustration Panel */}
      <div className="mt-8 pt-4">
        <div className="relative rounded-2xl bg-gradient-to-b from-[#f9f1e4] to-[#f4e8d3] p-4 text-center border border-[#eae0d0] overflow-hidden shadow-xs flex flex-col items-center">
          {/* Subtle Graphic background */}
          <div
            className="absolute inset-0 opacity-15 mix-blend-multiply bg-center bg-cover pointer-events-none"
            style={{
              backgroundImage: `url('${import.meta.env.BASE_URL}assets/temple_illustration.png')`,
            }}
          />

          <p className="relative z-10 text-xs italic text-[#7a6458] font-serif leading-relaxed px-1">
            "Every event is a moment worth remembering."
          </p>

          <div className="mt-3 relative z-10 h-20 flex items-center justify-center">
            <img
              src="/assets/temple_illustration.png"
              alt="VBS Temple Illustration"
              className="max-h-full object-contain opacity-80 drop-shadow-xs"
            />
          </div>

          {/* Pill Badge matching target image */}
          <div className="mt-3 relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-[#eae0d0] text-[10px] font-semibold text-[#7a6458] shadow-2xs">
            <ImageIcon className="w-3 h-3 text-[#c85a28] shrink-0" />
            <span>VBS Temple Illustration</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`w-64 bg-[#fcf8f2] border-r border-[#efe6da] flex flex-col justify-between min-h-screen shrink-0 ${className}`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <aside className="relative w-72 max-w-[80vw] bg-[#fcf8f2] h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

