import { NavLink } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";

import { sidebarItems } from "@/constants/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { LogOut } from "lucide-react";

export default function Sidebar() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-zinc-800 bg-[#090909]">
      {/* ================= Logo ================= */}

      {/* ================= Logo ================= */}

      <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-4 ">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-400 text-xs font-bold text-black">
          IV
        </div>

        <div className="leading-tight">
          <h2 className="text-[11px] font-semibold tracking-tight text-white">
            Intelli<span className="text-yellow-400">View</span>
          </h2>
        </div>
      </div>

      {/* ================= Navigation ================= */}

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-yellow-400 text-black"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />

                <span className="truncate">{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ================= User ================= */}

      <div className="border-t border-zinc-800 p-3">
        <div className="flex items-center justify-between rounded-lg bg-zinc-900 px-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.imageUrl} />

              <AvatarFallback className="bg-yellow-400 text-black">
                {user?.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <span className="truncate text-sm font-medium text-white">
              {user?.firstName}
            </span>
          </div>

          <button
            onClick={() => signOut()}
            className="rounded-md p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-red-400"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
