import {
  Code2,
  Clock,
  Users,
  Trophy,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function RecentSessions({ sessions, isLoading }) {
  return (
    <Card className="mt-8 border-zinc-800 bg-[#181818]">

      <CardHeader>

        <div className="flex items-center justify-between">

          <div>

            <CardTitle className="text-2xl text-white">
              Recent Sessions
            </CardTitle>

            <p className="mt-2 text-sm text-zinc-400">
              Review your latest collaborative coding interviews.
            </p>

          </div>

          <Badge className="bg-yellow-400 text-black">
            {sessions.length} Sessions
          </Badge>

        </div>

      </CardHeader>

      <CardContent>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">

            <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />

          </div>
        ) : sessions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {sessions.map((session) => (
              <Card
                key={session._id}
                className="border-zinc-700 bg-[#111111] transition-colors hover:border-yellow-400"
              >
                <CardContent className="p-5">

                  {/* Header */}

                  <div className="flex items-start justify-between">

                    <div className="flex gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10">

                        <Code2 className="h-6 w-6 text-yellow-400" />

                      </div>

                      <div>

                        <h3 className="font-semibold text-white">

                          {session.problem}

                        </h3>

                        <Badge
                          className={
                            session.difficulty?.toLowerCase() === "easy"
                              ? "mt-2 bg-green-600"
                              : session.difficulty?.toLowerCase() === "medium"
                              ? "mt-2 bg-yellow-500 text-black"
                              : "mt-2 bg-red-600"
                          }
                        >
                          {session.difficulty}
                        </Badge>

                      </div>

                    </div>

                    {session.status === "active" && (
                      <Badge className="bg-green-600">
                        Active
                      </Badge>
                    )}

                  </div>

                  {/* Info */}

                  <div className="mt-6 space-y-3">

                    <div className="flex items-center gap-3 text-sm text-zinc-400">

                      <Clock className="h-4 w-4" />

                      <span>
                        {formatDistanceToNow(
                          new Date(session.createdAt),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 text-sm text-zinc-400">

                      <Users className="h-4 w-4" />

                      <span>
                        {session.participant ? "2 Participants" : "1 Participant"}
                      </span>

                    </div>

                  </div>

                  {/* Footer */}

                  <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">

                    <span className="text-xs text-zinc-500">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>

                    <Button
                      size="sm"
                      variant="ghost"
                    >
                      View

                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                  </div>

                </CardContent>

              </Card>
            ))}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400/10">

              <Trophy className="h-10 w-10 text-yellow-400" />

            </div>

            <h2 className="mt-6 text-2xl font-semibold text-white">
              No Sessions Yet
            </h2>

            <p className="mt-3 text-center text-zinc-400">
              Create your first coding interview session
              to start tracking your progress.
            </p>

          </div>
        )}

      </CardContent>

    </Card>
  );
}

export default RecentSessions;