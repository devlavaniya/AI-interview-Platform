import {
  MapPin,
  GraduationCap,
  Mail,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import { SiLeetcode, SiCodeforces } from "react-icons/si";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function CodeFolioProfile({ user, usernames, stats, onOpenCard }) {
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Developer";

  const username =
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "user";

  const email = user?.primaryEmailAddress?.emailAddress;

  const initials =
    `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}` ||
    "U";

  const platforms = [
    {
      key: "leetcode",
      name: "LeetCode",
      username: usernames?.leetcode,
      icon: SiLeetcode,
      iconClass: "text-orange-500",
      bgClass: "bg-orange-500/10",
    },
    {
      key: "codeforces",
      name: "Codeforces",
      username: usernames?.codeforces,
      icon: SiCodeforces,
      iconClass: "text-blue-500",
      bgClass: "bg-blue-500/10",
    },
    {
      key: "codechef",
      name: "CodeChef",
      username: usernames?.codechef,
      icon: null,
      iconClass: "text-purple-400",
      bgClass: "bg-purple-500/10",
    },
  ];

  const connectedPlatforms = platforms.filter((platform) => platform.username);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
      {/* ================================================= */}
      {/* PROFILE HEADER                                    */}
      {/* ================================================= */}

      <div className="relative">
        {/* Small accent strip */}

        <div className="h-16 bg-gradient-to-r from-yellow-400/15 via-yellow-400/5 to-transparent" />

        {/* Avatar */}

        <div className="absolute left-5 top-7">
          <div className="rounded-full bg-[#111111] p-1.5">
            <Avatar className="h-16 w-16 border border-zinc-700">
              <AvatarImage src={user?.imageUrl} alt={displayName} />

              <AvatarFallback className="bg-yellow-400 text-lg font-bold text-black">
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* IDENTITY                                          */}
      {/* ================================================= */}

      <div className="px-5 pb-5 pt-12">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-lg font-semibold text-white">
                {displayName}
              </span>

              <CheckCircle2
                size={15}
                className="shrink-0 fill-yellow-400 text-yellow-400"
              />
            </div>

            <span className="mt-0.5 block truncate text-xs text-zinc-500">
              @{username}
            </span>
          </div>

          <Badge
            variant="outline"
            className="shrink-0 border-green-500/20 bg-green-500/5 text-[10px] text-green-400"
          >
            Active
          </Badge>
        </div>

        {/* Email */}

        {email && (
          <div className="mt-4 flex min-w-0 items-center gap-2">
            <Mail size={13} className="shrink-0 text-zinc-600" />

            <span className="truncate text-xs text-zinc-500">{email}</span>
          </div>
        )}
      </div>

      <Separator className="bg-zinc-800" />

      {/* ================================================= */}
      {/* DETAILS                                           */}
      {/* ================================================= */}

      <div className="space-y-3 px-5 py-4">
        {usernames?.location && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
              <MapPin size={14} className="text-zinc-500" />
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                Location
              </span>

              <span className="truncate text-xs text-zinc-300">
                {usernames.location}
              </span>
            </div>
          </div>
        )}

        {usernames?.university && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
              <GraduationCap size={14} className="text-zinc-500" />
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                Education
              </span>

              <span className="truncate text-xs text-zinc-300">
                {usernames.university}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* CODEFOLIO CARD ACTION                             */}
      {/* ================================================= */}

      <div className="px-5 pb-4">

      </div>

      {/* ================================================= */}
      {/* CONNECTED PLATFORMS                              */}
      {/* ================================================= */}

      {connectedPlatforms.length > 0 && (
        <>
          <Separator className="bg-zinc-800" />

          <div className="px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300">
                Connected Platforms
              </span>

              <span className="text-[10px] text-zinc-600">
                {connectedPlatforms.length} connected
              </span>
            </div>

            <div className="space-y-1">
              {connectedPlatforms.map((platform) => {
                const Icon = platform.icon;

                return (
                  <div
                    key={platform.key}
                    className="
                        group
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-2
                        py-2.5
                        transition-colors
                        hover:bg-zinc-900
                      "
                  >
                    <div
                      className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          ${platform.bgClass}
                        `}
                    >
                      {Icon ? (
                        <Icon size={15} className={platform.iconClass} />
                      ) : (
                        <span className="text-[10px] font-bold text-purple-400">
                          CC
                        </span>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-xs font-medium text-zinc-300">
                        {platform.name}
                      </span>

                      <span className="truncate text-[10px] text-zinc-600">
                        @{platform.username}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-green-500" />

                      <ChevronRight
                        size={13}
                        className="text-zinc-700 transition-transform group-hover:translate-x-0.5"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ================================================= */}
      {/* ABOUT                                            */}
      {/* ================================================= */}

      {usernames?.about && (
        <>
          <Separator className="bg-zinc-800" />

          <div className="px-5 py-4">
            <span className="mb-2 block text-xs font-semibold text-zinc-300">
              About
            </span>

            <p className="line-clamp-4 text-xs leading-5 text-zinc-500">
              {usernames.about}
            </p>
          </div>
        </>
      )}

      {/* ================================================= */}
      {/* FOOTER                                           */}
      {/* ================================================= */}

      <div className="border-t border-zinc-800 bg-[#0d0d0d] px-5 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-600">CodeFolio profile</span>

          <span className="text-[10px] text-yellow-400">
            {stats?.totalQuestions || 0} problems tracked
          </span>
        </div>
      </div>
    </div>
  );
}

export default CodeFolioProfile;
