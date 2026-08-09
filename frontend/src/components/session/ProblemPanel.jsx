import {
  Check,
  Copy,
  Loader2,
  LogOut,
  Share2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { getDifficultyBadgeClass } from "@/lib/utils";

function ProblemPanel({
  session,
  problemData,

  isAccepted,

  isHost,
  isParticipant,

  copiedCode,

  handleCopySessionCode,
  handleEndSession,
  handleLeaveSession,

  endSessionMutation,
  leaveSessionMutation,
}) {
  return (
    <div className="h-full overflow-y-auto bg-[#090909]">

      {/* Header */}

      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-[#111111] backdrop-blur">

        <div className="p-8">

          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

            {/* Left */}

            <div className="space-y-4">

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-4xl font-bold text-white">

                  {session?.problem || "Loading..."}

                </h1>

                {isAccepted && (
                  <Badge className="bg-green-600">

                    <Check className="mr-2 h-4 w-4" />

                    Accepted

                  </Badge>
                )}

                <Badge
                  className={getDifficultyBadgeClass(
                    session?.difficulty
                  )}
                >
                  {session?.difficulty}
                </Badge>

                {problemData?.category && (
                  <Badge
                    variant="secondary"
                  >
                    {problemData.category}
                  </Badge>
                )}

              </div>

              <p className="text-zinc-400">

                Host

                <span className="ml-2 font-medium text-white">

                  {session?.host?.name}

                </span>

              </p>

              <div className="flex flex-wrap gap-6">

                <div className="flex items-center gap-2">

                  <Users
                    size={18}
                    className="text-yellow-400"
                  />

                  <span className="text-sm text-zinc-400">

                    {session?.participant
                      ? "2 / 2 Participants"
                      : "1 / 2 Participants"}

                  </span>

                </div>

                <div>

                  <Badge
                    className={
                      session?.status === "active"
                        ? "bg-green-600"
                        : "bg-zinc-700"
                    }
                  >

                    {session?.status}

                  </Badge>

                </div>

              </div>

            </div>

            {/* Right */}

            <div className="flex flex-wrap justify-end gap-3">

              {isHost &&
                session?.status === "active" && (
                  <Button
                    variant="outline"
                    onClick={
                      handleCopySessionCode
                    }
                  >
                    {copiedCode ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />

                        Copied
                      </>
                    ) : (
                      <>
                        <Share2 className="mr-2 h-4 w-4" />

                        {session?.sessionCode}
                      </>
                    )}
                  </Button>
                )}

              {isHost &&
                session?.status === "active" && (
                  <Button
                    variant="destructive"
                    disabled={
                      endSessionMutation.isPending
                    }
                    onClick={
                      handleEndSession
                    }
                  >
                    {endSessionMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}

                    End Session
                  </Button>
                )}

              {isParticipant &&
                session?.status === "active" && (
                  <Button
                    variant="destructive"
                    disabled={
                      leaveSessionMutation.isPending
                    }
                    onClick={
                      handleLeaveSession
                    }
                  >
                    {leaveSessionMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}

                    Leave Session
                  </Button>
                )}

            </div>

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="space-y-6 p-8">
              {/* Description */}

      {problemData?.description && (
        <Card className="border-zinc-800 bg-[#181818]">

          <CardContent className="p-7">

            <h2 className="mb-6 text-2xl font-bold text-white">
              Description
            </h2>

            <div className="space-y-5 leading-8 text-zinc-300">

              <p>
                {problemData.description.text}
              </p>

              {problemData.description.notes?.map(
                (note, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4"
                  >
                    <p>{note}</p>
                  </div>
                )
              )}

            </div>

          </CardContent>

        </Card>
      )}

      {/* Examples */}

      {problemData?.examples &&
        problemData.examples.length > 0 && (

          <Card className="border-zinc-800 bg-[#181818]">

            <CardContent className="p-7">

              <h2 className="mb-6 text-2xl font-bold text-white">
                Examples
              </h2>

              <div className="space-y-6">

                {problemData.examples.map(
                  (example, index) => (

                    <div
                      key={index}
                      className="rounded-xl border border-zinc-700 bg-[#111111] p-5"
                    >

                      <div className="mb-5 flex items-center justify-between">

                        <Badge className="bg-yellow-400 text-black">

                          Example {index + 1}

                        </Badge>

                      </div>

                      <div className="space-y-4 font-mono text-sm">

                        <div>

                          <p className="mb-2 font-semibold text-zinc-400">

                            Input

                          </p>

                          <pre className="overflow-x-auto rounded-lg bg-black p-4 text-green-400">

{example.input}

                          </pre>

                        </div>

                        <div>

                          <p className="mb-2 font-semibold text-zinc-400">

                            Output

                          </p>

                          <pre className="overflow-x-auto rounded-lg bg-black p-4 text-blue-400">

{example.output}

                          </pre>

                        </div>

                        {example.explanation && (

                          <div>

                            <p className="mb-2 font-semibold text-zinc-400">

                              Explanation

                            </p>

                            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-zinc-300">

                              {example.explanation}

                            </div>

                          </div>

                        )}

                      </div>

                    </div>

                  )
                )}

              </div>

            </CardContent>

          </Card>

        )}

      {/* Constraints */}

      {problemData?.constraints &&
        problemData.constraints.length > 0 && (

          <Card className="border-zinc-800 bg-[#181818]">

            <CardContent className="p-7">

              <h2 className="mb-6 text-2xl font-bold text-white">
                Constraints
              </h2>

              <div className="grid gap-4">

                {problemData.constraints.map(
                  (constraint, index) => (

                    <div
                      key={index}
                      className="rounded-xl border border-zinc-700 bg-[#111111] p-4"
                    >

                      <code className="font-mono text-yellow-400">

                        {constraint}

                      </code>

                    </div>

                  )
                )}

              </div>

            </CardContent>

          </Card>

        )}

      {/* Footer */}

      <div className="pb-8" />

    </div>

  </div>
);

}

export default ProblemPanel;