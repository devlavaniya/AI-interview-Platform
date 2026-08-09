import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

import { TrendingUp, Settings, Loader2 } from "lucide-react";

// Components
import CodeFolioProfile from "../components/CodeFolio/CodeFolioProfile";
import CodeFolioStats from "../components/CodeFolio/CodeFolioStats";
import CodeFolioProblems from "../components/CodeFolio/CodeFolioProblems";
import CodeFolioContests from "../components/CodeFolio/CodeFolioContests";
import ContestRankings from "../components/CodeFolio/ContestRankings";
import CompetitiveProgramming from "../components/CodeFolio/CompetitiveProgramming";
import UsernameSetupModal from "../components/CodeFolio/UsernameSetupModal";
import CodeFolioCard from "../components/CodeFolio/CodeFolioCard";

// API
import {
  getLeetCodeStats,
  getCodeForcesStats,
  fetchCodeFolioUsernames,
  saveCodeFolioUsernames,
} from "../api/codefolio";

const CACHE_KEYS = {
  usernames: "codefolio_usernames_cache",
  profileData: "codefolio_profiledata_cache",
  platformStatus: "codefolio_platformstatus_cache",
  userId: "codefolio_user_id_cache",
};

function CodeFolioPage() {
  const { user } = useUser();

  /* ------------------------------------------------------ */
  /* UI STATE                                                */
  /* ------------------------------------------------------ */

  const [loading, setLoading] = useState(true);

  const [showSetupModal, setShowSetupModal] = useState(false);

  const [showCard, setShowCard] = useState(false);

  /* ------------------------------------------------------ */
  /* USER DATA                                               */
  /* ------------------------------------------------------ */

  const [usernames, setUsernames] = useState(null);

  const [profileData, setProfileData] = useState(null);

  const [platformStatus, setPlatformStatus] = useState({
    leetcode: false,
    codeforces: false,
  });

  /* ------------------------------------------------------ */
  /* DATA LOADING                                            */
  /* ------------------------------------------------------ */

  useEffect(() => {
    if (user) {
      loadUsernames();
    }
  }, [user]);

  /* ------------------------------------------------------ */
  /* FUNCTIONS                                               */
  /* ------------------------------------------------------ */

  const loadUsernames = async () => {
    setLoading(true);

    try {
      const cachedUserId = sessionStorage.getItem(CACHE_KEYS.userId);
      const cachedUsernames = sessionStorage.getItem(CACHE_KEYS.usernames);
      const cachedProfile = sessionStorage.getItem(CACHE_KEYS.profileData);
      const cachedPlatform = sessionStorage.getItem(CACHE_KEYS.platformStatus);

      // Different user logged in
      if (cachedUserId && cachedUserId !== user?.id) {
        sessionStorage.removeItem(CACHE_KEYS.userId);
        sessionStorage.removeItem(CACHE_KEYS.usernames);
        sessionStorage.removeItem(CACHE_KEYS.profileData);
        sessionStorage.removeItem(CACHE_KEYS.platformStatus);
      }

      // Load from cache
      if (cachedUsernames && cachedProfile && cachedUserId === user?.id) {
        setUsernames(JSON.parse(cachedUsernames));
        setProfileData(JSON.parse(cachedProfile));

        if (cachedPlatform) {
          setPlatformStatus(JSON.parse(cachedPlatform));
        }

        setLoading(false);
        return;
      }

      // Backend
      const response = await fetchCodeFolioUsernames();

      if (response?.success && response?.data) {
        setUsernames(response.data);

        sessionStorage.setItem(
          CACHE_KEYS.usernames,
          JSON.stringify(response.data),
        );

        sessionStorage.setItem(CACHE_KEYS.userId, user.id);

        await fetchProfileData(response.data);
        return;
      }

      // Local storage fallback
      const local = localStorage.getItem(`codefolio_usernames_${user.id}`);

      if (local) {
        const parsed = JSON.parse(local);

        setUsernames(parsed);

        sessionStorage.setItem(CACHE_KEYS.usernames, JSON.stringify(parsed));

        sessionStorage.setItem(CACHE_KEYS.userId, user.id);

        await fetchProfileData(parsed);
      } else {
        setShowSetupModal(true);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);

      const local = localStorage.getItem(`codefolio_usernames_${user.id}`);

      if (local) {
        const parsed = JSON.parse(local);

        setUsernames(parsed);

        await fetchProfileData(parsed);
      } else {
        setShowSetupModal(true);
        setLoading(false);
      }
    }
  };

  const fetchProfileData = async (usernames) => {
    setLoading(true);

    const profile = {
      totalQuestions: 0,
      totalActivedays: 0,

      easy: 0,
      medium: 0,
      hard: 0,

      leetcodeProblems: 0,
      leetcodeRating: 0,
      leetcodeRanking: 0,
      leetcodeContests: 0,

      codeforcesProblems: 0,
      codeforcesRating: 0,
      codeforcesMaxRating: 0,
      codeforcesRank: "",
      codeforcesContests: 0,

      badges: [],
      submissionCalendar: null,
    };

    const platform = {
      leetcode: false,
      codeforces: false,
    };

    try {
      /* ========================================================= */
      /* LeetCode */
      /* ========================================================= */

      if (usernames.leetcode) {
        toast.loading("Fetching LeetCode...", {
          id: "leetcode",
        });

        try {
          const res = await getLeetCodeStats(usernames.leetcode);

          if (res?.success && res?.data) {
            const data = res.data;

            profile.easy = data.easy || 0;
            profile.medium = data.medium || 0;
            profile.hard = data.hard || 0;

            profile.leetcodeProblems = data.totalQuestions || 0;

            profile.leetcodeRating = data.contestRating || 0;

            profile.leetcodeRanking = data.contestRanking || data.ranking || 0;

            profile.leetcodeContests = data.contestsAttended || 0;

            profile.badges = Array.isArray(data.badges) ? data.badges : [];

            profile.submissionCalendar = data.submissionCalendar || null;

            profile.totalQuestions += profile.leetcodeProblems;

            profile.totalActivedays += data.activeDays || 0;

            platform.leetcode = true;

            toast.success("LeetCode Loaded", {
              id: "leetcode",
            });
          } else {
            toast.error(res?.message || "Unable to fetch LeetCode", {
              id: "leetcode",
            });
          }
        } catch (e) {
          console.error(e);

          toast.error("LeetCode Error", {
            id: "leetcode",
          });
        }
      }

      /* ========================================================= */
      /* Codeforces */
      /* ========================================================= */

      if (usernames.codeforces) {
        toast.loading("Fetching Codeforces...", {
          id: "cf",
        });

        try {
          const res = await getCodeForcesStats(usernames.codeforces);

          if (res?.success && res?.data) {
            const data = res.data;

            profile.codeforcesProblems = data.problemsSolved || 0;

            profile.codeforcesRating = data.rating || 0;

            profile.codeforcesMaxRating = data.maxRating || 0;

            profile.codeforcesRank = data.rank || "";

            profile.codeforcesContests = data.contests || 0;

            profile.totalQuestions += profile.codeforcesProblems;

            profile.totalActivedays += data.activeDays || 0;

            platform.codeforces = true;

            toast.success("Codeforces Loaded", {
              id: "cf",
            });
          } else {
            toast.error(res?.message || "Unable to fetch Codeforces", {
              id: "cf",
            });
          }
        } catch (e) {
          console.error(e);

          toast.error("Codeforces Error", {
            id: "cf",
          });
        }
      }

      /* ========================================================= */
      /* CodeChef */
      /* ========================================================= */

      if (usernames.codechef) {
        toast("CodeChef support coming soon!", {
          icon: "ℹ️",
        });
      }

      /* ========================================================= */
      /* Save Result */
      /* ========================================================= */

      setPlatformStatus(platform);

      sessionStorage.setItem(
        CACHE_KEYS.platformStatus,
        JSON.stringify(platform),
      );

      if (!platform.leetcode && !platform.codeforces) {
        setProfileData(null);
      } else {
        setProfileData(profile);

        sessionStorage.setItem(CACHE_KEYS.profileData, JSON.stringify(profile));
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to load profile");

      setProfileData(null);
    }

    setLoading(false);
  };

  const handleSaveUsernames = async (newUsernames) => {
    try {
      // Clear previous cache
      sessionStorage.removeItem(CACHE_KEYS.profileData);
      sessionStorage.removeItem(CACHE_KEYS.platformStatus);

      const response = await saveCodeFolioUsernames(newUsernames);

      if (response?.success) {
        toast.success("Usernames saved successfully!");

        setUsernames(newUsernames);

        sessionStorage.setItem(
          CACHE_KEYS.usernames,
          JSON.stringify(newUsernames),
        );

        sessionStorage.setItem(CACHE_KEYS.userId, user.id);

        setShowSetupModal(false);

        await fetchProfileData(newUsernames);

        return;
      }

      throw new Error("Backend save failed");
    } catch (error) {
      console.error(error);

      toast("Saved locally.", {
        icon: "💾",
      });

      localStorage.setItem(
        `codefolio_usernames_${user.id}`,
        JSON.stringify(newUsernames),
      );

      setUsernames(newUsernames);

      sessionStorage.setItem(
        CACHE_KEYS.usernames,
        JSON.stringify(newUsernames),
      );

      sessionStorage.setItem(CACHE_KEYS.userId, user.id);

      setShowSetupModal(false);

      await fetchProfileData(newUsernames);
    }
  };

  /* ======================================================= */
  /* Loading */
  /* ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />

          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">
              Loading CodeFolio...
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Fetching your coding statistics
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================= */
  /* Empty State */
  /* ======================================================= */

  if (!usernames || !profileData) {
    return (
      <>
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-zinc-800 bg-[#111111] px-12 py-20 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-yellow-400/10">
              <TrendingUp className="h-12 w-12 text-yellow-400" />
            </div>

            <h1 className="mt-8 text-4xl font-bold text-white">
              Welcome to CodeFolio
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-zinc-500">
              Connect your coding accounts and unlock a beautiful dashboard that
              tracks your interview preparation.
            </p>

            <button
              onClick={() => setShowSetupModal(true)}
              className="mt-10 rounded-xl bg-yellow-400 px-7 py-3 font-semibold text-black hover:bg-yellow-300"
            >
              Setup Usernames
            </button>
          </div>
        </div>

        <UsernameSetupModal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          onSave={handleSaveUsernames}
          existingUsernames={usernames}
        />
      </>
    );
  }

  /* ======================================================= */
  /* Main UI */
  /* ======================================================= */

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
              CODEFOLIO
            </p>

            <h1 className="mt-2 text-4xl font-bold text-white">
              Coding Analytics Dashboard
            </h1>

            <p className="mt-3 max-w-3xl text-zinc-500">
              Monitor your coding journey across LeetCode, Codeforces and more.
            </p>
          </div>

          <button
            onClick={() => setShowSetupModal(true)}
            className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-white hover:border-yellow-400 hover:text-yellow-400"
          >
            <Settings size={18} />
            Settings
          </button>
        </div>

        {/* Layout */}

        <div className="grid gap-7 xl:grid-cols-4">
          {/* Sidebar */}

          <div className="xl:col-span-1">
            <CodeFolioProfile
              user={user}
              usernames={usernames}
              stats={profileData}
              onOpenCard={() => setShowCard(true)}
            />
          </div>

          {/* Main */}

          <div className="space-y-7 xl:col-span-3">
            <CodeFolioStats stats={profileData} />

            <div className="grid gap-7 lg:grid-cols-2">
              {platformStatus.leetcode && (
                <CodeFolioProblems stats={profileData} />
              )}

              {(platformStatus.leetcode || platformStatus.codeforces) && (
                <CodeFolioContests
                  contests={profileData.leetcodeContests}
                  ranking={profileData.leetcodeRating}
                  codeforcesRating={profileData.codeforcesRating}
                  codeforcesRank={profileData.codeforcesRank}
                  leetcodeContests={profileData.leetcodeContests}
                  codeforcesContests={profileData.codeforcesContests}
                  badges={profileData.badges}
                  hasLeetCode={platformStatus.leetcode}
                  hasCodeForces={platformStatus.codeforces}
                />
              )}
            </div>

            <div className="grid gap-7 lg:grid-cols-2">
              {platformStatus.codeforces && (
                <CompetitiveProgramming
                  codeforcesProblems={profileData.codeforcesProblems}
                />
              )}

              {(platformStatus.leetcode || platformStatus.codeforces) && (
                <ContestRankings
                  leetcodeRating={profileData.leetcodeRating}
                  leetcodeMaxRating={profileData.leetcodeRating}
                  codeforcesRating={profileData.codeforcesRating}
                  codeforcesMaxRating={profileData.codeforcesMaxRating}
                  codeforcesRank={profileData.codeforcesRank}
                  hasLeetCode={platformStatus.leetcode}
                  hasCodeForces={platformStatus.codeforces}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <UsernameSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSave={handleSaveUsernames}
        existingUsernames={usernames}
      />

      {/* <CodeFolioCard
        isOpen={showCard}
        onClose={() => setShowCard(false)}
        user={user}
        usernames={usernames}
        stats={profileData}
      /> */}
    </>
  );
}

export default CodeFolioPage;
