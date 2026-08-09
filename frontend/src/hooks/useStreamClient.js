import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";

import { sessionApi } from "../api/sessions";

function useStreamClient(
  session,
  loadingSession,
  isHost,
  isParticipant,
  shouldConnect = false,
) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(false);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;
    let cancelled = false;

    const clearState = () => {
      setStreamClient(null);
      setCall(null);
      setChatClient(null);
      setChannel(null);
    };

    const initCall = async () => {
      // --------------------------------------------------------
      // DO NOT CONNECT AUTOMATICALLY
      // --------------------------------------------------------

      if (!shouldConnect) {
        setIsInitializingCall(false);
        clearState();
        return;
      }

      if (loadingSession || !session) {
        return;
      }

      if (!session.callId) {
        console.error("Session does not contain callId");

        toast.error("Video call is not configured.");

        return;
      }

      if (!isHost && !isParticipant) {
        return;
      }

      if (session.status === "completed") {
        return;
      }

      setIsInitializingCall(true);

      try {
        // ------------------------------------------------------
        // GET STREAM AUTH TOKEN
        // ------------------------------------------------------

        const { token, userId, userName, userImage } =
          await sessionApi.getStreamToken();

        if (cancelled) return;

        // ------------------------------------------------------
        // INITIALIZE STREAM CLIENT
        // ------------------------------------------------------

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName || "User",
            image: userImage,
          },
          token,
        );

        if (cancelled) {
          await disconnectStreamClient();
          return;
        }

        setStreamClient(client);

        // ------------------------------------------------------
        // GET EXISTING VIDEO CALL
        // ------------------------------------------------------

        videoCall = client.call("default", session.callId);

        /*
         * Backend already created the call.
         *
         * Do NOT use:
         *
         * join({ create: true })
         */

        await videoCall.join();

        if (cancelled) {
          await videoCall.leave();
          return;
        }

        setCall(videoCall);

        // ------------------------------------------------------
        // STREAM CHAT
        // ------------------------------------------------------

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;

        if (!apiKey) {
          throw new Error("VITE_STREAM_API_KEY is missing");
        }

        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName || "User",
            image: userImage,
          },
          token,
        );

        if (cancelled) {
          await chatClientInstance.disconnectUser();
          return;
        }

        setChatClient(chatClientInstance);

        // ------------------------------------------------------
        // CHAT CHANNEL
        // ------------------------------------------------------

        const chatChannel = chatClientInstance.channel(
          "messaging",
          session.callId,
        );

        await chatChannel.watch();

        if (cancelled) return;

        setChannel(chatChannel);

        console.log("Stream connection established:", session.callId);
      } catch (error) {
        console.error("Error initializing Stream:", error);

        if (!cancelled) {
          toast.error(
            error?.response?.data?.message || "Failed to connect to interview",
          );
        }

        clearState();
      } finally {
        if (!cancelled) {
          setIsInitializingCall(false);
        }
      }
    };

    initCall();

    // ----------------------------------------------------------
    // CLEANUP
    // ----------------------------------------------------------

    return () => {
      cancelled = true;

      const cleanup = async () => {
        try {
          if (videoCall) {
            await videoCall.leave();
          }

          if (chatClientInstance) {
            await chatClientInstance.disconnectUser();
          }

          await disconnectStreamClient();
        } catch (error) {
          console.error("Stream cleanup error:", error);
        }
      };

      cleanup();
    };
  }, [session, loadingSession, isHost, isParticipant, shouldConnect]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;
