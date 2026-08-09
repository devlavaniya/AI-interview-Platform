import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

import {
  useActiveSessions,
  useCreateSession,
  useMyActiveSessions,
  useMyRecentSessions,
} from "../hooks/useSessions";

import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCard";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionsModal";
import OngoingSession from "../components/OngoingSession";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [roomConfig, setRoomConfig] = useState({
    problem: "",
    difficulty: "",
  });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } =
    useActiveSessions();

  const { data: myActiveSessionsData } = useMyActiveSessions();

  const { data: recentSessionsData, isLoading: loadingRecentSessions } =
    useMyRecentSessions();

  const activeSessionsCount = activeSessionsData?.count || 0;

  const myActiveSessions = myActiveSessionsData?.sessions || [];

  const recentSessions = recentSessionsData?.sessions || [];

  const ongoingSession =
    myActiveSessions.length > 0 ? myActiveSessions[0] : null;

  const hasActiveSession = myActiveSessions.length > 0;

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      },
    );
  };

  const isUserInSession = (session) => {
    if (!user?.id) return false;

    return (
      session.host?.clerkId === user.id ||
      session.participant?.clerkId === user.id
    );
  };

  const handleRejoinSession = () => {
    if (ongoingSession) {
      navigate(`/session/${ongoingSession._id}`);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#090909] text-white">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Hero */}

          <WelcomeSection
            onCreateSession={() => setShowCreateModal(true)}
            hasActiveSession={hasActiveSession}
          />

          {/* Active Session */}

          {ongoingSession && (
            <OngoingSession
              session={ongoingSession}
              onRejoin={handleRejoinSession}
              isLoading={false}
            />
          )}

          {/* Cards */}

          <div className="grid gap-6 xl:grid-cols-2">
            <StatsCards
              activeSessionsCount={activeSessionsCount}
              recentSessionsCount={recentSessions.length}
            />

            <ActiveSessions
              count={activeSessionsCount}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          {/* Recent */}

          <RecentSessions
            sessions={recentSessions}
            isLoading={loadingRecentSessions}
          />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;
