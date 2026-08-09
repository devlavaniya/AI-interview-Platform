import { useRef } from "react";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

import {
  Download,
  Share2,
  X,
} from "lucide-react";

import {
  SiLeetcode,
  SiCodeforces,
} from "react-icons/si";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

function CodeFolioCard({
  isOpen,
  onClose,
  user,
  usernames,
  stats,
}) {
  const cardRef = useRef(null);

  const handleDownload = async () => {
    if (!cardRef.current) {
      toast.error("Card not ready");
      return;
    }

    try {
      toast.loading("Generating image...", {
        id: "download-card",
      });

      const canvas = await html2canvas(
        cardRef.current,
        {
          backgroundColor: "#090909",
          scale: 2,
          useCORS: true,
          allowTaint: true,
        }
      );

      const link =
        document.createElement("a");

      link.download = `codefolio-${
        user?.username || "card"
      }.png`;

      link.href = canvas.toDataURL(
        "image/png"
      );

      link.click();

      toast.success(
        "Downloaded successfully",
        {
          id: "download-card",
        }
      );
    } catch (err) {
      toast.error(err.message, {
        id: "download-card",
      });
    }
  };

  const tryClipboard = async (blob) => {
    try {
      const item = new ClipboardItem({
        "image/png": blob,
      });

      await navigator.clipboard.write([
        item,
      ]);

      toast.success(
        "Copied to clipboard",
        {
          id: "share-card",
        }
      );
    } catch {
      toast.error(
        "Clipboard not supported",
        {
          id: "share-card",
        }
      );
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      toast.loading("Preparing...", {
        id: "share-card",
      });

      const canvas = await html2canvas(
        cardRef.current,
        {
          backgroundColor: "#090909",
          scale: 2,
          useCORS: true,
          allowTaint: true,
        }
      );

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          "codefolio.png",
          {
            type: "image/png",
          }
        );

        if (navigator.share) {
          try {
            await navigator.share({
              files: [file],
              title: "My CodeFolio",
              text: "Check out my coding profile!",
            });

            toast.success("Shared!", {
              id: "share-card",
            });
          } catch {
            tryClipboard(blob);
          }
        } else {
          tryClipboard(blob);
        }
      });
    } catch (err) {
      toast.error(err.message, {
        id: "share-card",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-7xl border-zinc-800 bg-[#090909] p-8">

        {/* Top Buttons */}

        <div className="mb-6 flex justify-end gap-3">

          <Button
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>

          <Button
            className="bg-yellow-400 text-black hover:bg-yellow-300"
            onClick={handleShare}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          <Button
            variant="destructive"
            onClick={onClose}
          >
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>

        </div>

        {/* Card */}

        <Card
          ref={cardRef}
          className="overflow-hidden border-yellow-400/20 bg-[#111111]"
        >
          <CardContent className="p-10">

            {/* Header */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-6">

                <img
                  src={
                    user?.imageUrl ||
                    "/default-avatar.png"
                  }
                  alt=""
                  className="h-24 w-24 rounded-full border-4 border-yellow-400 object-cover"
                />

                <div>

                  <h1 className="text-4xl font-bold text-white">

                    {user?.firstName}{" "}
                    {user?.lastName}

                  </h1>

                  <p className="mt-2 text-zinc-400">

                    @
                    {user?.username ||
                      user?.primaryEmailAddress?.emailAddress?.split(
                        "@"
                      )[0]}

                  </p>

                  <div className="mt-4 flex gap-2">

                    <Badge className="bg-yellow-400 text-black">

                      IntelliView

                    </Badge>

                    <Badge variant="secondary">

                      Developer

                    </Badge>

                  </div>

                </div>

              </div>

              <div className="text-right">

                <h2 className="text-5xl font-bold text-yellow-400">

                  CodeFolio

                </h2>

                <p className="mt-2 text-zinc-500">

                  Coding Portfolio Card

                </p>

              </div>

            </div>

            {/* Quick Stats */}

            <div className="mt-10 grid grid-cols-3 gap-6">
                            {/* Total Questions */}

              <Card className="border-zinc-800 bg-[#181818]">
                <CardContent className="p-6 text-center">

                  <p className="text-sm text-zinc-500">
                    Total Solved
                  </p>

                  <h2 className="mt-3 text-5xl font-bold text-yellow-400">
                    {stats?.totalQuestions || 0}
                  </h2>

                </CardContent>
              </Card>

              {/* Active Days */}

              <Card className="border-zinc-800 bg-[#181818]">
                <CardContent className="p-6 text-center">

                  <p className="text-sm text-zinc-500">
                    Active Days
                  </p>

                  <h2 className="mt-3 text-5xl font-bold text-white">
                    {stats?.totalActivedays || 0}
                  </h2>

                </CardContent>
              </Card>

              {/* Contests */}

              <Card className="border-zinc-800 bg-[#181818]">
                <CardContent className="p-6 text-center">

                  <p className="text-sm text-zinc-500">
                    Contests
                  </p>

                  <h2 className="mt-3 text-5xl font-bold text-white">
                    {(stats?.leetcodeContests || 0) +
                      (stats?.codeforcesContests || 0)}
                  </h2>

                </CardContent>
              </Card>

            </div>

            {/* Difficulty */}

            <Card className="mt-8 border-zinc-800 bg-[#181818]">

              <CardContent className="space-y-7 p-8">

                <h2 className="text-2xl font-bold text-white">

                  Problem Breakdown

                </h2>

                {/* Easy */}

                <div>

                  <div className="mb-2 flex justify-between">

                    <span className="text-green-400">
                      Easy
                    </span>

                    <span className="font-bold text-white">
                      {stats?.easy || 0}
                    </span>

                  </div>

                  <div className="h-3 w-full rounded-full bg-zinc-800">

                    <div
                      className="h-3 rounded-full bg-green-500"
                      style={{
                        width: `${Math.min(
                          ((stats?.easy || 0) /
                            Math.max(
                              stats?.totalQuestions || 1,
                              1
                            )) *
                            100,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

                {/* Medium */}

                <div>

                  <div className="mb-2 flex justify-between">

                    <span className="text-yellow-400">
                      Medium
                    </span>

                    <span className="font-bold text-white">
                      {stats?.medium || 0}
                    </span>

                  </div>

                  <div className="h-3 w-full rounded-full bg-zinc-800">

                    <div
                      className="h-3 rounded-full bg-yellow-400"
                      style={{
                        width: `${Math.min(
                          ((stats?.medium || 0) /
                            Math.max(
                              stats?.totalQuestions || 1,
                              1
                            )) *
                            100,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

                {/* Hard */}

                <div>

                  <div className="mb-2 flex justify-between">

                    <span className="text-red-400">
                      Hard
                    </span>

                    <span className="font-bold text-white">
                      {stats?.hard || 0}
                    </span>

                  </div>

                  <div className="h-3 w-full rounded-full bg-zinc-800">

                    <div
                      className="h-3 rounded-full bg-red-500"
                      style={{
                        width: `${Math.min(
                          ((stats?.hard || 0) /
                            Math.max(
                              stats?.totalQuestions || 1,
                              1
                            )) *
                            100,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              </CardContent>

            </Card>

            {/* Platforms */}

            <div className="mt-8 grid grid-cols-2 gap-6">

              {usernames?.leetcode && (

                <Card className="border-orange-500/20 bg-[#181818]">

                  <CardContent className="p-6">

                    <div className="mb-6 flex items-center gap-4">

                      <SiLeetcode
                        className="text-orange-500"
                        size={32}
                      />

                      <div>

                        <h3 className="text-xl font-bold text-white">

                          LeetCode

                        </h3>

                        <p className="text-sm text-zinc-500">

                          {usernames.leetcode}

                        </p>

                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-5">

                      <div>

                        <p className="text-sm text-zinc-500">

                          Rating

                        </p>

                        <h2 className="text-3xl font-bold text-white">

                          {stats?.leetcodeRating || 0}

                        </h2>

                      </div>

                      <div>

                        <p className="text-sm text-zinc-500">

                          Solved

                        </p>

                        <h2 className="text-3xl font-bold text-white">

                          {stats?.leetcodeProblems || 0}

                        </h2>

                      </div>

                    </div>

                  </CardContent>

                </Card>

              )}

              {usernames?.codeforces && (

                <Card className="border-blue-500/20 bg-[#181818]">

                  <CardContent className="p-6">

                    <div className="mb-6 flex items-center gap-4">

                      <SiCodeforces
                        className="text-blue-500"
                        size={32}
                      />

                      <div>

                        <h3 className="text-xl font-bold text-white">

                          Codeforces

                        </h3>

                        <p className="text-sm text-zinc-500">

                          {usernames.codeforces}

                        </p>

                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-5">

                      <div>

                        <p className="text-sm text-zinc-500">

                          Rating

                        </p>

                        <h2 className="text-3xl font-bold text-white">

                          {stats?.codeforcesRating || 0}

                        </h2>

                      </div>

                      <div>

                        <p className="text-sm text-zinc-500">

                          Problems

                        </p>

                        <h2 className="text-3xl font-bold text-white">

                          {stats?.codeforcesProblems || 0}

                        </h2>

                      </div>

                    </div>

                  </CardContent>

                </Card>

              )}

            </div>

            {/* Footer */}

            <div className="mt-10 border-t border-zinc-800 pt-6 text-center">

              <p className="text-sm text-zinc-500">

                Generated with ❤️ using IntelliView

              </p>

              <p className="mt-2 text-xs text-zinc-600">

                {new Date().toLocaleDateString()}

              </p>

            </div>

          </CardContent>

        </Card>

      </DialogContent>

    </Dialog>
  );
}

export default CodeFolioCard;