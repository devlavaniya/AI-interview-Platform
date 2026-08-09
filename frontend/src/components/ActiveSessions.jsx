import { useState } from "react";
import { Users, Code2, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import JoinByCodeModal from "./JoinByCodeModal";
import { useJoinSessionByCode } from "../hooks/useSessions";

function ActiveSessions({ count, isLoading }) {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [joinError, setJoinError] = useState("");

  const joinByCodeMutation = useJoinSessionByCode();

  const handleJoinByCode = (code) => {
    setJoinError("");

    joinByCodeMutation.mutate(
      { code },
      {
        onSuccess: (data) => {
          setShowCodeModal(false);
          window.location.href = `/session/${data.session._id}`;
        },
        onError: (error) => {
          setJoinError(
            error.response?.data?.message ||
              "Failed to join session"
          );
        },
      }
    );
  };

  return (
    <>
      <Card className="border-zinc-800 bg-[#181818] shadow-none">

        <CardHeader className="pb-4">

          <div className="flex items-center justify-between">

            <div>

              <CardTitle className="text-xl text-white">
                Live Sessions
              </CardTitle>

              <p className="mt-2 text-sm text-zinc-400">
                Join an active collaborative coding interview.
              </p>

            </div>

            <Badge
              className={`${
                isLoading
                  ? "bg-zinc-700 text-zinc-300"
                  : "bg-green-600 text-white"
              }`}
            >
              {isLoading ? "--" : `${count} Active`}
            </Badge>

          </div>

        </CardHeader>

        <CardContent>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">

              <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />

            </div>
          ) : (
            <>
              {/* Icon */}

              <div className="flex justify-center">

                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400/10">

                  <Users className="h-11 w-11 text-yellow-400" />

                </div>

              </div>

              {/* Count */}

              <div className="mt-6 text-center">

                <h2 className="text-5xl font-bold text-white">

                  {count}

                </h2>

                <p className="mt-3 text-zinc-400">
                  Active coding interview sessions
                </p>

              </div>

              {/* Join Button */}

              <Button
                onClick={() => setShowCodeModal(true)}
                className="mt-8 w-full bg-yellow-400 text-black hover:bg-yellow-300"
              >
                <Code2 className="mr-2 h-5 w-5" />

                Join Session by Code
              </Button>

              {/* Tip */}

              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">

                <h4 className="mb-2 font-semibold text-white">
                  Quick Tip
                </h4>

                <p className="text-sm text-zinc-400">
                  Ask the session creator for the
                  <span className="font-semibold text-white">
                    {" "}
                    8-character session code
                  </span>{" "}
                  to join instantly.
                </p>

              </div>
            </>
          )}

        </CardContent>

      </Card>

      <JoinByCodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        onJoin={handleJoinByCode}
        isJoining={joinByCodeMutation.isPending}
        error={joinError}
      />
    </>
  );
}

export default ActiveSessions;