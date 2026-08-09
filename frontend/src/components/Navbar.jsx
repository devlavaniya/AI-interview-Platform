import { UserButton, useUser } from "@clerk/clerk-react";

import { ChevronDown } from "lucide-react";
export default function Navbar() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#0B0B0B]/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left */}
        <div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 px-3 py-2 transition-colors hover:border-zinc-700">
          <span className="hidden text-sm font-medium text-white sm:block">
            {user?.firstName}
          </span>

          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: "36px",
                  height: "36px",
                },
              },
            }}
            afterSignOutUrl="/"
          />

          <ChevronDown
            size={16}
            className="text-zinc-500 transition-colors duration-200 hover:text-white"
          />
        </div>
      </div>
    </header>
  );
}
