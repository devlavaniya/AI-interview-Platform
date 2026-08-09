import React from "react";
import {
  ParticipantView,
  useCallStateHooks,
  CallingState,
} from "@stream-io/video-react-sdk";

import { Mic, MicOff, Video, VideoOff } from "lucide-react";

function VideoTile({ participant, isLocal }) {
  if (!participant) {
    return null;
  }

  return (
    <div
      className="
        relative
        h-[120px]
        w-[120px]
        overflow-hidden
        rounded-xl
        border
        border-zinc-700
        bg-[#111111]
        shadow-2xl
      "
    >
      <ParticipantView participant={participant} className="h-full w-full" />

      {/* Name */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          bg-gradient-to-t
          from-black/80
          to-transparent
          px-2
          pb-1.5
          pt-5
        "
      >
        <span className="block truncate text-[10px] font-medium text-white">
          {isLocal ? "You" : participant.name || "Participant"}
        </span>
      </div>
    </div>
  );
}

function VideoCallUI() {
  const {
    useParticipants,
    useLocalParticipant,
    useCallCallingState,
    useCameraState,
    useMicrophoneState,
  } = useCallStateHooks();

  const participants = useParticipants();

  const localParticipant = useLocalParticipant();

  const callingState = useCallCallingState();

  const { camera, isMute: isCameraMuted } = useCameraState();

  const { microphone, isMute: isMicrophoneMuted } = useMicrophoneState();

  // ----------------------------------------------------------
  // REMOTE PARTICIPANT
  // ----------------------------------------------------------

  const remoteParticipant = participants.find(
    (participant) => participant.sessionId !== localParticipant?.sessionId,
  );

  // ----------------------------------------------------------
  // CAMERA
  // ----------------------------------------------------------

  const toggleCamera = async () => {
    try {
      await camera.toggle();
    } catch (error) {
      console.error("Camera toggle error:", error);
    }
  };

  // ----------------------------------------------------------
  // MICROPHONE
  // ----------------------------------------------------------

  const toggleMicrophone = async () => {
    try {
      await microphone.toggle();
    } catch (error) {
      console.error("Microphone toggle error:", error);
    }
  };

  // ----------------------------------------------------------
  // CONNECTING
  // ----------------------------------------------------------

  if (
    callingState !== CallingState.JOINED &&
    callingState !== CallingState.JOINING
  ) {
    return (
      <div className="pointer-events-none absolute inset-0 z-50">
        <div className="absolute right-4 top-4">
          <div
            className="
              flex
              h-[120px]
              w-[120px]
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-800
              bg-[#111111]
              shadow-xl
            "
          >
            <span className="text-[10px] text-zinc-500">Connecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {/* ======================================================
          OTHER PERSON
      ======================================================= */}

      <div
        className="
          pointer-events-auto
          absolute
          right-4
          top-4
        "
      >
        {remoteParticipant ? (
          <VideoTile participant={remoteParticipant} isLocal={false} />
        ) : (
          <div
            className="
              flex
              h-[120px]
              w-[120px]
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-800
              bg-[#111111]
              shadow-xl
            "
          >
            <span className="px-2 text-center text-[10px] text-zinc-500">
              Waiting for participant
            </span>
          </div>
        )}
      </div>

      {/* ======================================================
          YOU
      ======================================================= */}

      <div
        className="
          pointer-events-auto
          absolute
          bottom-16
          right-4
        "
      >
        <VideoTile participant={localParticipant} isLocal={true} />
      </div>

      {/* ======================================================
          CONTROLS
      ======================================================= */}

      <div
        className="
          pointer-events-auto
          absolute
          bottom-4
          right-4
          flex
          items-center
          gap-1.5
          rounded-xl
          border
          border-zinc-800
          bg-[#111111]/95
          p-1.5
          shadow-xl
          backdrop-blur
        "
      >
        <button
          type="button"
          onClick={toggleMicrophone}
          className={`
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            transition
            ${
              isMicrophoneMuted
                ? "bg-red-500/10 text-red-400"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }
          `}
        >
          {isMicrophoneMuted ? (
            <MicOff className="h-3.5 w-3.5" />
          ) : (
            <Mic className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          type="button"
          onClick={toggleCamera}
          className={`
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            transition
            ${
              isCameraMuted
                ? "bg-red-500/10 text-red-400"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }
          `}
        >
          {isCameraMuted ? (
            <VideoOff className="h-3.5 w-3.5" />
          ) : (
            <Video className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default VideoCallUI;
