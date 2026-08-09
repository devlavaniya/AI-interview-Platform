import { useEffect, useState } from "react";
import { X, Save, MapPin, GraduationCap, UserRound } from "lucide-react";
import { SiLeetcode, SiCodeforces } from "react-icons/si";

function UsernameSetupModal({ isOpen, onClose, onSave, existingUsernames }) {
  const [usernames, setUsernames] = useState({
    leetcode: "",
    codeforces: "",
    codechef: "",
    location: "",
    university: "",
    about: "",
  });

  useEffect(() => {
    if (isOpen) {
      setUsernames({
        leetcode: existingUsernames?.leetcode || "",
        codeforces: existingUsernames?.codeforces || "",
        codechef: existingUsernames?.codechef || "",
        location: existingUsernames?.location || "",
        university: existingUsernames?.university || "",
        about: existingUsernames?.about || "",
      });
    }
  }, [isOpen, existingUsernames]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setUsernames((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(usernames);
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/70
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-zinc-800
          bg-[#111111]
          shadow-2xl
        "
      >
        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/10">
              <UserRound size={18} className="text-yellow-400" />
            </div>

            <div>
              <span className="block text-sm font-semibold text-white">
                CodeFolio Profile
              </span>

              <span className="text-[11px] text-zinc-500">
                Connect your coding profiles
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              text-zinc-500
              transition
              hover:bg-zinc-800
              hover:text-white
            "
          >
            <X size={17} />
          </button>
        </div>

        {/* ================= BODY ================= */}

        <div className="overflow-y-auto px-5 py-5">
          <div className="space-y-6">
            {/* ================= PLATFORMS ================= */}

            <div>
              <div className="mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Coding Platforms
                </span>
              </div>

              <div className="space-y-3">
                {/* LeetCode */}

                <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/10">
                      <SiLeetcode size={15} className="text-orange-400" />
                    </div>

                    <span className="text-xs font-medium text-zinc-300">
                      LeetCode
                    </span>
                  </div>

                  <input
                    type="text"
                    value={usernames.leetcode}
                    onChange={(e) => updateField("leetcode", e.target.value)}
                    placeholder="Enter your LeetCode username"
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-zinc-800
                      bg-[#111111]
                      px-3
                      text-xs
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                      focus:border-yellow-400/60
                    "
                  />
                </div>

                {/* Codeforces */}

                <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10">
                      <SiCodeforces size={15} className="text-blue-400" />
                    </div>

                    <span className="text-xs font-medium text-zinc-300">
                      Codeforces
                    </span>
                  </div>

                  <input
                    type="text"
                    value={usernames.codeforces}
                    onChange={(e) => updateField("codeforces", e.target.value)}
                    placeholder="Enter your Codeforces username"
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-zinc-800
                      bg-[#111111]
                      px-3
                      text-xs
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                      focus:border-yellow-400/60
                    "
                  />
                </div>

                {/* CodeChef */}

                <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/10">
                      <span className="text-[10px] font-bold text-purple-400">
                        CC
                      </span>
                    </div>

                    <span className="text-xs font-medium text-zinc-300">
                      CodeChef
                    </span>

                    <span className="ml-auto text-[10px] text-zinc-600">
                      Coming soon
                    </span>
                  </div>

                  <input
                    type="text"
                    value={usernames.codechef}
                    onChange={(e) => updateField("codechef", e.target.value)}
                    placeholder="Enter your CodeChef username"
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-zinc-800
                      bg-[#111111]
                      px-3
                      text-xs
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                      focus:border-yellow-400/60
                    "
                  />
                </div>
              </div>
            </div>

            {/* ================= PROFILE ================= */}

            <div>
              <div className="mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Profile Information
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Location */}

                <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-zinc-500" />

                    <span className="text-xs text-zinc-400">Location</span>
                  </div>

                  <input
                    type="text"
                    value={usernames.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="India"
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-zinc-800
                      bg-[#111111]
                      px-3
                      text-xs
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                      focus:border-yellow-400/60
                    "
                  />
                </div>

                {/* University */}

                <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <GraduationCap size={14} className="text-zinc-500" />

                    <span className="text-xs text-zinc-400">University</span>
                  </div>

                  <input
                    type="text"
                    value={usernames.university}
                    onChange={(e) => updateField("university", e.target.value)}
                    placeholder="Your university"
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-zinc-800
                      bg-[#111111]
                      px-3
                      text-xs
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                      focus:border-yellow-400/60
                    "
                  />
                </div>
              </div>

              {/* About */}

              <div className="mt-3 rounded-xl border border-zinc-800 bg-[#0d0d0d] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">About</span>

                  <span className="text-[10px] text-zinc-600">Optional</span>
                </div>

                <textarea
                  value={usernames.about}
                  onChange={(e) => updateField("about", e.target.value)}
                  placeholder="Tell people a little about yourself..."
                  rows={3}
                  maxLength={300}
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-zinc-800
                    bg-[#111111]
                    px-3
                    py-2
                    text-xs
                    leading-relaxed
                    text-white
                    outline-none
                    placeholder:text-zinc-600
                    focus:border-yellow-400/60
                  "
                />

                <div className="mt-1 text-right text-[10px] text-zinc-600">
                  {usernames.about.length}/300
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}

        <div className="flex items-center justify-end gap-2 border-t border-zinc-800 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              border
              border-zinc-800
              px-4
              py-2
              text-xs
              font-medium
              text-zinc-400
              transition
              hover:bg-zinc-900
              hover:text-white
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-yellow-400
              px-4
              py-2
              text-xs
              font-semibold
              text-black
              transition
              hover:bg-yellow-300
            "
          >
            <Save size={14} />
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default UsernameSetupModal;
