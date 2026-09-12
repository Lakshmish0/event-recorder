import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Calendar, LayoutGrid, Image, Settings, Sun } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Events", path: "/events", icon: LayoutGrid },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Gallery", path: "/gallery", icon: Image },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`w-64 bg-[#fcf8f2] border-r border-[#efe6da] flex flex-col justify-between p-5 min-h-screen shrink-0 ${className}`}
    >
      {/* Top Header & Brand */}
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e07a3c] to-[#c85a28] flex items-center justify-center shadow-md text-white">
            <Sun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-[#2d1f19] flex items-center gap-1">
              EventRecorder
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-[#9c8a82] font-semibold">
              Capture • Organize • Remember
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-[#fbebe3] text-[#c85a28] font-semibold shadow-sm border border-[#f7d6c5]"
                      : "text-[#6e5c54] hover:bg-[#f5ede0] hover:text-[#2d1f19]"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Quote & Decorative Illustration Panel */}
      <div className="mt-8 pt-4">
        <div className="relative rounded-2xl bg-gradient-to-b from-[#f9f1e4] to-[#f4e8d3] p-4 text-center border border-[#eae0d0] overflow-hidden shadow-sm">
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
              className="max-h-full object-contain opacity-70 drop-shadow-sm"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
